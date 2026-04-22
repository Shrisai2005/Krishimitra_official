import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Weather() {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (!city) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/weather?city=${city}`
      );

      if (res.data.status === "success") {
        setForecast(res.data.data || []);
      } else {
        alert("City not found");
        setForecast([]);
      }
    } catch {
      alert("Error fetching weather");
      setForecast([]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>⬅</button>
        <h2>🌦️ Weather Forecast</h2>
      </div>

      {/* INPUT CARD */}
      <div style={styles.card}>
        <input
          placeholder="📍 Enter city (Bangalore)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={styles.input}
        />

        <button onClick={getWeather} style={styles.button}>
          Get Weather 🌤️
        </button>
      </div>

      {/* LOADING */}
      {loading && <p style={styles.center}>⏳ Fetching weather...</p>}

      {/* EMPTY */}
      {!loading && forecast.length === 0 && (
        <p style={styles.center}>
          Enter a city to view weather 🌦️
        </p>
      )}

      {/* WEATHER CARDS */}
      {!loading && forecast.length > 0 && (
        <div style={styles.grid}>
          {forecast.map((day, i) => (
            <div
              key={i}
              style={{
                ...styles.cardDay,
                background:
                  day.temp > 35 ? "#ffcdd2" :
                  day.temp < 20 ? "#bbdefb" :
                  "#e3f2fd"
              }}
            >
              <h4>{day.date}</h4>

              <p style={styles.temp}>🌡️ {day.temp}°C</p>

              <p>☁️ {day.condition}</p>
              <p>💧 {day.humidity}%</p>

              <div style={styles.advice}>
                {day.advice}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Weather;

const styles = {
  page: {
    background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Segoe UI"
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px"
  },

  backBtn: {
    padding: "5px 10px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  button: {
    background: "#1976d2",
    color: "white",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    marginTop: "20px"
  },

  cardDay: {
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
  },

  temp: {
    fontSize: "18px",
    fontWeight: "bold"
  },

  advice: {
    marginTop: "10px",
    fontSize: "12px",
    background: "#ffffff",
    padding: "8px",
    borderRadius: "8px"
  },

  center: {
    textAlign: "center",
    marginTop: "20px"
  }
};