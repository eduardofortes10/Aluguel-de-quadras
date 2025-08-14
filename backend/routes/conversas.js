// backend/routes/conversas.js
const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * POST /api/conversas
 * Cria (se necessário) e envia uma mensagem.
 * Body: { cliente_id, locador_id, autor_id, mensagem }
 */
router.post("/", async (req, res) => {
  const { cliente_id, locador_id, autor_id, mensagem } = req.body || {};

  if (!cliente_id || !locador_id || !autor_id || !mensagem) {
    return res.status(400).json({ erro: "Campos obrigatórios: cliente_id, locador_id, autor_id, mensagem." });
  }

  try {
    // Verifica se já existe conversa entre as duas pessoas
    const [exist] = await db.query(
      "SELECT id FROM conversas WHERE cliente_id = ? AND locador_id = ? LIMIT 1",
      [cliente_id, locador_id]
    );

    let conversaId = exist?.[0]?.id || null;

    if (!conversaId) {
      const [ins] = await db.query(
        "INSERT INTO conversas (cliente_id, locador_id, data_inicio) VALUES (?, ?, NOW())",
        [cliente_id, locador_id]
      );
      conversaId = ins.insertId;
    }

    // Insere mensagem
    await db.query(
      "INSERT INTO mensagens (conversa_id, autor_id, mensagem, data_envio) VALUES (?, ?, ?, NOW())",
      [conversaId, autor_id, mensagem]
    );

    // Notificação para o outro participante
    const destinatario_id = autor_id === Number(cliente_id) ? Number(locador_id) : Number(cliente_id);
    await db.query(
      "INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES (?, ?, ?)",
      [destinatario_id, "mensagem", "Você recebeu uma nova mensagem."]
    );

    res.status(201).json({ sucesso: true, conversa_id: conversaId });
  } catch (err) {
    console.error("POST /conversas erro:", err);
    res.status(500).json({ erro: "Erro ao criar conversa ou mensagem." });
  }
});

/**
 * GET /api/conversas/mensagens/:conversa_id
 * Lista mensagens de uma conversa
 */
router.get("/mensagens/:conversa_id", async (req, res) => {
  const { conversa_id } = req.params;
  try {
    const [msgs] = await db.query(
      "SELECT id, conversa_id, autor_id, mensagem, data_envio, lida FROM mensagens WHERE conversa_id = ? ORDER BY data_envio ASC",
      [conversa_id]
    );
    res.json(msgs);
  } catch (err) {
    console.error("GET /conversas/mensagens erro:", err);
    res.status(500).json({ erro: "Erro ao buscar mensagens." });
  }
});

/**
 * GET /api/conversas/ultimas/:usuario_id
 * Lista as conversas do usuário com o nome do outro participante e última mensagem
 */
router.get("/ultimas/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const sql = `
      SELECT
        c.id AS conversa_id,
        c.cliente_id,
        c.locador_id,
        CASE 
          WHEN c.cliente_id = ? THEN u2.nome
          ELSE u1.nome
        END AS nome,
        lm.mensagem AS ultima_mensagem,
        lm.data_envio AS ultima_data
      FROM conversas c
      LEFT JOIN usuarios u1 ON u1.id = c.cliente_id
      LEFT JOIN usuarios u2 ON u2.id = c.locador_id
      LEFT JOIN (
        SELECT m.*
        FROM mensagens m
        INNER JOIN (
          SELECT conversa_id, MAX(data_envio) AS max_data
          FROM mensagens
          GROUP BY conversa_id
        ) ult ON ult.conversa_id = m.conversa_id AND ult.max_data = m.data_envio
      ) lm ON lm.conversa_id = c.id
      WHERE c.cliente_id = ? OR c.locador_id = ?
      ORDER BY COALESCE(lm.data_envio, c.data_inicio) DESC
    `;
    const [rows] = await db.query(sql, [usuario_id, usuario_id, usuario_id]);

    res.json(rows);
  } catch (err) {
    console.error("GET /conversas/ultimas erro:", err);
    res.status(500).json({ erro: "Erro ao buscar conversas." });
  }
});

/**
 * DELETE /api/conversas/mensagens/:id
 * Exclui uma mensagem
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
 * Exclui a conversa (e, por FK, apaga as mensagens)
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM conversas WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("DELETE /conversas erro:", err);
    res.status(500).json({ erro: "Erro ao deletar conversa." });
  }
});

module.exports = router;
