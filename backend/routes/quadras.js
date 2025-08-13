// backend/routes/quadras.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Garante pasta de uploads
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path.basename(file.originalname || "arquivo", ext).replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB por arquivo
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Apenas imagens são permitidas"));
    cb(null, true);
  }
});

// Util
function parseNumber(v) {
  if (v == null) return NaN;
  const n = Number(String(v).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

// ========== POST /quadras  (criar) ==========
router.post("/", upload.array("imagens", 10), async (req, res) => {
  try {
    const {
      nome,
      local,
      preco,
      tipo,
      descricao,
      dono_id,
      nota,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      horario_inicio,
      horario_fim
    } = req.body;

    // validações básicas
    const precoNumber = parseNumber(preco);
    if (!nome || !local || !tipo || !dono_id || isNaN(precoNumber) || precoNumber <= 0) {
      return res.status(400).json({ erro: "Campos inválidos. Verifique nome, local, tipo, dono_id e preço." });
    }

    // imagens salvas
    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length < 3) {
      return res.status(400).json({ erro: "Envie no mínimo 3 imagens." });
    }
    const imagens = files.map((f) => `/uploads/${f.filename}`);

    // insert
    const [result] = await db.query(
      `INSERT INTO quadras
        (nome, local, preco, tipo, descricao, dono_id, nota, imagens,
         cep, endereco, numero, complemento, bairro, cidade, uf,
         horario_inicio, horario_fim, status, criado_em)
       VALUES (?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON),
               ?, ?, ?, ?, ?, ?, ?,
               ?, ?, 'ativa', NOW())`,
      [
        nome.trim(),
        local.trim(),
        precoNumber,
        String(tipo).trim(),
        (descricao || "").trim(),
        Number(dono_id),
        parseNumber(nota) || 0,
        JSON.stringify(imagens),
        cep || null,
        endereco || null,
        numero || null,
        complemento || null,
        bairro || null,
        cidade || null,
        uf || null,
        horario_inicio || null,
        horario_fim || null
      ]
    );

    const id = result.insertId;
    const [rows] = await db.query("SELECT * FROM quadras WHERE id = ?", [id]);
    const row = rows[0] || null;
    // Garante que 'imagens' venha como array no response
    if (row && typeof row.imagens === "string") {
      try { row.imagens = JSON.parse(row.imagens); } catch {}
    }
    return res.status(201).json(row);
  } catch (err) {
    console.error("POST /quadras erro:", err);
    return res.status(500).json({ erro: err.message || "Falha ao cadastrar quadra" });
  }
});

// ========== GET /quadras  (listar; opcional ?dono_id=) ==========
router.get("/", async (req, res) => {
  const { dono_id } = req.query;
  let sql = "SELECT * FROM quadras";
  const params = [];
  if (dono_id) {
    sql += " WHERE dono_id = ?";
    params.push(dono_id);
  }
  sql += " ORDER BY id DESC";

  try {
    const [rows] = await db.query(sql, params);
    const out = rows.map((r) => {
      if (typeof r.imagens === "string") {
        try { r.imagens = JSON.parse(r.imagens); } catch {}
      }
      return r;
    });
    res.json(out);
  } catch (err) {
    console.error("GET /quadras erro:", err);
    res.status(500).json({ erro: "Falha ao listar quadras" });
  }
});

// ========== GET /quadras/:id ==========
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM quadras WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ erro: "Quadra não encontrada" });
    const row = rows[0];
    if (typeof row.imagens === "string") {
      try { row.imagens = JSON.parse(row.imagens); } catch {}
    }
    res.json(row);
  } catch (err) {
    console.error("GET /quadras/:id erro:", err);
    res.status(500).json({ erro: "Falha ao obter quadra" });
  }
});

// ========== DELETE /quadras/:id ==========
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // pega imagens para tentar apagar do disco
    const [rows] = await db.query("SELECT imagens FROM quadras WHERE id = ?", [id]);
    const imgs = rows[0]?.imagens;
    if (!rows.length) return res.status(404).json({ erro: "Quadra não encontrada" });

    // deleta no banco
    await db.query("DELETE FROM quadras WHERE id = ?", [id]);

    // tenta remover arquivos
    let arr = [];
    if (typeof imgs === "string") {
      try { arr = JSON.parse(imgs); } catch {}
    } else if (Array.isArray(imgs)) {
      arr = imgs;
    }
    for (const rel of arr) {
      if (typeof rel !== "string") continue;
      const abs = path.join(__dirname, "..", rel.replace(/^\/+/, ""));
      fs.promises.unlink(abs).catch(() => {});
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /quadras/:id erro:", err);
    res.status(500).json({ erro: "Falha ao excluir quadra" });
  }
});

module.exports = router;
