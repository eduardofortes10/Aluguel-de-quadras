// routes/favoritos.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// 🔒 Garante req.user em todas as rotas
router.use(auth);

// GET /api/favoritos -> lista do usuário logado
router.get("/", async (req, res) => {
  try {
    const usuario_id = req.user.id;

    const [rows] = await db.query(
      `SELECT
         f.id,
         f.usuario_id,
         f.quadra_id,
         COALESCE(f.nome, iq.nome_arquivo) AS nome,
         iq.local,
         iq.tipo,
         iq.preco,
         iq.avaliacao                       AS avaliacao,
         iq.url_completa                    AS imagem_url, -- 🔑 usa url_completa
         iq.dono_nome,
         iq.dono_foto,
         iq.dono_email,
         iq.dono_telefone
       FROM favoritos f
       LEFT JOIN imagens_quadras iq ON iq.id = f.quadra_id
       WHERE f.usuario_id = ?
       ORDER BY f.id DESC`,
      [usuario_id]
    );

    return res.json(rows);
  } catch (err) {
    console.error("❌ Erro ao listar favoritos:", err.sqlMessage || err.message, err);
    return res.status(500).json({ erro: err.sqlMessage || "Falha ao listar favoritos" });
  }
});

// POST /api/favoritos -> adiciona/atualiza favorito
router.post("/", async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { quadra_id } = req.body;

    if (!quadra_id) {
      return res.status(400).json({ erro: "quadra_id é obrigatório" });
    }

    // 🔎 Busca os dados direto da tabela imagens_quadras
    const [quadraRows] = await db.query(
      "SELECT nome_arquivo, local, tipo, preco, avaliacao, url_completa FROM imagens_quadras WHERE id = ?",
      [quadra_id]
    );

    if (!quadraRows.length) {
      return res.status(404).json({ erro: "Quadra não encontrada" });
    }

    const quadra = quadraRows[0];

    const [result] = await db.query(
      `INSERT INTO favoritos 
        (usuario_id, quadra_id, nome, preco, local, tipo, imagem_url, nota)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         nome = VALUES(nome),
         preco = VALUES(preco),
         local = VALUES(local),
         tipo = VALUES(tipo),
         imagem_url = VALUES(imagem_url),
         nota = VALUES(nota)`,
      [
        usuario_id,
        quadra_id,
        quadra.nome_arquivo,
        quadra.preco,
        quadra.local,
        quadra.tipo,
        quadra.url_completa,
        quadra.avaliacao,
      ]
    );

    return res.status(201).json({ id: result.insertId || 0, ok: true });
  } catch (err) {
    console.error("❌ Erro ao favoritar:", err.sqlMessage || err.message, err);
    return res.status(500).json({ erro: err.sqlMessage || "Falha ao favoritar" });
  }
});

// DELETE /api/favoritos/:id
router.delete("/:id", async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT id FROM favoritos WHERE id = ? AND usuario_id = ?",
      [id, usuario_id]
    );
    if (!rows.length) {
      return res.status(404).json({ erro: "Favorito não encontrado" });
    }

    await db.query("DELETE FROM favoritos WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ Erro ao deletar favorito:", err);
    return res.status(500).json({ erro: "Falha ao deletar favorito" });
  }
});

// DELETE /api/favoritos/usuario/:usuario_id/quadra/:quadra_id
router.delete("/usuario/:usuario_id/quadra/:quadra_id", async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { quadra_id } = req.params;

    const [rows] = await db.query(
      "SELECT id FROM favoritos WHERE usuario_id = ? AND quadra_id = ?",
      [usuario_id, quadra_id]
    );
    if (!rows.length) {
      return res.status(404).json({ erro: "Favorito não encontrado" });
    }

    await db.query(
      "DELETE FROM favoritos WHERE usuario_id = ? AND quadra_id = ?",
      [usuario_id, quadra_id]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ Erro ao deletar favorito por usuario/quadra:", err);
    return res.status(500).json({ erro: "Falha ao deletar favorito" });
  }
});

module.exports = router;
