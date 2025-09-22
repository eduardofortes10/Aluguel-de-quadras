// server.js
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const auth = require("./middleware/auth");

const app = express();
app.set("trust proxy", 1);

// ====== Paths estáticos ======
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, "uploads");
const avatarsDir = process.env.AVATARS_DIR || path.join(__dirname, "public", "avatars");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

// ====== CORS ======
function parseOrigins(env) {
  return (env || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      if (s.startsWith("/") && s.endsWith("/")) {
        try { return new RegExp(s.slice(1, -1)); } catch { return s; }
      }
      return s;
    });
}
const allowed = parseOrigins(process.env.FRONTEND_ORIGINS || "");
console.log("🌐 CORS allowed origins:", allowed);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // curl/healthz
    const ok = allowed.length === 0 || allowed.some(o => o instanceof RegExp ? o.test(origin) : o === origin);
    return cb(ok ? null : new Error("CORS_ORIGIN_NOT_ALLOWED"), ok ? true : false);
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

// ====== Middlewares globais ======
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("tiny"));

// ====== Arquivos estáticos ======
app.use("/uploads", express.static(uploadDir, { maxAge: "7d", index: false }));
app.use("/avatars", express.static(avatarsDir, {
  maxAge: "7d",
  index: false,
  setHeaders: (res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  }
}));

// ====== Healthcheck ======
app.get("/healthz", (_req, res) => res.json({ ok: true }));

// ====== Rate limit em endpoints sensíveis ======
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// ====== Rotas ======
app.use("/api/auth/login", loginLimiter, require("./routes/auth"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/quadras", require("./routes/quadras"));

app.use("/api/favoritos", auth, require("./routes/favoritos"));
app.use("/api/alugueis", auth, require("./routes/alugueis"));
app.use("/api/notificacoes", auth, require("./routes/notificacoes"));
// manter a rota antiga e expor também a rota curta usada pelo front
app.use("/api/chat/conversas", auth, require("./routes/conversas"));
app.use("/api/conversas",     auth, require("./routes/conversas"));
app.use("/api/fotos-perfil", auth, require("./routes/fotosPerfil"));
app.use("/api/usuarios", auth, require("./routes/usuarios"));

// ====== 404 ======
app.use((req, res) => {
  if (req.path === "/" || req.path === "/index.html") {
    return res.status(200).send("API de aluguel de quadras");
  }
  return res.status(404).json({ erro: "Rota não encontrada" });
});

// ====== Error handler ======
app.use((err, _req, res, _next) => {
  if (err && err.message === "CORS_ORIGIN_NOT_ALLOWED") {
    return res.status(403).json({ erro: "Origem não autorizada" });
  }
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }
  console.error("🔥 Unhandled error:", err);
  res.status(500).json({ erro: err?.message || "Erro interno do servidor" });
});

// ====== Start ======
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`🚀 API ouvindo em http://${HOST}:${PORT}`);
  console.log(`📂 Uploads: ${uploadDir}`);
  console.log(`👤 Avatars: ${avatarsDir}`);
});

module.exports = app;
