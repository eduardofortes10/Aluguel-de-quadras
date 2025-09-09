// src/services/api.js
import axios from "axios";

// 👉 Defina isso na Vercel:
const API_FROM_ENV = (import.meta.env.VITE_API_URL || "").trim();          // ex.: https://SEU-BACK.onrender.com/api
const FILES_FROM_ENV = (import.meta.env.VITE_FILES_ORIGIN || "").trim();   // ex.: https://SEU-BACK.onrender.com

// Defaults de segurança (troque pro seu domínio da Render, se quiser)
const ABSOLUTE_DEFAULT = "https://aluguel-de-quadras.onrender.com/api";
const baseURL = (API_FROM_ENV || ABSOLUTE_DEFAULT).replace(/\/+$/, "");

// Se não informarem VITE_FILES_ORIGIN, derivamos da API removendo o /api do fim
const derivedFilesOrigin = baseURL.replace(/\/api\/?$/i, "");
const filesOrigin = (FILES_FROM_ENV || derivedFilesOrigin).replace(/\/+$/, "");

export const api = axios.create({
  baseURL,
  withCredentials: true, // deixe true se usar cookies de sessão; se usar só Authorization, pode ser false
  headers: { Accept: "application/json" }
});

// Helper robusto para montar URL de arquivo
export function fileURL(p = "") {
  if (!p) return "";
  const s = String(p).trim();

  // se já é absoluta, retorna como está
  if (/^https?:\/\//i.test(s)) return s;

  // normaliza caminhos armazenados de formas diferentes
  // exemplos que viram "/uploads/xyz.png": "uploads/xyz.png", "/uploads/xyz.png", "/var/.../uploads/xyz.png"
  const idx = s.indexOf("/uploads/");
  const rel = idx >= 0 ? s.slice(idx) : (s.startsWith("/") ? s : `/${s}`);

  return `${filesOrigin}${rel}`;
}

// Debug opcional no browser
if (typeof window !== "undefined") {
  window.__API_BASE__ = baseURL;
  window.__FILES_ORIGIN__ = filesOrigin;
  console.log("[api] baseURL =", baseURL);
  console.log("[api] filesOrigin =", filesOrigin);
}
// após export const api = axios.create({ baseURL: ... })
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
