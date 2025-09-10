// routes/alugueis.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// Criar novo aluguel
router.post("/", auth, async (req, res) => {
  try {
    const { quadra_id, data, hora_inicio, hora_fim } = req.body;
    const cliente_id = req.user.id;

    if (!quadra_id || !data || !hora_inicio || !hora_fim) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    // 🔎 Checa conflito
    const [conflitos] = await db.query(
      `SELECT 1 FROM alugueis
       WHERE quadra_id = ?
         AND data = ?
         AND NOT (hora_fim <= ? OR hora_inicio >= ?)
       LIMIT 1`,
      [quadra_id, data, hora_inicio, hora_fim]
    );

    if (conflitos.length > 0) {
      return res.status(409).json({ erro: "Horário indisponível para esta quadra." });
    }

    // Se não houver conflito → insere
    await db.query(
      `INSERT INTO alugueis (quadra_id, cliente_id, data, hora_inicio, hora_fim, criado_em)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [quadra_id, cliente_id, data, hora_inicio, hora_fim]
    );

    res.status(201).json({ sucesso: true, msg: "Aluguel criado com sucesso" });
  } catch (err) {
    console.error("POST /alugueis erro:", err);
    res.status(500).json({ erro: "Erro ao criar aluguel" });
  }
});

// 📌 Nova rota → lista aluguéis do cliente logado
router.get("/minhas", auth, async (req, res) => {
  try {
    const cliente_id = req.user.id;
    const [rows] = await db.query(
      "SELECT * FROM alugueis WHERE cliente_id = ? ORDER BY data DESC, hora_inicio DESC",
      [cliente_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /alugueis/minhas erro:", err);
    res.status(500).json({ erro: "Erro ao buscar aluguéis" });
  }
});

module.exports = router;
