const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const authRoutes = require('./routes/auth');
const quadrasRoutes = require('./routes/quadras');
const favoritosRoutes = require('./routes/favoritos');

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/quadras', quadrasRoutes); // ✅ ESSA É A CORRETA
// ❌ REMOVA esta linha se ainda estiver no seu código:
// app.use('/api', quadrasRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicialização do servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
