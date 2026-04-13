# 🏥 KidneyCare AI – Chronic Kidney Disease Prediction System

![KidneyCare AI Hero](https://raw.githubusercontent.com/shree0-0/kidneycare-ai/main/assets/hero.png)

## 🌐 Overview
**KidneyCare AI** is a comprehensive health assessment platform that leverages Machine Learning to provide early detection of Chronic Kidney Disease (CKD). By analyzing nine critical clinical biomarkers, the platform empowers patients and healthcare professionals with rapid, data-driven insights.

## ✨ Core Features
- **AI-Driven Prediction:** High-accuracy results based on professional medical datasets.
- **Modern UI/UX:** A sleek, responsive dashboard built with luxury aesthetics and smooth animations.
- **Privacy-Centric:** Secure data processing for risk assessment.
- **Real-Time Feedback:** Instant analysis results including model confidence scores.
- **Scalable Architecture:** Modular separation between the machine learning backend and the interactive frontend.

## 🏗 Project Structure
- `/`: The interactive frontend application (HTML, CSS, JS).
- `/machine_learning_deployment`: The Flask-based ML prediction API.

## 🛠 Technology Stack
### Frontend
- **HTML5/CSS3:** Semantic structure and custom glassmorphic styling.
- **JavaScript (ES6):** Dynamic interaction and asynchronous API communication.
- **Google Fonts:** Inter typography for a premium feel.

### Backend (ML API)
- **Flask:** Lightweight RESTful API framework.
- **Scikit-learn:** Decision Tree classifier for predictive modeling.
- **Pandas & NumPy:** Data preprocessing and numerical operations.
- **Joblib:** Model persistence and serialization.

## 🚀 Getting Started

### Local Development
1. **Frontend:** Simply open `index.html` in your browser.
2. **Backend:**
   ```bash
   cd machine_learning_deployment
   pip install -r requirements.txt
   python app.py
   ```

### Live Demo
- **Frontend:** [https://shree0-0.github.io/kidneycare-ai/](https://shree0-0.github.io/kidneycare-ai/) *(Placeholder)*
- **API:** [https://machine-learning-deployment-mdk2.onrender.com](https://machine-learning-deployment-mdk2.onrender.com)

## 🧪 Clinical Markers Analyzed
The model evaluates the following parameters:
- Age
- Blood Pressure (bp)
- Specific Gravity (sg)
- Albumin (al)
- Sugar (su)
- Red Blood Cell status (rbc)
- Pus Cell status (pc)
- Serum Creatinine (sc)
- Hemoglobin (hemo)

## ⚖ License
This project is open-source and available under the MIT License.

## 🤝 Support
For any questions or feedback, please contact [support@kidneycare.ai](mailto:support@kidneycare.ai).

---
*Developed by the KidneyCare AI Team — 2026*
x