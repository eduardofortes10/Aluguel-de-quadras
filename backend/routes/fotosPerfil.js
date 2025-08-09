// backend/routes/fotosPerfil.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pasta pública para avatares (subindo 1 nível: backend/routes -> backend/public/avatars)
const AVATAR_DIR = path.resolve(__dirname, "..", "public", "avatars");
fs.mkdirSync(AVATAR_DIR, { recursive: true });

// Storage do multer salvando no /public/avatars com nome único
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".png";
    cb(null, `user_${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = /image\/(png|jpg|jpeg|webp|gif)/i.test(file.mimetype || "");
    return ok ? cb(null, true) : cb(new Error("Tipo de arquivo inválido"));
  },
});

/** Resolve a origem correta dos arquivos (Render, local, etc.) */
function getOrigin(req) {
  if (process.env.FILES_ORIGIN) return process.env.FILES_ORIGIN.replace(/\/+$/, "");
  const proto = (req.headers["x-forwarded-proto"] || req.protocol || "http").split(",")[0].trim();
  const host = (req.headers["x-forwarded-host"] || req.get("host") || "").split(",")[0].trim();
  return `${proto}://${host}`.replace(/\/+$/, "");
}

/** Upload de avatar */
router.post("/upload", upload.single("avatar"), async (req, res) => {
  try {
    const usuarioId = Number(req.body.usuario_id);
    if (!usuarioId || !req.file) {
      return res.status(400).json({ erro: "Faltando usuario_id ou arquivo" });
    }

    const filename = req.file.filename; // salvamos somente o nome
    await db.execute(
      "INSERT INTO fotos_perfil (usuario_id, imagem_url) VALUES (?, ?)",
      [usuarioId, filename]
    );

    const ORIGIN = getOrigin(req);
    return res.json({
      ok: true,
      imagem_url: `${ORIGIN}/avatars/${filename}`,
    });
  } catch (err) {
    console.error("Erro no upload de foto:", err);
    return res.status(500).json({ erro: "Erro no upload de foto" });
  }
});

/** Busca última foto do usuário (ou default.png) */
// no topo já tem: const path = require("path");

// ...
/** Busca última foto do usuário (ou default.png) */
router.get("/:usuarioId", async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);
    const ORIGIN = getOrigin(req);

    if (!usuarioId) {
      return res.json({ imagem_url: `${ORIGIN}/avatars/default.png` });
    }

    let rows;
    try {
      [rows] = await db.execute(
        "SELECT imagem_url FROM fotos_perfil WHERE usuario_id = ? ORDER BY criado_em DESC LIMIT 1",
        [usuarioId]
      );
    } catch {
      [rows] = await db.execute(
        "SELECT imagem_url FROM fotos_perfil WHERE usuario_id = ? ORDER BY id DESC LIMIT 1",
        [usuarioId]
      );
    }

    if (!rows || rows.length === 0 || !rows[0].imagem_url) {
      return res.json({ imagem_url: `${ORIGIN}/avatars/default.png` });
    }

    // 🔒 blindagem: garante que vamos responder sempre /avatars/<arquivo>
    const raw = String(rows[0].imagem_url || "").trim();
    const base = path.basename(raw); // ex: "user_1754....png"
    const full = `${ORIGIN}/avatars/${base}`;

    return res.json({ imagem_url: full });
  } catch (err) {
    console.error("Erro ao buscar foto de perfil:", err);
    return res.status(500).json({ erro: "Erro ao buscar foto de perfil" });
  }
});


module.exports = router;
