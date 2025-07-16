// ✅ server.js atualizado com rotas corretas e sem manipulação da data_envio

const express = require('express');
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const app = express();
const db = require('./db');
const conversasRoutes = require("./routes/conversas");

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/quadras", require("./routes/quadras"));
app.use("/api/favoritos", require("./routes/favoritos"));
app.use("/usuarios", require("./routes/usuarios"));
app.use("/login", require("./routes/login"));
app.use("/api/conversas", conversasRoutes);

app.get('/', (req, res) => {
  res.send('API do Aluguel de Quadras está rodando!');
});

app.get('/notificacoes', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM notificacoes');
    res.json(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/notificacoes', async (req, res) => {
  const { usuario_id, mensagem } = req.body;
  try {
    await db.query(
      'INSERT INTO notificacoes (usuario_id, mensagem) VALUES (?, ?)',
      [usuario_id, mensagem]
    );
    res.status(201).json({ mensagem: 'Notificação enviada!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao adicionar notificação' });
  }
});

app.get('/api/notificacoes/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [results] = await db.query('SELECT * FROM notificacoes WHERE usuario_id = ?', [usuario_id]);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar notificações' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
