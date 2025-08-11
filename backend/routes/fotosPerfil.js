// backend/routes/fotosPerfil.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Diretório público dos avatares (backend/public/avatars)
const AVATAR_DIR = path.resolve(__dirname, "..", "public", "avatars");
fs.mkdirSync(AVATAR_DIR, { recursive: true });

function getOrigin(req) {
  if (process.env.FILES_ORIGIN) return process.env.FILES_ORIGIN.replace(/\/+$/, "");
  const proto = (req.headers["x-forwarded-proto"] || req.protocol || "http").split(",")[0].trim();
  const host = (req.headers["x-forwarded-host"] || req.get("host") || "").split(",")[0].trim();
  return `${proto}://${host}`.replace(/\/+$/, "");
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".png";
    const safe = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
    cb(null, `user_${safe}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /image\/(png|jpg|jpeg|webp|gif)/i.test(file.mimetype || "");
    cb(ok ? null : new Error("Tipo de arquivo inválido"), ok);
  },
});

// POST /api/fotos-perfil/upload
router.post("/upload", upload.single("avatar"), async (req, res) => {
  try {
    const usuarioId = Number(req.body.usuario_id);
    if (!usuarioId || !req.file) {
      return res.status(400).json({ erro: "Faltando usuario_id ou arquivo" });
    }

    const filename = req.file.filename;
    await db.execute(
      `INSERT INTO fotos_perfil (usuario_id, imagem_url, data)
       VALUES (?, ?, NOW())`,
      [usuarioId, filename]
    );

    const ORIGIN = getOrigin(req);
    res.json({ ok: true, imagem_url: `${ORIGIN}/avatars/${filename}` });
  } catch (err) {
    console.error("Erro no upload de foto:", err);
    res.status(500).json({ erro: "Erro no upload de foto" });
  }
});

// GET /api/fotos-perfil/:usuarioId
router.get("/:usuarioId", async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);
    const ORIGIN = getOrigin(req);
    const fallback = `${ORIGIN}/avatars/default.png`;

    if (!usuarioId) return res.json({ imagem_url: fallback });

    const [rows] = await db.execute(
      `SELECT imagem_url
         FROM fotos_perfil
        WHERE usuario_id = ?
        ORDER BY data DESC, id DESC
        LIMIT 1`,
      [usuarioId]
    );

    if (!rows?.length) return res.json({ imagem_url: fallback });

    const filename = path.basename(String(rows[0].imagem_url || "").trim());
    const diskPath = path.join(AVATAR_DIR, filename);
    if (!fs.existsSync(diskPath)) return res.json({ imagem_url: fallback });

    res.json({ imagem_url: `${ORIGIN}/avatars/${filename}` });
  } catch (err) {
    console.error("Erro ao buscar foto:", err);
    res.status(500).json({ erro: "Falha ao buscar foto" });
  }
});

module.exports = router;
