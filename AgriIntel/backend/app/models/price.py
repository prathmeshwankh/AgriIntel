from datetime import datetime

from typing import List, Optional

from pydantic import BaseModel, Field


class PricePredictionRequest(BaseModel):

    crop: str

    state: str

    district: str

    market: str

    forecast_days: Optional[int] = Field(
        default=None,
        ge=1,
        le=30
    )

    days: Optional[int] = Field(
        default=None,
        ge=1,
        le=30
    )


class DailyForecast(BaseModel):

    date: str

    predicted_price: float

    day: Optional[str] = None

    price: Optional[float] = None


class PricePredictionResponse(BaseModel):

    id: Optional[str] = None

    crop: str

    state: str

    district: str

    market: str

    forecast_days: int

    days: Optional[int] = None

    current_price: float

    predicted_price: Optional[float] = None

    change_percent: Optional[float] = None

    predictions: List[DailyForecast]

    forecast: Optional[List[dict]] = None

    model_used: str

    trend: str

    timestamp: datetime = Field(
        default_factory=datetime.utcnow
    )