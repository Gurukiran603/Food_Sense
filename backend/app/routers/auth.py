from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, models
from ..database import get_db, engine
from ..security import get_password_hash, verify_password, create_access_token
from pydantic import EmailStr
from sqlalchemy import select
import requests

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

router = APIRouter()


@router.post("/register", response_model=schemas.UserOut)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
	existing = db.execute(select(models.User).where(models.User.email == user_in.email)).scalar_one_or_none()
	if existing:
		raise HTTPException(status_code=400, detail="Email already registered")
	user = models.User(
		email=str(user_in.email),
		password_hash=get_password_hash(user_in.password),
		full_name=user_in.full_name,
	)
	db.add(user)
	db.commit()
	db.refresh(user)
	return user


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
	user: models.User | None = db.execute(
		select(models.User).where(models.User.email == str(credentials.email))
	).scalar_one_or_none()
	if not user or not user.password_hash or not verify_password(credentials.password, user.password_hash):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
	token = create_access_token(subject=str(user.id))
	return {"access_token": token, "token_type": "bearer"}


@router.post("/google", response_model=schemas.Token)
def login_google(payload: schemas.GoogleTokenIn, db: Session = Depends(get_db)):
	# Verify token using Google tokeninfo endpoint (no client secret required)
	resp = requests.get("https://oauth2.googleapis.com/tokeninfo", params={"id_token": payload.id_token}, timeout=10)
	if resp.status_code != 200:
		raise HTTPException(status_code=401, detail="Invalid Google token")
	data = resp.json()
	google_sub = data.get("sub")
	email = data.get("email")
	name = data.get("name")
	if not google_sub or not email:
		raise HTTPException(status_code=401, detail="Google token missing subject/email")

	user: models.User | None = db.execute(
		select(models.User).where((models.User.google_sub == google_sub) | (models.User.email == email))
	).scalar_one_or_none()
	if not user:
		user = models.User(email=email, full_name=name, google_sub=google_sub, password_hash=None)
		db.add(user)
		db.commit()
		db.refresh(user)
	else:
		# Backfill google_sub if missing
		if not user.google_sub:
			user.google_sub = google_sub
			db.add(user)
			db.commit()

	token = create_access_token(subject=str(user.id))
	return {"access_token": token, "token_type": "bearer"}
