// src/services/api.js
import axios from "axios";

const ABSOLUTE_DEFAULT = "https://aluguel-de-quadras.onrender.com/api";
const FILES_DEFAULT   = "https://aluguel-de-quadras.onrender.com";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || ABSOLUTE_DEFAULT,
});

export const fileURL = (p = "") =>
  `${(import.meta.env.VITE_FILES_ORIGIN || FILES_DEFAULT).replace(/\/+$/, "")}${p}`;
