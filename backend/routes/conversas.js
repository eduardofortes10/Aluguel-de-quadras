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

// ===== Criar conversa (se não existir) e inserir PRIMEIRA mensagem =====
router.post("/", async (req, res) => {
  try {
    let { cliente_id, locador_id, mensagem } = req.body;

    // Sanitização
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
    if (autor_id !== cliente_id && autor_id !== locador_id) {
      return res.status(403).json({ erro: "Você não pode enviar mensagem em uma conversa de terceiros." });
    }

    // Garante unicidade (ideal: UNIQUE KEY (cliente_id, locador_id))
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

    const [ins] = await db.query(
      "INSERT INTO mensagens (conversa_id, autor_id, mensagem, data_envio) VALUES (?, ?, ?, NOW())",
      [conversaId, autor_id, texto]
    );

    // Buscar a mensagem recém-criada para emitir completa
    const [[novaMensagem]] = await db.query(
      "SELECT id, conversa_id, autor_id, mensagem, data_envio FROM mensagens WHERE id = ?",
      [ins.insertId]
    );

    // Notificação simples para o outro participante
    const destinatario_id = autor_id === cliente_id ? locador_id : cliente_id;
    await db.query(
      "INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES (?, 'mensagem', 'Você recebeu uma nova mensagem.')",
      [destinatario_id]
    );

    // === Socket.IO: emitir nova mensagem para a sala da conversa ===
    const io = req.app.get("io");
    if (io && novaMensagem) {
      io.to(`conv:${conversaId}`).emit("message:new", novaMensagem);
    }

    res.status(201).json({ sucesso: true, conversa_id: conversaId, mensagem: novaMensagem });
  } catch (err) {
    console.error("POST /conversas erro:", err);
    res.status(500).json({ erro: "Erro ao criar conversa ou mensagem." });
  }
});

// ===== Enviar mensagem em conversa EXISTENTE =====
router.post("/mensagens", async (req, res) => {
  try {
    let { conversa_id, mensagem } = req.body;
    conversa_id = Number(conversa_id);
    const autor_id = Number(req.user.id);
    const texto = String(mensagem || "").trim();

    if (!conversa_id) return res.status(400).json({ erro: "conversa_id inválido." });
    if (!texto) return res.status(400).json({ erro: "mensagem é obrigatória." });

    // Participante?
    const participante = await ehParticipante(conversa_id, autor_id);
    if (!participante) return res.status(403).json({ erro: "Acesso negado: você não participa desta conversa." });

    const [ins] = await db.query(
      "INSERT INTO mensagens (conversa_id, autor_id, mensagem, data_envio) VALUES (?, ?, ?, NOW())",
      [conversa_id, autor_id, texto]
    );

    const [[msg]] = await db.query(
      "SELECT id, conversa_id, autor_id, mensagem, data_envio FROM mensagens WHERE id = ?",
      [ins.insertId]
    );

    // Descobrir outro participante para notificação
    const conversa = await getConversa(conversa_id);
    if (conversa) {
      const destinatario_id = autor_id === conversa.cliente_id ? conversa.locador_id : conversa.cliente_id;
      await db.query(
        "INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES (?, 'mensagem', 'Você recebeu uma nova mensagem.')",
        [destinatario_id]
      );
    }

    // === Socket.IO: emitir nova mensagem ===
    const io = req.app.get("io");
    if (io && msg) {
      io.to(`conv:${conversa_id}`).emit("message:new", msg);
    }

    res.status(201).json(msg);
  } catch (err) {
    console.error("POST /conversas/mensagens erro:", err);
    res.status(500).json({ erro: "Erro ao enviar mensagem." });
  }
});

// ===== Mensagens da conversa (apenas participantes) =====
router.get("/mensagens/:conversa_id", async (req, res) => {
  const conversa_id = Number(req.params.conversa_id);
  try {
    if (!conversa_id) return res.status(400).json({ erro: "conversa_id inválido." });

    const participante = await ehParticipante(conversa_id, req.user.id);
    if (!participante) return res.status(403).json({ erro: "Acesso negado às mensagens desta conversa." });

    const [rows] = await db.query(
      "SELECT id, conversa_id, autor_id, mensagem, data_envio, IFNULL(lida, 0) AS lida FROM mensagens WHERE conversa_id = ? ORDER BY data_envio ASC",
      [conversa_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET /conversas/mensagens erro:", err);
    res.status(500).json({ erro: "Erro ao buscar mensagens." });
  }
});

// ===== Lista das últimas conversas do usuário =====
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

// ===== Marcar mensagens como lidas (se coluna existir) =====
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

// ===== Excluir uma mensagem (somente autor) =====
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

    // === Socket.IO: avisar deleção da mensagem ===
    const io = req.app.get("io");
    if (io) {
      io.to(`conv:${msg.conversa_id}`).emit("message:deleted", { id: msg.id, conversa_id: msg.conversa_id });
    }

    res.json({ sucesso: true });
  } catch (err) {
    console.error("DELETE /conversas/mensagens erro:", err);
    res.status(500).json({ erro: "Erro ao excluir mensagem." });
  }
});

// ===== Excluir conversa (participante) =====
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

    // === Socket.IO: avisar deleção da conversa ===
    const io = req.app.get("io");
    if (io) {
      io.to(`conv:${id}`).emit("conversation:deleted", { conversa_id: id });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("DELETE /conversas erro:", err);
    res.status(500).json({ erro: "Erro ao deletar conversa." });
  }
});

module.exports = router;
