import joblib
import pandas as pd
import os

path_scaler = 'machine_learning_deployment/minmax_scaler.joblib'
path_impute = 'machine_learning_deployment/imputation_values.joblib'

scaler = joblib.load(path_scaler)
impute = joblib.load(path_impute)

print(f"Scaler expected features: {scaler.n_features_in_}")
if hasattr(scaler, 'feature_names_in_'):
    print("SCALER_FEATURES:" + ",".join(list(scaler.feature_names_in_)))
else:
    print("Scaler has no feature_names_in_")

print(f"Impute keys count: {len(impute.keys())}")
print(f"Impute keys: {sorted(list(impute.keys()))}")
