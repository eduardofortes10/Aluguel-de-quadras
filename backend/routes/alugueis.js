// routes/alugueis.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

router.use(auth);

/**
 * POST /api/alugueis
 * Cria um aluguel. Salva nome e imagem_url se existirem na tabela,
 * e usa o usuário logado (req.user.id) como cliente_id.
 * OBS: NÃO grava 'local' (vem de quadras no GET).
 */
router.post("/", async (req, res) => {
  try {
    const {
      quadra_id,
      data,
      hora_inicio,
      hora_fim,
      imagem_url,
      nome,
      valor_pago,
      observacoes,
    } = req.body;

    if (!quadra_id || !data || !hora_inicio || !hora_fim) {
      return res
        .status(400)
        .json({ erro: "quadra_id, data, hora_inicio e hora_fim são obrigatórios." });
    }

    // Fallbacks a partir de quadras (para nome/imagem_url)
    let nomeFinal = (nome || "").trim();
    let imagemFinal = (imagem_url || "").trim();

    if (!nomeFinal || !imagemFinal) {
      const [[q]] = await db.query(
        "SELECT nome, imagem_url FROM quadras WHERE id = ?",
        [quadra_id]
      );
      if (q) {
        if (!nomeFinal) nomeFinal = q.nome || "Quadra";
        if (!imagemFinal) imagemFinal = q.imagem_url || "sem-imagem.png";
      }
    }

    // IMPORTANTE: NÃO usamos coluna 'local' aqui (não existe na tabela alugueis)
    const [ins] = await db.query(
      `INSERT INTO alugueis
         (quadra_id, cliente_id, data, hora_inicio, hora_fim,
          imagem_url, nome, valor_pago, observacoes)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        quadra_id,
        req.user.id, // usuário logado
        data,
        hora_inicio,
        hora_fim,
        imagemFinal || null,
        nomeFinal || null,
        valor_pago ?? null,
        observacoes || null,
      ]
    );

    return res.status(201).json({ id: ins.insertId });
  } catch (e) {
    console.error("POST /alugueis", e);
    return res.status(500).json({ erro: "Erro ao salvar aluguel." });
  }
});

/**
 * GET /api/alugueis/minhas
 * Lista aluguéis do usuário. 'local' SEMPRE vem de quadras.
 */
router.get("/minhas", async (req, res) => {
  try {
    const uid = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
        a.id,
        a.quadra_id,
        a.data,
        a.hora_inicio,
        a.hora_fim,
        a.valor_pago,
        a.observacoes,
        COALESCE(a.nome, q.nome)         AS nome,
        q.local                           AS local,         -- <- pega de quadras
        COALESCE(a.imagem_url, q.imagem_url) AS imagem_url
      FROM alugueis a
      LEFT JOIN quadras q ON q.id = a.quadra_id
      WHERE a.cliente_id = ?
      ORDER BY a.data DESC, a.hora_inicio DESC
      `,
      [uid]
    );

    res.json(rows);
  } catch (e) {
    console.error("GET /alugueis/minhas", e);
    res.status(500).json({ erro: "Erro ao buscar seus aluguéis." });
  }
});

/**
 * GET /api/alugueis/:id
 * Detalhe de um aluguel (pertencente ao usuário logado).
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ erro: "id inválido." });

    const [[row]] = await db.query(
      `
      SELECT
        a.*,
        COALESCE(a.nome, q.nome)            AS nome_resolvido,
        q.local                              AS local_resolvido,      -- <- de quadras
        COALESCE(a.imagem_url, q.imagem_url) AS imagem_resolvida
      FROM alugueis a
      LEFT JOIN quadras q ON q.id = a.quadra_id
      WHERE a.id = ? AND a.cliente_id = ?
      `,
      [id, req.user.id]
    );

    if (!row) return res.status(404).json({ erro: "Aluguel não encontrado." });
    res.json(row);
  } catch (e) {
    console.error("GET /alugueis/:id", e);
    res.status(500).json({ erro: "Erro ao buscar aluguel." });
  }
});

module.exports = router;
