// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  const { nome, email, senha, tipo_usuario } = req.body;
  const hash = await bcrypt.hash(senha, 10);

  const sql = "INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)";
  db.query(sql, [nome, email, hash, tipo_usuario], (err, result) => {
    if (err) {
      console.error("Erro ao registrar:", err); // <- adicione essa linha
      return res.status(500).json({ erro: 'Erro ao registrar usuário' });
    }
    res.json({ mensagem: 'Usuário registrado com sucesso!' });
  });
});


// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const usuario = results[0];
    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) return res.status(401).json({ erro: 'Senha incorreta' });

    res.json({
      mensagem: 'Login bem-sucedido',
      id: usuario.id,
      nome: usuario.nome,
      tipo_usuario: usuario.tipo_usuario
    });
  });
});

module.exports = router;
