// routes/alugueis.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

router.use(auth);

/**
 * POST /api/alugueis
 * Cria um aluguel. Recebe (além dos campos obrigatórios) imagem_url, nome, local e observacoes.
 * Se algum desses vier vazio, busca na tabela quadras para preencher.
 */
router.post("/", async (req, res) => {
  try {
    const {
      quadra_id,
      // cliente_id, // ignorado — usamos o usuário logado (req.user.id)
      data,
      hora_inicio,
      hora_fim,
      imagem_url,
      nome,
      local,
      valor_pago,
      observacoes,
    } = req.body;

    if (!quadra_id || !data || !hora_inicio || !hora_fim) {
      return res
        .status(400)
        .json({ erro: "quadra_id, data, hora_inicio e hora_fim são obrigatórios." });
    }

    // Prepara fallbacks a partir da tabela quadras, se necessário
    let nomeFinal = (nome || "").trim();
    let localFinal = (local || "").trim();
    let imagemFinal = (imagem_url || "").trim();

    if (!nomeFinal || !localFinal || !imagemFinal) {
      const [[q]] = await db.query(
        "SELECT nome, local, imagem_url FROM quadras WHERE id = ?",
        [quadra_id]
      );
      if (q) {
        if (!nomeFinal) nomeFinal = q.nome || "Quadra";
        if (!localFinal) localFinal = q.local || "";
        if (!imagemFinal) imagemFinal = q.imagem_url || "sem-imagem.png";
      }
    }

    const [ins] = await db.query(
      `INSERT INTO alugueis
         (quadra_id, cliente_id, data, hora_inicio, hora_fim,
          imagem_url, nome, local, valor_pago, observacoes)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        quadra_id,
        req.user.id, // sempre o usuário logado
        data,
        hora_inicio,
        hora_fim,
        imagemFinal || null,
        nomeFinal || null,
        localFinal || null,
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
 * Lista os aluguéis do usuário logado, retornando imagem/nome/local do aluguel
 * (ou, se nulos, fazendo fallback para os dados atuais da quadra).
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
        COALESCE(a.nome,  q.nome)  AS nome,
        COALESCE(a.local, q.local) AS local,
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
 * Detalhe de um aluguel (apenas se pertence ao usuário logado).
 * Útil para depuração e futuras telas de detalhe.
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ erro: "id inválido." });

    const [[row]] = await db.query(
      `
      SELECT
        a.*,
        COALESCE(a.nome,  q.nome)  AS nome_resolvido,
        COALESCE(a.local, q.local) AS local_resolvido,
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
