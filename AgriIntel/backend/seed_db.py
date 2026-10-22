from datetime import datetime, timedelta
import pymongo
from app.config import settings
from app.utils.auth_utils import get_password_hash


def seed():
    print(f"Connecting to MongoDB at {settings.MONGODB_URL}...")
    client = pymongo.MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
    db = client[settings.DATABASE_NAME]

    # Ensure indexes
    db.users.create_index("email", unique=True)
    db.disease_predictions.create_index("timestamp")
    db.price_predictions.create_index("timestamp")

    print("Seeding users...")
    users = [
        {
            "full_name": "AgriIntel Administrator",
            "email": "admin@agriintel.com",
            "hashed_password": get_password_hash("Admin@123"),
            "role": "admin",
            "created_at": datetime.utcnow()
        },
        {
            "full_name": "Ramesh Patel",
            "email": "farmer@agriintel.com",
            "hashed_password": get_password_hash("Farmer@123"),
            "role": "farmer",
            "created_at": datetime.utcnow()
        }
    ]

    for u in users:
        existing = db.users.find_one({"email": u["email"]})
        if not existing:
            db.users.insert_one(u)
            print(f"  -> Created user: {u['email']} ({u['role']})")
        else:
            # Update password to ensure it matches
            db.users.update_one(
                {"email": u["email"]},
                {"$set": {"hashed_password": u["hashed_password"], "role": u["role"]}}
            )
            print(f"  -> Updated existing user: {u['email']} ({u['role']})")

    farmer = db.users.find_one({"email": "farmer@agriintel.com"})
    farmer_id = str(farmer["_id"])

    # Seed disease predictions if empty
    if db.disease_predictions.count_documents({}) == 0:
        print("Seeding initial disease predictions...")
        disease_samples = [
            {
                "user_id": farmer_id,
                "filename": "tomato_leaf_01.jpg",
                "crop": "Tomato",
                "disease": "Tomato - Early Blight",
                "status": "Diseased",
                "confidence": 0.942,
                "severity": "Moderate",
                "symptoms": [
                    "Dark brown spots with concentric rings.",
                    "Yellowing halo surrounding lesions."
                ],
                "treatment": {
                    "organic_control": ["Neem oil spray", "Remove infected foliage"],
                    "chemical_control": ["Mancozeb or Copper-based fungicide"]
                },
                "timestamp": datetime.utcnow() - timedelta(days=2)
            },
            {
                "user_id": farmer_id,
                "filename": "apple_sample_leaf.jpg",
                "crop": "Apple",
                "disease": "Apple - Healthy",
                "status": "Healthy",
                "confidence": 0.985,
                "severity": "Healthy",
                "symptoms": ["Leaf tissue is vibrant and unblemished."],
                "treatment": {
                    "organic_control": ["Maintain balanced drip irrigation."],
                    "chemical_control": []
                },
                "timestamp": datetime.utcnow() - timedelta(days=1)
            },
            {
                "user_id": farmer_id,
                "filename": "potato_sample_leaf.jpg",
                "crop": "Potato",
                "disease": "Potato - Healthy",
                "status": "Healthy",
                "confidence": 0.961,
                "severity": "Healthy",
                "symptoms": ["Healthy foliage without signs of blight."],
                "treatment": {
                    "organic_control": ["Routine field scouting."],
                    "chemical_control": []
                },
                "timestamp": datetime.utcnow()
            }
        ]
        db.disease_predictions.insert_many(disease_samples)
        print(f"  -> Inserted {len(disease_samples)} disease scan records.")

    # Seed price predictions if empty
    if db.price_predictions.count_documents({}) == 0:
        print("Seeding initial price predictions...")
        price_samples = [
            {
                "user_id": farmer_id,
                "crop": "Tomato",
                "state": "Maharashtra",
                "district": "Nashik",
                "market": "Lasalgaon",
                "forecast_days": 7,
                "days": 7,
                "current_price": 32.0,
                "predicted_price": 35.5,
                "change_percent": 10.94,
                "trend": "Upward Trend",
                "model_used": "Trained Price Forecasting Model",
                "predictions": [
                    {"date": (datetime.utcnow() + timedelta(days=i)).strftime("%Y-%m-%d"), "predicted_price": 32.0 + i * 0.5, "day": f"Day {i}", "price": 32.0 + i * 0.5}
                    for i in range(1, 8)
                ],
                "timestamp": datetime.utcnow() - timedelta(hours=5)
            },
            {
                "user_id": farmer_id,
                "crop": "Onion",
                "state": "Maharashtra",
                "district": "Nashik",
                "market": "Nashik",
                "forecast_days": 7,
                "days": 7,
                "current_price": 28.0,
                "predicted_price": 27.2,
                "change_percent": -2.86,
                "trend": "Downward Trend",
                "model_used": "Trained Price Forecasting Model",
                "predictions": [
                    {"date": (datetime.utcnow() + timedelta(days=i)).strftime("%Y-%m-%d"), "predicted_price": 28.0 - i * 0.12, "day": f"Day {i}", "price": 28.0 - i * 0.12}
                    for i in range(1, 8)
                ],
                "timestamp": datetime.utcnow() - timedelta(days=1)
            }
        ]
        db.price_predictions.insert_many(price_samples)
        print(f"  -> Inserted {len(price_samples)} price forecast records.")

    print("\nDatabase seeded successfully!")
    print("Default Admin Account:")
    print("  Email:    admin@agriintel.com")
    print("  Password: Admin@123")
    print("\nDefault Farmer Account:")
    print("  Email:    farmer@agriintel.com")
    print("  Password: Farmer@123")


if __name__ == "__main__":
    seed()
