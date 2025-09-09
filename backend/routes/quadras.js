// backend/routes/quadras.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const auth = require("../middleware/auth");

// ====== Uploads ======
const uploadRoot = process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path
      .basename(file.originalname || "arquivo", ext)
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "");
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2)}_${base}${ext || ".png"}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB por arquivo
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      return cb(new Error("Apenas imagens são permitidas"));
    }
    cb(null, true);
  },
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
  schemaCache.cols = new Set(rows.map((r) => r.name));
  schemaCache.ts = now;
  return schemaCache.cols;
}
function hasCol(cols, c) {
  return cols.has(c);
}

function parseNumber(v) {
  if (v == null) return NaN;
  const n = Number(String(v).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}
function toRelUrl(absPath) {
  // guarda no banco como caminho relativo servido pelo express static
  return `/uploads/${path.basename(absPath)}`;
}
function parseImagensField(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    try {
      const arr = JSON.parse(val);
      return Array.isArray(arr) ? arr.filter(Boolean) : [];
    } catch {
      return [];
    }
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

    if (dono_id) {
      where.push("dono_id = ?");
      params.push(dono_id);
    }
    if (tipo) {
      where.push("tipo = ?");
      params.push(tipo);
    }
    if (q) {
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

// POST /api/quadras (PROTEGIDO) – cria quadra; dono_id vem do token
router.post("/", auth, upload.array("imagens", 10), async (req, res) => {
  try {
    const cols = await getQuadrasColumns();

    const {
      nome,
      local,
      preco,
      tipo,
      descricao,
      // dono_id do body é ignorado por segurança
      nota,
      // opcionais (só inserimos se existirem na tabela)
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      horario_inicio,
      horario_fim,
      status,
    } = req.body;

    const dono_id = req.user?.id; // força proprietário ser o usuário logado
    const precoNumber = parseNumber(preco);
    if (!nome || !local || !tipo || !dono_id || isNaN(precoNumber) || precoNumber <= 0) {
      return res.status(400).json({ erro: "Preencha nome, local, tipo e um preço válido." });
    }

    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length < 3) {
      return res.status(400).json({ erro: "Envie no mínimo 3 imagens." });
    }
    const imagens = files.map((f) => toRelUrl(path.join(uploadRoot, f.filename)));

    // ---- MONTAÇÃO CORRETA (sem splice) ----
    const fields = ["nome", "local", "preco", "tipo", "descricao", "dono_id", "nota", "imagens"];
    const placeholders = ["?", "?", "?", "?", "?", "?", "?", "?"];
    const values = [
      nome.trim(),
      local.trim(),
      precoNumber,
      String(tipo).trim(),
      (descricao || "").trim(),
      Number(dono_id),
      parseNumber(nota) || 0,
      JSON.stringify(imagens),
    ];

    // opcionais (só se a coluna existir mesmo)
    if (hasCol(cols, "cep")) {
      fields.push("cep");
      placeholders.push("?");
      values.push(cep || null);
    }
    if (hasCol(cols, "endereco")) {
      fields.push("endereco");
      placeholders.push("?");
      values.push(endereco || null);
    }
    if (hasCol(cols, "numero")) {
      fields.push("numero");
      placeholders.push("?");
      values.push(numero || null);
    }
    if (hasCol(cols, "complemento")) {
      fields.push("complemento");
      placeholders.push("?");
      values.push(complemento || null);
    }
    if (hasCol(cols, "bairro")) {
      fields.push("bairro");
      placeholders.push("?");
      values.push(bairro || null);
    }
    if (hasCol(cols, "cidade")) {
      fields.push("cidade");
      placeholders.push("?");
      values.push(cidade || null);
    }
    if (hasCol(cols, "uf")) {
      fields.push("uf");
      placeholders.push("?");
      values.push(uf || null);
    }
    if (hasCol(cols, "horario_inicio")) {
      fields.push("horario_inicio");
      placeholders.push("?");
      values.push(horario_inicio || null);
    }
    if (hasCol(cols, "horario_fim")) {
      fields.push("horario_fim");
      placeholders.push("?");
      values.push(horario_fim || null);
    }
    if (hasCol(cols, "status")) {
      fields.push("status");
      placeholders.push("?");
      values.push(status || "ativa");
    }

    // criado_em por último com NOW() (se existir a coluna)
    if (hasCol(cols, "criado_em")) {
      fields.push("criado_em");
      placeholders.push("NOW()");
    }

    const sql = `INSERT INTO quadras (${fields.join(",")}) VALUES (${placeholders.join(",")})`;
    const [result] = await db.query(sql, values);
    const id = result.insertId;

    const [[row]] = await db.query("SELECT * FROM quadras WHERE id = ?", [id]);
    return res.status(201).json(mapRow(row));
  } catch (err) {
    console.error("POST /quadras erro:", err.code || "", err.message || err);
    res.status(500).json({ erro: "Falha ao cadastrar quadra", detalhe: err.message || String(err) });
  }
});

// PATCH /api/quadras/:id  (PROTEGIDO) – atualização parcial somente pelo dono
router.patch("/:id", auth, upload.array("imagens", 10), async (req, res) => {
  const { id } = req.params;
  try {
    const cols = await getQuadrasColumns();

    // Verifica propriedade
    const [[ownerRow]] = await db.query("SELECT dono_id, imagens FROM quadras WHERE id = ?", [id]);
    if (!ownerRow) return res.status(404).json({ erro: "Quadra não encontrada" });
    if (Number(ownerRow.dono_id) !== Number(req.user.id)) {
      return res.status(403).json({ erro: "Você não tem permissão para editar esta quadra" });
    }

    const up = [];
    const params = [];

    // campos simples (se existem na tabela)
    // Obs: NÃO permitimos mudar dono_id por segurança
    const fields = [
      "nome",
      "local",
      "preco",
      "tipo",
      "descricao",
      "nota",
      "cep",
      "endereco",
      "numero",
      "complemento",
      "bairro",
      "cidade",
      "uf",
      "horario_inicio",
      "horario_fim",
      "status",
    ];
    for (const f of fields) {
      if (req.body[f] != null && hasCol(cols, f)) {
        if (f === "preco") {
          const n = parseNumber(req.body[f]);
          if (!isNaN(n)) {
            up.push(`${f} = ?`);
            params.push(n);
          }
        } else {
          up.push(`${f} = ?`);
          params.push(req.body[f]);
        }
      }
    }

    // novas imagens anexadas
    if (req.files && req.files.length && hasCol(cols, "imagens")) {
      const novas = req.files.map((f) => toRelUrl(path.join(uploadRoot, f.filename)));
      const antigas = parseImagensField(ownerRow?.imagens);
      const merged = [...antigas, ...novas].slice(0, 10);
      up.push("imagens = ?");
      params.push(JSON.stringify(merged));
    }

    if (!up.length) return res.status(400).json({ erro: "Nenhum campo válido para atualizar" });

    const sql = `UPDATE quadras SET ${up.join(", ")} WHERE id = ?`;
    params.push(id);
    await db.query(sql, params);

    const [[row2]] = await db.query("SELECT * FROM quadras WHERE id = ?", [id]);
    if (!row2) return res.status(404).json({ erro: "Quadra não encontrada" });
    res.json(mapRow(row2));
  } catch (err) {
    console.error("PATCH /quadras/:id erro:", err.code || "", err.message || err);
    res.status(500).json({ erro: "Falha ao atualizar quadra" });
  }
});

// DELETE /api/quadras/:id (PROTEGIDO) – somente pelo dono
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    // pega imagens e verifica dono
    const [[row]] = await db.query("SELECT dono_id, imagens FROM quadras WHERE id = ?", [id]);
    if (!row) return res.status(404).json({ erro: "Quadra não encontrada" });
    if (Number(row.dono_id) !== Number(req.user.id)) {
      return res.status(403).json({ erro: "Você não tem permissão para excluir esta quadra" });
    }

    const imgs = parseImagensField(row.imagens);

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
