const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Rotas externas
const authRoutes = require('./routes/auth');
const quadrasRoutes = require('./routes/quadras');
const favoritosRoutes = require('./routes/favoritos');
const conversasRoutes = require('./routes/conversas'); // Chat

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/quadras', quadrasRoutes);
app.use('/api/conversas', conversasRoutes); // Chat

// Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicialização do servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
