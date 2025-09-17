from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from .. import schemas
from ..database import get_db
from ..ml.dataset_days import get_fruit_avg_days

router = APIRouter()

# Default per-fruit shelf-life in days (room-temp defaults)
SHELF_LIFE_DAYS = {
	"banana": 5,
	"apple": 21,
	"tomato": 5,
	"carrot": 28,
	"strawberry": 3,
	"blueberry": 7,
	"orange": 14,
	"lemon": 21,
	"grape": 7,
	"mango": 5,
	"pineapple": 5,
	"pear": 7,
	"peach": 4,
	"watermelon": 5,
}

_DATASET_AVG = get_fruit_avg_days(sample_ratio=0.5)


def predict_for_name(name: str, purchase_date: datetime | None) -> tuple[datetime, float]:
	key = (name or "").strip().lower()
	# Use dataset-derived averages if fruit matches
	for fruit, avg_days in _DATASET_AVG.items():
		if fruit in key:
			purchase = purchase_date or datetime.utcnow()
			return purchase + timedelta(days=int(round(avg_days))), 0.85

	# Fallback to defaults
	best = 10
	confidence = 0.5
	for fruit, days in SHELF_LIFE_DAYS.items():
		if fruit in key:
			best = days
			confidence = 0.8
			break
	purchase = purchase_date or datetime.utcnow()
	return purchase + timedelta(days=best), confidence


@router.post("/predict", response_model=schemas.PredictionResponse)
def predict_expiry(req: schemas.PredictionRequest, db: Session = Depends(get_db)):
	predicted, conf = predict_for_name(req.item_name, req.purchase_date)
	return schemas.PredictionResponse(
		item_name=req.item_name,
		predicted_expiry=predicted,
		confidence=conf,
	)


@router.post("/predict/batch", response_model=schemas.PredictionBatchResponse)
def predict_expiry_batch(body: schemas.PredictionBatchRequest, db: Session = Depends(get_db)):
	results: list[schemas.PredictionBatchItem] = []
	for item in body.items:
		predicted, conf = predict_for_name(item.item_name, item.purchase_date)
		results.append(schemas.PredictionBatchItem(item_name=item.item_name, predicted_expiry=predicted, confidence=conf))
	return schemas.PredictionBatchResponse(results=results)
