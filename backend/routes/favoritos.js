const express = require("express");
const router = express.Router();
const db = require("../db"); // Arquivo de conexão MySQL

// Rota: GET /api/favoritos/:usuario_id
router.get("/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;

  console.log("📥 Requisição recebida para favoritos do usuário:", usuario_id);

  const query = `
    SELECT q.id, q.nome, q.local, q.preco, q.imagem_url, q.nota
    FROM favoritos f
    JOIN quadras q ON f.quadra_id = q.id
    WHERE f.usuario_id = ?;
  `;

  db.query(query, [usuario_id], (err, results) => {
    if (err) {
      console.error("❌ Erro ao buscar favoritos:", err);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }

    console.log("✅ Favoritos encontrados:", results);
    res.status(200).json(results);
  });
});

// ✅ POST /api/favoritos
router.post("/", (req, res) => {
  const { usuario_id, quadra_id } = req.body;
  console.log("📦 Dados recebidos no POST:", { usuario_id, quadra_id });

  if (!usuario_id || !quadra_id) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  const query = "INSERT INTO favoritos (usuario_id, quadra_id) VALUES (?, ?)";

  db.query(query, [usuario_id, quadra_id], (err, result) => {
    if (err) {
      console.error("Erro ao adicionar favorito:", err);
      return res.status(500).json({ erro: "Erro ao adicionar favorito" });
    }

    res.status(201).json({ mensagem: "Favorito adicionado com sucesso!" });
  });
});


module.exports = router;
