import React, { useState, useEffect } from "react";
import {
  CloudSun,
  Sun,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Compass,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Umbrella,
  Sprout
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function WeatherForecast({ lang = "en", t, PageTitle }) {
  const [district, setDistrict] = useState("Nashik");
  const [state, setState] = useState("Maharashtra");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const districtsByState = {
    Maharashtra: [
      "Nashik",
      "Pune",
      "Nagpur",
      "Akola",
      "Ahmednagar",
      "Kolhapur",
      "Solapur",
      "Chhatrapati Sambhajinagar",
      "Amravati",
      "Jalgaon",
      "Latur",
      "Satara",
      "Sangli",
      "Nanded",
      "Buldhana",
      "Yavatmal"
    ],
    "Madhya Pradesh": ["Indore", "Bhopal", "Ujjain", "Jabalpur"],
    Gujarat: ["Ahmedabad", "Surat", "Rajkot"],
    Karnataka: ["Belagavi", "Bengaluru"]
  };

  const fetchWeather = async (targetDistrict = district, targetState = state) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/weather?district=${encodeURIComponent(targetDistrict)}&state=${encodeURIComponent(targetState)}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch weather forecast data.");
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError(
        lang === "mr"
          ? "हवामान माहिती लोड करण्यात अडचण आली. कृपया बॅकएंड सुरू असल्याचे तपासा."
          : lang === "hi"
          ? "मौसम डेटा प्राप्त करने में असमर्थ। कृपया बैकएंड जांचें।"
          : lang === "hinglish"
          ? "Mausam data load karne mein dikkat aayi. Kripya backend status check karein."
          : "Unable to load weather forecast. Please ensure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(district, state);
  }, [district, state]);

  // Handle weather icon
  const renderWeatherIcon = (iconName, size = 32) => {
    switch (iconName) {
      case "sun":
        return <Sun size={size} color="#eab308" />;
      case "cloud-rain":
      case "cloud-drizzle":
        return <CloudRain size={size} color="#0284c7" />;
      case "cloud-lightning":
        return <CloudLightning size={size} color="#7c3aed" />;
      default:
        return <CloudSun size={size} color="#f59e0b" />;
    }
  };

  // Condition description in active language
  const getConditionText = (item) => {
    if (!item) return "";
    if (lang === "mr") return item.condition_mr || item.condition;
    if (lang === "hi") return item.condition_hi || item.condition;
    if (lang === "hinglish") return item.condition_hinglish || item.condition_hi || item.condition;
    return item.condition;
  };

  // Chart data
  const chartData =
    weatherData?.forecast_7days?.map((day) => ({
      day: day.day,
      date: day.date,
      tempMax: day.temp_max,
      tempMin: day.temp_min,
      rainProb: day.rain_prob
    })) || [];

  return (
    <main>
      <PageTitle
        title={t?.weather?.title || "Weather Forecast"}
        hindi={lang === "mr" ? "हवामान अंदाज" : lang === "hinglish" ? "Mausam Ka Haal" : "मौसम विज्ञान"}
        text={t?.weather?.subtitle || "Agricultural Weather Forecast"}
      />

      {/* LOCATION SELECTOR & REFRESH */}
      <section
        style={{
          background: "white",
          padding: "16px 20px",
          border: "1px solid #dedfd6",
          borderRadius: "8px",
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "16px",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#6e8374", marginBottom: "4px" }}>
              {t.weather.selectState.toUpperCase()}
            </label>
            <select
              value={state}
              onChange={(e) => {
                const newState = e.target.value;
                setState(newState);
                const firstDistrict = districtsByState[newState][0];
                setDistrict(firstDistrict);
              }}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #c9d5cb",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1e3a24",
                background: "#fbfcfb",
                cursor: "pointer"
              }}
            >
              {Object.keys(districtsByState).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#6e8374", marginBottom: "4px" }}>
              {t.weather.selectDistrict.toUpperCase()}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #c9d5cb",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1e3a24",
                background: "#fbfcfb",
                cursor: "pointer"
              }}
            >
              {districtsByState[state]?.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => fetchWeather(district, state)}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#166534",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "9px 16px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          <RefreshCw size={15} className={loading ? "spin" : ""} />
          <span>{loading ? "..." : lang === "mr" ? "अपडेट करा" : lang === "hi" ? "ताज़ा करें" : "Refresh"}</span>
        </button>
      </section>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #f87171", padding: "16px", borderRadius: "8px", color: "#991b1b", marginBottom: "20px" }}>
          ⚠️ {error}
        </div>
      )}

      {loading && !weatherData ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#6e8374" }}>
          <div style={{ width: "40px", height: "40px", border: "4px solid #cce5c2", borderTopColor: "#1e6338", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
          {lang === "mr" ? "हवामान माहिती लोड होत आहे..." : lang === "hi" ? "मौसम जानकारी लोड हो रही है..." : "Fetching live agro-meteorological data..."}
        </div>
      ) : weatherData ? (
        <>
          {/* CURRENT WEATHER HERO CARD */}
          <section
            style={{
              background: "linear-gradient(135deg, #1b4d2e 0%, #166534 60%, #15803d 100%)",
              color: "white",
              padding: "28px",
              borderRadius: "12px",
              marginBottom: "24px",
              boxShadow: "0 4px 14px rgba(22, 101, 52, 0.18)"
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
              <div>
                <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", background: "rgba(255,255,255,0.18)", padding: "4px 10px", borderRadius: "20px" }}>
                  📍 {weatherData.location.district}, {weatherData.location.state}
                </span>
                <h1 style={{ fontSize: "56px", margin: "14px 0 4px", fontWeight: "800", letterSpacing: "-1px" }}>
                  {Math.round(weatherData.current.temp)}°C
                </h1>
                <p style={{ fontSize: "18px", margin: 0, fontWeight: "600", opacity: 0.95, display: "flex", alignItems: "center", gap: "8px" }}>
                  {renderWeatherIcon(weatherData.current.icon, 24)}
                  <span>{getConditionText(weatherData.current)}</span>
                </p>
                <small style={{ opacity: 0.8, marginTop: "6px", display: "block" }}>
                  {t.weather.feelsLike}: {Math.round(weatherData.current.feels_like)}°C • {weatherData.source}
                </small>
              </div>

              {/* CURRENT METRICS GRID */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "12px",
                  background: "rgba(255, 255, 255, 0.12)",
                  padding: "16px",
                  borderRadius: "10px",
                  backdropFilter: "blur(6px)",
                  minWidth: "300px"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", opacity: 0.85, fontSize: "12px" }}>
                    <Droplets size={14} />
                    <span>{t.weather.humidity}</span>
                  </div>
                  <b style={{ fontSize: "17px", marginTop: "2px", display: "block" }}>{weatherData.current.humidity}%</b>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", opacity: 0.85, fontSize: "12px" }}>
                    <Wind size={14} />
                    <span>{t.weather.windSpeed}</span>
                  </div>
                  <b style={{ fontSize: "17px", marginTop: "2px", display: "block" }}>{weatherData.current.wind_speed} km/h</b>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", opacity: 0.85, fontSize: "12px" }}>
                    <Umbrella size={14} />
                    <span>{t.weather.rainProbability}</span>
                  </div>
                  <b style={{ fontSize: "17px", marginTop: "2px", display: "block" }}>{weatherData.current.rain_chance}%</b>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", opacity: 0.85, fontSize: "12px" }}>
                    <Sprout size={14} />
                    <span>{t.weather.soilMoisture}</span>
                  </div>
                  <b style={{ fontSize: "14px", marginTop: "2px", display: "block" }}>{weatherData.current.soil_moisture}</b>
                </div>
              </div>
            </div>
          </section>

          {/* REAL-TIME AGRICULTURAL ADVISORIES */}
          <section style={{ marginBottom: "28px" }}>
            <div style={{ marginBottom: "14px" }}>
              <p className="eyebrow" style={{ margin: 0 }}>
                {t.weather.advisoriesTitle.toUpperCase()}
              </p>
              <h3 style={{ margin: "2px 0 0", color: "#1f2937" }}>{t.weather.advisoriesSub}</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              {/* 1. Irrigation */}
              <div style={{ background: "white", padding: "18px", borderRadius: "8px", border: "1px solid #dedfd6", borderLeft: "4px solid #0284c7" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Droplets size={18} color="#0284c7" />
                  <b style={{ fontSize: "14px", color: "#0369a1" }}>{t.weather.advIrrigation}</b>
                </div>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5", color: "#374151" }}>
                  {weatherData.advisories?.irrigation?.[lang] || weatherData.advisories?.irrigation?.hi || weatherData.advisories?.irrigation?.en}
                </p>
              </div>

              {/* 2. Spraying Window */}
              <div style={{ background: "white", padding: "18px", borderRadius: "8px", border: "1px solid #dedfd6", borderLeft: "4px solid #16a34a" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  <b style={{ fontSize: "14px", color: "#15803d" }}>{t.weather.advSpray}</b>
                </div>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5", color: "#374151" }}>
                  {weatherData.advisories?.spray?.[lang] || weatherData.advisories?.spray?.hi || weatherData.advisories?.spray?.en}
                </p>
              </div>

              {/* 3. Disease Risk */}
              <div style={{ background: "white", padding: "18px", borderRadius: "8px", border: "1px solid #dedfd6", borderLeft: "4px solid #d97706" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <AlertTriangle size={18} color="#d97706" />
                  <b style={{ fontSize: "14px", color: "#b45309" }}>{t.weather.advDisease}</b>
                </div>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5", color: "#374151" }}>
                  {weatherData.advisories?.disease_risk?.[lang] || weatherData.advisories?.disease_risk?.hi || weatherData.advisories?.disease_risk?.en}
                </p>
              </div>

              {/* 4. Harvest / Field Work */}
              <div style={{ background: "white", padding: "18px", borderRadius: "8px", border: "1px solid #dedfd6", borderLeft: "4px solid #8b5cf6" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Calendar size={18} color="#8b5cf6" />
                  <b style={{ fontSize: "14px", color: "#6d28d9" }}>{t.weather.advFieldWork}</b>
                </div>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5", color: "#374151" }}>
                  {weatherData.advisories?.field_work?.[lang] || weatherData.advisories?.field_work?.hi || weatherData.advisories?.field_work?.en}
                </p>
              </div>
            </div>
          </section>

          {/* 7-DAY FORECAST CARDS */}
          <section style={{ marginBottom: "28px" }}>
            <h3 style={{ margin: "0 0 14px", color: "#1f2937" }}>{t.weather.sevenDayForecast}</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
              {weatherData.forecast_7days?.map((day, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "white",
                    padding: "16px 12px",
                    borderRadius: "8px",
                    border: idx === 0 ? "2px solid #166534" : "1px solid #dedfd6",
                    textAlign: "center"
                  }}
                >
                  <b style={{ display: "block", fontSize: "14px", color: idx === 0 ? "#166534" : "#1f2937" }}>
                    {day.day}
                  </b>
                  <small style={{ color: "#6b7280", fontSize: "11px", display: "block", marginBottom: "8px" }}>
                    {day.date}
                  </small>
                  <div style={{ margin: "8px 0" }}>{renderWeatherIcon(day.icon, 30)}</div>
                  <small style={{ fontSize: "11px", color: "#4b5563", minHeight: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {getConditionText(day)}
                  </small>
                  <div style={{ marginTop: "10px", fontSize: "13px" }}>
                    <b>{Math.round(day.temp_max)}°</b>{" "}
                    <span style={{ color: "#9ca3af", fontSize: "12px" }}>{Math.round(day.temp_min)}°</span>
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "11px", color: "#0284c7", fontWeight: "600" }}>
                    🌧️ {day.rain_prob}%
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TEMPERATURE & RAINFALL TREND CHART */}
          <section style={{ background: "white", padding: "24px", borderRadius: "8px", border: "1px solid #dedfd6" }}>
            <h3 style={{ margin: "0 0 6px", color: "#1f2937" }}>
              {lang === "mr" ? "७ दिवसांचे तापमान व पाऊस कल" : lang === "hi" ? "7 दिवसीय तापमान एवं बारिश का रुख" : "7-Day Temperature & Precipitation Trend"}
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#6b7280" }}>
              {lang === "mr" ? "कमाल तापमान (°C) आणि पावसाची शक्यता (%)" : lang === "hi" ? "अधिकतम तापमान (°C) एवं वर्षा की संभावना (%)" : "Maximum temperature (°C) & Rain probability (%)"}
            </p>

            <div style={{ width: "100%", height: "260px" }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }}
                    formatter={(val, name) => [
                      name === "tempMax" ? `${val}°C` : `${val}%`,
                      name === "tempMax" ? (lang === "mr" ? "कमाल तापमान" : lang === "hi" ? "अधिकतम तापमान" : "Max Temp") : (lang === "mr" ? "पाऊस शक्यता" : lang === "hi" ? "बारिश संभावना" : "Rain Prob")
                    ]}
                  />
                  <Area type="monotone" dataKey="tempMax" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" />
                  <Area type="monotone" dataKey="rainProb" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#rainGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
