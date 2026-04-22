import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Schemes() {
  const navigate = useNavigate();

  const [state, setState] = useState("");
  const [crop, setCrop] = useState("");
  const [land, setLand] = useState("");
  const [income, setIncome] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSchemes = async () => {
    if (!state || !crop) {
      alert("Please enter State and Crop");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/schemes?state=${state}&crop=${crop}&land=${land}&income=${income}`
      );

      setSchemes(res.data.data || []);
    } catch {
      alert("Error fetching schemes");
      setSchemes([]);
    }

    setLoading(false);
  };

  const filterRelevantSchemes = () => {
    return schemes.filter((s) => {
      const text = (s.name + s.why).toLowerCase();
      return (
        text.includes(crop.toLowerCase()) ||
        text.includes(state.toLowerCase()) ||
        text.includes("loan") ||
        text.includes("insurance")
      );
    });
  };

  const filtered = filterRelevantSchemes();

  const groupSchemes = (data) => {
    const groups = { loans: [], insurance: [], support: [] };

    data.forEach((s) => {
      const name = s.name.toLowerCase();

      if (name.includes("loan") || name.includes("credit")) {
        groups.loans.push(s);
      } else if (name.includes("insurance")) {
        groups.insurance.push(s);
      } else {
        groups.support.push(s);
      }
    });

    return groups;
  };

  const grouped = groupSchemes(filtered);

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>⬅</button>
        <h2>🏦 Smart Schemes & Loans</h2>
      </div>

      {/* INPUT CARD */}
      <div style={styles.formCard}>
        <input placeholder="📍 State" onChange={(e) => setState(e.target.value)} style={styles.input}/>
        <input placeholder="🌾 Crop" onChange={(e) => setCrop(e.target.value)} style={styles.input}/>
        <input placeholder="📏 Land Size" onChange={(e) => setLand(e.target.value)} style={styles.input}/>
        <input placeholder="💰 Income Level" onChange={(e) => setIncome(e.target.value)} style={styles.input}/>

        <button onClick={fetchSchemes} style={styles.button}>
          Get Personalized Schemes 🚀
        </button>
      </div>

      {/* LOADING */}
      {loading && <p style={styles.center}>⏳ Finding best schemes...</p>}

      {/* EMPTY */}
      {!loading && schemes.length === 0 && (
        <p style={styles.center}>Enter details to see recommendations</p>
      )}

      {/* RESULTS */}
      {!loading && schemes.length > 0 && (
        <div>

          <div style={styles.personalBox}>
            🎯 Personalized for <b>{state}</b> | <b>{crop}</b> | <b>{land}</b> | <b>{income}</b>
          </div>

          <Section title="💰 Loans" data={grouped.loans} />
          <Section title="🛡️ Insurance" data={grouped.insurance} />
          <Section title="🌾 Support & Subsidy" data={grouped.support} />

        </div>
      )}
    </div>
  );
}

function Section({ title, data }) {
  if (!data.length) return null;

  return (
    <div style={{ marginTop: "25px" }}>
      <h3 style={styles.sectionTitle}>{title}</h3>

      <div style={styles.grid}>
        {data.map((s, i) => (
          <div key={i} style={styles.card}>
            <h4>
              {s.name} {i === 0 && <span style={styles.badge}>⭐ Recommended</span>}
            </h4>

            <p><b>💰 Benefit:</b> {s.benefit}</p>
            <p><b>📋 Eligibility:</b> {s.eligibility}</p>
            <p><b>🤖 Why:</b> {s.why}</p>

            <a href={s.link} target="_blank" rel="noreferrer" style={styles.link}>
              Visit Official →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    padding: "5px 10px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  formCard: {
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

  personalBox: {
    marginTop: "20px",
    background: "#c8e6c9",
    padding: "12px",
    borderRadius: "10px",
    textAlign: "center"
  },

  sectionTitle: {
    color: "#2e7d32"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px"
  },

  card: {
    background: "white",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
  },

  badge: {
    color: "green",
    fontSize: "12px",
    marginLeft: "10px"
  },

  link: {
    color: "#1976d2",
    fontWeight: "bold"
  },

  center: {
    textAlign: "center",
    marginTop: "20px"
  }
};

export default Schemes;