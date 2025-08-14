// backend/routes/conversas.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Helpers
const asInt = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};
const hasText = (s) => typeof s === "string" && s.trim().length > 0;

// Cria (se necessário) e retorna uma conversa única entre cliente/locador
async function getOrCreateConversa(cliente_id, locador_id) {
  const cId = asInt(cliente_id);
  const lId = asInt(locador_id);
  if (!cId || !lId) throw new Error("IDs inválidos");

  // procura conversa existente em ambos os sentidos
  const [found] = await db.query(
    `SELECT id, cliente_id, locador_id
       FROM conversas
      WHERE (cliente_id = ? AND locador_id = ?)
         OR (cliente_id = ? AND locador_id = ?)
      LIMIT 1`,
    [cId, lId, lId, cId]
  );

  if (found.length) return found[0];

  const [ins] = await db.query(
    `INSERT INTO conversas (cliente_id, locador_id, data_inicio)
     VALUES (?, ?, NOW())`,
    [cId, lId]
  );
  return { id: ins.insertId, cliente_id: cId, locador_id: lId };
}

/**
 * POST /api/conversas
 * Body: { cliente_id, locador_id, autor_id, mensagem }
 */
router.post("/", async (req, res) => {
  try {
    const cliente_id = asInt(req.body?.cliente_id);
    const locador_id = asInt(req.body?.locador_id);
    const autor_id = asInt(req.body?.autor_id);
    const mensagem = req.body?.mensagem;

    if (!cliente_id || !locador_id || !autor_id || !hasText(mensagem)) {
      return res.status(400).json({ erro: "Campos obrigatórios: cliente_id, locador_id, autor_id, mensagem." });
    }

    const conversa = await getOrCreateConversa(cliente_id, locador_id);

    await db.query(
      `INSERT INTO mensagens (conversa_id, autor_id, mensagem, data_envio)
       VALUES (?, ?, ?, NOW())`,
      [conversa.id, autor_id, mensagem.trim()]
    );

    // notificação simples
    const destinatario_id = autor_id === cliente_id ? locador_id : cliente_id;
    await db.query(
      `INSERT INTO notificacoes (usuario_id, tipo, mensagem)
       VALUES (?, ?, ?)`,
      [destinatario_id, "mensagem", "Você recebeu uma nova mensagem."]
    );

    // última mensagem inserida
    const [[last]] = await db.query(
      `SELECT id, conversa_id, autor_id, mensagem, data_envio
         FROM mensagens
        WHERE conversa_id = ?
        ORDER BY id DESC
        LIMIT 1`,
      [conversa.id]
    );

    res.status(201).json({
      sucesso: true,
      conversa_id: conversa.id,
      cliente_id: conversa.cliente_id,
      locador_id: conversa.locador_id,
      ultima_mensagem: last?.mensagem || null,
      data_envio: last?.data_envio || null,
    });
  } catch (err) {
    console.error("POST /conversas erro:", err);
    res.status(500).json({ erro: "Erro ao criar conversa ou mensagem." });
  }
});

/**
 * GET /api/conversas/mensagens/:conversa_id
 * Lista mensagens (ordenadas)
 */
router.get("/mensagens/:conversa_id", async (req, res) => {
  const conversa_id = asInt(req.params.conversa_id);
  if (!conversa_id) return res.status(400).json({ erro: "conversa_id inválido" });

  try {
    const [mensagens] = await db.query(
      `SELECT id, conversa_id, autor_id, mensagem, data_envio
         FROM mensagens
        WHERE conversa_id = ?
        ORDER BY id ASC`,
      [conversa_id]
    );
    res.json(mensagens || []);
  } catch (err) {
    console.error("GET /conversas/mensagens erro:", err);
    res.status(500).json({ erro: "Erro ao buscar mensagens." });
  }
});

/**
 * GET /api/conversas/ultimas/:usuario_id
 * Lista conversas de um usuário + última msg
 * Retorna: conversa_id, cliente_id, locador_id, nome (outro participante), ultima_mensagem, data_envio
 */
router.get("/ultimas/:usuario_id", async (req, res) => {
  const usuario_id = asInt(req.params.usuario_id);
  if (!usuario_id) return res.status(400).json({ erro: "usuario_id inválido" });

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
      ORDER BY data_envio DESC NULLS LAST
      `,
      [usuario_id, usuario_id, usuario_id]
    );

    res.json(conversas || []);
  } catch (err) {
    console.error("GET /conversas/ultimas erro:", err);
    res.status(500).json({ erro: "Erro ao buscar conversas." });
  }
});

/**
 * DELETE /api/conversas/mensagens/:id  — apaga UMA mensagem
 */
router.delete("/mensagens/:id", async (req, res) => {
  const id = asInt(req.params.id);
  if (!id) return res.status(400).json({ erro: "id inválido" });

  try {
    const [r] = await db.query(`DELETE FROM mensagens WHERE id = ?`, [id]);
    if (r.affectedRows === 0) return res.status(404).json({ erro: "Mensagem não encontrada" });
    res.json({ sucesso: true });
  } catch (err) {
    console.error("DELETE /conversas/mensagens/:id erro:", err);
    res.status(500).json({ erro: "Erro ao excluir mensagem." });
  }
});

/**
 * DELETE /api/conversas/:id — apaga conversa inteira + mensagens
 */
router.delete("/:id", async (req, res) => {
  const id = asInt(req.params.id);
  if (!id) return res.status(400).json({ erro: "id inválido" });

  try {
    await db.query(`DELETE FROM mensagens WHERE conversa_id = ?`, [id]);
    const [r] = await db.query(`DELETE FROM conversas WHERE id = ?`, [id]);
    if (r.affectedRows === 0) return res.status(404).json({ erro: "Conversa não encontrada" });
    res.sendStatus(204);
  } catch (err) {
    console.error("DELETE /conversas/:id erro:", err);
    res.status(500).json({ erro: "Erro ao deletar conversa" });
  }
});

module.exports = router;
