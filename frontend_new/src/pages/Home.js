import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const features = [
    { name: "Chatbot", icon: "💬", path: "/chat" },
    { name: "Disease Detection", icon: "📸", path: "/disease" },
    { name: "Weather", icon: "🌦️", path: "/weather" },
    { name: "Schemes & Loans", icon: "🏦", path: "/schemes" },
    { name: "Market Analysis", icon: "📈", path: "/market" }
  ];

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>🌾 KrishiMitra</h1>
        <p>Your AI-powered smart farming assistant</p>
      </div>

      {/* FEATURE GRID */}
      <div style={styles.grid}>
        {features.map((f, i) => (
          <div
            key={i}
            style={styles.card}
            onClick={() => navigate(f.path)}
          >
            <div style={styles.icon}>{f.icon}</div>
            <h3>{f.name}</h3>
            <p style={styles.desc}>
              {getDescription(f.name)}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

function getDescription(name) {
  switch (name) {
    case "Chatbot":
      return "Ask farming questions in your language";
    case "Disease Detection":
      return "Upload crop image & detect diseases";
    case "Weather":
      return "Get 5-day weather forecast & advice";
    case "Schemes & Loans":
      return "Find best govt schemes & loans";
    case "Market Analysis":
      return "Check prices & best mandi to sell";
    default:
      return "";
  }
}

export default Home;

const styles = {
  page: {
    background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "Segoe UI"
  },

  header: {
    textAlign: "center",
    marginBottom: "40px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },

  icon: {
    fontSize: "40px",
    marginBottom: "10px"
  },

  desc: {
    fontSize: "14px",
    color: "#555"
  }
};