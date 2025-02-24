import json
import numpy as np
import joblib
from azureml.core.model import Model

def init():
    global model
    global scaler

    model_dir = "/var/azureml-app/azureml-models/heart-disease-prediction-model-with-scaler/1/heart-disease-prediction-model-with-scaler"

    model_path = f"{model_dir}/heart-disease-prediction-model.joblib"
    scaler_path = f"{model_dir}/heart-disease-prediction-scaler.joblib"

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

def run(raw_data):
    try:
        data = json.loads(raw_data)
        data_scaled = scaler.transform(np.array(data['data']))
        prediction = model.predict_proba(data_scaled)
        positive_probability = prediction[:, 1]
        return {'probability': round(prediction[0][1] * 100, 2)}
    except Exception as e:
        return {'error': str(e)}