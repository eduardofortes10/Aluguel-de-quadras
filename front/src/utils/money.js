// src/utils/money.js
export function parsePrecoBR(value) {
  // aceita 200, "200", "R$ 200", "200,00", "200.00"
  if (value == null) return 0;
  if (typeof value === "number") return value;

  const only = String(value).replace(/[^\d,.,,]/g, ""); // mantém dígitos . ,
  // se vier no formato brasileiro "200,00"
  if (only.includes(",") && !only.includes(".")) {
    return parseFloat(only.replace(/\./g, "").replace(",", ".")) || 0;
  }
  // formato "200.00" ou "200"
  return parseFloat(only.replace(/,/g, "")) || 0;
}

export function formatBRLHour(value) {
  const n = Math.round(parsePrecoBR(value)); // sem casas decimais
  // força "R$ 200/h"
  return `R$ ${n.toLocaleString("pt-BR")}/h`;
}
