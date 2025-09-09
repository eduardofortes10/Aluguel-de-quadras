// routes/conversas.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// Todas as rotas abaixo exigem autenticação
router.use(auth);

// Utilitários
async function ehParticipante(conversaId, usuarioId) {
  const [rows] = await db.query(
    "SELECT 1 FROM conversas WHERE id = ? AND (cliente_id = ? OR locador_id = ?) LIMIT 1",
    [conversaId, usuarioId, usuarioId]
  );
  return rows.length > 0;
}

async function getConversa(conversaId) {
  const [[row]] = await db.query(
    "SELECT id, cliente_id, locador_id, data_inicio FROM conversas WHERE id = ?",
    [conversaId]
  );
  return row || null;
}

// Criar conversa (se não existir) e inserir mensagem
router.post("/", async (req, res) => {
  try {
    let { cliente_id, locador_id, mensagem } = req.body;

    // Sanitização básica
    cliente_id = Number(cliente_id);
    locador_id = Number(locador_id);
    const autor_id = Number(req.user.id);
    const texto = String(mensagem || "").trim();

    if (!cliente_id || !locador_id || cliente_id === locador_id) {
      return res.status(400).json({ erro: "cliente_id e locador_id válidos e distintos são obrigatórios." });
    }
    if (!texto) {
      return res.status(400).json({ erro: "mensagem é obrigatória." });
    }
    // Autor precisa ser participante (cliente OU locador)
    if (autor_id !== cliente_id && autor_id !== locador_id) {
      return res.status(403).json({ erro: "Você não pode enviar mensagem em uma conversa de terceiros." });
    }

    // Garante unicidade (recomenda-se UNIQUE KEY (cliente_id, locador_id) na tabela)
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
      [conversaId, autor_id, texto]
    );

    // Notificação simples para o outro participante
    const destinatario_id = autor_id === cliente_id ? locador_id : cliente_id;
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

// Mensagens da conversa (apenas para participantes)
router.get("/mensagens/:conversa_id", async (req, res) => {
  const conversa_id = Number(req.params.conversa_id);
  try {
    if (!conversa_id) return res.status(400).json({ erro: "conversa_id inválido." });

    const participante = await ehParticipante(conversa_id, req.user.id);
    if (!participante) return res.status(403).json({ erro: "Acesso negado às mensagens desta conversa." });

    const [rows] = await db.query(
      "SELECT id, conversa_id, autor_id, mensagem, data_envio FROM mensagens WHERE conversa_id = ? ORDER BY data_envio ASC",
      [conversa_id]
    );

    // Compat: adiciona lida=false se a coluna não existir
    const mensagens = rows.map((r) => ({ ...r, lida: r.lida ?? 0 }));
    res.json(mensagens);
  } catch (err) {
    console.error("GET /conversas/mensagens erro:", err);
    res.status(500).json({ erro: "Erro ao buscar mensagens." });
  }
});

// Lista das últimas conversas do usuário (compat mantém :usuario_id, mas valida)
router.get("/ultimas/:usuario_id", async (req, res) => {
  const paramId = Number(req.params.usuario_id);
  const usuario_id = Number(req.user.id);
  try {
    if (!paramId || paramId !== usuario_id) {
      return res.status(403).json({ erro: "Você só pode listar suas próprias conversas." });
    }

    const [rows] = await db.query(
      `
      SELECT 
        c.id AS conversa_id,
        c.cliente_id,
        c.locador_id,
        u.id   AS outro_usuario_id,
        u.nome AS nome,
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

// Marcar mensagens como lidas (se coluna existir), apenas para participante
router.patch("/mensagens/ler/:conversa_id", async (req, res) => {
  const conversa_id = Number(req.params.conversa_id);
  try {
    if (!conversa_id) return res.status(400).json({ erro: "conversa_id inválido." });

    const participante = await ehParticipante(conversa_id, req.user.id);
    if (!participante) return res.status(403).json({ erro: "Acesso negado." });

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
        [conversa_id, req.user.id]
      );
    }
    res.sendStatus(204);
  } catch (err) {
    console.error("PATCH /conversas/mensagens/ler erro:", err);
    res.sendStatus(204);
  }
});

// Excluir uma mensagem (somente autor pode deletar)
router.delete("/mensagens/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    if (!id) return res.status(400).json({ erro: "id inválido." });

    const [[msg]] = await db.query(
      "SELECT m.id, m.autor_id, m.conversa_id FROM mensagens m WHERE m.id = ?",
      [id]
    );
    if (!msg) return res.status(404).json({ erro: "Mensagem não encontrada." });
    if (Number(msg.autor_id) !== Number(req.user.id)) {
      return res.status(403).json({ erro: "Você só pode excluir suas próprias mensagens." });
    }

    await db.query("DELETE FROM mensagens WHERE id = ?", [id]);
    res.json({ sucesso: true });
  } catch (err) {
    console.error("DELETE /conversas/mensagens erro:", err);
    res.status(500).json({ erro: "Erro ao excluir mensagem." });
  }
});

// Excluir conversa (participante pode excluir o histórico da conversa)
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    if (!id) return res.status(400).json({ erro: "id inválido." });

    const conversa = await getConversa(id);
    if (!conversa) return res.status(404).json({ erro: "Conversa não encontrada." });

    if (Number(conversa.cliente_id) !== Number(req.user.id) &&
        Number(conversa.locador_id) !== Number(req.user.id)) {
      return res.status(403).json({ erro: "Você não pode excluir conversa de terceiros." });
    }

    await db.query("DELETE FROM mensagens WHERE conversa_id = ?", [id]);
    await db.query("DELETE FROM conversas WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("DELETE /conversas erro:", err);
    res.status(500).json({ erro: "Erro ao deletar conversa." });
  }
});

module.exports = router;
