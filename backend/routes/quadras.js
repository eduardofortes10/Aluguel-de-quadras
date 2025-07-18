const express = require('express');
const router = express.Router();
const db = require('../db');

// Buscar todas as quadras
router.get('/quadras', (req, res) => {
  db.query('SELECT * FROM quadras', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

// Buscar quadra por ID
router.get('/quadras/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT q.*, i.url_completa AS imagem_url, i.nome_arquivo,
            u.nome AS dono_nome, u.email AS dono_email, u.telefone AS dono_telefone, u.foto AS dono_foto
     FROM quadras q
     JOIN imagens_quadras i ON q.imagem_id = i.id
     JOIN usuarios u ON q.dono_id = u.id
     WHERE q.id = ?`,
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      if (results.length === 0) return res.status(404).json({ erro: "Quadra não encontrada" });
      res.json(results[0]);
    }
  );
});

module.exports = router;
