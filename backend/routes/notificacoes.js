// backend/routes/notificacoes.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/notificacoes -> lista do usuário logado
router.get("/", async (req, res) => {
  try {
    const uid = req.user.id;
    const [rows] = await db.query(
      "SELECT id, usuario_id, tipo, mensagem, lida, data FROM notificacoes WHERE usuario_id = ? ORDER BY data DESC",
      [uid]
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Erro ao buscar notificações:", error);
    res.status(500).json({ erro: "Erro interno ao buscar notificações" });
  }
});

// POST /api/notificacoes -> cria notificação para o usuário logado
router.post("/", async (req, res) => {
  try {
    console.log("🔎 POST /notificacoes", {
      user: req.user,
      body: req.body
    });

    const uid = req.user?.id;
    const { tipo, mensagem } = req.body;

    if (!uid) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }
    if (!tipo || !mensagem) {
      return res.status(400).json({ erro: "tipo e mensagem são obrigatórios" });
    }

    await db.query(
      "INSERT INTO notificacoes (usuario_id, tipo, mensagem, lida, data) VALUES (?, ?, ?, 0, NOW())",
      [uid, tipo, mensagem]
    );

    res.status(201).json({ ok: true });
  } catch (error) {
    console.error("❌ Erro ao criar notificação:", error);
    res.status(500).json({ erro: "Erro interno ao criar notificação" });
  }
});


// PATCH /api/notificacoes/marcar-lidas -> marca todas como lidas
router.patch("/marcar-lidas", async (req, res) => {
  try {
    const uid = req.user.id;
    await db.query("UPDATE notificacoes SET lida = 1 WHERE usuario_id = ?", [uid]);
    res.json({ ok: true });
  } catch (error) {
    console.error("❌ Erro ao marcar notificações:", error);
    res.status(500).json({ erro: "Erro interno ao marcar notificações" });
  }
});

// DELETE /api/notificacoes/:id -> apaga uma notificação do usuário
router.delete("/:id", async (req, res) => {
  try {
    const uid = req.user.id;
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT id FROM notificacoes WHERE id = ? AND usuario_id = ?",
      [id, uid]
    );
    if (!rows.length) return res.status(404).json({ erro: "Notificação não encontrada" });

    await db.query("DELETE FROM notificacoes WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("❌ Erro ao excluir notificação:", error);
    res.status(500).json({ erro: "Erro interno ao excluir notificação" });
  }
});

module.exports = router;
