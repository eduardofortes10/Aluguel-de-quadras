// src/services/api.js
import axios from "axios";

const ABSOLUTE_DEFAULT = "https://aluguel-de-quadras.onrender.com/api";
const FILES_DEFAULT    = "https://aluguel-de-quadras.onrender.com";

const baseURL = (import.meta.env.VITE_API_URL || ABSOLUTE_DEFAULT).replace(/\/+$/, "");
const filesOrigin = (import.meta.env.VITE_FILES_ORIGIN || FILES_DEFAULT).replace(/\/+$/, "");

export const api = axios.create({ baseURL });

// ajuda de debug no navegador
if (typeof window !== "undefined") {
  window.__API_BASE__ = baseURL;
  window.__FILES_ORIGIN__ = filesOrigin;
  console.log("[api] baseURL =", baseURL);
}

export const fileURL = (p = "") => `${filesOrigin}${p}`;
