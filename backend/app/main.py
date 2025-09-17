from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, predictions, alerts, env
from . import models
from .database import engine

app = FastAPI(title="FoodSense API", version="0.1.0")

# CORS - allow local dev and typical frontend hosts
app.add_middleware(
	CORSMiddleware,
	allow_origins=[
		"http://localhost:5173",
		"http://127.0.0.1:5173",
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		"http://localhost:5500",
		"http://127.0.0.1:5500",
		"https://*.vercel.app",
	],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
	# Ensure SQLite tables exist
	models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(predictions.router, prefix="/api", tags=["predictions"])
app.include_router(alerts.router, prefix="/api", tags=["alerts"])
app.include_router(env.router, prefix="/api", tags=["environment"])

@app.get("/")
async def root():
	return {"name": "FoodSense", "status": "ok"}
