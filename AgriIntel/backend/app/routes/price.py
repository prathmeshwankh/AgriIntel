from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from app.database import get_database
from app.models.price import (
    PricePredictionRequest,
    PricePredictionResponse
)
from app.services.price_service import (
    forecast_market_price
)
from app.utils.auth_utils import (
    get_optional_current_user
)


router = APIRouter(
    prefix="/price",
    tags=["Price Forecasting"]
)


@router.post(
    "/predict",
    response_model=PricePredictionResponse
)
async def predict_price(
    request: PricePredictionRequest,
    current_user: dict | None = Depends(
        get_optional_current_user
    )
):
    num_days = request.days or request.forecast_days or 7

    if num_days < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Forecast days must be at least 1."
        )

    if num_days > 30:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Forecast period cannot exceed 30 days."
        )

    result = forecast_market_price(
        crop=request.crop,
        state=request.state,
        district=request.district,
        market=request.market,
        forecast_days=num_days
    )

    preds = result.get("predictions", [])

    # Enrich with fields needed by both main.jsx and PriceForecast.jsx
    formatted_forecast = []
    for idx, p in enumerate(preds, 1):
        price_val = p.get("predicted_price", 0.0)
        formatted_forecast.append({
            "day": f"Day {idx}",
            "date": p.get("date", ""),
            "price": price_val,
            "predicted_price": price_val
        })
        p["day"] = f"Day {idx}"
        p["price"] = price_val

    predicted_price = preds[-1]["predicted_price"] if preds else result.get("current_price", 0.0)
    current_price = result.get("current_price", 1.0)
    change_pct = round(((predicted_price - current_price) / max(current_price, 0.01)) * 100, 2)

    result["predicted_price"] = predicted_price
    result["change_percent"] = change_pct
    result["forecast"] = formatted_forecast
    result["days"] = num_days
    result["forecast_days"] = num_days

    db = get_database()

    document = {
        "user_id": current_user["_id"] if current_user else "anonymous",
        **result
    }

    insert_result = await db.price_predictions.insert_one(
        document
    )

    result["id"] = str(
        insert_result.inserted_id
    )

    return result


@router.get("/history")
async def get_price_history(
    current_user: dict | None = Depends(
        get_optional_current_user
    )
):
    db = get_database()

    query = {}
    if current_user:
        query["user_id"] = current_user["_id"]

    cursor = (
        db.price_predictions
        .find(query)
        .sort("timestamp", -1)
        .limit(50)
    )

    history = []
    async for document in cursor:
        document["id"] = str(document["_id"])
        document["_id"] = str(document["_id"])
        history.append(document)

    return history