// src/utils/preco.js
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
