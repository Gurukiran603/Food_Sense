from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from .. import models
from ..deps import get_current_user

router = APIRouter()


@router.get("/alerts")
def list_alerts(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
	rows = db.execute(select(models.Alert).where(models.Alert.user_id == user.id).order_by(models.Alert.created_at.desc())).scalars().all()
	return [
		{
			"id": a.id,
			"message": a.message,
			"is_read": a.is_read,
			"created_at": a.created_at,
		}
		for a in rows
	]


@router.post("/alerts")
def create_alert(message: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
	alert = models.Alert(user_id=user.id, message=message)
	db.add(alert)
	db.commit()
	db.refresh(alert)
	return {"id": alert.id}


@router.post("/alerts/{alert_id}/read")
def mark_read(alert_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
	alert = db.execute(
		select(models.Alert).where(models.Alert.id == alert_id, models.Alert.user_id == user.id)
	).scalar_one_or_none()
	if not alert:
		raise HTTPException(status_code=404, detail="Alert not found")
	alert.is_read = True
	db.add(alert)
	db.commit()
	return {"ok": True}
