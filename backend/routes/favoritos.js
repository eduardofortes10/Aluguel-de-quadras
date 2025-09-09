// routes/favoritos.js (substituição)
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/favoritos -> lista do usuário logado
router.get("/", async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const [rows] = await db.query(
      "SELECT * FROM favoritos WHERE usuario_id = ? ORDER BY id DESC",
      [usuario_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Erro ao listar favoritos:", err);
    res.status(500).json({ erro: "Falha ao listar favoritos" });
  }
});

// POST /api/favoritos -> adiciona favorito do usuário logado
router.post("/", async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { quadra_id } = req.body;
    if (!quadra_id) return res.status(400).json({ erro: "quadra_id é obrigatório" });

    await db.query(
      "INSERT IGNORE INTO favoritos (usuario_id, quadra_id) VALUES (?, ?)",
      [usuario_id, quadra_id]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("❌ Erro ao favoritar:", err);
    res.status(500).json({ erro: "Falha ao favoritar" });
  }
});

// DELETE /api/favoritos/:id -> remove, garantindo propriedade
router.delete("/:id", async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT id FROM favoritos WHERE id = ? AND usuario_id = ?",
      [id, usuario_id]
    );
    if (!rows.length) return res.status(404).json({ erro: "Favorito não encontrado" });

    await db.query("DELETE FROM favoritos WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Erro ao deletar favorito:", err);
    res.status(500).json({ erro: "Falha ao deletar favorito" });
  }
});

module.exports = router;
