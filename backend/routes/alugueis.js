const express = require("express");
const router = express.Router();
const db = require("../db");

// POST - Criar novo aluguel
router.post("/", async (req, res) => {
  const { quadra_id, cliente_id, data, hora_inicio, hora_fim, imagem_url } = req.body;

  if (!cliente_id || !quadra_id || !data || !hora_inicio || !hora_fim || !imagem_url) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
  }

  try {
    await db.execute(
      "INSERT INTO alugueis (quadra_id, cliente_id, data, hora_inicio, hora_fim, imagem_url) VALUES (?, ?, ?, ?, ?, ?)",
      [quadra_id, cliente_id, data, hora_inicio, hora_fim, imagem_url]
    );

    res.status(201).json({ message: "Aluguel registrado com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao registrar aluguel:", err);
    res.status(500).json({ error: "Erro interno ao registrar aluguel" });
  }
});

module.exports = router;
