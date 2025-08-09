const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// --- CORS ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://aluguel-de-quadras-xomr.vercel.app', // produção
  /\.vercel\.app$/                               // qualquer preview da Vercel
];

app.use((req, res, next) => {
  res.setHeader('Vary', 'Origin');
  next();
});

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // healthcheck/curl
    const ok = allowedOrigins.some((o) =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    return ok ? cb(null, true) : cb(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // <- NADA de 'https://*'

// --- Body parser ---
app.use(express.json());

// --- Rotas ---
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

// --- Arquivos estáticos (sempre paths) ---
app.use('/quadras', express.static(path.join(__dirname, 'public', 'quadras')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/avatars', express.static(path.join(__dirname, 'uploads/avatars')));
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev' });
});

// --- Inicialização ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API on ${PORT}`);
});
