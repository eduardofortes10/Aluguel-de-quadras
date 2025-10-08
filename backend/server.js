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

// ===== App =====
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
        try {
          return new RegExp(s.slice(1, -1));
        } catch {
          return s;
        }
      }
      return s;
    });
}
const allowed = parseOrigins(process.env.FRONTEND_ORIGINS || "");
console.log("🌐 CORS allowed origins:", allowed);

function isAllowedOrigin(origin) {
  if (!origin) return true; // curl/healthz
  if (allowed.length === 0) return true;
  return allowed.some(o => (o instanceof RegExp ? o.test(origin) : o === origin));
}

function corsOrigin(origin, cb) {
  const ok = isAllowedOrigin(origin);
  return cb(ok ? null : new Error("CORS_ORIGIN_NOT_ALLOWED"), ok);
}

app.use(cors({
  origin: corsOrigin,
  credentials: true, // deixe true apenas se estiver usando cookies/sessão
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));
app.options("*", cors({ origin: corsOrigin, credentials: true }));

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
// aplique o limiter diretamente na rota /login do router de auth
app.use("/api/auth", require("./routes/auth")(loginLimiter));
app.use("/api/quadras", require("./routes/quadras"));

app.use("/api/favoritos", auth, require("./routes/favoritos"));
app.use("/api/alugueis", auth, require("./routes/alugueis"));
app.use("/api/notificacoes", auth, require("./routes/notificacoes"));
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

// ====== Socket.IO ======
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    // Para Socket.IO v4, podemos usar função (origin, cb)
    origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
    methods: ["GET", "POST"],
    credentials: true,
  },
  // timeout/upgrade padrões funcionam bem no Render
});

// Disponibiliza o io para uso nas rotas: req.app.get('io')
app.set("io", io);

// Eventos básicos
io.on("connection", (socket) => {
  console.log("🔌 socket conectado:", socket.id);

  // Entrar numa sala por conversa
  socket.on("join_conversation", (conversaId) => {
    const room = `conv:${conversaId}`;
    socket.join(room);
    // opcional: notificar entrada
    // socket.to(room).emit("user:joined", { socketId: socket.id });
  });

  socket.on("leave_conversation", (conversaId) => {
    socket.leave(`conv:${conversaId}`);
  });

  // Indicador de digitação (opcional)
  socket.on("typing", ({ conversaId, usuarioId, typing }) => {
    socket.to(`conv:${conversaId}`).emit("typing", { usuarioId, typing });
  });

  socket.on("disconnect", () => {
    console.log("🔌 socket desconectado:", socket.id);
  });
});

// ====== Start ======
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
server.listen(PORT, HOST, () => {
  console.log(`🚀 API ouvindo em http://${HOST}:${PORT}`);
  console.log(`📣 Socket.IO ligado em ${PORT}`);
  console.log(`📂 Uploads: ${uploadDir}`);
  console.log(`👤 Avatars: ${avatarsDir}`);
});

// Exporta apenas o app para manter compatibilidade, io pode ser acessado via req.app.get('io')
module.exports = app;
