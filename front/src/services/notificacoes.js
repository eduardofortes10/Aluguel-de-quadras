// src/services/notificacoes.js
import { api } from "./api";

// Lista TODAS as notificações do usuário logado (id vem do token)
export function getNotificacoes() {
  return api.get("/notificacoes");
}

// Remove uma notificação específica
export function deleteNotificacao(id) {
  return api.delete(`/notificacoes/${id}`);
}
