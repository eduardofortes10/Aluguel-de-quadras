// backend/routes/conversas.js
const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * Helper: encontra ou cria uma conversa entre cliente_id e locador_id.
 * Retorna { id, wasCreated }
 */
async function getOrCreateConversa(cliente_id, locador_id) {
  // procura conversa existente (garantindo a ordem cliente/locador)
  const [rows] = await db.query(
    "SELECT id FROM conversas WHERE cliente_id = ? AND locador_id = ? LIMIT 1",
    [cliente_id, locador_id]
  );

  if (rows.length) {
    return { id: rows[0].id, wasCreated: false };
  }

  // cria se não existir
  const [ins] = await db.query(
    "INSERT INTO conversas (cliente_id, locador_id, data_inicio) VALUES (?, ?, NOW())",
    [cliente_id, locador_id]
  );
  return { id: ins.insertId, wasCreated: true };
}

/**
 * POST /api/conversas
 * Cria (se necessário) a conversa e grava uma mensagem.
 * body: { cliente_id, locador_id, autor_id, mensagem? }
 * - Se a conversa for nova e 'mensagem' vier vazia, enviamos uma mensagem automática.
 */
router.post("/", async (req, res) => {
  try {
    let { cliente_id, locador_id, autor_id, mensagem } = req.body || {};

    // validação simples
    cliente_id = Number(cliente_id);
    locador_id = Number(locador_id);
    autor_id = Number(autor_id);

    if (!cliente_id || !locador_id || !autor_id) {
      return res.status(400).json({ erro: "cliente_id, locador_id e autor_id são obrigatórios." });
    }

    const { id: conversaId, wasCreated } = await getOrCreateConversa(cliente_id, locador_id);

    // mensagem automática se conversa acabou de ser criada e não veio texto
    if (!mensagem || !String(mensagem).trim()) {
      mensagem = wasCreated ? "Olá, gostaria de saber mais sobre o aluguel." : "";
    }

    if (mensagem) {
      await db.query(
        "INSERT INTO mensagens (conversa_id, autor_id, mensagem, data_envio, lida) VALUES (?, ?, ?, NOW(), 0)",
        [conversaId, autor_id, String(mensagem).trim()]
      );

      // notifica o destinatário
      const destinatario_id = autor_id === cliente_id ? locador_id : cliente_id;
      await db.query(
        "INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES (?, ?, ?)",
        [destinatario_id, "mensagem", "Você recebeu uma nova mensagem."]
      );
    }

    res.status(201).json({ sucesso: true, conversa_id: conversaId, nova: wasCreated });
  } catch (err) {
    console.error("POST /conversas erro:", err);
    res.status(500).json({ erro: "Erro ao criar conversa ou mensagem." });
  }
});

/**
 * GET /api/conversas/mensagens/:conversa_id
 * Lista mensagens (inclui 'lida')
 */
router.get("/mensagens/:conversa_id", async (req, res) => {
  const { conversa_id } = req.params;
  try {
    const [mensagens] = await db.query(
      "SELECT id, conversa_id, autor_id, mensagem, data_envio, lida FROM mensagensWHERE conversa_id = ? ORDER BY data_envio ASC",
      [conversa_id]
    );
    res.json(mensagens);
  } catch (err) {
    console.error("GET /conversas/mensagens erro:", err);
    res.status(500).json({ erro: "Erro ao buscar mensagens." });
  }
});

/**
 * PATCH /api/conversas/mensagens/ler/:conversa_id
 * Marca como lidas as mensagens da conversa para o usuário que abriu.
 * body: { usuario_id }
 */
router.patch("/mensagens/ler/:conversa_id", async (req, res) => {
  const { conversa_id } = req.params;
  const usuario_id = Number(req.body?.usuario_id);
  if (!usuario_id) return res.status(400).json({ erro: "usuario_id é obrigatório." });

  try {
    await db.query(
      "UPDATE mensagens SET lida = 1 WHERE conversa_id = ? AND autor_id <> ? AND lida = 0",
      [conversa_id, usuario_id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("PATCH /conversas/mensagens/ler erro:", err);
    res.status(500).json({ erro: "Erro ao marcar mensagens como lidas." });
  }
});

/**
 * GET /api/conversas/ultimas/:usuario_id
 * Lista as conversas do usuário com a última mensagem e o nome do outro participante.
 */
router.get("/ultimas/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const [conversas] = await db.query(
      `
      SELECT 
        c.id AS conversa_id,
        c.cliente_id,
        c.locador_id,
        u.nome,
        (
          SELECT m.mensagem 
          FROM mensagens m 
          WHERE m.conversa_id = c.id 
          ORDER BY m.data_envio DESC 
          LIMIT 1
        ) AS ultima_mensagem,
        (
          SELECT m.data_envio 
          FROM mensagens m 
          WHERE m.conversa_id = c.id 
          ORDER BY m.data_envio DESC 
          LIMIT 1
        ) AS data_envio
      FROM conversas c
      JOIN usuarios u 
        ON u.id = IF(c.cliente_id = ?, c.locador_id, c.cliente_id)
      WHERE c.cliente_id = ? OR c.locador_id = ?
      ORDER BY data_envio DESC
      `,
      [usuario_id, usuario_id, usuario_id]
    );

    res.json(conversas);
  } catch (err) {
    console.error("GET /conversas/ultimas erro:", err);
    res.status(500).json({ erro: "Erro ao buscar conversas." });
  }
});

/**
 * DELETE /api/conversas/mensagens/:id
 * Exclui uma única mensagem.
 */
router.delete("/mensagens/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM mensagens WHERE id = ?", [id]);
    res.json({ sucesso: true });
  } catch (err) {
    console.error("DELETE /conversas/mensagens erro:", err);
    res.status(500).json({ erro: "Erro ao excluir mensagem." });
  }
});

/**
 * DELETE /api/conversas/:id
 * Exclui a conversa e TODAS as mensagens dela.
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM mensagens WHERE conversa_id = ?", [id]);
    await db.query("DELETE FROM conversas WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("DELETE /conversas erro:", err);
    res.status(500).json({ erro: "Erro ao deletar conversa." });
  }
});

module.exports = router;
