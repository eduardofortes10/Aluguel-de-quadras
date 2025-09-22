// src/services/api.js
import axios from "axios";

// Vars vindas do Vite/Vercel
const API_FROM_ENV = (import.meta.env.VITE_API_URL || "").trim();          // ex.: https://SEU-BACK.onrender.com/api
const FILES_FROM_ENV = (import.meta.env.VITE_FILES_ORIGIN || "").trim();   // ex.: https://SEU-BACK.onrender.com

// ⚠️ Falhar cedo se a API não foi configurada (evita cair num default silencioso)
if (!API_FROM_ENV) {
  // Em produção, apenas loga; em dev, ajuda a perceber a falta de env
  console.warn("[api] VITE_API_URL não definido. Configure nas variáveis do Vite/Vercel.");
}
const baseURL = (API_FROM_ENV || "").replace(/\/+$/, "");

// Deriva origin de arquivos removendo o /api do fim, se não foi informado
const derivedFilesOrigin = baseURL ? baseURL.replace(/\/api\/?$/i, "") : "";
const filesOrigin = (FILES_FROM_ENV || derivedFilesOrigin).replace(/\/+$/, "");

// Axios instance
export const api = axios.create({
  baseURL,
  withCredentials: false, // ✅ usando somente Authorization (sem cookies)
  headers: { Accept: "application/json" },
  timeout: 20000,
});

// Anexa JWT se existir
api.interceptors.request.use((config) => {
  try {
    const t = localStorage.getItem("token");
    if (t) config.headers.Authorization = `Bearer ${t}`;
  } catch {}
  return config;
});

// Log simples de erro (opcional)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== "undefined") {
      console.debug("[api:erro]", err?.response?.status, err?.config?.url, err?.response?.data);
    }
    return Promise.reject(err);
  }
);

// Monta URL de arquivo do backend (/uploads, /avatars), normalizando contrabarras
export function fileURL(p = "") {
  if (!p) return "";
  let s = String(p).trim().replace(/\\/g, "/");

  // já é absoluta?
  if (/^https?:\/\//i.test(s)) return s;

  // normaliza caminhos tipo "uploads/xyz.png", "/uploads/xyz.png", "C:/.../uploads/xyz.png"
  const uploadsIdx = s.toLowerCase().indexOf("/uploads/");
  const avatarsIdx = s.toLowerCase().indexOf("/avatars/");
  let rel = "";

  if (uploadsIdx >= 0) rel = s.slice(uploadsIdx);
  else if (avatarsIdx >= 0) rel = s.slice(avatarsIdx);
  else rel = s.startsWith("/") ? s : `/${s}`;

  return `${filesOrigin}${rel}`;
}

// Debug (desativar em prod se quiser)
if (typeof window !== "undefined") {
  window.__API_BASE__ = baseURL;
  window.__FILES_ORIGIN__ = filesOrigin;
  console.log("[api] baseURL =", baseURL || "(NÃO DEFINIDO)");
  console.log("[api] filesOrigin =", filesOrigin || "(NÃO DEFINIDO)");
}
