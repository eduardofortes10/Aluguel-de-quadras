// backend/routes/usuarios.js
const express = require("express");
const router = express.Router();
const connection = require("../db");
const bcrypt = require("bcrypt");

// Rota de cadastro de usuário
router.post("/", async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
  }

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);

    const sql = "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)";
    connection.query(sql, [nome, email, hashedPassword, tipo], (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar usuário:", err);
        return res.status(500).json({ error: "Erro ao cadastrar usuário." });
      }

      return res.status(201).json({ message: "Usuário cadastrado com sucesso!", userId: result.insertId });
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

module.exports = router;
