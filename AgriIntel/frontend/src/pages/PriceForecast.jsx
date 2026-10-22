import React, { useState } from "react";
import axios from "axios";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

import {
    LayoutDashboard,
    Leaf,
    TrendingUp,
    FileText,
    Users,
    Settings,
    CloudSun,
    Bell,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
} from "lucide-react";

import "./priceForecast.css";


const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


export default function PriceForecast() {

    const [crop, setCrop] = useState("Tomato");
    const [state, setState] = useState("Maharashtra");
    const [district, setDistrict] = useState("Nashik");
    const [market, setMarket] = useState("Lasalgaon");
    const [days, setDays] = useState("7");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [result, setResult] = useState(null);


    const handleForecast = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await axios.post(
                `${API_URL}/api/v1/price/predict`,
                {
                    crop,
                    state,
                    district,
                    market,
                    days: Number(days),
                }
            );

            setResult(response.data);

        } catch (err) {

            console.error("Price prediction error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to generate price forecast. Please make sure the backend is running."
            );

        } finally {

            setLoading(false);

        }
    };


    const historical =
        result?.historical || result?.historical_prices || [];

    const forecast =
        result?.forecast || result?.predictions || [];


    const chartData = [

        ...historical.map((item) => ({
            date: item.date,
            historical: Number(
                item.price ?? item.modal_price ?? item.predicted_price ?? 0
            ),
            forecast: null,
        })),

        ...forecast.map((item) => ({
            date: item.date || `Day ${item.day}`,
            historical: null,
            forecast: Number(
                item.predicted_price ?? item.price ?? 0
            ),
        })),

    ];


    const currentPrice =
        result?.current_price ??
        result?.latest_price ??
        0;


    const predictedPrice =
        result?.predicted_price ??
        result?.forecast_price ??
        (
            forecast.length
                ? forecast[forecast.length - 1]?.predicted_price
                : 0
        );


    const changePercent =
        result?.change_percent ??
        (
            currentPrice && predictedPrice
                ? ((predictedPrice - currentPrice) / currentPrice) * 100
                : 0
        );


    const isIncrease = changePercent >= 0;


    return (

        <div className="agri-app">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="brand">

                    <div className="brand-icon">
                        🌱
                    </div>

                    <span>AgriIntel</span>

                </div>


                <div className="farmer-title">
                    किसान केंद्र
                </div>


                <nav className="sidebar-menu">

                    <a href="/" className="menu-item">

                        <LayoutDashboard size={20} />

                        <span>Dashboard</span>

                    </a>


                    <a href="/disease" className="menu-item">

                        <Leaf size={20} />

                        <span>Disease Detection</span>

                    </a>


                    <a
                        href="/price-forecast"
                        className="menu-item active"
                    >

                        <TrendingUp size={20} />

                        <span>Price Forecast</span>

                    </a>


                    <a href="/history" className="menu-item">

                        <FileText size={20} />

                        <span>My History</span>

                    </a>


                    <a href="/admin" className="menu-item">

                        <Users size={20} />

                        <span>Admin View</span>

                        <small>PRO</small>

                    </a>

                </nav>


                <div className="sidebar-bottom">

                    <div className="weather">

                        <CloudSun size={28} />

                        <div>

                            <strong>28°C</strong>

                            <span>आज साफ मौसम</span>

                        </div>

                    </div>


                    <a href="/settings" className="menu-item">

                        <Settings size={20} />

                        <span>Settings</span>

                    </a>

                </div>

            </aside>


            {/* MAIN */}

            <main className="main-content">

                {/* HEADER */}

                <header className="top-header">

                    <div className="breadcrumb">
                        AgriIntel / <strong>Price Forecast</strong>
                    </div>


                    <div className="header-right">

                        <span>EN⌄</span>

                        <Bell size={20} />

                        <div className="profile">

                            <div className="profile-circle">
                                P
                            </div>

                            <div>

                                <strong>prathmesh</strong>

                                <small>Farmer</small>

                            </div>

                        </div>

                    </div>

                </header>


                {/* PAGE */}

                <section className="forecast-page">

                    <div className="page-heading">

                        <div>

                            <div className="section-label">
                                MARKET PULSE / 02
                            </div>

                            <h1>
                                Price Forecast
                            </h1>

                            <p>
                                मंडी चुनें और अगले दिनों का अनुमान देखें।
                            </p>

                        </div>


                        <div className="model-label">
                            MODEL • XGBoost
                        </div>

                    </div>


                    {/* FILTER BOX */}

                    <div className="filter-card">

                        <div className="field">

                            <label>फसल</label>

                            <select
                                value={crop}
                                onChange={(e) => setCrop(e.target.value)}
                            >

                                <option>Tomato</option>
                                <option>Potato</option>
                                <option>Onion</option>
                                <option>Apple</option>

                            </select>

                        </div>


                        <div className="field">

                            <label>राज्य</label>

                            <select
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            >

                                <option>Maharashtra</option>
                                <option>Madhya Pradesh</option>
                                <option>Gujarat</option>
                                <option>Karnataka</option>

                            </select>

                        </div>


                        <div className="field">

                            <label>जिला</label>

                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                            >

                                <option>Nashik</option>
                                <option>Akola</option>
                                <option>Pune</option>
                                <option>Nagpur</option>

                            </select>

                        </div>


                        <div className="field">

                            <label>मंडी</label>

                            <select
                                value={market}
                                onChange={(e) => setMarket(e.target.value)}
                            >

                                <option>Lasalgaon</option>
                                <option>Pimpalgaon</option>
                                <option>Nashik</option>
                                <option>Akola</option>

                            </select>

                        </div>


                        <div className="field">

                            <label>दिन</label>

                            <select
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                            >

                                <option value="7">7</option>
                                <option value="15">15</option>
                                <option value="30">30</option>

                            </select>

                        </div>


                        <button
                            className="forecast-button"
                            onClick={handleForecast}
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <Loader2
                                        size={20}
                                        className="spin"
                                    />

                                    Prediction...

                                </>

                            ) : (

                                <>
                                    अनुमान देखें
                                    <ArrowUpRight size={20} />
                                </>

                            )}

                        </button>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="error-box">
                            ⚠️ {error}
                        </div>

                    )}


                    {/* RESULT */}

                    {result && (

                        <>

                            {/* SUMMARY */}

                            <div className="summary-grid">

                                <div className="summary-card">

                                    <span>
                                        Current Price
                                    </span>

                                    <strong>
                                        ₹{Number(currentPrice).toLocaleString()}
                                    </strong>

                                    <small>
                                        प्रति क्विंटल
                                    </small>

                                </div>


                                <div className="summary-card highlight">

                                    <span>
                                        Predicted Price
                                    </span>

                                    <strong>
                                        ₹{Number(predictedPrice).toLocaleString()}
                                    </strong>

                                    <small>
                                        {days}-day forecast
                                    </small>

                                </div>


                                <div className="summary-card">

                                    <span>
                                        Expected Change
                                    </span>

                                    <strong
                                        className={
                                            isIncrease
                                                ? "positive"
                                                : "negative"
                                        }
                                    >

                                        {isIncrease ? "+" : ""}
                                        {Number(changePercent).toFixed(2)}%

                                    </strong>

                                    <small>

                                        {isIncrease
                                            ? "Expected increase"
                                            : "Expected decrease"}

                                    </small>

                                </div>


                                <div className="summary-card">

                                    <span>
                                        Model
                                    </span>

                                    <strong>
                                        XGBoost
                                    </strong>

                                    <small>
                                        Historical APMC data
                                    </small>

                                </div>

                            </div>


                            {/* CHART */}

                            <div className="chart-card">

                                <div className="chart-header">

                                    <div>

                                        <h2>
                                            {crop} Price Forecast
                                        </h2>

                                        <p>
                                            {market}, {district}, {state}
                                        </p>

                                    </div>


                                    <div className="chart-badge">

                                        {isIncrease ? (
                                            <ArrowUpRight size={17} />
                                        ) : (
                                            <ArrowDownRight size={17} />
                                        )}

                                        {isIncrease ? "+" : ""}
                                        {Number(changePercent).toFixed(1)}%

                                    </div>

                                </div>


                                <div className="chart-container">

                                    {chartData.length > 0 ? (

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <LineChart
                                                data={chartData}
                                                margin={{
                                                    top: 10,
                                                    right: 20,
                                                    left: 10,
                                                    bottom: 10,
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />

                                                <XAxis
                                                    dataKey="date"
                                                    tick={{ fontSize: 12 }}
                                                />

                                                <YAxis
                                                    tick={{ fontSize: 12 }}
                                                    tickFormatter={(value) =>
                                                        `₹${value}`
                                                    }
                                                />

                                                <Tooltip
                                                    formatter={(value) =>
                                                        value
                                                            ? `₹${Number(value).toLocaleString()}`
                                                            : "-"
                                                    }
                                                />

                                                <Legend />

                                                <Line
                                                    type="monotone"
                                                    dataKey="historical"
                                                    name="Historical Price"
                                                    strokeWidth={3}
                                                    dot={false}
                                                    connectNulls
                                                />

                                                <Line
                                                    type="monotone"
                                                    dataKey="forecast"
                                                    name="Predicted Price"
                                                    strokeWidth={3}
                                                    strokeDasharray="7 5"
                                                    dot
                                                    connectNulls
                                                />

                                            </LineChart>

                                        </ResponsiveContainer>

                                    ) : (

                                        <div className="no-chart">
                                            Forecast data not available.
                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* RECOMMENDATION */}

                            <div className="recommendation">

                                <div className="recommendation-icon">

                                    {isIncrease
                                        ? "📈"
                                        : "📉"}

                                </div>


                                <div>

                                    <h3>
                                        Recommendation
                                    </h3>

                                    <p>

                                        {isIncrease

                                            ? `Prices are expected to increase by approximately ${Number(changePercent).toFixed(1)}%. Consider waiting ${days} days before selling, if storage and market conditions permit.`

                                            : `Prices are expected to decrease by approximately ${Math.abs(Number(changePercent)).toFixed(1)}%. Consider evaluating current market conditions before delaying your sale.`

                                        }

                                    </p>

                                </div>

                            </div>

                        </>

                    )}

                </section>

            </main>

        </div>

    );
}