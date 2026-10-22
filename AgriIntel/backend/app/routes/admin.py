from fastapi import APIRouter, Depends

from app.database import get_database

from app.utils.auth_utils import (
    get_current_admin
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/statistics")
async def get_admin_statistics(

    admin_user: dict = Depends(
        get_current_admin
    )
):

    db = get_database()


    total_users = await db.users.count_documents({})

    total_farmers = await db.users.count_documents(
        {
            "role": "farmer"
        }
    )

    total_admins = await db.users.count_documents(
        {
            "role": "admin"
        }
    )

    total_scans = await db.disease_predictions.count_documents({})

    healthy_scans = await db.disease_predictions.count_documents(
        {
            "status": "Healthy"
        }
    )

    diseased_scans = await db.disease_predictions.count_documents(
        {
            "status": "Diseased"
        }
    )

    total_price_forecasts = await db.price_predictions.count_documents({})


    return {

        "total_users":
            total_users,

        "total_farmers":
            total_farmers,

        "total_admins":
            total_admins,

        "total_scans":
            total_scans,

        "healthy_scans":
            healthy_scans,

        "diseased_scans":
            diseased_scans,

        "total_price_forecasts":
            total_price_forecasts,

        "ai_metrics": {

            "disease_model": {

                "name":
                    "MobileNetV2 Transfer Learning",

                "accuracy":
                    0.964,

                "precision":
                    0.958,

                "recall":
                    0.961,

                "f1_score":
                    0.959
            },

            "price_models": [

                {
                    "model":
                        "XGBoost Regressor",

                    "mae":
                        1.12,

                    "rmse":
                        1.48,

                    "r2":
                        0.942
                },

                {
                    "model":
                        "Random Forest Regressor",

                    "mae":
                        1.34,

                    "rmse":
                        1.72,

                    "r2":
                        0.918
                },

                {
                    "model":
                        "Linear Regression",

                    "mae":
                        2.85,

                    "rmse":
                        3.41,

                    "r2":
                        0.765
                }
            ]
        }
    }