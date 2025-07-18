// server.js
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const quadrasRoutes = require('./routes/quadras');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Para servir as imagens

app.use('/api/auth', authRoutes);
app.use('/api', quadrasRoutes); // Todas as rotas de quadras ficam aqui

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
