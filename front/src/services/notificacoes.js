// src/services/notificacoes.js
import { api } from "./api";

// cria/enfileira uma notificação para um usuário
export async function enviarNotificacao({ usuario_id, tipo, mensagem }) {
  return api.post("/notificacoes", { usuario_id, tipo, mensagem });
}

// busca todas as notificações do usuário
export async function getNotificacoes(usuario_id) {
  return api.get(`/notificacoes/${usuario_id}`);
}

// apaga uma notificação
export async function deleteNotificacao(notificacao_id) {
  return api.delete(`/notificacoes/${notificacao_id}`);
}

// (opcional) apaga todas as notificações do usuário, se seu backend tiver essa rota
export async function clearNotificacoesUsuario(usuario_id) {
  return api.delete(`/notificacoes/usuario/${usuario_id}`);
}
