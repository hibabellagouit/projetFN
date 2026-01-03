from pydantic import BaseModel
from typing import List, Dict, Optional

class TrainingRequest(BaseModel):
    features: List[Dict[str, float]]

class PredictRequest(BaseModel):
    features: List[Dict[str, float]]

class PredictResponse(BaseModel):
    risk: float

class FactorExplanation(BaseModel):
    impact: str
    valeur: float
    importance: float

class AlertResponse(BaseModel):
    risk_score: float
    trend: str
    factors: List[FactorExplanation]
    history: List[float]

class TrainingResponse(BaseModel):
    accuracy: float
    precision: float
    recall: float
    roc_auc: float

class ModelStatusResponse(BaseModel):
    model_trained: bool
