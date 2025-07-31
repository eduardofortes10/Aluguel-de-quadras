// routes/notificacoes.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Adicionar notificação
router.post("/", async (req, res) => {
  const { usuario_id, tipo, mensagem } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES (?, ?, ?)",
      [usuario_id, tipo, mensagem]
    );
    res.json({ sucesso: true, id: result.insertId });
  } catch (err) {
    console.error("❌ Erro ao adicionar notificação:", err);
    res.status(500).json({ erro: err });
  }
});

// Buscar notificações por usuário
router.get("/:usuario_id", async (req, res) => {
  console.log("🟢 Rota de GET /api/notificacoes/:usuario_id acessada");
  const { usuario_id } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM notificacoes WHERE usuario_id = ? ORDER BY id DESC",
      [usuario_id]
    );
    console.log("📦 Notificações encontradas:", rows);
    res.json(rows);
  } catch (err) {
    console.error("❌ Erro ao buscar notificações:", err);
    res.status(500).json({ erro: err });
  }
});

// Marcar como lida
router.put("/:id/lida", async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("UPDATE notificacoes SET lida = TRUE WHERE id = ?", [id]);
    res.json({ sucesso: true });
  } catch (err) {
    console.error("❌ Erro ao marcar como lida:", err);
    res.status(500).json({ erro: err });
  }
});

// Excluir notificação permanentemente
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute("DELETE FROM notificacoes WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Notificação não encontrada." });
    }
    res.json({ sucesso: true });
  } catch (err) {
    console.error("❌ Erro ao excluir notificação:", err);
    res.status(500).json({ erro: err });
  }
});
// Contar notificações não lidas por usuário
router.get("/nao-lidas/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;
  const sql = "SELECT COUNT(*) AS total FROM notificacoes WHERE usuario_id = ? AND lida = 0";

  db.query(sql, [usuario_id], (err, results) => {
    if (err) {
      console.error("❌ Erro ao contar notificações não lidas:", err);
      return res.status(500).json({ erro: err });
    }

    res.json({ total: results[0].total });
  });
});
// Buscar quantidade de notificações não lidas
router.get("/nao-lidas/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;
  const sql = "SELECT COUNT(*) AS total FROM notificacoes WHERE usuario_id = ? AND lida = 0";
  db.query(sql, [usuario_id], (err, rows) => {
    if (err) {
      console.error("❌ Erro ao contar notificações não lidas:", err);
      return res.status(500).json({ erro: err });
    }
    res.json({ total: rows[0].total });
  });
});
module.exports = router;