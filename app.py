"""
KidneyCare AI – Flask Prediction API
=====================================
Endpoint:  POST /predict
           GET  /          → health check
           GET  /health    → detailed health check

Run locally:
    python app.py

Deploy (Render / Railway / Heroku):
    gunicorn app:app
"""

import os
import logging

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

# ── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

# ── Flask app ──────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from the HTML frontend

# ── Load ML artifacts ──────────────────────────────────────────────────────
# Artifacts live in the same directory as this file.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def _load(filename: str):
    """Load a joblib artifact and log the result."""
    path = os.path.join(BASE_DIR, filename)
    try:
        artifact = joblib.load(path)
        logger.info("Loaded  ✓  %s", filename)
        return artifact
    except FileNotFoundError:
        logger.error("Missing artifact: %s — place it in %s", filename, BASE_DIR)
        raise
    except Exception as exc:
        logger.error("Failed to load %s: %s", filename, exc)
        raise

try:
    model               = _load("kidney_disease_model.joblib")
    imputation_values   = _load("imputation_values.joblib")
    label_encoders      = _load("label_encoders.joblib")
    class_label_encoder = _load("class_label_encoder.joblib")
    minmax_scaler       = _load("minmax_scaler.joblib")
    _artifacts_ok = True
except Exception:
    _artifacts_ok = False
    logger.warning(
        "One or more model artifacts could not be loaded. "
        "The /predict endpoint will return 503 until all artifacts are present."
    )


# ── Preprocessing helper ───────────────────────────────────────────────────

# Recognised text normalisation for noisy categorical columns
_TEXT_FIXES = {
    "Diabetes_Mellitus":   {" yes": "yes", "\tno": "no", "\tyes": "yes"},
    "Coronary_Artery_Disease": {"\tno": "no"},
}

def preprocess_input(data: dict) -> np.ndarray:
    """
    Convert a raw JSON dict from the request body into a scaled NumPy array
    ready for model.predict().

    Steps:
        1. Build a single-row DataFrame.
        2. Fill missing values using stored imputation_values.
        3. Normalise noisy categorical strings.
        4. Label-encode categorical columns.
        5. Select & order features to match the training schema.
        6. Convert to numeric and MinMax-scale.
    """
    df = pd.DataFrame([data])

    # 1. Ensure all expected features are present (Impute missing) ----------------
    # Use scaler's feature names if present, else all imputation keys (including Class)
    feature_columns = list(getattr(minmax_scaler, "feature_names_in_", imputation_values.keys()))

    for col in feature_columns:
        if col not in df.columns:
            # If column is missing entirely, initialize with imputation value
            df[col] = imputation_values.get(col, 0)
        else:
            # If column exists but has NaN, fill it
            df[col] = df[col].fillna(imputation_values[col])

    # 2. Fix noisy text in categorical columns ---------------------------------
    for col, mapping in _TEXT_FIXES.items():
        if col in df.columns:
            df[col] = df[col].replace(mapping)

    # 3. Label-encode categorical columns -------------------------------------
    for col, encoder in label_encoders.items():
        if col in df.columns:
            def _safe_encode(value):
                if value in encoder.classes_:
                    return encoder.transform([value])[0]
                # Fall back to the imputed (most-frequent) value
                fallback = imputation_values.get(col, encoder.classes_[0])
                try:
                    return encoder.transform([fallback])[0]
                except:
                    return 0 # Final fallback

            df[col] = df[col].apply(_safe_encode)

    # 4. Select features in exact order ---------------------------------------
    df_processed = df[feature_columns].copy()

    # 5. Coerce to numeric (handles any stray strings) -------------------------
    df_processed = df_processed.apply(pd.to_numeric, errors="coerce")

    # 6. MinMax scale ---------------------------------------------------------
    scaled = minmax_scaler.transform(df_processed)

    # The scaled array has 25 features, but the model expects 24 (without Class).
    if "Class" in feature_columns:
        class_idx = feature_columns.index("Class")
        scaled = np.delete(scaled, class_idx, axis=1)

    return scaled


# ── Routes ─────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def home():
    """Basic health-check on root."""
    return jsonify({
        "service": "KidneyCare AI – Prediction API",
        "status": "running",
        "artifacts_loaded": _artifacts_ok,
    })


@app.route("/health", methods=["GET"])
def health():
    """Detailed health-check used by deployment platforms."""
    if _artifacts_ok:
        return jsonify({"status": "healthy", "artifacts_loaded": True}), 200
    return jsonify({"status": "degraded", "artifacts_loaded": False}), 503


@app.route("/predict", methods=["POST"])
def predict():
    """
    Accepts JSON body with clinical feature keys and returns a CKD prediction.

    Request body example:
    {
        "Age": 55,
        "Blood_Pressure": 80,
        "Specific_Gravity": 1.02,
        "Albumin": 1,
        "Sugar": 0,
        "Red_Blood_Cells": "normal",
        "Pus_Cell": "normal",
        "Serum_Creatinine": 1.2,
        "Haemoglobin": 14.5
    }

    Response:
    {
        "prediction": "ckd"   // or "notckd"
    }
    """
    # Guard: artifacts must be loaded
    if not _artifacts_ok:
        return jsonify({
            "error": "Model artifacts are not loaded. Check server logs."
        }), 503

    # Parse request body
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    # Validate: at least one recognised feature must be present
    known_keys = set(imputation_values.keys()) - {"Class"}
    if not known_keys.intersection(data.keys()):
        return jsonify({
            "error": "No recognised feature keys found.",
            "expected_keys": sorted(known_keys),
        }), 400

    try:
        processed = preprocess_input(data)
        prediction = model.predict(processed)
        predicted_label = class_label_encoder.inverse_transform(prediction)[0]

        # Also return prediction probability if the model supports it
        response = {"prediction": predicted_label}
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(processed)[0]
            classes = list(class_label_encoder.classes_)
            response["probabilities"] = {
                cls: float(f"{float(p):.4f}")
                for cls, p in zip(classes, proba)
            }

        return jsonify(response), 200

    except Exception as exc:
        logger.exception("Prediction failed: %s", exc)
        return jsonify({"error": str(exc)}), 400


# ── Entry point ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Render / Railway pass PORT via env var; default to 5000 locally
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    logger.info("Starting KidneyCare AI API on port %d (debug=%s)", port, debug)
    app.run(host="0.0.0.0", port=port, debug=debug)
