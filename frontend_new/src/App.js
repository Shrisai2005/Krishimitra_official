import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import DiseaseDetection from "./pages/DiseaseDetection";
import Weather from "./pages/Weather";
import Schemes from "./pages/Schemes";
import Market from "./pages/Market";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/disease" element={<DiseaseDetection />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/market" element={<Market />} />
      </Routes>
    </Router>
  );
}

export default App;