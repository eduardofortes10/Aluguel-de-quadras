// src/utils/imagens.js
import { fileURL } from "../services/api";

// defina o fallback para uma imagem real existente em public/quadras/
const FALLBACK = "/quadras/quadra1.png";

export function resolveImagemQuadra(q) {
  if (!q) return FALLBACK;

  // 1) campo direto
  if (q.imagem) {
    if (/^https?:\/\//i.test(q.imagem)) return q.imagem;
    if (q.imagem.includes("/uploads/") || q.imagem.startsWith("/")) return fileURL(q.imagem);
    return `/quadras/${q.imagem}`;
  }

  // 2) campo imagem_url
  if (q.imagem_url) {
    if (/^https?:\/\//i.test(q.imagem_url)) return q.imagem_url;
    if (q.imagem_url.includes("/uploads/") || q.imagem_url.startsWith("/")) return fileURL(q.imagem_url);
    return `/quadras/${q.imagem_url}`;
  }

  // 3) lista de imagens
  if (Array.isArray(q.imagens)) {
    for (let c of q.imagens) {
      if (!c) continue;
      const s = String(c).trim().replace(/\\/g, "/");
      if (/^https?:\/\//i.test(s)) return s;
      if (s.includes("/uploads/") || s.startsWith("/")) return fileURL(s);
      return `/quadras/${s}`;
    }
  }

  // fallback
  return FALLBACK;
}

// utils/preco.js (ou dentro do CourtCard/QuadraDetalhes)
export function precoToNumberAny(v) {
  if (typeof v === "number") return v;
  const s = String(v || "")
    .replace(/\s*\/\s*hora\b/gi, "")
    .replace(/\s*\/\s*h\b/gi, "")
    .replace(/[^\d.,-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}
