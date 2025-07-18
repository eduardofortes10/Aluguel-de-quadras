const express = require('express');
const db = require('../db');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ⬇️ Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nome = Date.now() + ext;
    cb(null, nome);
  }
});
const upload = multer({ storage });

// ⬇️ Buscar quadra por ID (DEVE vir antes da rota com query param)
router.get('/quadras/:id', (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM quadras WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar quadra por ID:", err);
      return res.status(500).json({ erro: 'Erro interno ao buscar quadra' });
    }

    if (results.length === 0) {
      return res.status(404).json({ erro: 'Quadra não encontrada' });
    }

    res.json(results[0]);
  });
});

// ⬇️ Rota GET para listar quadras por dono
router.get('/quadras', (req, res) => {
  const { dono_id } = req.query;
  if (!dono_id) return res.status(400).json({ erro: 'dono_id é obrigatório' });

  const sql = "SELECT * FROM quadras WHERE dono_id = ?";
  db.query(sql, [dono_id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar quadras:", err);
      return res.status(500).json({ erro: 'Erro ao buscar quadras' });
    }
    res.json(results);
  });
});

// ⬇️ Rota POST com upload de imagem
router.post('/quadras', upload.single('imagem'), (req, res) => {
  const { nome, local, preco, tipo, descricao, dono_id, nota } = req.body;
  const imagem_url = req.file ? `/uploads/${req.file.filename}` : "";

  if (!nome || !local || !preco || !dono_id) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
  }

  const sql = `
    INSERT INTO quadras (nome, local, preco, imagem_url, dono_id, nota)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [nome, local, preco, imagem_url, dono_id, nota || 4.5];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar quadra:", err);
      return res.status(500).json({ error: 'Erro ao cadastrar quadra' });
    }

    res.json({ mensagem: 'Quadra cadastrada com sucesso!', id: result.insertId });
  });
});

module.exports = router;
