// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

// ✅ Registro com async/await
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario } = req.body;

    if (!nome || !email || !senha || !tipo_usuario) {
      return res.status(400).json({ erro: 'Preencha todos os campos' });
    }

    const hash = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)";
    await db.query(sql, [nome, email, hash, tipo_usuario]);

    res.json({ mensagem: 'Usuário registrado com sucesso!' });
  } catch (err) {
    console.error("Erro ao registrar:", err);
    res.status(500).json({ erro: 'Erro ao registrar usuário' });
  }
});

// ✅ Login com async/await
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    const [results] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (results.length === 0) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const usuario = results[0];
    const match = await bcrypt.compare(senha, usuario.senha);

    if (!match) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    res.json({
      mensagem: 'Login bem-sucedido',
      id: usuario.id,
      nome: usuario.nome,
      tipo_usuario: usuario.tipo_usuario
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ erro: 'Erro ao tentar fazer login' });
  }
});

module.exports = router;
