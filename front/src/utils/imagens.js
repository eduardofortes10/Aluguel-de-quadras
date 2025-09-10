// src/utils/imagens.js
import { fileURL } from "../services/api";

export function resolveImagemQuadra(q) {
  if (!q) return "/quadras/sem-imagem.png";

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
  return "/quadras/sem-imagem.png";
}
