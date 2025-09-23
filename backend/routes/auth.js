// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs"); // seus hashes $2b$10...
const jwt = require("jsonwebtoken");
const db = require("../db");

/**
 * Exporta uma fábrica de router que recebe o loginLimiter
 * Uso no server.js:
 *   app.use("/api/auth", require("./routes/auth")(loginLimiter));
 */
module.exports = function authRouterFactory(loginLimiter) {
  const router = express.Router();

  // POST /api/auth/login
  router.post("/login", loginLimiter, async (req, res) => {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    const emailNorm = String(email).trim().toLowerCase();

    try {
      // Ajuste o nome da tabela/colunas se necessário
      const [rows] = await db.execute(
        `SELECT id, nome, email, senha, tipo_usuario, telefone, data_nascimento
           FROM usuarios
          WHERE LOWER(email) = ?
          LIMIT 1`,
        [emailNorm]
      );

      if (!rows || rows.length === 0) {
        return res.status(401).json({ message: "Credenciais inválidas." });
      }

      const u = rows[0];

      const ok = await bcrypt.compare(String(senha), u.senha);
      if (!ok) {
        return res.status(401).json({ message: "Credenciais inválidas." });
      }

      const token = jwt.sign(
        { id: u.id, tipo_usuario: u.tipo_usuario },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Se você preferir cookie em vez de Bearer, descomente:
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: true,          // em produção (HTTPS)
      //   sameSite: "none",      // para cross-site (Vercel -> Render)
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // });

      return res.json({
        usuario: {
          id: u.id,
          nome: u.nome,
          email: u.email,
          tipo_usuario: u.tipo_usuario,
          tipo: u.tipo_usuario, // compat com front antigo
          telefone: u.telefone,
          data_nascimento: u.data_nascimento,
        },
        token, // se usar Bearer no front; se for usar cookie, pode omitir
      });
    } catch (e) {
      console.error("Erro no login:", e);

      const transient =
        e?.code === "ECONNRESET" ||
        e?.code === "PROTOCOL_CONNECTION_LOST" ||
        e?.code === "ECONNREFUSED" ||
        e?.code === "ETIMEDOUT";

      if (transient) {
        return res.status(503).json({
          message: "Banco de dados indisponível no momento. Tente novamente.",
          code: e.code,
        });
      }

      return res.status(500).json({ message: "Erro interno na autenticação." });
    }
  });

  // POST /api/auth/register
  router.post("/register", async (req, res) => {
    const { nome, email, senha, tipo_usuario, telefone, data_nascimento } = req.body || {};

    if (!nome || !email || !senha || !tipo_usuario) {
      return res.status(400).json({
        message: "Campos obrigatórios: nome, email, senha, tipo_usuario.",
      });
    }

    const emailNorm = String(email).trim().toLowerCase();

    try {
      const [exists] = await db.execute(
        "SELECT id FROM usuarios WHERE LOWER(email) = ? LIMIT 1",
        [emailNorm]
      );
      if (exists.length) {
        return res.status(409).json({ message: "E-mail já cadastrado." });
      }

      const hash = await bcrypt.hash(String(senha), 10);

      await db.execute(
        `INSERT INTO usuarios (nome, email, senha, tipo_usuario, telefone, data_nascimento, criado_em)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [nome, emailNorm, hash, tipo_usuario, telefone || null, data_nascimento || null]
      );

      return res.status(201).json({ ok: true });
    } catch (e) {
      console.error("Erro no register:", e);
      return res.status(500).json({ message: "Erro ao cadastrar." });
    }
  });

  return router;
};
