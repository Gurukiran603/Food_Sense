from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
	email: EmailStr
	password: str
	full_name: Optional[str] = None


class UserLogin(BaseModel):
	email: EmailStr
	password: str


class GoogleTokenIn(BaseModel):
	id_token: str


class Token(BaseModel):
	access_token: str
	token_type: str = "bearer"


class UserOut(BaseModel):
	id: int
	email: EmailStr
	full_name: Optional[str] = None

	class Config:
		from_attributes = True


class PantryItemIn(BaseModel):
	name: str
	quantity: float = 1.0
	unit: str = "unit"
	purchase_date: Optional[datetime] = None


class PantryItemOut(BaseModel):
	id: int
	name: str
	quantity: float
	unit: str
	purchase_date: datetime
	predicted_expiry: Optional[datetime] = None

	class Config:
		from_attributes = True


class PredictionRequest(BaseModel):
	item_name: str
	purchase_date: Optional[datetime] = None
	storage: Optional[str] = None


class PredictionResponse(BaseModel):
	item_name: str
	predicted_expiry: datetime
	confidence: float


class PredictionBatchRequest(BaseModel):
	items: List[PredictionRequest]


class PredictionBatchItem(BaseModel):
	item_name: str
	predicted_expiry: datetime
	confidence: float


class PredictionBatchResponse(BaseModel):
	results: List[PredictionBatchItem]
