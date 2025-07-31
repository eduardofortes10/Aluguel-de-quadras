import axios from "axios";

export const enviarNotificacao = async ({ usuario_id, tipo, mensagem }) => {
  try {
    await axios.post("http://localhost:5000/api/notificacoes", {
      usuario_id,
      tipo,
      mensagem,
    });
  } catch (err) {
    console.error("Erro ao enviar notificação:", err);
  }
};
