// routes/conversas.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Criar conversa (se não existir) e inserir mensagem
router.post("/", async (req, res) => {
  const { cliente_id, locador_id, autor_id, mensagem } = req.body;
  try {
    // procura conversa existente
    const [exist] = await db.query(
      "SELECT id FROM conversas WHERE cliente_id = ? AND locador_id = ?",
      [cliente_id, locador_id]
    );
    let conversaId = exist.length ? exist[0].id : null;

    if (!conversaId) {
      const [nova] = await db.query(
        "INSERT INTO conversas (cliente_id, locador_id, data_inicio) VALUES (?, ?, NOW())",
        [cliente_id, locador_id]
      );
      conversaId = nova.insertId;
    }

    await db.query(
      "INSERT INTO mensagens (conversa_id, autor_id, mensagem, data_envio) VALUES (?, ?, ?, NOW())",
      [conversaId, autor_id, mensagem]
    );

    // notificação básica (opcional)
    const destinatario_id = autor_id === Number(cliente_id) ? locador_id : cliente_id;
    await db.query(
      "INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES (?, 'mensagem', 'Você recebeu uma nova mensagem.')",
      [destinatario_id]
    );

    res.status(201).json({ sucesso: true, conversa_id: conversaId });
  } catch (err) {
    console.error("POST /conversas erro:", err);
    res.status(500).json({ erro: "Erro ao criar conversa ou mensagem." });
  }
});

// Mensagens da conversa (ORDENA E **SEM** coluna lida)
router.get("/mensagens/:conversa_id", async (req, res) => {
  const { conversa_id } = req.params;
  try {
    const [rows] = await db.query(
      // 👇 ATENÇÃO: espaço entre 'mensagens' e 'WHERE'
      "SELECT id, conversa_id, autor_id, mensagem, data_envio FROM mensagens WHERE conversa_id = ? ORDER BY data_envio ASC",
      [conversa_id]
    );

    // Para o front não quebrar, adiciona lida=false (não existe no DB)
    const mensagens = rows.map((r) => ({ ...r, lida: 0 }));
    res.json(mensagens);
  } catch (err) {
    console.error("GET /conversas/mensagens erro:", err);
    res.status(500).json({ erro: "Erro ao buscar mensagens." });
  }
});

// Lista das últimas conversas do usuário (alinha os nomes/aliases com o front)
router.get("/ultimas/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [rows] = await db.query(
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

    res.json(rows);
  } catch (err) {
    console.error("GET /conversas/ultimas erro:", err);
    res.status(500).json({ erro: "Erro ao buscar conversas." });
  }
});

// Marcar como lidas (NO-OP se não existir coluna 'lida')
router.patch("/mensagens/ler/:conversa_id", async (req, res) => {
  const { conversa_id } = req.params;
  const { usuario_id } = req.body || {};
  try {
    // Verifica se a coluna 'lida' existe; se existir, marca.
    const [cols] = await db.query(
      `SELECT COUNT(*) AS ok
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'mensagens'
         AND COLUMN_NAME = 'lida'`
    );
    const temLida = cols?.[0]?.ok > 0;

    if (temLida) {
      await db.query(
        "UPDATE mensagens SET lida = 1 WHERE conversa_id = ? AND autor_id <> ?",
        [conversa_id, usuario_id || 0]
      );
    }
    res.sendStatus(204);
  } catch (err) {
    console.error("PATCH /conversas/mensagens/ler erro:", err);
    // Mesmo que falhe, não bloqueia o front:
    res.sendStatus(204);
  }
});

// Excluir uma mensagem
router.delete("/mensagens/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM mensagens WHERE id = ?", [req.params.id]);
    res.json({ sucesso: true });
  } catch (err) {
    console.error("DELETE /conversas/mensagens erro:", err);
    res.status(500).json({ erro: "Erro ao excluir mensagem." });
  }
});

// Excluir conversa (e suas mensagens)
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
