const express = require("express");
const router = express.Router();
const db = require("../db"); // conexão com mysql2/promise
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Diretório para uploads
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ===== POST - Cadastrar quadra ===== */
router.post("/", upload.array("imagens", 10), async (req, res) => {
  console.log("📩 Rota POST /api/quadras chamada");

  try {
    const { nome, local, preco, tipo, descricao, dono_id, nota } = req.body;
    const imagens = req.files?.map((file) => `/uploads/${file.filename}`) || [];
    const imagens_json = JSON.stringify(imagens);

    if (!dono_id) {
      return res.status(400).json({ error: "dono_id é obrigatório" });
    }

    const query = `
      INSERT INTO quadras (nome, local, preco, tipo, descricao, dono_id, nota, imagens)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      nome,
      local,
      preco,
      tipo,
      descricao,
      dono_id,
      nota,
      imagens_json,
    ]);

    console.log("✅ Quadra cadastrada com sucesso. ID:", result.insertId);
    res.status(200).json({ message: "Quadra cadastrada com sucesso" });
  } catch (err) {
    console.error("❌ Erro ao cadastrar quadra:", err);
    res.status(500).json({ error: "Erro ao cadastrar quadra" });
  }
});

/* ===== GET - Listar quadras por dono_id ===== */
router.get("/", async (req, res) => {
  const { dono_id } = req.query;
  let query = "SELECT * FROM quadras";
  const params = [];

  if (dono_id) {
    query += " WHERE dono_id = ?";
    params.push(dono_id);
  }

  try {
    const [results] = await db.query(query, params);

    const dadosTratados = results.map((quadra) => {
      try {
        if (typeof quadra.imagens === "string") {
          quadra.imagens = JSON.parse(quadra.imagens);
        }
        if (!Array.isArray(quadra.imagens)) {
          quadra.imagens = [];
        }
      } catch {
        quadra.imagens = [];
      }
      return quadra;
    });

    res.json(dadosTratados);
  } catch (err) {
    console.error("❌ Erro na query:", err);
    res.status(500).json({ error: "Erro ao buscar quadras" });
  }
});

/* ===== GET - Detalhes de uma quadra ===== */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query(`
      SELECT q.*, u.nome AS dono_nome, u.email AS dono_email
      FROM quadras q
      JOIN usuarios u ON q.dono_id = u.id
      WHERE q.id = ?
    `, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Quadra não encontrada" });
    }

    const quadra = results[0];
    try {
      if (typeof quadra.imagens === "string") {
        quadra.imagens = JSON.parse(quadra.imagens);
      }
      if (!Array.isArray(quadra.imagens)) {
        quadra.imagens = [];
      }
    } catch {
      quadra.imagens = [];
    }

    res.json(quadra);
  } catch (err) {
    console.error("❌ Erro ao buscar detalhes:", err);
    res.status(500).json({ error: "Erro ao buscar detalhes da quadra" });
  }
});

/* ===== DELETE - Deletar quadra ===== */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query("SELECT imagens FROM quadras WHERE id = ?", [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: "Quadra não encontrada" });
    }

    let imagens = [];
    try {
      imagens = JSON.parse(results[0].imagens || "[]");
    } catch {
      imagens = [];
    }

    await db.query("DELETE FROM quadras WHERE id = ?", [id]);

    imagens.forEach((imgPath) => {
      const fullPath = path.join(__dirname, "..", imgPath);
      fs.unlink(fullPath, (err) => {
        if (err) console.warn("⚠️ Erro ao deletar imagem:", fullPath);
      });
    });

    res.json({ message: "Quadra deletada com sucesso" });
  } catch (err) {
    console.error("❌ Erro ao deletar quadra:", err);
    res.status(500).json({ error: "Erro ao deletar quadra" });
  }
});

/* ===== GET - Filtro usando imagens_quadras ===== */
router.get("/imagens", async (req, res) => {
  const { tipo, preco, avaliacao } = req.query;
  let query = "SELECT * FROM imagens_quadras WHERE 1=1";
  const params = [];

  if (tipo && tipo.toLowerCase() !== "todos") {
    const tipoLower = tipo.toLowerCase();
    if (["futsal", "vôlei", "volei", "basquete"].includes(tipoLower)) {
      query += " AND LOWER(tipo) = 'poliesportiva'";
    } else if (tipoLower === "campo") {
      query += " AND (LOWER(tipo) = 'futebol' OR LOWER(tipo) = 'golfe')";
    } else {
      query += " AND LOWER(tipo) = ?";
      params.push(tipoLower);
    }
  }

  if (preco) {
    query += " AND preco <= ?";
    params.push(Number(preco));
  }

  if (avaliacao) {
    const avaliacoes = Array.isArray(avaliacao) ? avaliacao : [avaliacao];
    if (avaliacoes.length > 0) {
      query += ` AND FLOOR(avaliacao) IN (${avaliacoes.map(() => "?").join(",")})`;
      params.push(...avaliacoes.map(Number));
    }
  }

  try {
    const [results] = await db.query(query, params);
    res.json(results);
  } catch (err) {
    console.error("❌ Erro ao buscar quadras filtradas:", err);
    res.status(500).json({ error: "Erro ao buscar quadras filtradas" });
  }
});

module.exports = router;
