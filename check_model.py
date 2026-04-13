import joblib
import pandas as pd
import os

path_model = 'machine_learning_deployment/kidney_disease_model.joblib'
model = joblib.load(path_model)

print(f"Model type: {type(model)}")
if hasattr(model, 'n_features_in_'):
    print(f"Model expected features: {model.n_features_in_}")
if hasattr(model, 'feature_names_in_'):
    print(f"Model feature names: {list(model.feature_names_in_)}")
else:
    print("Model has no feature_names_in_")
