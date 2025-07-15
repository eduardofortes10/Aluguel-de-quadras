// backend/routes/login.js
const express = require("express");
const router = express.Router();
const connection = require("../db");
const bcrypt = require("bcrypt");

// Rota de login
router.post("/", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  connection.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuário:", err);
      return res.status(500).json({ error: "Erro no servidor." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    const user = results[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    // Login válido
    res.json({
      message: "Login bem-sucedido!",
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      }
    });
  });
});

module.exports = router;
