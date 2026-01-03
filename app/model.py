import numpy as np
from typing import List, Dict
from .trainer import load_model, FEATURE_NAMES

def predict_risk(features: List[Dict[str, float]]) -> float:
    model, scaler = load_model()
    if model is None or scaler is None:
        return 0.5
    
    feature_array = []
    for item in features:
        feature_array.append([
            item.get("totalEvents", 0),
            item.get("logins", 0),
            item.get("resourceViews", 0),
            item.get("submissions", 0)
        ])
    
    X = np.array(feature_array)
    X_scaled = scaler.transform(X)
    
    probabilities = model.predict_proba(X_scaled)
    risk_score = float(np.mean(probabilities[:, 1]))
    
    return max(0.0, min(1.0, risk_score))

def analyze_feature_contribution(features: List[Dict[str, float]]) -> List[Dict]:
    model, scaler = load_model()
    if model is None or scaler is None:
        return []
    
    feature_array = []
    for item in features:
        feature_array.append([
            item.get("totalEvents", 0),
            item.get("logins", 0),
            item.get("resourceViews", 0),
            item.get("submissions", 0)
        ])
    
    X = np.array(feature_array)
    X_scaled = scaler.transform(X)
    
    importances = model.feature_importances_
    mean_values = np.mean(X, axis=0)
    
    factors = []
    for i, feature_name in enumerate(FEATURE_NAMES):
        importance = float(importances[i])
        valeur = float(mean_values[i])
        
        if valeur < 5:
            impact = "faible"
        elif valeur < 20:
            impact = "moyen"
        else:
            impact = "élevé"
        
        factors.append({
            "impact": impact,
            "valeur": valeur,
            "importance": importance
        })
    
    return sorted(factors, key=lambda x: x["importance"], reverse=True)

def detect_trend(history: List[float]) -> str:
    if len(history) < 3:
        return "stable"
    
    recent = np.mean(history[-3:])
    older = np.mean(history[:-3]) if len(history) > 3 else history[0]
    
    diff = recent - older
    
    if diff > 0.1:
        return "hausse"
    elif diff < -0.1:
        return "baisse"
    else:
        return "stable"

def predict_with_analysis(features: List[Dict[str, float]], history: List[float] = None) -> Dict:
    risk_score = predict_risk(features)
    factors = analyze_feature_contribution(features)
    
    if history is None:
        history = []
    
    trend = detect_trend(history + [risk_score])
    
    return {
        "risk_score": risk_score,
        "trend": trend,
        "factors": factors,
        "history": (history + [risk_score])[-10:]
    }
