const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔍 Buscar favoritos de um usuário
router.get('/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  console.log("🔍 Buscando favoritos do usuário:", usuario_id);

  try {
    const [results] = await db.query(
      'SELECT * FROM favoritos WHERE usuario_id = ?',
      [usuario_id]
    );
    res.json(results);
  } catch (err) {
    console.error("❌ Erro ao buscar favoritos:", err);
    res.status(500).json({ erro: err });
  }
});

// ➕ Adicionar favorito
router.post('/', async (req, res) => {
  const {
    usuario_id,
    quadra_id,
    nome,
    preco,
    local,
    imagem_url,
    nota
  } = req.body;

  const precoConvertido = parseFloat(preco);
  const notaConvertida = parseFloat(nota);

  console.log("📥 Recebido no backend:", req.body);
  console.log("🧪 Convertidos:", {
    usuario_id,
    quadra_id,
    preco: precoConvertido,
    nota: notaConvertida,
  });

  if (
    !usuario_id || !quadra_id ||
    isNaN(precoConvertido) ||
    isNaN(notaConvertida)
  ) {
    return res.status(400).json({ erro: 'Dados inválidos ou incompletos.' });
  }

  try {
    const [existente] = await db.query(
      'SELECT * FROM favoritos WHERE usuario_id = ? AND quadra_id = ?',
      [usuario_id, quadra_id]
    );

    if (existente.length > 0) {
      return res.status(400).json({ erro: 'Quadra já favoritada por esse usuário.' });
    }

    const [result] = await db.query(
      'INSERT INTO favoritos (usuario_id, quadra_id, nome, preco, local, imagem_url, nota) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [usuario_id, quadra_id, nome, precoConvertido, local, imagem_url, notaConvertida]
    );

    res.json({ sucesso: true, id: result.insertId });
    console.log("✅ Favorito inserido com ID:", result.insertId);

  } catch (err) {
    console.error("❌ Erro ao inserir favorito:", err);
    res.status(500).json({ erro: err });
  }
});

// ❌ Remover favorito
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM favoritos WHERE id = ?', [id]);
    res.json({ sucesso: true });
  } catch (err) {
    console.error("❌ Erro ao deletar favorito:", err);
    res.status(500).json({ erro: err });
  }
});

module.exports = router;
