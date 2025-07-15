const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const connection = require("../db");

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

const upload = multer({ storage });

// Rota POST com upload
router.post("/", upload.single("imagem"), (req, res) => {
  const { nome, local, preco, tipo, dono_id, nota, descricao } = req.body;
  const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO quadras (nome, local, preco, tipo, dono_id, nota, descricao, imagem_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(sql, [nome, local, preco, tipo, dono_id, nota, descricao, imagem_url], (err, result) => {
    if (err) {
      console.error("Erro ao salvar quadra:", err);
      return res.status(500).json({ error: "Erro ao salvar quadra" });
    }

    res.status(201).json({ message: "Quadra cadastrada com sucesso!" });
  });
});
// Rota GET para listar quadras, com suporte a filtro por dono_id
router.get("/", (req, res) => {
  const { dono_id } = req.query;

  let sql = "SELECT * FROM quadras";
  const params = [];

  if (dono_id) {
    sql += " WHERE dono_id = ?";
    params.push(dono_id);
  }

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error("Erro ao buscar quadras:", err);
      return res.status(500).json({ error: "Erro ao buscar quadras" });
    }

    res.status(200).json(results);
  });
});

module.exports = router;

// Rota GET /quadras/:id para buscar os detalhes de uma quadra
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM quadras WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar quadra:", err);
      return res.status(500).json({ error: "Erro ao buscar quadra" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Quadra não encontrada" });
    }

    res.status(200).json(results[0]);
  });
});
