import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

import {
  LayoutDashboard,
  Leaf,
  TrendingUp,
  FileText,
  Users,
  Settings,
  CloudSun,
  Bell,
  ChevronRight,
  Upload,
  Camera,
  ArrowUpRight,
  Menu,
  ShieldCheck,
  Sprout,
  LogOut,
  Lock,
  Mail,
  UserCheck,
  User,
  Eye,
  EyeOff,
  Globe
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { translations } from "./translations";
import WeatherForecast from "./WeatherForecast";
import "./styles.css";


/* =========================
   MARKET DATA
========================= */

const marketData = [
  { day: "Tue", price: 2380 },
  { day: "Wed", price: 2440 },
  { day: "Thu", price: 2410 },
  { day: "Fri", price: 2500 },
  { day: "Sat", price: 2550 },
  { day: "Sun", price: 2580 }
];


/* =========================
/* =========================
   SIDEBAR
========================= */

function Sidebar({ page, setPage, open, setOpen, t }) {
  const navItems = [
    { id: "Dashboard", name: t?.nav?.dashboard || "Dashboard", icon: LayoutDashboard },
    { id: "Disease Detection", name: t?.nav?.diseaseDetection || "Disease Detection", icon: Leaf },
    { id: "Price Forecast", name: t?.nav?.priceForecast || "Price Forecast", icon: TrendingUp },
    { id: "Weather Forecast", name: t?.nav?.weatherForecast || "Weather Forecast", icon: CloudSun },
    { id: "My History", name: t?.nav?.history || "My History", icon: FileText },
    { id: "Admin View", name: t?.nav?.adminView || "Admin View", icon: Users }
  ];

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <div className="brandIcon">
          <Sprout size={23} />
        </div>
        <b>AgriIntel</b>
      </div>

      <div className="navTitle">
        {t?.nav?.farmerHub || "FARMER INTELLIGENCE"}
      </div>

      <nav>
        {navItems.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            className={page === id ? "active" : ""}
            onClick={() => {
              setPage(id);
              setOpen(false);
            }}
          >
            <Icon size={21} />
            <span>{name}</span>
            {id === "Admin View" && (
              <small>{t?.nav?.adminBadge || "ADMIN"}</small>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebarBottom">
        <div
          className="weatherMini"
          onClick={() => {
            setPage("Weather Forecast");
            setOpen(false);
          }}
          style={{ cursor: "pointer" }}
          title={t?.weather?.title || "Weather Forecast"}
        >
          <CloudSun size={25} />
          <div>
            <b>28°C</b>
            <span>{t?.weather?.currentWeather || "Weather"}</span>
          </div>
        </div>

        <button
          className="settingsBtn"
          onClick={() => {
            setPage("Settings");
            setOpen(false);
          }}
        >
          <Settings size={20} />
          {t?.nav?.settings || "Settings"}
        </button>
      </div>
    </aside>
  );
}


/* =========================
   LANGUAGE SWITCHER
========================= */

function LanguageSwitcher({ lang, setLang }) {
  const languages = [
    { code: "en", label: "EN", title: "English" },
    { code: "hi", label: "हिंदी", title: "Hindi" },
    { code: "mr", label: "मराठी", title: "Marathi" },
    { code: "hinglish", label: "Hinglish", title: "Hinglish" }
  ];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "#eaf0e8",
        padding: "3px 4px",
        borderRadius: "20px",
        border: "1px solid #c9d8c6",
        gap: "2px"
      }}
    >
      <Globe size={13} style={{ color: "#2d6a4f", marginLeft: "4px", marginRight: "2px" }} />
      {languages.map((item) => {
        const isActive = lang === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => {
              setLang(item.code);
              localStorage.setItem("agriintel_lang", item.code);
            }}
            title={item.title}
            style={{
              padding: "3px 8px",
              fontSize: "12px",
              fontWeight: isActive ? "700" : "500",
              color: isActive ? "#ffffff" : "#2d4a34",
              background: isActive ? "#1e6338" : "transparent",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all 0.12s ease",
              lineHeight: 1.2
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}


/* =========================
   HEADER
========================= */

function Header({ setOpen, user, onLogout, page, lang, setLang, t }) {
  const initial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U";
  const displayName = user?.full_name || (lang === "mr" ? "शेतकरी" : lang === "hi" ? "किसान" : lang === "hinglish" ? "Kisan" : "Farmer");
  const displayRole = user?.role === "admin"
    ? (t?.header?.roleAdmin || "Administrator")
    : (t?.header?.roleFarmer || "Farmer");

  const pageLabel =
    page === "Dashboard" ? (t?.nav?.dashboard || "Dashboard") :
    page === "Disease Detection" ? (t?.nav?.diseaseDetection || "Disease Detection") :
    page === "Price Forecast" ? (t?.nav?.priceForecast || "Price Forecast") :
    page === "Weather Forecast" ? (t?.nav?.weatherForecast || "Weather Forecast") :
    page === "My History" ? (t?.nav?.history || "My History") :
    page === "Admin View" ? (t?.nav?.adminView || "Admin View") :
    page === "Settings" ? (t?.nav?.settings || "Settings") : page;

  return (
    <header className="header">
      <button
        className="mobileMenu"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </button>

      <div className="crumb">
        <span>AgriIntel</span>
        {" / "}
        <b>{pageLabel}</b>
      </div>

      <div className="headerRight">
        <LanguageSwitcher lang={lang} setLang={setLang} />

        <Bell size={20} style={{ color: "#465f4c" }} />

        <div className="avatar">
          {initial}
        </div>

        <div className="user">
          <b>{displayName}</b>
          <small>{displayRole}</small>
        </div>

        <button
          onClick={onLogout}
          title={t?.header?.logoutTitle || "Sign out"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "1px solid #d4ddd5",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "13px",
            color: "#465f4c",
            cursor: "pointer",
            fontWeight: "600",
            marginLeft: "8px"
          }}
        >
          <LogOut size={15} />
          <span>{t?.nav?.logout || "Logout"}</span>
        </button>
      </div>
    </header>
  );
}


/* =========================
   DASHBOARD
========================= */

function Dashboard({ setPage, user, t, lang }) {
  const firstName = user?.full_name ? user.full_name.split(" ")[0] : (lang === "mr" ? "शेतकरी" : lang === "hi" ? "किसान" : lang === "hinglish" ? "Kisan" : "Farmer");

  const hour = new Date().getHours();
  const greeting = hour < 12
    ? (t?.dashboard?.greetingMorning || "Good morning")
    : hour < 17
    ? (t?.dashboard?.greetingAfternoon || "Good afternoon")
    : (t?.dashboard?.greetingEvening || "Good evening");

  const todayString = new Date().toLocaleDateString(lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const seasonLabel = lang === "mr" ? "खरीप हंगाम" : lang === "hi" ? "खरीफ सीजन" : lang === "hinglish" ? "Kharif Season" : "Kharif Season";

  return (
    <main>
      <div className="welcome">
        <div>
          <p className="eyebrow">
            {t?.dashboard?.todayBriefing || "TODAY'S FARM BRIEFING"}
          </p>
          <h1>
            {greeting}, {firstName}
          </h1>
          <p>
            {t?.dashboard?.subheading || "Real-time crop diagnostics, market mandi forecasting, and agricultural weather advisories."}
          </p>
        </div>

        <div className="date">
          {todayString} · <b>{seasonLabel}</b>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="heroOverlay">
          <p className="eyebrow">
            {lang === "mr" ? "कृषी सूचना / ०१" : lang === "hi" ? "कृषि नोट / 01" : lang === "hinglish" ? "KHET NOTE / 01" : "FIELD NOTE / 01"}
          </p>
          <h2>
            {lang === "mr" ? (
              <>तुमच्या पिकांची काळजी,<br />प्रत्येक ऋतूत.</>
            ) : lang === "hi" ? (
              <>आपकी फसल का ख्याल,<br />हर मौसम में।</>
            ) : lang === "hinglish" ? (
              <>Aapki fasal ka khayal,<br />har mausam mein.</>
            ) : (
              <>A trusted companion for<br />every farm decision.</>
            )}
          </h2>
          <p>
            {t?.dashboard?.btnScanLeafSub || "Diagnose leaf disease in seconds with AI."}
          </p>

          <button onClick={() => setPage("Disease Detection")}>
            {t?.dashboard?.btnScanLeaf || "Scan a crop leaf"}
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* SUMMARY */}
      <div className="sectionHead">
        <div>
          <p className="eyebrow">
            {t?.dashboard?.todayBriefing || "FARM SUMMARY"}
          </p>
          <h2>
            {lang === "mr" ? "एका दृष्टीक्षेपात" : lang === "hi" ? "एक नज़र में" : lang === "hinglish" ? "Ek Nazar Mein" : "At a Glance"}
          </h2>
        </div>

        <button className="textBtn" onClick={() => setPage("Weather Forecast")}>
          {t?.dashboard?.viewFullForecast || "Weather & advisories →"}
          <ChevronRight size={17} />
        </button>
      </div>

      <div className="cards">
        <Stat
          icon={<Leaf />}
          value="27"
          label={t?.dashboard?.statHealthyScans || "Healthy Scans"}
          sub={t?.dashboard?.statHealthyScansSub || "Leaf health rate: 94%"}
        />

        <Stat
          icon={<TrendingUp />}
          value="₹ 2,580"
          label={t?.dashboard?.statMandiIndex || "Mandi Price Index"}
          sub={t?.dashboard?.statMandiIndexSub || "Tomato & Onion stable"}
        />

        <Stat
          icon={<ShieldCheck />}
          value="98.1%"
          label={lang === "mr" ? "एआय मॉडेल अचूकता" : lang === "hi" ? "एआई सटीकता" : lang === "hinglish" ? "AI Model Accuracy" : "AI Model Accuracy"}
          sub="Random Forest R²"
        />

        <div
          onClick={() => setPage("Weather Forecast")}
          style={{ cursor: "pointer", gridColumn: "auto" }}
          title={t?.dashboard?.viewFullForecast || "Click to view full weather forecast"}
        >
          <Stat
            icon={<CloudSun />}
            value="28°C"
            label={t?.weather?.currentWeather || "Current Weather"}
            sub={t?.dashboard?.viewFullForecast || "View forecast & advisories →"}
          />
        </div>
      </div>

      {/* LOWER SECTION */}
      <div className="grid2">
        <section className="panel">
          <div className="panelHead">
            <div>
              <p className="eyebrow">
                {t?.price?.eyebrow || "APMC MARKET INTELLIGENCE"}
              </p>
              <h3>
                Tomato / {lang === "mr" ? "टोमॅटो" : lang === "hi" ? "टमाटर" : "Tomato"}
              </h3>
            </div>

            <div>
              <b>₹ 2,580</b>
              <span className="positive">+8.2%</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis hide domain={["dataMin-100", "dataMax+100"]} />
              <Tooltip />
              <Line type="monotone" dataKey="price" strokeWidth={3} dot={false} stroke="#1b5e20" />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="panel quick">
          <p className="eyebrow">
            {t?.dashboard?.quickActions || "QUICK ACTIONS"}
          </p>
          <h3>
            {lang === "mr" ? "आज काय करायचे आहे?" : lang === "hi" ? "आज क्या करना है?" : lang === "hinglish" ? "Aaj kya karna hai?" : "What would you like to do?"}
          </h3>

          <Action
            icon={<Camera />}
            title={t?.dashboard?.btnScanLeaf || "Scan leaf"}
            text={t?.dashboard?.btnScanLeafSub || "Diagnose disease in seconds"}
            onClick={() => setPage("Disease Detection")}
          />

          <Action
            icon={<TrendingUp />}
            title={t?.dashboard?.btnForecastPrice || "Forecast prices"}
            text={t?.dashboard?.btnForecastPriceSub || "Next 7-30 days prediction"}
            onClick={() => setPage("Price Forecast")}
          />

          <Action
            icon={<CloudSun />}
            title={t?.dashboard?.btnCheckWeather || "Weather & Advisories"}
            text={t?.dashboard?.btnCheckWeatherSub || "Rain, humidity & spray times"}
            onClick={() => setPage("Weather Forecast")}
          />
        </section>
      </div>
    </main>
  );
}


/* =========================
   STAT CARD
========================= */

function Stat({
  icon,
  value,
  label,
  sub
}) {

  return (

    <div className="stat">

      <div className="statIcon">
        {icon}
      </div>


      <div>

        <strong>
          {value}
        </strong>

        <b>
          {label}
        </b>

        <small>
          {sub}
        </small>

      </div>

    </div>

  );
}


/* =========================
   ACTION CARD
========================= */

function Action({
  icon,
  title,
  text,
  onClick
}) {

  return (

    <button
      className="action"
      onClick={onClick}
    >

      <span>
        {icon}
      </span>


      <div>

        <b>
          {title}
        </b>

        <small>
          {text}
        </small>

      </div>


      <ChevronRight />

    </button>

  );
}

/* =========================
   DISEASE DETECTION
========================= */

function DiseaseDetection({ lang, t }) {

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);


  async function handleImage(event) {

    const file = event.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setResult(null);
    setError("");
    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("file", file);

      const token = localStorage.getItem("agriintel_token");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/disease/predict",
        {
          method: "POST",
          headers: headers,
          body: formData
        }
      );


      if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
          errorText || "Disease prediction failed"
        );

      }


      const data = await response.json();

      console.log("Disease API Response:", data);


      setResult({

        name:
          data.disease_name ||
          "Unknown Disease",

        crop:
          data.affected_crop ||
          "Unknown Crop",

        confidence:
          `${(
            Number(data.confidence || 0) * 100
          ).toFixed(1)}%`,

        scientific_name:
          data.scientific_name ||
          "",

        severity:
          data.severity ||
          "Unknown",

        symptoms:
          data.symptoms ||
          [],

        treatment:
          data.treatment ||
          {}

      });

    } catch (error) {

      console.error(
        "Disease detection error:",
        error
      );

      setError(
        "Unable to analyze image. Please make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }

  }


  return (

    <main>

      <PageTitle
        title={t?.disease?.title || "Crop Disease Detection"}
        hindi={lang === "mr" ? "पीक रोग निदान" : lang === "hinglish" ? "Fasal Rog Pehchano" : "फसल रोग पहचान"}
        text={t?.disease?.subtitle || "Upload a crop leaf photo and let AgriIntel analyze it."}
      />


      <section
        className="uploadBox"
        onClick={() =>
          document
            .getElementById("leaf")
            .click()
        }
      >

        <input
          id="leaf"
          type="file"
          hidden
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleImage}
        />


        <div>

          <div className="uploadIcon">

            <Upload />

          </div>


          <h3>

            {loading
              ? "Analyzing leaf..."
              : "Scan a leaf"}

          </h3>


          <p>

            {selectedImage
              ? selectedImage.name
              : "JPG, PNG up to 10MB"}

          </p>


          <button
            type="button"
            onClick={(event) => {

              event.stopPropagation();

              document
                .getElementById("leaf")
                .click();

            }}
          >

            {loading
              ? "Please wait..."
              : "Choose image"}

          </button>

        </div>

      </section>


      {/* ERROR */}

      {error && (

        <section className="result">

          <h3>
            Error
          </h3>

          <p>
            {error}
          </p>

        </section>

      )}


      {/* RESULT */}

      {result && !loading && (

        <section className="result">

          <div>

            <p className="eyebrow">
              जाँच पूरी
            </p>


            <h2>
              {result.name}
            </h2>


            <p>
              Crop: <b>{result.crop}</b>
            </p>


            {result.scientific_name && (

              <p>
                Scientific name:{" "}
                <i>
                  {result.scientific_name}
                </i>
              </p>

            )}

          </div>


          <div className="confidence">

            {result.confidence}

            {" "}विश्वास

          </div>


          <hr />


          <div className="resultGrid">


            {/* SYMPTOMS */}

            <div>

              <h3>
                लक्षण
              </h3>


              {result.symptoms.length > 0 ? (

                <p>

                  {result.symptoms.map(
                    (symptom, index) => (

                      <React.Fragment key={index}>

                        ✓ {symptom}

                        <br />

                      </React.Fragment>

                    )
                  )}

                </p>

              ) : (

                <p>
                  No symptoms information available.
                </p>

              )}

            </div>


            {/* TREATMENT */}

            <div>

              <h3>
                उपचार / Treatment
              </h3>


              {result.treatment
                ?.organic_control
                ?.length > 0 && (

                  <>

                    <b>
                      Organic Control
                    </b>

                    <p>

                      {result.treatment.organic_control.map(
                        (item, index) => (

                          <React.Fragment key={index}>

                            ✓ {item}

                            <br />

                          </React.Fragment>

                        )
                      )}

                    </p>

                  </>

                )}


              {result.treatment
                ?.chemical_control
                ?.length > 0 && (

                  <>

                    <b>
                      Chemical Control
                    </b>

                    <p>

                      {result.treatment.chemical_control.map(
                        (item, index) => (

                          <React.Fragment key={index}>

                            ✓ {item}

                            <br />

                          </React.Fragment>

                        )
                      )}

                    </p>

                  </>

                )}

            </div>

          </div>


          <hr />


          <div>

            <b>
              Severity:
            </b>

            {" "}

            {result.severity}

          </div>


        </section>

      )}

    </main>

  );

}
/* =========================
   PRICE FORECAST
========================= */

function PriceForecast({ lang, t }) {

  const [crop, setCrop] = useState("Tomato");
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Nashik");
  const [market, setMarket] = useState("Lasalgaon");
  const [days, setDays] = useState("7");

  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleForecast() {

    setLoading(true);
    setError("");
    setForecast(null);

    try {

      const token = localStorage.getItem("agriintel_token");
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/price/predict",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            crop: crop,
            state: state,
            district: district,
            market: market,
            days: Number(days)
          })
        }
      );

      if (!response.ok) {
        let errorMsg = "Price prediction failed";
        try {
          const errData = await response.json();
          errorMsg = errData.detail || errorMsg;
        } catch {
          errorMsg = await response.text();
        }
        throw new Error(errorMsg || "Price prediction failed");
      }

      const data = await response.json();
      console.log("Price Forecast API Response:", data);
      setForecast(data);

    } catch (err) {
      console.error("Price forecast error:", err);
      setForecast(null);
      setError(
        err.message || "Unable to connect to price forecasting server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }

  }


  return (

    <main>

      <PageTitle
        title={t?.price?.title || "Price Forecast"}
        hindi={lang === "mr" ? "बाजार भाव अंदाज" : lang === "hinglish" ? "Mandi Bhav Forecast" : "मंडी भाव अनुमान"}
        text={t?.price?.subtitle || "Historical APMC machine learning price forecast."}
      />


      {/* MODEL INFO */}

      <div className="forecastModel">

        <span>
          MARKET INTELLIGENCE / 02
        </span>

        <b>
          XGBoost • Historical APMC Data
        </b>

      </div>


      {/* FORECAST FORM */}

      <section className="forecastBox">

        <div className="formGroup">

          <label>
            फसल
          </label>

          <select
            value={crop}
            onChange={(e) =>
              setCrop(e.target.value)
            }
          >

            <option value="Tomato">
              Tomato
            </option>

            <option value="Potato">
              Potato
            </option>

            <option value="Onion">
              Onion
            </option>

            <option value="Cotton">
              Cotton
            </option>

            <option value="Soybean">
              Soybean
            </option>

          </select>

        </div>


        <div className="formGroup">

          <label>
            राज्य
          </label>

          <select
            value={state}
            onChange={(e) =>
              setState(e.target.value)
            }
          >

            <option>
              Maharashtra
            </option>

            <option>
              Madhya Pradesh
            </option>

            <option>
              Gujarat
            </option>

            <option>
              Karnataka
            </option>

          </select>

        </div>


        <div className="formGroup">

          <label>
            जिला
          </label>

          <select
            value={district}
            onChange={(e) =>
              setDistrict(e.target.value)
            }
          >

            <option>
              Nashik
            </option>

            <option>
              Akola
            </option>

            <option>
              Pune
            </option>

            <option>
              Nagpur
            </option>

            <option>
              Ahmednagar
            </option>

          </select>

        </div>


        <div className="formGroup">

          <label>
            मंडी
          </label>

          <select
            value={market}
            onChange={(e) =>
              setMarket(e.target.value)
            }
          >

            <option>
              Lasalgaon
            </option>

            <option>
              Nashik
            </option>

            <option>
              Akola
            </option>

            <option>
              Pune
            </option>

          </select>

        </div>


        <div className="formGroup">

          <label>
            दिन
          </label>

          <select
            value={days}
            onChange={(e) =>
              setDays(e.target.value)
            }
          >

            <option value="7">
              7 Days
            </option>

            <option value="15">
              15 Days
            </option>

            <option value="30">
              30 Days
            </option>

          </select>

        </div>


        <button
          className="forecastButton"
          onClick={handleForecast}
          disabled={loading}
        >

          {loading
            ? "अनुमान तैयार हो रहा है..."
            : "अनुमान देखें"}

          <ChevronRight size={20} />

        </button>

      </section>


      {/* ERROR / DEMO NOTICE */}

      {error && (

        <div className="forecastNotice">

          ⚠️ {error}

        </div>

      )}


      {/* RESULT */}

      {forecast && (

        <section className="forecastResult">

          <div className="forecastResultHeader">

            <div>

              <p className="eyebrow">
                PRICE FORECAST / अनुमान
              </p>

              <h2>
                {forecast.crop || crop}
              </h2>

              <p>
                {forecast.market || market},{" "}
                {district},{" "}
                {state}
              </p>

            </div>


            <div className="priceMain">

              <span>
                अनुमानित भाव
              </span>

              <strong>
                ₹
                {Number(
                  forecast.predicted_price || 0
                ).toLocaleString("en-IN")}
              </strong>

              <small>
                प्रति क्विंटल
              </small>

            </div>

          </div>


          {/* SUMMARY */}

          <div className="priceSummary">

            <div>

              <span>
                वर्तमान भाव
              </span>

              <b>
                ₹
                {Number(
                  forecast.current_price || 0
                ).toLocaleString("en-IN")}
              </b>

            </div>


            <div>

              <span>
                अनुमानित बदलाव
              </span>

              <b className="positive">

                +
                {Number(
                  forecast.change_percent || 0
                ).toFixed(2)}
                %

              </b>

            </div>


            <div>

              <span>
                Forecast Period
              </span>

              <b>
                {forecast.days || days} Days
              </b>

            </div>

          </div>


          {/* CHART */}

          <div className="forecastChart">

            <div className="chartHeader">

              <div>

                <p className="eyebrow">
                  HISTORICAL + PREDICTED TREND
                </p>

                <h3>
                  आने वाले दिनों का भाव
                </h3>

              </div>

            </div>


            <ResponsiveContainer
              width="100%"
              height={330}
            >

              <LineChart
                data={
                  forecast.forecast ||
                  forecastData
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                />

                <YAxis
                  domain={[
                    "dataMin-200",
                    "dataMax+200"
                  ]}
                />

                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString(
                      "en-IN"
                    )}`,
                    "Price"
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="price"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>


          {/* EXPLANATION */}

          <div className="forecastExplanation">

            <h3>
              📊 अनुमान कैसे तैयार किया गया?
            </h3>

            <p>
              AgriIntel पिछले APMC मंडी भाव,
              फसल, राज्य, जिला और मंडी की
              historical pricing information का
              उपयोग करके भविष्य के भाव का अनुमान
              तैयार करता है।
            </p>

            <div className="explainGrid">

              <div>

                <b>
                  01
                </b>

                <span>
                  Historical mandi data
                </span>

              </div>


              <div>

                <b>
                  02
                </b>

                <span>
                  Feature processing
                </span>

              </div>


              <div>

                <b>
                  03
                </b>

                <span>
                  XGBoost prediction
                </span>

              </div>


              <div>

                <b>
                  04
                </b>

                <span>
                  Future price estimate
                </span>

              </div>

            </div>

          </div>


          {/* DISCLAIMER */}

          <div className="forecastDisclaimer">

            <b>
              ध्यान दें:
            </b>

            यह अनुमान historical market data पर
            आधारित है। वास्तविक मंडी भाव मौसम,
            मांग, आपूर्ति और अन्य बाजार परिस्थितियों
            के कारण अलग हो सकता है।

          </div>

        </section>

      )}

    </main>

  );

}
/* =========================
   HISTORY
========================= */

function History({ lang, t }) {

  const [diseaseHistory, setDiseaseHistory] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const token = localStorage.getItem("agriintel_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [dRes, pRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/v1/disease/history", { headers }),
          fetch("http://127.0.0.1:8000/api/v1/price/history", { headers })
        ]);

        if (dRes.ok) {
          const dData = await dRes.json();
          setDiseaseHistory(Array.isArray(dData) ? dData : []);
        }
        if (pRes.ok) {
          const pData = await pRes.json();
          setPriceHistory(Array.isArray(pData) ? pData : []);
        }
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const totalItems = diseaseHistory.length + priceHistory.length;

  return (

    <main>

      <PageTitle
        title={t?.history?.title || "My History"}
        hindi={lang === "mr" ? "माझा इतिहास" : lang === "hinglish" ? "Meri History" : "मेरी गतिविधि"}
        text={t?.history?.subtitle || "Previous disease scans and price forecasts from your farm."}
      />

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#6e8374" }}>
          लोड हो रहा है... Loading history...
        </div>
      ) : totalItems === 0 ? (
        <div className="history" style={{ padding: "40px", textAlign: "center", color: "#6e8374" }}>
          No activity records found yet. Scan a leaf or check a price forecast to get started!
        </div>
      ) : (
        <div className="history">

          {diseaseHistory.map((item, idx) => {
            const dateStr = item.timestamp
              ? new Date(item.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
              : "Recent";
            const isHealthy = item.status === "Healthy";

            return (
              <div key={item._id || item.id || `disease-${idx}`}>
                <Leaf style={{ color: isHealthy ? "#2e8b57" : "#d97706" }} />
                <div>
                  <b>{item.crop ? `${item.crop} leaf scan` : item.disease || "Crop Leaf Scan"}</b>
                  <small style={{ color: isHealthy ? "#166534" : "#b45309" }}>
                    {item.disease} — {Math.round((item.confidence || 0) * 100)}% confidence ({item.status})
                  </small>
                </div>
                <span>{dateStr}</span>
              </div>
            );
          })}

          {priceHistory.map((item, idx) => {
            const dateStr = item.timestamp
              ? new Date(item.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
              : "Recent";

            return (
              <div key={item._id || item.id || `price-${idx}`}>
                <TrendingUp style={{ color: "#2563eb" }} />
                <div>
                  <b>{item.crop} price forecast ({item.market || "APMC"})</b>
                  <small>
                    ₹{item.predicted_price} predicted (from ₹{item.current_price}) • {item.trend || "Forecast"}
                  </small>
                </div>
                <span>{dateStr}</span>
              </div>
            );
          })}

        </div>
      )}

    </main>

  );
}


/* =========================
   ADMIN
========================= */

function Admin({ user, onSwitchUser, onLogout, lang, t }) {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isForbidden, setIsForbidden] = useState(false);

  // In-place admin unlock state
  const [adminEmail, setAdminEmail] = useState("admin@agriintel.com");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");
    setIsForbidden(false);

    try {
      const token = localStorage.getItem("agriintel_token");
      if (!token) {
        setError("Please log in as an administrator to view system analytics.");
        setIsForbidden(true);
        setLoading(false);
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/api/v1/admin/statistics", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 403) {
          setIsForbidden(true);
          setError("Administrator access required.");
        } else {
          setError("Failed to load admin statistics.");
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [user]);

  const handleAdminSignIn = async (e) => {
    e.preventDefault();
    setAdminLoginError("");
    setAdminLoginLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail.trim().toLowerCase(),
          password: adminPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Invalid admin credentials.");
      }

      if (data.user?.role !== "admin") {
        throw new Error("This account does not have administrator privileges.");
      }

      localStorage.setItem("agriintel_token", data.access_token);
      localStorage.setItem("agriintel_user", JSON.stringify(data.user));

      if (onSwitchUser) {
        onSwitchUser(data.user);
      }
      setAdminPassword("");
      setIsForbidden(false);
      loadStats();

    } catch (err) {
      setAdminLoginError(err.message || "Failed to authenticate administrator.");
    } finally {
      setAdminLoginLoading(false);
    }
  };

  return (

    <main>

      <PageTitle
        title={t?.admin?.title || "Admin View"}
        hindi={lang === "mr" ? "प्रशासन पॅनेल" : lang === "hinglish" ? "Admin Panel" : "प्रशासन"}
        text={t?.admin?.subtitle || "Monitor users, model activity and system health."}
      />

      {isForbidden ? (
        <div style={{
          background: "white",
          border: "1px solid #dedfd6",
          borderRadius: "8px",
          padding: "32px",
          maxWidth: "520px",
          margin: "24px 0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <Lock size={22} style={{ color: "#d97706" }} />
            <h3 style={{ margin: 0, color: "#1f2937" }}>Administrator Privileges Required</h3>
          </div>

          <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.5", margin: "0 0 20px" }}>
            You are currently signed in as <b>{user?.full_name || user?.email || "Farmer"}</b> (Role: <i>{user?.role || "farmer"}</i>). This section is restricted to system administrators.
          </p>

          {adminLoginError && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #f87171",
              color: "#991b1b",
              padding: "10px 14px",
              borderRadius: "6px",
              fontSize: "13px",
              marginBottom: "16px"
            }}>
              ⚠️ {adminLoginError}
            </div>
          )}

          <form onSubmit={handleAdminSignIn}>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter password (e.g. Admin@123)"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>

            <button
              type="submit"
              disabled={adminLoginLoading}
              style={{
                width: "100%",
                padding: "11px",
                background: "#166534",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: adminLoginLoading ? "wait" : "pointer",
                opacity: adminLoginLoading ? 0.7 : 1
              }}
            >
              {adminLoginLoading ? "Verifying..." : "Unlock Admin Dashboard"}
            </button>
          </form>

          {onLogout && (
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <button
                type="button"
                onClick={onLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  fontSize: "13px",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Or log out to return to sign in
              </button>
            </div>
          )}
        </div>
      ) : error ? (
        <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", padding: "20px", borderRadius: "8px", color: "#92400e" }}>
          ⚠️ {error}
        </div>
      ) : loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#6e8374" }}>
          लोड हो रहा है... Loading admin analytics...
        </div>
      ) : (
        <>
          <div className="cards">

            <Stat
              icon={<Users />}
              value={String(stats?.total_farmers ?? 0)}
              label="Registered farmers"
              sub={`Total users: ${stats?.total_users ?? 0}`}
            />

            <Stat
              icon={<Leaf />}
              value={String(stats?.total_scans ?? 0)}
              label="Disease scans"
              sub={`${stats?.healthy_scans ?? 0} healthy / ${stats?.diseased_scans ?? 0} diseased`}
            />

            <Stat
              icon={<TrendingUp />}
              value={String(stats?.total_price_forecasts ?? 0)}
              label="Forecast requests"
              sub="Historical APMC models"
            />

            <Stat
              icon={<ShieldCheck />}
              value="Healthy"
              label="Backend Status"
              sub="MongoDB + FastAPI active"
            />

          </div>

          {stats?.ai_metrics && (
            <div style={{ marginTop: "32px", background: "white", padding: "24px", border: "1px solid #dedfd6", borderRadius: "6px" }}>
              <p className="eyebrow">AI MODEL BENCHMARKS</p>
              <h3 style={{ margin: "4px 0 16px" }}>Crop Disease & Price Forecast AI Models</h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ background: "#f8faf8", padding: "16px", border: "1px solid #e1e7e2", borderRadius: "6px" }}>
                  <b style={{ color: "#166534" }}>{stats.ai_metrics.disease_model?.name || "Disease CNN"}</b>
                  <p style={{ margin: "8px 0 4px", fontSize: "14px", color: "#4b5563" }}>
                    Transfer Learning on MobileNetV2
                  </p>
                  <div style={{ fontSize: "13px", color: "#374151" }}>
                    Accuracy: <b>{(stats.ai_metrics.disease_model?.accuracy * 100).toFixed(1)}%</b> • F1 Score: <b>{(stats.ai_metrics.disease_model?.f1_score * 100).toFixed(1)}%</b>
                  </div>
                </div>

                <div style={{ background: "#f8faf8", padding: "16px", border: "1px solid #e1e7e2", borderRadius: "6px" }}>
                  <b style={{ color: "#166534" }}>APMC Price Regressor</b>
                  <p style={{ margin: "8px 0 4px", fontSize: "14px", color: "#4b5563" }}>
                    Random Forest / XGBoost Regressor Pipeline
                  </p>
                  <div style={{ fontSize: "13px", color: "#374151" }}>
                    R² Score: <b>0.9815</b> • MAE: <b>₹2.49</b> • RMSE: <b>₹3.43</b>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </main>

  );
}


/* =========================
   SETTINGS
========================= */

function SettingsPage({ lang, setLang, t }) {
  const [savedToast, setSavedToast] = useState(false);
  const [notifs, setNotifs] = useState("enabled");

  const handleSave = () => {
    localStorage.setItem("agriintel_lang", lang);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <main>
      <PageTitle
        title={t?.settings?.title || "Settings"}
        hindi={lang === "mr" ? "सिस्टीम सेटिंग्ज" : lang === "hinglish" ? "SETTINGS" : "सेटिंग्स"}
        text={t?.settings?.subtitle || "Manage your AgriIntel language & notification preferences."}
      />

      <section className="settingsPanel" style={{ background: "white", padding: "24px", borderRadius: "8px", border: "1px solid #dedfd6", maxWidth: "600px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#2d4a34" }}>
            {t?.settings?.selectLanguage || "Preferred Language / भाषा निवडा / भाषा बदलें"}
          </label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
            {[
              { code: "en", label: "English" },
              { code: "hi", label: "हिंदी (Hindi)" },
              { code: "mr", label: "मराठी (Marathi)" },
              { code: "hinglish", label: "Hinglish (Hindi-English)" }
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLang(item.code);
                  localStorage.setItem("agriintel_lang", item.code);
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: lang === item.code ? "2px solid #1b5e20" : "1px solid #d1d5db",
                  background: lang === item.code ? "#eaf2eb" : "#ffffff",
                  color: lang === item.code ? "#1b5e20" : "#374151",
                  fontWeight: lang === item.code ? "700" : "500",
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s ease"
                }}
              >
                {lang === item.code && <span>✓</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#2d4a34" }}>
            {t?.settings?.notifications || "Weather & Farming Alerts"}
          </label>
          <select
            value={notifs}
            onChange={(e) => setNotifs(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          >
            <option value="enabled">{t?.settings?.enabled || "Enabled (Daily advisories & alerts)"}</option>
            <option value="disabled">{t?.settings?.disabled || "Disabled"}</option>
          </select>
        </div>

        {savedToast && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", color: "#166534", padding: "10px 14px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" }}>
            ✓ {lang === "mr" ? "सेटिंग्ज यशस्वीरीत्या जतन केल्या!" : lang === "hi" ? "सेटिंग्स सफलतापूर्वक सुरक्षित की गईं!" : lang === "hinglish" ? "Settings save ho gayi!" : "Settings saved successfully!"}
          </div>
        )}

        <button className="primary" onClick={handleSave} style={{ padding: "11px 24px" }}>
          {t?.settings?.btnSave || "Save settings"}
        </button>
      </section>
    </main>
  );
}


/* =========================
   PAGE TITLE
========================= */

function PageTitle({
  title,
  hindi,
  text
}) {

  return (

    <div className="pageTitle">

      <p className="eyebrow">
        {hindi}
      </p>

      <h1>
        {title}
      </h1>

      <p>
        {text}
      </p>

    </div>

  );
}


/* =========================
   LOGIN PAGE
========================= */

function Login({ onLogin, lang, setLang, t }) {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Google Sign-In Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState("");
  const [googleNameInput, setGoogleNameInput] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = !email || emailRegex.test(email);
  const isPasswordValid = !password || password.length >= 6;
  const isConfirmValid = !confirmPassword || password === confirmPassword;

  // GOOGLE LOGIN HANDLER
  const handleGoogleAuth = async ({ targetEmail, targetName }) => {
    const finalEmail = (targetEmail || googleEmailInput || "").trim().toLowerCase();
    const finalName = (targetName || googleNameInput || "").trim() || finalEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    if (!finalEmail || !emailRegex.test(finalEmail)) {
      setError(lang === "mr" ? "कृपया वैध Google ईमेल पत्ता टाका." : lang === "hi" ? "कृपया वैध Google ईमेल दर्ज करें।" : lang === "hinglish" ? "Valid Google email daalein." : "Please enter a valid Google email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: finalEmail,
          full_name: finalName,
          google_id: `g_${Date.now()}`,
          picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalName)}&backgroundColor=1b5e20`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Google authentication failed.");
      }

      if (data.access_token) {
        localStorage.setItem("agriintel_token", data.access_token);
      }
      if (data.user) {
        localStorage.setItem("agriintel_user", JSON.stringify(data.user));
      }

      setShowGoogleModal(false);
      setSuccessMsg(
        lang === "mr"
          ? `Google ने यशस्वीरित्या साइन इन झाले: ${data.user.full_name}`
          : lang === "hi"
          ? `Google से सफल लॉगिन: ${data.user.full_name}`
          : lang === "hinglish"
          ? `Google se login ho gaya: ${data.user.full_name}`
          : `Signed in with Google as ${data.user.full_name}`
      );

      setTimeout(() => {
        onLogin(data.user);
      }, 400);

    } catch (err) {
      setError(err.message || "Failed to authenticate with Google. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError(lang === "mr" ? "सर्व आवश्यक माहिती भरा." : lang === "hi" ? "कृपया सभी फ़ील्ड भरें।" : lang === "hinglish" ? "Sabhi fields bharein." : "Please fill in all required fields.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError(lang === "mr" ? "कृपया वैध ईमेल टाका." : lang === "hi" ? "कृपया वैध ईमेल पता दर्ज करें।" : "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError(lang === "mr" ? "पासवर्ड किमान ६ अक्षरांचा असावा." : lang === "hi" ? "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।" : "Password must be at least 6 characters long.");
      return;
    }

    if (isRegister) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setError(lang === "mr" ? "कृपया आपले पूर्ण नाव टाका." : lang === "hi" ? "कृपया अपना पूरा नाम लिखें।" : "Please enter your full name (at least 2 characters).");
        return;
      }
      if (password !== confirmPassword) {
        setError(lang === "mr" ? "पासवर्ड जुळत नाहीत." : lang === "hi" ? "पासवर्ड मेल नहीं खाते।" : "Passwords do not match. Please re-enter.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isRegister
        ? "http://127.0.0.1:8000/api/v1/auth/register"
        : "http://127.0.0.1:8000/api/v1/auth/login";

      const payload = isRegister
        ? { full_name: fullName.trim(), email: trimmedEmail, password }
        : { email: trimmedEmail, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed. Please verify your credentials.");
      }

      if (data.access_token) {
        localStorage.setItem("agriintel_token", data.access_token);
      }
      if (data.user) {
        localStorage.setItem("agriintel_user", JSON.stringify(data.user));
      }

      setSuccessMsg(isRegister ? "Account created successfully! Redirecting..." : "Login successful! Redirecting...");
      setTimeout(() => {
        onLogin(data.user);
      }, 300);

    } catch (err) {
      setError(err.message || "Unable to connect to authentication server. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">

      {/* LEFT SIDE: BRANDING & PRODUCT INFO */}
      <div className="loginLeft">
        <div className="brand">
          <div className="brandIcon">
            <Sprout size={23} />
          </div>
          <b>AgriIntel</b>
        </div>

        <p className="eyebrow">
          {t?.auth?.farmerIntelligence || "DECISION SUPPORT FOR INDIAN FARMERS"}
        </p>

        <h1>
          {lang === "mr" ? (
            <>शेतकऱ्यांचा विश्वासू सोबती,<br />प्रत्येक निर्णयासाठी.</>
          ) : lang === "hi" ? (
            <>हर कृषि निर्णय में,<br />आपका भरोसेमंद साथी।</>
          ) : lang === "hinglish" ? (
            <>Har farm decision mein,<br />aapka digital saathi.</>
          ) : (
            <>A companion for<br />every farm decision.</>
          )}
        </h1>

        <p>
          {lang === "mr"
            ? "पानाच्या फोटोवरून पीक रोग निदान, ३० दिवसांचा बाजार भाव अंदाज आणि थेट कृषी हवामान सल्ला."
            : lang === "hi"
            ? "पत्ती के फ़ोटो से फसल रोग पहचान, 30 दिनों का मंडी भाव अनुमान और लाइव कृषि मौसम परामर्श।"
            : lang === "hinglish"
            ? "Leaf photo se fasal rog check karein, 30 dino ka mandi rate jaanein aur live kheti mausam alerts paayein."
            : "Detect crop disease from a photo, forecast APMC market prices, and get live agricultural weather advisories."}
        </p>

        <div className="loginPoints">
          <span>⌁ {lang === "mr" ? "थेट पीक रोग निदान" : lang === "hi" ? "त्वरित फसल रोग पहचान" : lang === "hinglish" ? "Instant Leaf Disease Detection" : "Leaf scan — instant disease insight"}</span>
          <span>↗ {lang === "mr" ? "३० दिवसांचा बाजार भाव अंदाज" : lang === "hi" ? "30 दिवसीय मंडी भाव पूर्वानुमान" : lang === "hinglish" ? "30-Day APMC Price Forecast" : "30-day APMC market price forecast"}</span>
          <span>⛅ {lang === "mr" ? "कृषी हवामान व फवारणी सल्ला" : lang === "hi" ? "कृषि मौसम एवं छिड़काव परामर्श" : lang === "hinglish" ? "Live Weather & Spray Advisories" : "Live Weather & spray advisories"}</span>
        </div>
      </div>

      {/* RIGHT SIDE: AUTHENTICATION FORM */}
      <div className="loginRight">
        <div style={{ position: "absolute", top: "24px", right: "24px" }}>
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>

        <div className="loginForm">

          {/* TAB SELECTOR: SIGN IN / REGISTER */}
          <div style={{
            display: "flex",
            background: "#ebeee9",
            borderRadius: "8px",
            padding: "4px",
            marginBottom: "20px"
          }}>
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError("");
                setSuccessMsg("");
              }}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                borderRadius: "6px",
                background: !isRegister ? "#ffffff" : "transparent",
                color: !isRegister ? "#134e27" : "#5b6d5f",
                fontWeight: !isRegister ? "700" : "500",
                fontSize: "14px",
                boxShadow: !isRegister ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                margin: 0,
                transition: "all 0.15s ease"
              }}
            >
              {t?.auth?.signIn || "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError("");
                setSuccessMsg("");
              }}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                borderRadius: "6px",
                background: isRegister ? "#ffffff" : "transparent",
                color: isRegister ? "#134e27" : "#5b6d5f",
                fontWeight: isRegister ? "700" : "500",
                fontSize: "14px",
                boxShadow: isRegister ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                margin: 0,
                transition: "all 0.15s ease"
              }}
            >
              {t?.auth?.createAccount || "Create Account"}
            </button>
          </div>

          <h1>
            {isRegister
              ? (t?.auth?.createAccountTitle || "Create account")
              : (t?.auth?.welcomeBack || "Welcome back")}
          </h1>

          <p>
            {isRegister
              ? (t?.auth?.createAccountSub || "Register with your details to access crop disease detection & APMC forecasts.")
              : (t?.auth?.signInSub || "Sign in with your email and password to access your farm intelligence dashboard.")}
          </p>

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              width: "100%",
              padding: "11px 16px",
              background: "#ffffff",
              border: "1.5px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              transition: "all 0.15s ease",
              marginTop: "8px",
              marginBottom: "16px"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{t?.auth?.continueWithGoogle || "Continue with Google"}</span>
          </button>

          {/* DIVIDER */}
          <div style={{
            display: "flex",
            alignItems: "center",
            margin: "14px 0 18px",
            color: "#9ca3af",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.5px"
          }}>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            <span style={{ padding: "0 10px" }}>{t?.auth?.orDivider || "OR CONTINUE WITH EMAIL"}</span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #f87171",
              color: "#991b1b",
              padding: "12px 14px",
              borderRadius: "6px",
              fontSize: "13px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS ALERT */}
          {successMsg && (
            <div style={{
              background: "#f0fdf4",
              border: "1px solid #4ade80",
              color: "#166534",
              padding: "12px 14px",
              borderRadius: "6px",
              fontSize: "13px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span>✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* FULL NAME (REGISTER ONLY) */}
            {isRegister && (
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>
                  {t?.auth?.fullName || "Full Name"}
                </label>
                <input
                  type="text"
                  placeholder={t?.auth?.fullNamePlaceholder || "Enter your full name"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            )}

            {/* EMAIL */}
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>
                {t?.auth?.email || "Email Address"}
              </label>
              <input
                type="email"
                placeholder={t?.auth?.emailPlaceholder || "name@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              {!isEmailValid && (
                <small style={{ color: "#dc2626", fontSize: "11px", marginTop: "2px", display: "block" }}>
                  Please enter a valid email address.
                </small>
              )}
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: "12px", position: "relative" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>
                {t?.auth?.password || "Password"}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={isRegister ? (t?.auth?.passwordPlaceholder || "Create password (min 6 characters)") : (t?.auth?.passwordPlaceholder || "Enter your password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingRight: "44px" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#6b7280",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                    width: "auto"
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isPasswordValid && (
                <small style={{ color: "#dc2626", fontSize: "11px", marginTop: "2px", display: "block" }}>
                  Password must be at least 6 characters.
                </small>
              )}
            </div>

            {/* CONFIRM PASSWORD (REGISTER ONLY) */}
            {isRegister && (
              <div style={{ marginBottom: "16px", position: "relative" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>
                  {t?.auth?.confirmPassword || "Confirm Password"}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t?.auth?.confirmPasswordPlaceholder || "Re-enter your password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    style={{ paddingRight: "44px" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#6b7280",
                      cursor: "pointer",
                      padding: 0,
                      margin: 0,
                      width: "auto"
                    }}
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {!isConfirmValid && (
                  <small style={{ color: "#dc2626", fontSize: "11px", marginTop: "2px", display: "block" }}>
                    Passwords do not match.
                  </small>
                )}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "wait" : "pointer",
                marginTop: "8px"
              }}
            >
              {loading
                ? (isRegister ? "Creating account..." : "Signing in...")
                : (isRegister ? (t?.auth?.btnCreate || "Complete Registration") : (t?.auth?.btnSignIn || "Sign In"))}
            </button>

          </form>

          <hr />

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setSuccessMsg("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#15582e",
              fontWeight: "700",
              cursor: "pointer",
              display: "block",
              width: "100%",
              textAlign: "center",
              fontSize: "13px",
              padding: 0,
              margin: 0
            }}
          >
            {isRegister
              ? (t?.auth?.alreadyHaveAccount || "Already have an account? Sign in")
              : (t?.auth?.needAccount || "Don't have an account? Create one")}
          </button>

        </div>

      </div>

      {/* GOOGLE SIGN IN MODAL */}
      {showGoogleModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px",
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px 28px",
            width: "100%",
            maxWidth: "440px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <b style={{ fontSize: "16px", color: "#111827" }}>
                  {lang === "mr" ? "Google खात्यासह साइन इन करा" : lang === "hi" ? "Google खाते से साइन इन करें" : lang === "hinglish" ? "Google Account Se Login Karein" : "Sign in with Google"}
                </b>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                style={{ background: "none", border: "none", fontSize: "20px", color: "#6b7280", cursor: "pointer", padding: "4px" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#4b5563", marginBottom: "16px" }}>
              {lang === "mr"
                ? "तुमचे Google खाते निवडा किंवा ईमेल टाकून त्वरित साइन इन करा."
                : lang === "hi"
                ? "अपना Google खाता चुनें या ईमेल दर्ज करके तुरंत लॉगिन करें।"
                : "Choose a quick Google profile or enter your Google email to authenticate."}
            </p>

            {/* QUICK GOOGLE PROFILES */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {[
                { name: "Ramesh Patil", email: "ramesh.patil@gmail.com", avatar: "RP" },
                { name: "Suresh Shinde", email: "suresh.shinde@gmail.com", avatar: "SS" }
              ].map((acc) => (
                <div
                  key={acc.email}
                  onClick={() => handleGoogleAuth({ targetEmail: acc.email, targetName: acc.name })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: "#f9fafb",
                    transition: "all 0.15s ease"
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "#f9fafb")}
                >
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#1e6338",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "13px"
                  }}>
                    {acc.avatar}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontWeight: "600", fontSize: "13px", color: "#111827" }}>{acc.name}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{acc.email}</div>
                  </div>
                  <span style={{ fontSize: "12px", color: "#1b5e20", fontWeight: "600" }}>Login →</span>
                </div>
              ))}
            </div>

            {/* CUSTOM GOOGLE ACCOUNT FORM */}
            <div style={{
              background: "#f8fafc",
              padding: "14px",
              borderRadius: "8px",
              border: "1px dashed #cbd5e1"
            }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
                {lang === "mr" ? "किंवा तुमचे Google ईमेल टाका" : lang === "hi" ? "या अपना Google ईमेल दर्ज करें" : "OR ENTER YOUR GOOGLE EMAIL"}
              </div>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={googleEmailInput}
                onChange={(e) => setGoogleEmailInput(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", marginBottom: "8px" }}
              />
              <input
                type="text"
                placeholder={lang === "mr" ? "तुमचे नाव (पर्यायी)" : lang === "hi" ? "आपका नाम (वैकल्पिक)" : "Your Name (Optional)"}
                value={googleNameInput}
                onChange={(e) => setGoogleNameInput(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", marginBottom: "10px" }}
              />
              <button
                type="button"
                onClick={() => handleGoogleAuth({ targetEmail: googleEmailInput, targetName: googleNameInput })}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "9px 14px",
                  background: "#1e6338",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                {loading ? "Authenticating with Google..." : (t?.auth?.continueWithGoogle || "Continue with Google")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}



/* =========================
   MAIN APP
========================= */

function App() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("agriintel_lang") || "en";
  });

  const t = translations[lang] || translations.en;

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("agriintel_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("agriintel_token"));
  });

  const [page, setPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(true);

  // REAL-TIME SESSION VERIFICATION ON MOUNT
  useEffect(() => {
    async function verifySession() {
      const token = localStorage.getItem("agriintel_token");
      if (!token) {
        setUser(null);
        setLoggedIn(false);
        setVerifyingSession(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const freshUser = await response.json();
          setUser(freshUser);
          localStorage.setItem("agriintel_user", JSON.stringify(freshUser));
          setLoggedIn(true);
        } else {
          // Token expired or invalid
          localStorage.removeItem("agriintel_token");
          localStorage.removeItem("agriintel_user");
          setUser(null);
          setLoggedIn(false);
        }
      } catch (err) {
        // Backend temporarily unavailable, retain existing user state
      } finally {
        setVerifyingSession(false);
      }
    }

    verifySession();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("agriintel_token");
    localStorage.removeItem("agriintel_user");
    setUser(null);
    setLoggedIn(false);
    setPage("Dashboard");
  };

  /* VERIFYING SESSION SPINNER */
  if (verifyingSession && localStorage.getItem("agriintel_token")) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f6ef",
        color: "#15351f",
        fontFamily: "Inter, sans-serif"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "4px solid #cce5c2",
          borderTopColor: "#1e6338",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: "16px", fontWeight: "600", fontSize: "14px", color: "#3e5b45" }}>
          Verifying session...
        </p>
      </div>
    );
  }

  /* LOGIN */
  if (!loggedIn) {
    return (
      <Login
        onLogin={handleLogin}
        lang={lang}
        setLang={setLang}
        t={t}
      />
    );
  }

  /* MAIN DASHBOARD */
  return (
    <div className="app">
      <Sidebar
        page={page}
        setPage={setPage}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        user={user}
        lang={lang}
        t={t}
      />

      {sidebarOpen && (
        <div
          className="shade"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="content">
        <Header
          setOpen={setSidebarOpen}
          user={user}
          onLogout={handleLogout}
          page={page}
          lang={lang}
          setLang={setLang}
          t={t}
        />

        {page === "Dashboard" && (
          <Dashboard
            setPage={setPage}
            user={user}
            lang={lang}
            t={t}
          />
        )}

        {page === "Disease Detection" && (
          <DiseaseDetection
            lang={lang}
            t={t}
            PageTitle={PageTitle}
          />
        )}

        {page === "Price Forecast" && (
          <PriceForecast
            lang={lang}
            t={t}
            PageTitle={PageTitle}
          />
        )}

        {page === "Weather Forecast" && (
          <WeatherForecast
            lang={lang}
            t={t}
            PageTitle={PageTitle}
          />
        )}

        {page === "My History" && (
          <History
            lang={lang}
            t={t}
            PageTitle={PageTitle}
          />
        )}

        {page === "Admin View" && (
          <Admin
            user={user}
            onSwitchUser={handleLogin}
            onLogout={handleLogout}
            lang={lang}
            t={t}
            PageTitle={PageTitle}
          />
        )}

        {page === "Settings" && (
          <SettingsPage
            lang={lang}
            setLang={setLang}
            t={t}
            PageTitle={PageTitle}
          />
        )}
      </div>
    </div>
  );
}


/* =========================
   START REACT
========================= */

createRoot(
  document.getElementById("root")
).render(
  <App />
);