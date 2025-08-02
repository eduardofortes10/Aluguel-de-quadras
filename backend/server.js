const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Rotas externas
const authRoutes = require('./routes/auth');
const quadrasRoutes = require('./routes/quadras');
const favoritosRoutes = require('./routes/favoritos');
const conversasRoutes = require('./routes/conversas');
const alugueisRoutes = require('./routes/alugueis');
const fotosPerfilRoutes = require('./routes/fotosPerfil');
const notificacoesRoutes = require('./routes/notificacoes');
const usuariosRoutes = require('./routes/usuarios');
// Middlewares
app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/quadras', quadrasRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/conversas', conversasRoutes);
app.use('/api/alugueis', alugueisRoutes);
app.use('/api/fotos-perfil', fotosPerfilRoutes);
app.use('/api/notificacoes', notificacoesRoutes);
app.use('/api/usuarios', usuariosRoutes);
// Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/avatars', express.static(path.join(__dirname, 'uploads/avatars'))); // Para servir imagens de perfil
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

// Tratamento de erros não tratados
process.on('uncaughtException', (err) => {
  console.error('❌ Erro não tratado:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('❌ Promessa rejeitada:', err);
});

// Inicialização
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
