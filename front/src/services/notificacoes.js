// src/services/notificacoes.js
import { api } from "./api";

export function getNotificacoes() {
  return api.get("/notificacoes");
}
export function enviarNotificacao({ usuario_id, tipo, mensagem }) {
  // Se o backend já pega o id do token, você pode omitir usuario_id
  return api.post("/notificacoes", { usuario_id, tipo, mensagem });
}
export function marcarNotificacoesLidas() {
  return api.patch("/notificacoes/marcar-lidas");
}
export function contarNaoLidas() {
  return api.get("/notificacoes/nao-lidas");
}
export function deleteNotificacao(id) {
  return api.delete(`/notificacoes/${id}`);
}
