const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
   const dir = path.resolve(__dirname, "..", "..", "public", "avatars");

    fs.mkdirSync(dir, { recursive: true }); // <-- Garante que toda a estrutura de pasta exista
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `user_${Date.now()}${ext}`;
    cb(null, filename);
  },
});


const upload = multer({ storage });

// POST - Enviar nova imagem de perfil
router.post("/upload", upload.single("avatar"), async (req, res) => {
  const { usuario_id } = req.body;
  const imagem_url = req.file?.filename;

  if (!usuario_id || !imagem_url) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  try {
    await db.execute(
      "INSERT INTO fotos_perfil (usuario_id, imagem_url) VALUES (?, ?)",
      [usuario_id, imagem_url]
    );
    res.status(201).json({ url: imagem_url });
  } catch (err) {
    console.error("Erro ao salvar imagem:", err);
    res.status(500).json({ erro: "Erro ao salvar imagem" });
  }
});

// GET - Obter imagem atual
router.get("/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT imagem_url FROM fotos_perfil WHERE usuario_id = ? ORDER BY criado_em DESC LIMIT 1",
      [usuario_id]
    );
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar imagem" });
  }
});

module.exports = router;
