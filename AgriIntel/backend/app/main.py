import asyncio

from contextlib import asynccontextmanager

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

from app.database import (
    connect_to_mongo,
    close_mongo_connection
)

from app.routes import (
    auth,
    disease,
    price,
    admin,
    weather
)

from app.services.disease_service import (
    load_disease_model
)

from app.services.price_service import (
    load_price_model
)


# =========================================================
# APPLICATION LIFESPAN
# =========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    # =====================================================
    # DATABASE
    # =====================================================

    await connect_to_mongo()


    # =====================================================
    # LOAD ML MODELS
    # =====================================================

    loop = asyncio.get_running_loop()


    # -----------------------------------------------------
    # Disease Detection Model
    # -----------------------------------------------------

    await loop.run_in_executor(
        None,
        load_disease_model
    )


    # -----------------------------------------------------
    # Price Forecast Model
    # -----------------------------------------------------

    await loop.run_in_executor(
        None,
        load_price_model
    )


    print(
        "AgriIntel services initialized successfully."
    )


    # =====================================================
    # APPLICATION RUNNING
    # =====================================================

    yield


    # =====================================================
    # SHUTDOWN
    # =====================================================

    await close_mongo_connection()


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(

    title=settings.PROJECT_NAME,

    version=settings.VERSION,

    description=(
        "AI-powered crop disease detection "
        "and agricultural market price "
        "forecasting system."
    ),

    lifespan=lifespan
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# =========================================================
# API ROUTES (Supporting both /api and /api/v1)
# =========================================================

prefixes = [settings.API_V1_STR]
if "/api/v1" not in prefixes:
    prefixes.append("/api/v1")
if "/api" not in prefixes:
    prefixes.append("/api")

for pfx in prefixes:
    app.include_router(
        auth.router,
        prefix=pfx
    )

    app.include_router(
        disease.router,
        prefix=pfx
    )

    app.include_router(
        price.router,
        prefix=pfx
    )

    app.include_router(
        admin.router,
        prefix=pfx
    )

    app.include_router(
        weather.router,
        prefix=pfx
    )


# =========================================================
# AUXILIARY ROUTES
# =========================================================

SUPPORTED_CROPS = [
    "Tomato",
    "Potato",
    "Onion",
    "Wheat",
    "Rice",
    "Cotton",
    "Soybean",
    "Apple",
    "Chana",
    "Maize",
    "Turmeric",
    "Ginger",
    "Garlic",
    "Mustard",
    "Groundnut",
    "Green chilli",
    "Banana",
    "Pomegranate",
    "Grapes",
    "Sugarcane"
]

SUPPORTED_MARKETS = [
    {"state": "Maharashtra", "district": "Nashik", "market": "Lasalgaon"},
    {"state": "Maharashtra", "district": "Nashik", "market": "Nashik"},
    {"state": "Maharashtra", "district": "Pune", "market": "Gultekdi APMC"},
    {"state": "Maharashtra", "district": "Pune", "market": "Pune"},
    {"state": "Maharashtra", "district": "Nagpur", "market": "Nagpur Central"},
    {"state": "Maharashtra", "district": "Mumbai", "market": "Vashi APMC"},
    {"state": "Maharashtra", "district": "Akola", "market": "Akola"},
    {"state": "Maharashtra", "district": "Kolhapur", "market": "Kolhapur"},
    {"state": "Maharashtra", "district": "Solapur", "market": "Solapur"},
    {"state": "Maharashtra", "district": "Ahmednagar", "market": "Ahmednagar"},
    {"state": "Maharashtra", "district": "Jalgaon", "market": "Jalgaon"},
    {"state": "Maharashtra", "district": "Latur", "market": "Latur"},
    {"state": "Maharashtra", "district": "Chhatrapati Sambhajinagar", "market": "Chhatrapati Sambhajinagar"},
    {"state": "Maharashtra", "district": "Amravati", "market": "Amravati"},
    {"state": "Maharashtra", "district": "Sangli", "market": "Sangli"},
    {"state": "Maharashtra", "district": "Satara", "market": "Satara"},
    {"state": "Madhya Pradesh", "district": "Indore", "market": "Indore"},
    {"state": "Madhya Pradesh", "district": "Bhopal", "market": "Bhopal"},
    {"state": "Madhya Pradesh", "district": "Ujjain", "market": "Ujjain"},
    {"state": "Madhya Pradesh", "district": "Jabalpur", "market": "Jabalpur"},
    {"state": "Gujarat", "district": "Surat", "market": "Surat"},
    {"state": "Gujarat", "district": "Ahmedabad", "market": "Ahmedabad"},
    {"state": "Gujarat", "district": "Rajkot", "market": "Rajkot"},
    {"state": "Karnataka", "district": "Belagavi", "market": "Belagavi"},
    {"state": "Karnataka", "district": "Bengaluru", "market": "Bengaluru"}
]


@app.get("/api/crops", tags=["Auxiliary"])
@app.get("/api/v1/crops", tags=["Auxiliary"])
async def get_supported_crops():
    return SUPPORTED_CROPS


@app.get("/api/markets", tags=["Auxiliary"])
@app.get("/api/v1/markets", tags=["Auxiliary"])
async def get_supported_markets():
    return SUPPORTED_MARKETS


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get(
    "/",
    tags=["Health"]
)
async def root():

    return {

        "status": "Online",

        "system": "AgriIntel API",

        "version": settings.VERSION

    }