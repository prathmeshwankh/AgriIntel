from datetime import datetime

from typing import List, Optional

from pydantic import BaseModel, Field


class DiseasePredictionResponse(BaseModel):

    id: Optional[str] = None

    crop: str

    disease: str

    confidence: float

    status: str

    info: str

    prevention: str

    timestamp: datetime = Field(
        default_factory=datetime.utcnow
    )


class DiseaseHistoryItem(BaseModel):

    id: str

    user_id: str

    crop: str

    disease: str

    confidence: float

    status: str

    timestamp: datetime