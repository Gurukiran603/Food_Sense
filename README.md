# Food-Sense-kalp-AI-Thon.
 
## FoodSense

Smart food shelf-life prediction and freshness tracking. This repository contains a FastAPI backend and a React + Vite + Tailwind frontend. The app predicts expiry dates for produce, lets users authenticate, and surfaces alerts. A curated image dataset is included for experimentation.

## 🚀 Features
- AI/ML-powered expiry detection (precomputes fruit/vegetable shelf life)  
- FastAPI backend with SQLite storage  
- React frontend (Vite) for user interaction  
- Static frontend served on port 3000  
- Recipe suggestions based on near-expiry foods  

---

## 📂 Project Structure
```

kittip/
│── backend/        # FastAPI app (ML + API + SQLite)
│── frontend/       # React (Vite) frontend
│── frontend1/      # Static frontend (served via python http.server)
│── dataset/        # Dataset used for ML model

````

---

## ⚡ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Gurukiran603/Food_Sense.git
cd Food_Sense
````

### 2️⃣ Create Virtual Environment (Python 3.10+ recommended)

```sh
python -m venv savorsmart_env
savorsmart_env\Scripts\activate
pip install -r requirements.txt
```

### 3️⃣ Install Frontend Dependencies

```sh
cd frontend
npm install
cd ..
```

---

## ▶ Run the Project (All Services)

Copy-paste this **single command** in **PowerShell**:

```powershell
# Go to project root
cd C:\Users\HP\OneDrive\Desktop\kittip

# 1) AI/ML precompute from 50% of dataset (prints averages in this window)
Write-Host "Precomputing dataset averages (50%)..."
D:\savorsmart_env\.venv\Scripts\python -c "import sys,os; sys.path.append('backend'); os.environ['DATASET_DIR']='dataset'; from app.ml.dataset_days import get_fruit_avg_days; print(get_fruit_avg_days())"
Write-Host "Done."

# 2) Start Backend (FastAPI + SQLite) in a new window
$backendCmd = 'cd C:\Users\HP\OneDrive\Desktop\kittip; $env:DATASET_DIR="dataset"; D:\savorsmart_env\.venv\Scripts\python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload'
Start-Process powershell -ArgumentList "-NoExit","-Command",$backendCmd

# 3) Start React frontend (Vite) in a new window (API base: http://localhost:8000)
$frontendCmd = 'cd C:\Users\HP\OneDrive\Desktop\kittip\frontend; $env:VITE_API_BASE = "http://localhost:8000"; npm run dev'
Start-Process powershell -ArgumentList "-NoExit","-Command",$frontendCmd

# 4) Start frontend1 (static) in a new window on port 3000
$frontend1Cmd = 'cd C:\Users\HP\OneDrive\Desktop\kittip\frontend1; python -m http.server 3000'
Start-Process powershell -ArgumentList "-NoExit","-Command",$frontend1Cmd

Write-Host "`nAll services launched:"
Write-Host "Backend:     http://localhost:8000"
Write-Host "Frontend:    (see the URL printed by npm run dev, usually http://localhost:5173)"
Write-Host "Frontend1:   http://localhost:3000"
```

---

## 🌐 Access the App

* **Backend (API):** [http://localhost:8000](http://localhost:8000)
* **Frontend (React):** Usually [http://localhost:5173](http://localhost:5173)
* **Frontend1 (Static):** [http://localhost:3000](http://localhost:3000)
----


### Repository structure

```text
backend/           FastAPI app (auth, predictions, alerts, env)
dataset/           Sample images grouped by item and day ranges
frontend/          React + Vite + Tailwind web app
frontend1/         Static HTML prototypes
savorsmart.db      SQLite database (created at runtime if missing)
```

### Tech stack
- FastAPI, Pydantic, SQLAlchemy, Alembic
- JWT auth (python-jose), password hashing (passlib[bcrypt])
- React 19, Vite 7, Tailwind CSS 4

---

## Getting started

### Prerequisites
- Python 3.11+
- Node.js 18+ (or 20+ recommended)

### Backend setup
```bash
cd backend
python -m venv .venv
# Windows PowerShell
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt

# Run the API (http://127.0.0.1:8000)
uvicorn app.main:app --reload
```

API docs will be available at:
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

Tables are auto-created on startup against a local SQLite database.

### Frontend setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://127.0.0.1:5173
```

The backend CORS is configured for `http://localhost:5173`, `:3000`, and `:5500`, and `*.vercel.app`.

---

## Configuration

Create a `.env` file for backend (optional; sensible defaults exist):

```env
# backend/.env (example)
SECRET_KEY=change-me
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Key defaults (see `backend/app/security.py`):
- `SECRET_KEY` defaults to `dev-secret-change-me`
- `ACCESS_TOKEN_EXPIRE_MINUTES` defaults to `60`

---

## API overview

Base URL: `http://127.0.0.1:8000`

### Health
- `GET /` → `{ name: "FoodSense", status: "ok" }`

### Auth
- `POST /api/auth/register` → Create user
- `POST /api/auth/login` → Obtain JWT
- `POST /api/auth/google` → Login with Google ID token

Request/response models are defined under `backend/app/schemas.py`.

#### Examples
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "StrongPass123",
    "full_name": "Jane Doe"
  }'

curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "StrongPass123"
  }'
```

### Predictions
- `POST /api/predict` → Predict expiry for a single item
- `POST /api/predict/batch` → Predict expiry for multiple items

The service uses dataset-derived average shelf-life when possible and falls back to fruit defaults.

```bash
curl -X POST http://127.0.0.1:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "item_name": "Banana",
    "purchase_date": null
  }'
```

### Alerts (requires Bearer token)
- `GET /api/alerts` → List user alerts
- `POST /api/alerts` → Create alert (`message` field)
- `POST /api/alerts/{alert_id}/read` → Mark as read

```bash
TOKEN="<paste JWT>"
curl http://127.0.0.1:8000/api/alerts -H "Authorization: Bearer $TOKEN"

curl -X POST "http://127.0.0.1:8000/api/alerts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Your apples are nearing expiry"}'
```

### Environment
- `GET /api/environment/env` → Returns simulated environment data (timestamp, location, weather, temperature, humidity)

---

## Dataset

The `dataset/` directory includes sample images organized by item and day ranges (e.g., `Apple(1-5)`, `Banana(10-15)`, `Expired/`). While the current prediction endpoint relies on dataset-derived averages (`backend/app/ml/dataset_days.py`), you can extend this with a full ML pipeline for image-based inference.

---

## Development notes

- SQLAlchemy models and SQLite tables are created at app startup.
- JWT uses HS256; keep `SECRET_KEY` secure in production.
- CORS is permissive for local development and Vercel previews.

---

## Scripts and commands

Backend:
```bash
cd backend
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm run dev
```

Build frontend:
```bash
cd frontend
npm run build
```

---

## Deployment

- Backend can be deployed to any ASGI host (Uvicorn, Gunicorn + Uvicorn workers, etc.).
- Frontend can be deployed to static hosts (Vercel, Netlify). Ensure `VITE` environment configuration or runtime API base points to your backend.

---



