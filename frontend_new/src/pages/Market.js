import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

function Market() {
  const navigate = useNavigate();

  const [crop, setCrop] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [result, setResult] = useState(null);

  const getMarket = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/market?crop=${crop}&state=${state}&district=${district}`
      );

      setResult(res.data.data);
    } catch {
      alert("Error fetching market data");
    }
  };

  const chartData = result?.future_prices?.map((p, i) => ({
    day: `Day ${i + 1}`,
    price: Number(p)
  })) || [];

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>⬅</button>
        <h1>📈 Smart Market Intelligence</h1>
      </div>

      {/* INPUT CARD */}
      <div style={styles.card}>
        <input placeholder="🌾 Crop" onChange={(e) => setCrop(e.target.value)} style={styles.input}/>
        <input placeholder="📍 State" onChange={(e) => setState(e.target.value)} style={styles.input}/>
        <input placeholder="🏙️ District" onChange={(e) => setDistrict(e.target.value)} style={styles.input}/>

        <button onClick={getMarket} style={styles.button}>
          Analyze Market 🚀
        </button>
      </div>

      {result && (
        <>
          {/* BEST MARKET */}
          <div style={styles.bestBox}>
            🏆 Best Market: <b>{result.best_market}</b>
          </div>

          {/* MANDI GRID */}
          <h3 style={styles.section}>🏪 Taluka Prices</h3>

          <div style={styles.grid}>
            {result.mandis.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.mandiCard,
                  ...(m.name === result.best_market ? styles.bestCard : {})
                }}
              >
                <h4>{m.name}</h4>
                <p style={styles.price}>₹{m.price}</p>
                {m.name === result.best_market && <span>🏆 Best</span>}
              </div>
            ))}
          </div>

          {/* TREND */}
          <div style={styles.trendBox}>
            📊 <b>Trend:</b> {result.trend}
          </div>

          {/* GRAPH */}
          <div style={styles.chartCard}>
            <h3>📈 Price Forecast (Next 5 Days)</h3>

            <LineChart width={750} height={320} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis label={{ value: "₹ Price", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2e7d32" 
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </div>
        </>
      )}
    </div>
  );
}

export default Market;

const styles = {
  page: {
    background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
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
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: "8px"
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
    background: "#2e7d32",
    color: "white",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer"
  },

  bestBox: {
    background: "#c8e6c9",
    padding: "15px",
    marginTop: "20px",
    borderRadius: "10px",
    fontSize: "18px",
    textAlign: "center"
  },

  section: {
    marginTop: "25px",
    color: "#2e7d32"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px"
  },

  mandiCard: {
    background: "white",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
  },

  bestCard: {
    border: "2px solid green",
    background: "#e8f5e9"
  },

  price: {
    fontSize: "18px",
    fontWeight: "bold"
  },

  trendBox: {
    marginTop: "20px",
    padding: "12px",
    background: "#e3f2fd",
    borderRadius: "10px"
  },

  chartCard: {
    marginTop: "25px",
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  }
};