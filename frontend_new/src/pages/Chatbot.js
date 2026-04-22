import { useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";
import axios from "axios";

function Chatbot() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  // 🔊 SPEAK
  const handleSpeak = (text, index) => {
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    if (text.match(/[ಅ-ೞ]/)) speech.lang = "kn-IN";
    else if (text.match(/[ऀ-ॿ]/)) speech.lang = "hi-IN";
    else speech.lang = "en-US";

    speech.onend = () => setSpeakingIndex(null);

    window.speechSynthesis.speak(speech);
    setSpeakingIndex(index);
  };

  // 🎤 VOICE INPUT
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setMessage(text);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const toggleMic = () => {
    listening ? stopListening() : startListening();
  };

  // 💬 SEND
  const sendMessage = async () => {
    if (!message) return;

    setChat((prev) => [...prev, { type: "user", text: message }]);

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/chat?query=${message}`
      );

      const reply = res.data.data.response;

      setChat((prev) => [...prev, { type: "bot", text: reply }]);
    } catch {
      alert("Error connecting to backend");
    }

    setMessage("");
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>⬅</button>
        <h2>🤖 KrishiMitra Assistant</h2>
      </div>

      {/* CHAT BOX */}
      <div style={styles.chatBox}>
        {chat.length === 0 && (
          <p style={styles.emptyText}>
            👋 Ask anything about crops, disease, weather...
          </p>
        )}

        {chat.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.messageRow,
              justifyContent: msg.type === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                background: msg.type === "user" ? "#2e7d32" : "#ffffff",
                color: msg.type === "user" ? "white" : "black"
              }}
            >
              {msg.text}

              {/* 🔊 ICON */}
              <div
                onClick={() => handleSpeak(msg.text, i)}
                style={styles.speaker}
              >
                {speakingIndex === i ? "🔇" : "🔊"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT AREA */}
      <div style={styles.inputBox}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type or speak..."
          style={styles.input}
        />

        <button
          onClick={toggleMic}
          style={{
            ...styles.mic,
            background: listening ? "red" : "#2196F3"
          }}
        >
          🎤
        </button>

        <button onClick={sendMessage} style={styles.send}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default Chatbot;

const styles = {
  page: {
    background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "10px"
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  backBtn: {
    padding: "5px 10px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    marginTop: "10px"
  },

  emptyText: {
    textAlign: "center",
    color: "#888"
  },

  messageRow: {
    display: "flex",
    marginBottom: "10px"
  },

  messageBubble: {
    padding: "12px",
    borderRadius: "15px",
    maxWidth: "70%",
    position: "relative",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },

  speaker: {
    position: "absolute",
    bottom: "-18px",
    right: "5px",
    cursor: "pointer"
  },

  inputBox: {
    display: "flex",
    gap: "5px",
    marginTop: "10px"
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc"
  },

  mic: {
    padding: "10px",
    borderRadius: "10px",
    color: "white",
    border: "none"
  },

  send: {
    padding: "10px 15px",
    borderRadius: "10px",
    background: "#2e7d32",
    color: "white",
    border: "none"
  }
};