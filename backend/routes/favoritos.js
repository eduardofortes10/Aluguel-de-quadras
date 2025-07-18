// routes/favoritos.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // ou conexão MySQL que você estiver usando

// Buscar favoritos de um usuário
router.get('/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  db.query('SELECT * FROM favoritos WHERE usuario_id = ?', [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

// Adicionar favorito
router.post('/', (req, res) => {
  const { usuario_id, quadra_id, nome, preco, local, imagem_url, nota } = req.body;

  // Verifica se já existe esse favorito
  db.query(
    'SELECT * FROM favoritos WHERE usuario_id = ? AND quadra_id = ?',
    [usuario_id, quadra_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err });

      if (results.length > 0) {
        return res.status(400).json({ erro: 'Quadra já favoritada por esse usuário.' });
      }

      // Se não existir, insere
      db.query(
        'INSERT INTO favoritos (usuario_id, quadra_id, nome, preco, local, imagem_url, nota) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [usuario_id, quadra_id, nome, preco, local, imagem_url, nota],
        (err, result) => {
          if (err) return res.status(500).json({ erro: err });
          res.json({ sucesso: true, id: result.insertId });
        }
      );
    }
  );
});




// Remover favorito
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM favoritos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ sucesso: true });
  });
});

module.exports = router;
