// routes/usuarios.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// Buscar usuário por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [resultado] = await db.query(
      "SELECT id, nome, email, telefone, DATE_FORMAT(data_nascimento, '%Y-%m-%d') AS data_nascimento FROM usuarios WHERE id = ?", 
      [id]
    );
    if (resultado.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(resultado[0]);
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// Atualizar dados do usuário
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, data_nascimento } = req.body;

  try {
    await db.query(
      "UPDATE usuarios SET nome = ?, email = ?, telefone = ?, data_nascimento = ? WHERE id = ?",
      [nome, email, telefone, data_nascimento, id]
    );
    res.json({ mensagem: "Dados atualizados com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar dados:", err);
    res.status(500).json({ erro: "Erro ao atualizar dados" });
  }
});

module.exports = router;
