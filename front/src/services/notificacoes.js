// src/services/notificacoes.js
import { api } from "./api";

export function getNotificacoes() {
  return api.get("/notificacoes");
}

export function enviarNotificacao({ tipo, mensagem }) {
  // não manda usuario_id, backend já resolve pelo token
  return api.post("/notificacoes", { tipo, mensagem });
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
