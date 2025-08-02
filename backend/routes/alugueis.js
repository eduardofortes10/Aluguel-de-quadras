const express = require("express");
const router = express.Router();
const db = require("../db");

// POST - Criar novo aluguel
router.post("/", async (req, res) => {
  const {
    quadra_id,
    cliente_id,
    data,
    hora_inicio,
    hora_fim,
    imagem_url,
    nome,
    valor_pago,
    observacoes,
  } = req.body;

  if (
    !cliente_id ||
    !quadra_id ||
    !data ||
    !hora_inicio ||
    !hora_fim ||
    !imagem_url ||
    !nome ||
    valor_pago === undefined
  ) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
  }

  try {
    await db.execute(
      `INSERT INTO alugueis 
        (quadra_id, cliente_id, data, hora_inicio, hora_fim, imagem_url, nome, valor_pago, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quadra_id,
        cliente_id,
        data,
        hora_inicio,
        hora_fim,
        imagem_url,
        nome,
        valor_pago,
        observacoes?.trim() === "" ? null : observacoes,
      ]
    );

    res.status(201).json({ message: "Aluguel registrado com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao registrar aluguel:", err);
    res.status(500).json({ error: "Erro interno ao registrar aluguel" });
  }
});

// GET - Buscar aluguéis de um cliente
router.get("/minhas-quadras/:cliente_id", async (req, res) => {
  const { cliente_id } = req.params;

  try {
    const [alugueis] = await db.execute(
      "SELECT * FROM alugueis WHERE cliente_id = ? ORDER BY data DESC",
      [cliente_id]
    );

    res.json(alugueis);
  } catch (error) {
    console.error("Erro ao buscar aluguéis:", error);
    res.status(500).json({ erro: "Erro interno ao buscar aluguéis" });
  }
});

module.exports = router;
