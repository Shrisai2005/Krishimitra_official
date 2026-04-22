import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DiseaseDetection() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/detect-disease",
        formData
      );

      setResult(res.data.data);
    } catch {
      alert("Error detecting disease");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>⬅</button>
        <h2>📸 AI Disease Detection</h2>
      </div>

      {/* UPLOAD CARD */}
      <div style={styles.card}>
        <label style={styles.uploadLabel}>
          📂 Upload Leaf Image
          <input type="file" onChange={handleImage} style={{ display: "none" }} />
        </label>

        {preview && (
          <div style={styles.imageBox}>
            <img src={preview} alt="preview" style={styles.image} />
          </div>
        )}

        <button onClick={handleUpload} style={styles.button}>
          Detect Disease 🔍
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div style={styles.loading}>
          ⏳ Analyzing plant health...
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div style={styles.resultCard}>

          <h3 style={styles.disease}>
            🦠 {result.disease}
          </h3>

          <p><b>📊 Confidence:</b> {result.confidence}</p>

          <p>
            <b>⚠️ Severity:</b> 
            <span style={{
              color:
                result.severity.includes("High") ? "red" :
                result.severity.includes("Moderate") ? "orange" : "green",
              marginLeft: "5px"
            }}>
              {result.severity}
            </span>
          </p>

          <div style={styles.explanation}>
            {result.explanation
              .replace(/###/g, "")
              .replace(/\*\*/g, "")
              .replace(/\*/g, "•")}
          </div>
        </div>
      )}
    </div>
  );
}

export default DiseaseDetection;

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

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    textAlign: "center"
  },

  uploadLabel: {
    display: "inline-block",
    padding: "12px 20px",
    background: "#2e7d32",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "15px"
  },

  imageBox: {
    marginTop: "10px"
  },

  image: {
    width: "220px",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)"
  },

  button: {
    marginTop: "15px",
    padding: "12px",
    width: "100%",
    background: "#2e7d32",
    color: "white",
    borderRadius: "10px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer"
  },

  loading: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "16px"
  },

  resultCard: {
    marginTop: "20px",
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },

  disease: {
    color: "#2e7d32"
  },

  explanation: {
    marginTop: "10px",
    lineHeight: "1.6",
    whiteSpace: "pre-line"
  }
};