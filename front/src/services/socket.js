// src/services/socket.js
import { io } from "socket.io-client";

// Pega do Vite ou cai no origin da API sem /api
const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL || "").trim() ||
  (import.meta.env.VITE_FILES_ORIGIN || "").trim() ||
  (import.meta.env.VITE_API_URL || "").trim().replace(/\/api\/?$/, "");

if (!SOCKET_URL) {
  console.warn("[socket] VITE_SOCKET_URL não definido.");
}

let socket;

// Singleton para não criar várias conexões
export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"], // segura em ambientes com proxy
      withCredentials: true,
    });

    // Logs básicos
    socket.on("connect", () => console.log("[socket] conectado", socket.id));
    socket.on("disconnect", (r) => console.log("[socket] desconectado", r));
    socket.on("connect_error", (e) => console.error("[socket] erro", e?.message || e));
  }
  return socket;
}
