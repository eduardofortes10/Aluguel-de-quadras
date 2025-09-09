// src/services/notificacoes.js
import { api } from "./api";

// Lista TODAS as notificações do usuário logado (id vem do token)
export function getNotificacoes() {
  return api.get("/notificacoes");
}

// Cria uma notificação (o backend pega o usuario_id do token se não mandar)
export function enviarNotificacao({ usuario_id, tipo, mensagem }) {
  // Se você não passar usuario_id, o backend deve usar req.user.id
  return api.post("/notificacoes", { usuario_id, tipo, mensagem });
}

// Marca todas como lidas
export function marcarNotificacoesLidas() {
  return api.patch("/notificacoes/marcar-lidas");
}

// Contagem de não lidas (se existir no backend)
export function contarNaoLidas() {
  return api.get("/notificacoes/nao-lidas");
}

// Remove uma notificação específica
export function deleteNotificacao(id) {
  return api.delete(`/notificacoes/${id}`);
}
