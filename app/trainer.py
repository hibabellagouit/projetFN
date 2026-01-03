import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, roc_auc_score

MODEL_PATH = "model.joblib"
SCALER_PATH = "scaler.joblib"

FEATURE_NAMES = ["totalEvents", "logins", "resourceViews", "submissions"]

def extract_features(data):
    features_list = []
    labels_list = []
    
    for item in data:
        features = [
            item.get("totalEvents", 0),
            item.get("logins", 0),
            item.get("resourceViews", 0),
            item.get("submissions", 0)
        ]
        features_list.append(features)
        labels_list.append(item.get("label", 0))
    
    return np.array(features_list), np.array(labels_list)

def train_model(training_data):
    X, y = extract_features(training_data)
    
    if len(X) == 0:
        raise ValueError("No training data provided")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    
    model.fit(X_train_scaled, y_train)
    
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    
    return {
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "roc_auc": float(roc_auc)
    }

def load_model():
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        return None, None
    return joblib.load(MODEL_PATH), joblib.load(SCALER_PATH)

def is_model_trained():
    return os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH)
