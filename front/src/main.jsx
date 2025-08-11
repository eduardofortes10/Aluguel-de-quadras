// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// garante que a configuração global do axios rode sempre
import "./services/api";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
    <App />
  </BrowserRouter>
);
