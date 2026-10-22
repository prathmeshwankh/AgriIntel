from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.database import get_database
from app.services.disease_service import (
    predict_plant_disease
)
from app.utils.auth_utils import get_optional_current_user


router = APIRouter(
    prefix="/disease",
    tags=["Disease Detection"]
)


@router.post("/predict")
async def predict_disease(
    file: UploadFile = File(...),
    current_user: dict | None = Depends(get_optional_current_user)
):

    # =====================================================
    # CHECK FILE
    # =====================================================

    if not file:

        raise HTTPException(
            status_code=400,
            detail="No image uploaded."
        )

    # =====================================================
    # CHECK IMAGE TYPE
    # =====================================================

    allowed_types = [

        "image/jpeg",
        "image/png",
        "image/jpg"
    ]

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail=(
                "Only JPG and PNG images "
                "are supported."
            )
        )

    # =====================================================
    # READ IMAGE
    # =====================================================

    image_bytes = await file.read()

    if not image_bytes:

        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    # =====================================================
    # PREDICTION
    # =====================================================

    try:

        result = await predict_plant_disease(
            image_bytes
        )

        db = get_database()

        is_healthy = "Healthy" in result.get("disease_name", "") or "Healthy" in result.get("severity", "")
        status_label = "Healthy" if is_healthy else "Diseased"

        scan_doc = {
            "user_id": current_user["_id"] if current_user else "anonymous",
            "filename": file.filename,
            "crop": result.get("affected_crop", ""),
            "disease": result.get("disease_name", ""),
            "status": status_label,
            "confidence": result.get("confidence", 0.0),
            "severity": result.get("severity", ""),
            "symptoms": result.get("symptoms", []),
            "treatment": result.get("treatment", {}),
            "timestamp": datetime.utcnow()
        }

        insert_res = await db.disease_predictions.insert_one(scan_doc)
        scan_id = str(insert_res.inserted_id)

        # Merge for complete compatibility:
        # Both root-level attributes (expected by main.jsx)
        # and nested result/success (expected by api.js)
        response_data = {
            "success": True,
            "id": scan_id,
            "filename": file.filename,
            "status": status_label,
            **result,
            "result": result
        }

        return response_data

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/history")
async def get_disease_history(
    current_user: dict | None = Depends(get_optional_current_user)
):
    db = get_database()

    query = {}
    if current_user:
        query["user_id"] = current_user["_id"]

    cursor = db.disease_predictions.find(query).sort("timestamp", -1).limit(50)

    history = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc["_id"] = str(doc["_id"])
        history.append(doc)

    return history