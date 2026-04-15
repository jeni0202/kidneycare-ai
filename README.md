# 🩺 KidneyCare AI – CKD Prediction System

![KidneyCare AI Hero](https://raw.githubusercontent.com/shree0-0/kidneycare-ai/main/assets/hero.png)

## 🌟 Overview
**KidneyCare AI** is a state-of-the-art medical diagnostic tool designed to predict the risk of Chronic Kidney Disease (CKD) using advanced Machine Learning. By analyzing clinical parameters such as Serum Creatinine, Hemoglobin, and Blood Pressure, the system provides rapid, accurate, and actionable health assessments.

This repository contains the **Machine Learning Deployment** module, which serves as the core intelligence of the KidneyCare platform via a RESTful Flask API.

---

## 🚀 Key Features
- **AI-Powered Diagnostics:** Uses a high-performance ensemble model (Decision Tree) for pattern recognition across 9 clinical markers.
- **Real-Time Analysis:** Get risk assessments and confidence scores in under 2 seconds.
- **Privacy First:** Data is processed for prediction purposes only and is not stored or transmitted without consent.
- **Professional Dashboard:** Seamless integration with a modern, responsive frontend.
- **Deployment Ready:** Configured for production environments using Gunicorn and Render.

---

## 🛠 Tech Stack
| Category | Technologies |
| :--- | :--- |
| **Backend** | Python, Flask, Gunicorn |
| **Machine Learning** | Scikit-learn, Pandas, NumPy, Joblib |
| **Frontend** | HTML5, Vanilla CSS3, JavaScript (ES6+) |
| **Deployment** | Render, Git |

---

## 🔌 API Documentation

The API exposes a single `POST` endpoint for predictions.

### **Endpoint**
`POST /predict`

### **Request Body (JSON)**
```json
{
  "Age": 48.0,
  "Blood_Pressure": 80.0,
  "Specific_Gravity": 1.020,
  "Albumin": 1.0,
  "Sugar": 0.0,
  "Red_Blood_Cells": "normal",
  "Pus_Cell": "normal",
  "Serum_Creatinine": 1.2,
  "Hemoglobin": 15.4
}
```

### **Successful Response (JSON)**
```json
{
  "prediction": "ckd",
  "probabilities": {
    "ckd": 0.98,
    "notckd": 0.02
  }
}
```

---

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shree0-0/kidneycare-ai.git
   cd kidneycare-ai/machine_learning_deployment
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the API:**
   ```bash
   python app.py
   ```
   The API will be available at `http://127.0.0.1:5000`.

---

## 🌐 Live API
You can access the production API at:
[https://machine-learning-deployment-mdk2.onrender.com](https://machine-learning-deployment-mdk2.onrender.com)

---

## 📜 Disclaimer
*This tool is intended for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.*

---
&copy; 2026 KidneyCare AI. Built for the future of healthcare.
