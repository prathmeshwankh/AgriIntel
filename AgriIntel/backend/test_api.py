import os
import sys
import time
import requests

BASE_URL = "http://127.0.0.1:8000"

def test_all():
    print("Testing AgriIntel Backend Endpoints...\n")

    # 1. Health check
    res = requests.get(f"{BASE_URL}/")
    print(f"[1] Root Health: status={res.status_code}, data={res.json()}")
    assert res.status_code == 200

    # 2. Crops & Markets
    res = requests.get(f"{BASE_URL}/api/crops")
    print(f"[2a] /api/crops: count={len(res.json())}")
    assert res.status_code == 200

    res = requests.get(f"{BASE_URL}/api/v1/markets")
    print(f"[2b] /api/v1/markets: count={len(res.json())}")
    assert res.status_code == 200

    # 3. Auth: Real Farmer Registration / Login
    farmer_email = "kishan.kumar@example.com"
    farmer_pass = "SecurePassword123"
    # Ensure registered
    requests.post(f"{BASE_URL}/api/v1/auth/register", json={
        "full_name": "Kishan Kumar",
        "email": farmer_email,
        "password": farmer_pass
    })
    res = requests.post(f"{BASE_URL}/api/v1/auth/login", json={
        "email": farmer_email,
        "password": farmer_pass
    })
    print(f"[3a] Farmer Login: status={res.status_code}, role={res.json().get('user', {}).get('role')}")
    assert res.status_code == 200
    farmer_token = res.json()["access_token"]

    # 3b. Auth: Admin Login
    admin_payload = {
        "email": "admin@agriintel.com",
        "password": "Admin@123"
    }
    res = requests.post(f"{BASE_URL}/api/auth/login", json=admin_payload)
    print(f"[3b] Admin Login: status={res.status_code}, role={res.json().get('user', {}).get('role')}")
    assert res.status_code == 200
    admin_token = res.json()["access_token"]

    # 4. Price Prediction (Guest call as done in main.jsx)
    price_req = {
        "crop": "Tomato",
        "state": "Maharashtra",
        "district": "Nashik",
        "market": "Lasalgaon",
        "days": 7
    }
    res = requests.post(f"{BASE_URL}/api/v1/price/predict", json=price_req)
    p_data = res.json()
    print(f"[4] Price Predict (Guest): status={res.status_code}, model='{p_data.get('model_used')}', predicted={p_data.get('predicted_price')}, trend='{p_data.get('trend')}'")
    assert res.status_code == 200
    assert len(p_data.get("predictions", [])) == 7
    assert len(p_data.get("forecast", [])) == 7

    # 5. Disease Prediction (Upload image)
    leaf_path = os.path.join(os.path.dirname(__file__), "data", "disease", "train", "Apple_Healthy", "appleleaf.jpg")
    with open(leaf_path, "rb") as f:
        files = {"file": ("appleleaf.jpg", f, "image/jpeg")}
        res = requests.post(
            f"{BASE_URL}/api/v1/disease/predict",
            files=files,
            headers={"Authorization": f"Bearer {farmer_token}"}
        )
    d_data = res.json()
    print(f"[5] Disease Predict: status={res.status_code}, disease='{d_data.get('disease_name')}', confidence={d_data.get('confidence')}, severity='{d_data.get('severity')}'")
    assert res.status_code == 200
    assert "disease_name" in d_data

    # 6. Disease History
    res = requests.get(
        f"{BASE_URL}/api/v1/disease/history",
        headers={"Authorization": f"Bearer {farmer_token}"}
    )
    print(f"[6] Disease History: count={len(res.json())}")
    assert res.status_code == 200

    # 7. Price History
    res = requests.get(
        f"{BASE_URL}/api/v1/price/history",
        headers={"Authorization": f"Bearer {farmer_token}"}
    )
    print(f"[7] Price History: count={len(res.json())}")
    assert res.status_code == 200

    # 8. Admin Statistics
    res = requests.get(
        f"{BASE_URL}/api/v1/admin/statistics",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    stats = res.json()
    print(f"[8] Admin Stats: status={res.status_code}, total_users={stats.get('total_users')}, total_scans={stats.get('total_scans')}, total_price_forecasts={stats.get('total_price_forecasts')}")
    assert res.status_code == 200

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all()
