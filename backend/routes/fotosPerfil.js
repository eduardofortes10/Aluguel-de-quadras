// backend/routes/fotosPerfil.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// pasta de avatares (mesma do server.js: public/avatars)
const avatarsDir = process.env.AVATARS_DIR
  ? path.resolve(process.env.AVATARS_DIR)
  : path.join(__dirname, "..", "public", "avatars");
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, avatarsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeBase = path.basename(file.originalname || "user", ext).replace(/\s+/g, "_");
    cb(null, `user_${Math.random().toString(36).slice(2)}-${Date.now()}${ext || ".png"}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype?.startsWith("image/")) return cb(new Error("Apenas imagens"));
    cb(null, true);
  },
});

// detecta se a coluna existe
async function hasColumn(table, column) {
  const [rows] = await db.query(
    `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows.length > 0;
}

// GET /api/fotos-perfil/:id -> { imagem_url: "/avatars/arquivo.png" }
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let url = null;

    if (await hasColumn("usuarios", "foto")) {
      const [r] = await db.query("SELECT foto FROM usuarios WHERE id = ?", [id]);
      url = r?.[0]?.foto || null;
    } else {
      const [r] = await db.query(
        "SELECT imagem_url FROM fotos_perfil WHERE usuario_id = ? ORDER BY id DESC LIMIT 1",
        [id]
      );
      url = r?.[0]?.imagem_url || null;
    }

    if (!url) url = "/avatars/default.png";

    // força caminho relativo /avatars/...
    if (!/^https?:\/\//i.test(url)) {
      const idx = url.indexOf("/avatars/");
      url = idx >= 0 ? url.slice(idx) : `/avatars/${path.basename(url)}`;
    }

    res.json({ imagem_url: url });
  } catch (err) {
    console.error("GET /fotos-perfil/:id", err.message || err);
    res.json({ imagem_url: "/avatars/default.png" });
  }
});

// POST /api/fotos-perfil/upload  (field "avatar")
router.post("/upload", upload.single("avatar"), async (req, res) => {
  try {
    const { usuario_id } = req.body;
    if (!usuario_id) return res.status(400).json({ erro: "usuario_id é obrigatório" });

    const rel = `/avatars/${req.file.filename}`;

    if (await hasColumn("usuarios", "foto")) {
      await db.query("UPDATE usuarios SET foto = ? WHERE id = ?", [rel, usuario_id]);
    } else {
      await db.query(
        "INSERT INTO fotos_perfil (usuario_id, imagem_url, criado_em) VALUES (?,?,NOW())",
        [usuario_id, rel]
      );
    }

    res.json({ ok: true, imagem_url: rel });
  } catch (err) {
    console.error("POST /fotos-perfil/upload", err.message || err);
    res.status(500).json({ erro: "Falha no upload" });
  }
});

module.exports = router;
