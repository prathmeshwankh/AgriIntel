from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# =========================================================
# BASE DIRECTORY
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):

    # =====================================================
    # PROJECT
    # =====================================================

    PROJECT_NAME: str = "AgriIntel"

    VERSION: str = "1.0.0"

    API_V1_STR: str = "/api"


    # =====================================================
    # DATABASE
    # =====================================================

    MONGODB_URL: str = "mongodb://localhost:27017"

    DATABASE_NAME: str = "agriintel_db"


    # =====================================================
    # JWT
    # =====================================================

    JWT_SECRET: str = "change_this_secret"

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7


    # =====================================================
    # DISEASE MODEL
    # =====================================================

    DISEASE_MODEL_PATH: str = str(
        BASE_DIR
        / "models"
        / "disease_model"
        / "crop_disease_model.keras"
    )


    # =====================================================
    # DISEASE CLASS NAMES
    # =====================================================

    DISEASE_CLASS_NAMES_PATH: str = str(
        BASE_DIR
        / "models"
        / "disease_model"
        / "class_names.json"
    )


    # =====================================================
    # PRICE MODEL
    # =====================================================

    PRICE_MODEL_PATH: str = str(
        BASE_DIR
        / "models"
        / "price_model"
        / "best_price_model.joblib"
    )


    # =====================================================
    # PRICE DATASET
    # =====================================================

    PRICE_DATASET_PATH: str = str(
        BASE_DIR
        / "data"
        / "price_data.csv"
    )


    # =====================================================
    # ENVIRONMENT
    # =====================================================

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


# =========================================================
# SETTINGS INSTANCE
# =========================================================

settings = Settings()