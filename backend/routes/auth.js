// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');       // seus hashes são $2b$10..., ou seja, bcrypt
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    // pega o usuário pelo e-mail (ajuste o nome da tabela se for diferente)
    const [rows] = await db.execute(
      `SELECT id, nome, email, senha, tipo_usuario, telefone, data_nascimento
         FROM usuarios
        WHERE email = ?
        LIMIT 1`,
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const u = rows[0];

    // compara senha plaintext com o hash armazenado em "senha"
    const ok = await bcrypt.compare(senha, u.senha);
    if (!ok) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // gera token
    const token = jwt.sign(
      { id: u.id, tipo_usuario: u.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // retorna o usuário (mantive "tipo" também para compatibilidade, se seu front usar)
    return res.json({
      usuario: {
        id: u.id,
        nome: u.nome,
        email: u.email,
        tipo_usuario: u.tipo_usuario,
        tipo: u.tipo_usuario,
        telefone: u.telefone,
        data_nascimento: u.data_nascimento
      },
      token
    });
  } catch (e) {
    console.error('Erro no login:', e);

    // erros de conexão/transientes (como o seu ECONNRESET) -> responde 503
    const transient =
      e?.code === 'ECONNRESET' ||
      e?.code === 'PROTOCOL_CONNECTION_LOST' ||
      e?.code === 'ECONNREFUSED' ||
      e?.code === 'ETIMEDOUT';

    if (transient) {
      return res.status(503).json({
        message: 'Banco de dados indisponível no momento. Tente novamente.',
        code: e.code,
      });
    }

    return res.status(500).json({ message: 'Erro interno na autenticação.' });
  }
});

module.exports = router;
