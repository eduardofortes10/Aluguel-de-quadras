const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

function looksLikeBcrypt(s) {
  return typeof s === 'string' && /^\$2[aby]\$\d{2}\$/.test(s);
}

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body || {};
    if (!email || !senha) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    // ⚠️ garante que JWT_SECRET está definido
    if (!process.env.JWT_SECRET) {
      console.error('[AUTH] JWT_SECRET ausente no .env');
      return res.status(500).json({ message: 'Configuração inválida do servidor.' });
    }

    // busca case-insensitive
    const [rows] = await db.execute(
      `SELECT id, nome, email, senha, tipo_usuario, telefone, data_nascimento
         FROM usuarios
        WHERE LOWER(email) = LOWER(?)
        LIMIT 1`,
      [email.trim()]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const u = rows[0];

    // 1) caminho normal: senha já em bcrypt
    if (looksLikeBcrypt(u.senha)) {
      const ok = await bcrypt.compare(senha, u.senha);
      if (!ok) return res.status(401).json({ message: 'Credenciais inválidas.' });
    } else {
      // 2) migração de legado: senha antiga em texto puro
      if (senha !== u.senha) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }
      // auto-upgrade para bcrypt
      try {
        const newHash = await bcrypt.hash(senha, 10);
        await db.execute('UPDATE usuarios SET senha = ? WHERE id = ?', [newHash, u.id]);
        u.senha = newHash;
      } catch (e) {
        console.warn('[AUTH] Falha ao atualizar hash de senha do usuário', u.id, e?.message);
      }
    }

    const token = jwt.sign(
      { id: u.id, tipo_usuario: u.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

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

// POST /api/auth/register (mantido)
router.post('/register', async (req, res) => {
  const { nome, email, senha, tipo_usuario, telefone, data_nascimento } = req.body || {};
  if (!nome || !email || !senha || !tipo_usuario) {
    return res.status(400).json({ message: 'Campos obrigatórios: nome, email, senha, tipo_usuario.' });
  }
  try {
    const [exists] = await db.execute('SELECT id FROM usuarios WHERE LOWER(email) = LOWER(?) LIMIT 1', [email.trim()]);
    if (exists.length) return res.status(409).json({ message: 'E-mail já cadastrado.' });

    const hash = await bcrypt.hash(senha, 10);
    await db.execute(
      `INSERT INTO usuarios (nome, email, senha, tipo_usuario, telefone, data_nascimento, criado_em)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [nome, email.trim(), hash, tipo_usuario, telefone || null, data_nascimento || null]
    );

    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error('Erro no register:', e);
    return res.status(500).json({ message: 'Erro ao cadastrar.' });
  }
});

module.exports = router;
