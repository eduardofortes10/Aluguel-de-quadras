// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario, telefone, data_nascimento } = req.body;

    if (!nome || !email || !senha || !tipo_usuario) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios' });
    }

    // verifica e-mail duplicado (responde 409 em vez de 500)
    const [exist] = await db.query('SELECT id FROM usuarios WHERE email = ? LIMIT 1', [email]);
    if (exist.length) {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }

    const hash = await bcrypt.hash(senha, 10);

    const [result] = await db.query(
      `INSERT INTO usuarios (nome, email, senha, tipo_usuario, telefone, data_nascimento)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, email, hash, tipo_usuario, telefone || null, data_nascimento || null]
    );

    // >>> retorno consistente para o front
    return res.status(201).json({
      usuario: {
        id: result.insertId,
        nome,
        email,
        tipo_usuario,
        telefone: telefone || null,
        data_nascimento: data_nascimento || null,
      }
    });
  } catch (err) {
  console.error("Erro no registro:", err.response?.data || err.message);
  const msg = err?.response?.data?.erro || "Erro ao registrar.";
  toast.error(msg);
}

});

// POST /api/auth/login (mantém como está)
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (results.length === 0) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const usuario = results[0];
    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    return res.json({
      mensagem: 'Login bem-sucedido',
      id: usuario.id,
      nome: usuario.nome,
      tipo_usuario: usuario.tipo_usuario
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ erro: 'Erro ao tentar fazer login' });
  }
});

module.exports = router;
