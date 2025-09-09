// routes/alugueis.js (substituição)
const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /api/alugueis -> cria aluguel (cliente logado)
router.post("/", async (req, res) => {
  try {
    const cliente_id = req.user.id; // força ser o usuário logado
    const { quadra_id, data, hora_inicio, hora_fim, valor_pago, observacoes, imagem_url, nome } = req.body;

    if (!quadra_id || !data || !hora_inicio || !hora_fim) {
      return res.status(400).json({ erro: "quadra_id, data, hora_inicio e hora_fim são obrigatórios" });
    }

    // Checagem de conflito (sobreposição de horário) para a mesma quadra no mesmo dia
    const [conflict] = await db.query(
      `SELECT 1 FROM alugueis 
       WHERE quadra_id = ? AND data = ?
       AND NOT (hora_fim <= ? OR hora_inicio >= ?)
       LIMIT 1`,
      [quadra_id, data, hora_inicio, hora_fim]
    );
    if (conflict.length) {
      return res.status(409).json({ erro: "Horário indisponível para esta quadra" });
    }

    const [result] = await db.query(
      `INSERT INTO alugueis 
        (quadra_id, cliente_id, data, hora_inicio, hora_fim, valor_pago, observacoes, imagem_url, nome)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [quadra_id, cliente_id, data, hora_inicio, hora_fim, valor_pago || null, observacoes || null, imagem_url || null, nome || null]
    );

    res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("❌ Erro ao criar aluguel:", error);
    res.status(500).json({ erro: "Erro interno ao criar aluguel" });
  }
});

// GET /api/alugueis/minhas -> lista do cliente logado
router.get("/minhas", async (req, res) => {
  try {
    const cliente_id = req.user.id;
    const [rows] = await db.query(
      "SELECT * FROM alugueis WHERE cliente_id = ? ORDER BY data DESC, hora_inicio DESC",
      [cliente_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Erro ao buscar aluguéis:", error);
    res.status(500).json({ erro: "Erro interno ao buscar aluguéis" });
  }
});

module.exports = router;
