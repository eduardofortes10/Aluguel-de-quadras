const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const notificacoesRoutes = require('./routes/notificacoes');

// Rotas externas
const authRoutes = require('./routes/auth');
const quadrasRoutes = require('./routes/quadras');
const favoritosRoutes = require('./routes/favoritos');
const conversasRoutes = require('./routes/conversas'); // Chat
const alugueisRoutes = require('./routes/alugueis');

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/quadras', quadrasRoutes);
app.use('/api/conversas', conversasRoutes); // Chat
app.use('/api/notificacoes', notificacoesRoutes);
app.use('/api/alugueis', alugueisRoutes);
// Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicialização do servidor
process.on('uncaughtException', (err) => {
  console.error('❌ Erro não tratado:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Promessa rejeitada:', err);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
