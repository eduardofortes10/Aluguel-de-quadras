const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const quadrasRoutes = require('./routes/quadras');
const favoritosRoutes = require('./routes/favoritos'); // <-- certo

app.use(cors());
app.use(express.json());

// ROTAS
app.use('/api/auth', authRoutes);
app.use('/api/favoritos', favoritosRoutes); // <-- ATIVA A ROTA /api/favoritos
app.use('/api', quadrasRoutes); // <-- quadras estão aqui

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
