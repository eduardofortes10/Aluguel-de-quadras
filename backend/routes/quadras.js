const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cria pasta uploads se não existir
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

/* ===== POST - Cadastrar quadra ===== */
router.post('/', upload.single('imagem'), (req, res) => {
  const { nome, local, preco, tipo, descricao, dono_id, nota } = req.body;
  const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;

  const query = `
    INSERT INTO quadras (nome, local, preco, tipo, descricao, dono_id, nota, imagem_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [nome, local, preco, tipo, descricao, dono_id, nota, imagem_url], (err) => {
    if (err) {
      console.error("Erro ao cadastrar quadra:", err);
      return res.status(500).json({ error: "Erro ao cadastrar quadra" });
    }
    res.status(200).json({ message: "Quadra cadastrada com sucesso" });
  });
});

/* ===== GET - Listar todas ou por dono_id ===== */
router.get('/', (req, res) => {
  const { dono_id } = req.query;
  let query = 'SELECT * FROM quadras';
  const params = [];

  if (dono_id) {
    query += ' WHERE dono_id = ?';
    params.push(dono_id);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

/* ===== GET - Detalhes de uma quadra ===== */
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.query(`
    SELECT q.*, u.nome AS dono_nome, u.email AS dono_email
    FROM quadras q
    JOIN usuarios u ON q.dono_id = u.id
    WHERE q.id = ?
  `, [id], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    if (results.length === 0) return res.status(404).json({ erro: "Quadra não encontrada" });
    res.json(results[0]);
  });
});

/* ===== DELETE - Deletar quadra e remover imagem do disco ===== */
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT imagem_url FROM quadras WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar quadra" });
    if (results.length === 0) return res.status(404).json({ error: "Quadra não encontrada" });

    const imagemPath = results[0].imagem_url ? path.join(__dirname, '..', results[0].imagem_url) : null;

    db.query('DELETE FROM quadras WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: "Erro ao deletar quadra" });

      if (imagemPath && fs.existsSync(imagemPath)) {
        fs.unlink(imagemPath, (err) => {
          if (err) console.warn("Imagem não foi removida:", err);
        });
      }

      res.status(200).json({ message: "Quadra deletada com sucesso" });
    });
  });
});

module.exports = router;
