// server.js
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const morgan = require("morgan");

const app = express();
app.set("trust proxy", 1);

// CORS
const envOrigins = (process.env.FRONTEND_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...envOrigins,
  /\.vercel\.app$/i,
];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      const ok = allowedOrigins.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin
      );
      return cb(null, ok);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(morgan("dev"));

// Uploads (usa UPLOAD_DIR se existir; senão ./uploads)
const uploadDir =
  process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ servir /uploads (origem) e /api/uploads (alias p/ quando baseURL termina em /api)
app.use("/uploads", express.static(uploadDir, { maxAge: "7d", index: false }));
app.use("/api/uploads", express.static(uploadDir, { maxAge: "7d", index: false }));

// Rotas básicas
app.get("/", (_req, res) => res.send("API OK"));
app.get("/healthz", (_req, res) =>
  res.json({ ok: true, uptime: process.uptime(), ts: Date.now() })
);

// Suas rotas
app.use("/api/quadras", require("./routes/quadras"));
app.use("/api/alugueis", require("./routes/alugueis"));
app.use("/api/favoritos", require("./routes/favoritos"));
app.use("/api/notificacoes", require("./routes/notificacoes"));
app.use("/api/fotos-perfil", require("./routes/fotosPerfil"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));

// 404
app.use((req, res, next) => {
  if (req.path.startsWith("/uploads/") || req.path.startsWith("/api/uploads/")) return next();
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Erros
app.use((err, _req, res, _next) => {
  console.error("🔥 Erro:", err);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ erro: "Arquivo muito grande (limite 8MB)." });
  }
  if (err.message && /CORS|Origin/i.test(err.message)) {
    return res.status(403).json({ erro: "Origem não autorizada" });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }
  res.status(500).json({ erro: err.message || "Erro interno do servidor" });
});

// Start
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () =>
  console.log(`🚀 API ouvindo em http://${HOST}:${PORT} | Uploads: ${uploadDir}`)
);

module.exports = app;
