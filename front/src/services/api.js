// src/services/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export const fileURL = (p) =>
  `${import.meta.env.VITE_FILES_ORIGIN || ""}${p || ""}`;
