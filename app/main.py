from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import (
    TrainingRequest, TrainingResponse, PredictRequest, PredictResponse,
    AlertResponse, ModelStatusResponse
)
from .trainer import train_model, is_model_trained
from .model import predict_risk, predict_with_analysis

app = FastAPI(title="DeepEduGraph AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/train", response_model=TrainingResponse)
def train(request: TrainingRequest):
    try:
        metrics = train_model(request.features)
        return TrainingResponse(**metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        risk = predict_risk(request.features)
        return PredictResponse(risk=risk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/alert", response_model=AlertResponse)
def alert(request: PredictRequest):
    try:
        result = predict_with_analysis(request.features)
        from .schemas import FactorExplanation
        factors = [FactorExplanation(**f) for f in result["factors"]]
        return AlertResponse(
            risk_score=result["risk_score"],
            trend=result["trend"],
            factors=factors,
            history=result["history"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model/status", response_model=ModelStatusResponse)
def get_model_status():
    return ModelStatusResponse(model_trained=is_model_trained())

@app.get("/")
def root():
    return {"message": "DeepEduGraph AI Service", "status": "running"}
