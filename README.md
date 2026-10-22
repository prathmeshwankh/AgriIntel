# AgriIntel – AI-Powered Crop Health and Market Intelligence System

AgriIntel is an academic project that combines artificial intelligence and machine learning to help users identify crop leaf diseases and analyze agricultural market prices.

## Features

- **Crop Disease Detection:** Analyzes uploaded leaf images using a MobileNetV2-based deep learning model.
- **Market Price Forecasting:** Uses an XGBoost-based model to estimate agricultural market prices.
- **Interactive Dashboard:** Provides a centralized interface for accessing project features.
- **REST API:** Connects the frontend with backend prediction services.
- **Database Integration:** Uses MongoDB for application data.

## Technologies Used

### Frontend
- React
- JavaScript
- Recharts

### Backend
- Python
- FastAPI
- REST API

### Machine Learning
- TensorFlow / Keras
- MobileNetV2
- XGBoost
- OpenCV
- NumPy and Pandas
- Scikit-learn

### Database and Tools
- MongoDB
- Git and GitHub
- Postman
- Visual Studio Code

## Project Modules

1. Authentication
2. Crop Disease Detection
3. Agricultural Market Price Forecasting
4. Dashboard

## Getting Started

### Prerequisites

Install the following tools before running the project:

- Python
- Node.js and npm
- MongoDB
- Git

### Backend Setup

1. Open a terminal in the backend directory.
2. Create and activate a Python virtual environment.
3. Install the dependencies listed in `requirements.txt`.
4. Configure the required environment variables.
5. Start the FastAPI server:

```bash
python -m uvicorn app.main:app --reload
```

The API is expected to be available at `http://127.0.0.1:8000`.

Interactive API documentation is available at `http://127.0.0.1:8000/docs` when the server is running.

### Frontend Setup

1. Open another terminal in the frontend directory.
2. Install dependencies:

```bash
npm install
```

3. Start the frontend using the script defined in `package.json`, commonly:

```bash
npm run dev
```

## Machine Learning Models

- **Disease Detection:** MobileNetV2
- **Market Price Forecasting:** XGBoost

The prediction results depend on the quality and coverage of the training data. Outputs should be treated as estimates rather than guaranteed diagnoses or market prices.

## Academic Project

AgriIntel is developed as an academic project to explore the use of AI and machine learning in agriculture.

## Author

**Prathmesh Wankhade**

GitHub: https://github.com/prathmeshwankh
