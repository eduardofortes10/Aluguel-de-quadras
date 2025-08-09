// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// --------- CORS ----------
const allowedOrigins = [
  'http://localhost:5173',
  'https://aluguel-de-quadras-xomr.vercel.app',        // prod vercel
  /\.vercel\.app$/,                                     // qualquer preview *.vercel.app
];

app.use((req, res, next) => {
  res.setHeader('Vary', 'Origin'); // para proxies/CDN
  next();
});

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // curl/healthcheck
    const ok = allowedOrigins.some((o) =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    if (ok) {
      return cb(null, true);
    } else {
      console.warn('[CORS] blocked origin:', origin);
      // em vez de lançar erro (que derruba headers), retornamos false:
      return cb(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


// aplica CORS antes de tudo
app.use(cors(corsOptions));
// garante preflight em qualquer rota
app.options('*', cors(corsOptions));

// --------- Body parser ----------
app.use(express.json({ limit: '10mb' }));

// --------- Rotas ----------
const authRoutes = require('./routes/auth');
const quadrasRoutes = require('./routes/quadras');
const favoritosRoutes = require('./routes/favoritos');
const conversasRoutes = require('./routes/conversas');
const alugueisRoutes = require('./routes/alugueis');
const fotosPerfilRoutes = require('./routes/fotosPerfil');
const notificacoesRoutes = require('./routes/notificacoes');
const usuariosRoutes = require('./routes/usuarios');

app.use('/api/auth', authRoutes);
app.use('/api/quadras', quadrasRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/conversas', conversasRoutes);
app.use('/api/alugueis', alugueisRoutes);
app.use('/api/fotos-perfil', fotosPerfilRoutes);
app.use('/api/notificacoes', notificacoesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// --------- Arquivos estáticos (sempre PATH, nunca URL) ----------
app.use('/quadras', express.static(path.join(__dirname, 'public', 'quadras')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/avatars', express.static(path.join(__dirname, 'uploads/avatars')));
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

// --------- Health ----------
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev' });
});

// --------- Debug do banco (ajuda a checar conexão/qual DB) ----------
const db = require('./db');
app.get('/api/_debug/db', async (req, res) => {
  try {
    const [dbres] = await db.query('SELECT DATABASE() AS db');
    const [cnt] = await db.query('SELECT COUNT(*) AS total FROM fotos_perfil');
    res.json({ db: dbres[0]?.db, fotos_perfil_total: cnt[0]?.total });
  } catch (e) {
    console.error('DB debug error:', e);
    res.status(500).json({ erro: e.message });
  }
});

// --------- Erros globais ----------
process.on('uncaughtException', (err) => console.error('❌ uncaught:', err));
process.on('unhandledRejection', (err) => console.error('❌ unhandled:', err));

// --------- Start ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API on ${PORT}`);
});
