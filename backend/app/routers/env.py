from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/env")
def get_environment():
	# Simulated data; replace with real API integrations if desired
	return {
		"timestamp": datetime.utcnow().isoformat() + "Z",
		"location": "local",
		"weather": "Partly Cloudy",
		"temperature_c": 27.5,
		"humidity_pct": 58,
		"spo2_pct": 98,
	}

