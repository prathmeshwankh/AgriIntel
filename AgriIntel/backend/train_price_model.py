import os
import random
from datetime import datetime, timedelta

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models", "price_model")
DATA_PATH = os.path.join(DATA_DIR, "price_data.csv")
MODEL_PATH = os.path.join(MODEL_DIR, "best_price_model.joblib")


def generate_price_dataset():
    print("Generating comprehensive APMC historical price dataset with expanded data...")
    random.seed(42)
    np.random.seed(42)

    # 20 Agricultural Commodities with realistic Mandi pricing dynamics
    crops_info = {
        "tomato": {"base": 32.0, "volatility": 7.5, "season_peak": 7},
        "potato": {"base": 22.0, "volatility": 3.2, "season_peak": 11},
        "onion": {"base": 28.0, "volatility": 9.5, "season_peak": 10},
        "wheat": {"base": 26.5, "volatility": 2.8, "season_peak": 4},
        "rice": {"base": 42.0, "volatility": 3.8, "season_peak": 11},
        "cotton": {"base": 68.0, "volatility": 8.0, "season_peak": 12},
        "soybean": {"base": 49.5, "volatility": 5.5, "season_peak": 10},
        "apple": {"base": 98.0, "volatility": 14.0, "season_peak": 9},
        "chana": {"base": 54.0, "volatility": 4.5, "season_peak": 3},
        "maize": {"base": 21.5, "volatility": 2.5, "season_peak": 9},
        "turmeric": {"base": 135.0, "volatility": 18.0, "season_peak": 4},
        "ginger": {"base": 88.0, "volatility": 15.0, "season_peak": 12},
        "garlic": {"base": 120.0, "volatility": 22.0, "season_peak": 1},
        "mustard": {"base": 56.0, "volatility": 5.0, "season_peak": 3},
        "groundnut": {"base": 62.0, "volatility": 6.2, "season_peak": 11},
        "green chilli": {"base": 45.0, "volatility": 11.0, "season_peak": 6},
        "banana": {"base": 24.0, "volatility": 3.0, "season_peak": 8},
        "pomegranate": {"base": 115.0, "volatility": 16.0, "season_peak": 10},
        "grapes": {"base": 78.0, "volatility": 12.0, "season_peak": 3},
        "sugarcane": {"base": 31.0, "volatility": 2.0, "season_peak": 12}
    }

    # 25 Major APMC Mandis across key Agricultural Hubs
    markets = [
        # Maharashtra
        {"state": "maharashtra", "market": "lasalgaon", "multiplier": 0.98},
        {"state": "maharashtra", "market": "nashik", "multiplier": 1.02},
        {"state": "maharashtra", "market": "pune", "multiplier": 1.05},
        {"state": "maharashtra", "market": "gultekdi apmc", "multiplier": 1.04},
        {"state": "maharashtra", "market": "akola", "multiplier": 0.97},
        {"state": "maharashtra", "market": "nagpur central", "multiplier": 1.03},
        {"state": "maharashtra", "market": "vashi apmc", "multiplier": 1.10},
        {"state": "maharashtra", "market": "kolhapur", "multiplier": 1.01},
        {"state": "maharashtra", "market": "solapur", "multiplier": 0.99},
        {"state": "maharashtra", "market": "ahmednagar", "multiplier": 0.98},
        {"state": "maharashtra", "market": "jalgaon", "multiplier": 0.96},
        {"state": "maharashtra", "market": "latur", "multiplier": 0.98},
        {"state": "maharashtra", "market": "chhatrapati sambhajinagar", "multiplier": 1.01},
        {"state": "maharashtra", "market": "amravati", "multiplier": 0.97},
        {"state": "maharashtra", "market": "sangli", "multiplier": 1.04},
        {"state": "maharashtra", "market": "satara", "multiplier": 1.02},

        # Madhya Pradesh
        {"state": "madhya pradesh", "market": "indore", "multiplier": 0.96},
        {"state": "madhya pradesh", "market": "bhopal", "multiplier": 0.97},
        {"state": "madhya pradesh", "market": "ujjain", "multiplier": 0.95},
        {"state": "madhya pradesh", "market": "jabalpur", "multiplier": 0.97},

        # Gujarat
        {"state": "gujarat", "market": "surat", "multiplier": 1.04},
        {"state": "gujarat", "market": "ahmedabad", "multiplier": 1.03},
        {"state": "gujarat", "market": "rajkot", "multiplier": 0.99},

        # Karnataka
        {"state": "karnataka", "market": "belagavi", "multiplier": 1.01},
        {"state": "karnataka", "market": "bengaluru", "multiplier": 1.08}
    ]

    # Expanded 4-Year Historical Dataset (2022 to 2026)
    start_date = datetime(2022, 1, 1)
    end_date = datetime(2026, 10, 20)
    total_days = (end_date - start_date).days

    records = []
    # Generate bi-daily records across all crops and mandis
    for day_offset in range(0, total_days, 2):
        curr_date = start_date + timedelta(days=day_offset)
        month = curr_date.month
        day_of_week = curr_date.weekday()
        day_of_year = curr_date.timetuple().tm_yday
        year = curr_date.year

        # Yearly inflation / general price growth (~3.5% per annum)
        inflation_factor = 1.0 + ((year - 2022) * 0.035)

        for crop, cinfo in crops_info.items():
            base = cinfo["base"] * inflation_factor
            volatility = cinfo["volatility"]
            peak_m = cinfo["season_peak"]

            # Seasonality sine wave
            season_effect = np.sin((month - peak_m) * (np.pi / 6)) * volatility

            # Festival demand spikes (e.g., Diwali in Oct/Nov, Ramadan, Holi in March)
            festival_boost = 0.0
            if month in [10, 11] and crop in ["onion", "tomato", "potato", "apple", "banana"]:
                festival_boost = base * 0.08
            elif month in [3, 4] and crop in ["wheat", "chana", "turmeric"]:
                festival_boost = base * 0.05

            for mkt in markets:
                mult = mkt["multiplier"]
                noise = np.random.normal(0, volatility * 0.35)
                price = max(6.0, round((base + season_effect + festival_boost + noise) * mult, 2))

                records.append({
                    "date": curr_date.strftime("%Y-%m-%d"),
                    "crop": crop,
                    "state": mkt["state"],
                    "market": mkt["market"],
                    "day_of_week": day_of_week,
                    "month": month,
                    "day_of_year": day_of_year,
                    "modal_price": price
                })

    df = pd.DataFrame(records)
    os.makedirs(DATA_DIR, exist_ok=True)
    df.to_csv(DATA_PATH, index=False)
    print(f"Expanded Dataset Generated: {len(df):,} records saved to {DATA_PATH}")
    return df


def train_model(df=None):
    if df is None:
        if not os.path.exists(DATA_PATH) or os.path.getsize(DATA_PATH) == 0:
            df = generate_price_dataset()
        else:
            df = pd.read_csv(DATA_PATH)

    features = ["crop", "state", "market", "day_of_week", "month", "day_of_year"]
    target = "modal_price"

    X = df[features]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42
    )

    categorical_features = ["crop", "state", "market"]
    numeric_features = ["day_of_week", "month", "day_of_year"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
            ("num", "passthrough", numeric_features)
        ]
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", RandomForestRegressor(n_estimators=100, max_depth=18, random_state=42, n_jobs=-1))
        ]
    )

    print(f"Training enhanced price model on {len(X_train):,} training samples...")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)

    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    print("\n==========================================")
    print("ENHANCED PRICE FORECAST MODEL PERFORMANCE")
    print("==========================================")
    print(f"Total Dataset Size: {len(df):,} records")
    print(f"Crops Count:        20 Commodities")
    print(f"Markets Count:      25 Mandis")
    print(f"R2 Score:           {r2:.4f}")
    print(f"MAE:                Rs.{mae:.2f}")
    print(f"RMSE:               Rs.{rmse:.2f}")
    print("==========================================")

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Model saved successfully to: {MODEL_PATH}")


if __name__ == "__main__":
    df = generate_price_dataset()
    train_model(df)
