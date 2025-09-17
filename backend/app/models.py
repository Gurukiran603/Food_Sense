from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
	__tablename__ = "users"
	id = Column(Integer, primary_key=True, index=True)
	email = Column(String, unique=True, index=True, nullable=False)
	password_hash = Column(String, nullable=True)
	full_name = Column(String, nullable=True)
	google_sub = Column(String, unique=True, nullable=True)
	created_at = Column(DateTime, default=datetime.utcnow)

	items = relationship("PantryItem", back_populates="owner")


class PantryItem(Base):
	__tablename__ = "pantry_items"
	id = Column(Integer, primary_key=True, index=True)
	name = Column(String, index=True, nullable=False)
	quantity = Column(Float, default=1.0)
	unit = Column(String, default="unit")
	purchase_date = Column(DateTime, default=datetime.utcnow)
	predicted_expiry = Column(DateTime, nullable=True)
	user_id = Column(Integer, ForeignKey("users.id"))

	owner = relationship("User", back_populates="items")


class Alert(Base):
	__tablename__ = "alerts"
	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id"), index=True)
	item_id = Column(Integer, ForeignKey("pantry_items.id"), nullable=True)
	message = Column(String, nullable=False)
	is_read = Column(Boolean, default=False)
	created_at = Column(DateTime, default=datetime.utcnow)
