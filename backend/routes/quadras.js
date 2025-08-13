// backend/routes/quadras.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// ====== Uploads ======
const uploadRoot = process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path.basename(file.originalname || "arquivo", ext).replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB por arquivo
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      return cb(new Error("Apenas imagens são permitidas"));
    }
    cb(null, true);
  }
});

// ====== Helpers ======
const schemaCache = { cols: null, ts: 0, ttl: 5 * 60 * 1000 }; // 5 min
async function getQuadrasColumns() {
  const now = Date.now();
  if (schemaCache.cols && now - schemaCache.ts < schemaCache.ttl) return schemaCache.cols;
  const sql = `
    SELECT COLUMN_NAME AS name
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'quadras'
  `;
  const [rows] = await db.query(sql);
  schemaCache.cols = new Set(rows.map(r => r.name));
  schemaCache.ts = now;
  return schemaCache.cols;
}
function hasCol(cols, c) { return cols.has(c); }

function parseNumber(v) {
  if (v == null) return NaN;
  const n = Number(String(v).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}
function toRelUrl(absPath) {
  // guarda em banco como caminho relativo servido pelo express static
  return `/uploads/${path.basename(absPath)}`;
}
function parseImagensField(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try { const arr = JSON.parse(val); return Array.isArray(arr) ? arr : []; }
    catch { return []; }
  }
  return [];
}
function mapRow(r) {
  const row = { ...r };
  row.imagens = parseImagensField(r.imagens);
  return row;
}

// ====== ROTAS ======

// GET /api/quadras?dono_id=&tipo=&q=&status=&limit=&offset=
router.get("/", async (req, res) => {
  const { dono_id, tipo, q, status, limit = 50, offset = 0 } = req.query;
  try {
    const cols = await getQuadrasColumns();
    let sql = "SELECT * FROM quadras";
    const where = [];
    const params = [];

    if (dono_id) { where.push("dono_id = ?"); params.push(dono_id); }
    if (tipo) { where.push("tipo = ?"); params.push(tipo); }
    if (q) {
      // busca simples por nome/local
      where.push("(nome LIKE ? OR local LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (status && hasCol(cols, "status")) {
      where.push("status = ?");
      params.push(status);
    }
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY id DESC";
    sql += " LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));

    const [rows] = await db.query(sql, params);
    res.json(rows.map(mapRow));
  } catch (err) {
    console.error("GET /quadras erro:", err.code || "", err.message || err);
    res.status(500).json({ erro: "Falha ao listar quadras" });
  }
});

// GET /api/quadras/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM quadras WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ erro: "Quadra não encontrada" });
    res.json(mapRow(rows[0]));
  } catch (err) {
    console.error("GET /quadras/:id erro:", err.code || "", err.message || err);
    res.status(500).json({ erro: "Falha ao obter quadra" });
  }
});

// POST /api/quadras
router.post("/", upload.array("imagens", 10), async (req, res) => {
  try {
    const cols = await getQuadrasColumns();

    const {
      nome, local, preco, tipo, descricao,
      dono_id, nota,
      // campos adicionais (só serão usados se existirem)
      cep, endereco, numero, complemento, bairro, cidade, uf,
      horario_inicio, horario_fim, status
    } = req.body;

    const precoNumber = parseNumber(preco);
    if (!nome || !local || !tipo || !dono_id || isNaN(precoNumber) || precoNumber <= 0) {
      return res.status(400).json({ erro: "Preencha nome, local, tipo, dono_id e um preço válido." });
    }

    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length < 3) {
      return res.status(400).json({ erro: "Envie no mínimo 3 imagens." });
    }
    const imagens = files.map(f => toRelUrl(path.join(uploadRoot, f.filename)));

    // Monta INSERT apenas com as colunas que existem
    const fields = ["nome", "local", "preco", "tipo", "descricao", "dono_id", "nota", "imagens", "criado_em"];
    const values = [nome.trim(), local.trim(), precoNumber, String(tipo).trim(), (descricao || "").trim(), Number(dono_id), parseNumber(nota) || 0, JSON.stringify(imagens), /* NOW() placeholder */];
    const placeholders = ["?", "?", "?", "?", "?", "?", "?", "?", "NOW()"];

    // opcionais
    if (hasCol(cols, "cep")) { fields.push("cep"); values.splice(values.length - 1, 0, cep || null); placeholders.splice(placeholders.length - 1, 0, "?"); }
    if (hasCol(cols, "endereco")) { fields.push("endereco"); values.splice(values.length - 1, 0, endereco || null); placeholders.splice(placeholders.length - 1, 0, "?"); }
    if (hasCol(cols, "numero")) { fields.push("numero"); values.splice(values.length - 1, 0, numero || null); placeholders.splice(placeholders.length - 1, 0, "?"); }
    if (hasCol(cols, "complemento")) { fields.push("complemento"); values.splice(values.length - 1, 0, complemento || null); placeholders.splice(placeholders.length - 1, 0, "?"); }
    if (hasCol(cols, "bairro")) { fields.push("bairro"); values.splice(values.length - 1, 0, bairro || null); placeholders.splice(placeholders.length - 1, 0, "?"); }
    if (hasCol(cols, "cidade")) { fields.push("cidade"); values.splice(values.length - 1, 0, cidade || null); placeholders.splice(placeholders.length - 1, 0, "?"); }
    if (hasCol(cols, "uf")) { fields.push("uf"); values.splice(values.length - 1, 0, uf || null); placeholders.splice(placeholders.length - 1, 0, "?"); }
    if (hasCol(cols, "horario_inicio")) { fields.push("horario_inicio"); values.splice(values.length - 1, 0, horario_inicio || null); placeholders.splice(placeholders.length - 1, 0, "?"); }
    if (hasCol(cols, "horario_fim")) { fields.push("horario_fim"); values.splice(values.length - 1, 0, horario_fim || null); placeholders.splice(placeholders.length - 1, 0, "?"); }
    if (hasCol(cols, "status")) {
      fields.push("status");
      values.splice(values.length - 1, 0, status || "ativa");
      placeholders.splice(placeholders.length - 1, 0, "?");
    }

    const sql = `INSERT INTO quadras (${fields.join(",")}) VALUES (${placeholders.join(",")})`;

    const [result] = await db.query(sql, values);
    const id = result.insertId;

    const [rows] = await db.query("SELECT * FROM quadras WHERE id = ?", [id]);
    const row = rows[0] || null;
    if (!row) return res.status(201).json({ id, imagens });

    res.status(201).json(mapRow(row));
  } catch (err) {
    console.error("POST /quadras erro:", err.code || "", err.message || err);
    res.status(500).json({ erro: "Falha ao cadastrar quadra", detalhe: err.message || String(err) });
  }
});

// PATCH /api/quadras/:id  (atualização parcial)
router.patch("/:id", upload.array("imagens", 10), async (req, res) => {
  const { id } = req.params;
  try {
    const cols = await getQuadrasColumns();

    const up = [];
    const params = [];

    // campos simples
    const fields = ["nome","local","preco","tipo","descricao","nota","dono_id","cep","endereco","numero","complemento","bairro","cidade","uf","horario_inicio","horario_fim","status"];
    for (const f of fields) {
      if (req.body[f] != null && hasCol(cols, f)) {
        if (f === "preco") {
          const n = parseNumber(req.body[f]);
          if (!isNaN(n)) { up.push(`${f} = ?`); params.push(n); }
        } else {
          up.push(`${f} = ?`);
          params.push(req.body[f]);
        }
      }
    }

    // imagens novas (se enviadas)
    if (req.files && req.files.length) {
      const novas = req.files.map(f => toRelUrl(path.join(uploadRoot, f.filename)));
      if (hasCol(cols, "imagens")) {
        // junta com as antigas
        const [rows] = await db.query("SELECT imagens FROM quadras WHERE id = ?", [id]);
        const antigas = parseImagensField(rows[0]?.imagens);
        const merged = [...antigas, ...novas].slice(0, 10);
        up.push("imagens = ?");
        params.push(JSON.stringify(merged));
      }
    }

    if (!up.length) return res.status(400).json({ erro: "Nenhum campo válido para atualizar" });

    const sql = `UPDATE quadras SET ${up.join(", ")} WHERE id = ?`;
    params.push(id);
    await db.query(sql, params);

    const [rows2] = await db.query("SELECT * FROM quadras WHERE id = ?", [id]);
    if (!rows2.length) return res.status(404).json({ erro: "Quadra não encontrada" });
    res.json(mapRow(rows2[0]));
  } catch (err) {
    console.error("PATCH /quadras/:id erro:", err.code || "", err.message || err);
    res.status(500).json({ erro: "Falha ao atualizar quadra" });
  }
});

// DELETE /api/quadras/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // pega imagens para tentar apagar do disco
    const [rows] = await db.query("SELECT imagens FROM quadras WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ erro: "Quadra não encontrada" });

    const imgs = parseImagensField(rows[0].imagens);

    await db.query("DELETE FROM quadras WHERE id = ?", [id]);

    // tenta remover arquivos locais (não falha se não achar)
    for (const rel of imgs) {
      if (typeof rel !== "string" || !rel.startsWith("/uploads/")) continue;
      const abs = path.join(uploadRoot, path.basename(rel));
      fs.promises.unlink(abs).catch(() => {});
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /quadras/:id erro:", err.code || "", err.message || err);
    res.status(500).json({ erro: "Falha ao excluir quadra" });
  }
});

module.exports = router;
