const express = require('express');
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const app = express();
const connection = require('./db');

// ✅ ATIVE O CORS ANTES DE TUDO
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
// Servir arquivos estáticos (imagens)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const quadrasRoutes = require("./routes/quadras");
app.use("/quadras", quadrasRoutes);

// ✅ Importa e usa as rotas externas
const favoritosRoutes = require("./routes/favoritos");
app.use("/api/favoritos", favoritosRoutes);

// ✅ Rota de teste
app.get('/', (req, res) => {
  res.send('API do Aluguel de Quadras está rodando!');
});

// ✅ Rota para buscar notificações
app.get('/notificacoes', (req, res) => {
  connection.query('SELECT * FROM notificacoes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ✅ NOVA rota para listar todos os contatos que o usuário conversou
app.get('/api/conversas/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  const sql = `
    SELECT DISTINCT 
      CASE 
        WHEN remetente_id = ? THEN destinatario_id
        ELSE remetente_id
      END AS contato_id
    FROM conversas
    WHERE remetente_id = ? OR destinatario_id = ?
  `;
  connection.query(sql, [usuario_id, usuario_id, usuario_id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar contatos:", err);
      return res.status(500).json({ erro: "Erro ao buscar contatos" });
    }
    const contatos = results.map(row => row.contato_id);
    res.status(200).json(contatos);
  });
});


// ✅ POST Notificações
app.post('/api/notificacoes', (req, res) => {
  const { usuario_id, mensagem } = req.body;
  const sql = 'INSERT INTO notificacoes (usuario_id, mensagem) VALUES (?, ?)';
  connection.query(sql, [usuario_id, mensagem], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao adicionar notificação' });
    res.status(201).json({ mensagem: 'Notificação enviada!' });
  });
});

// ✅ GET Notificações por usuário
app.get('/api/notificacoes/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  const sql = 'SELECT * FROM notificacoes WHERE usuario_id = ?';
  connection.query(sql, [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar notificações' });
    res.status(200).json(results);
  });
});

// ✅ POST Conversas
app.post('/api/conversas', (req, res) => {
  const { remetente_id, destinatario_id, mensagem } = req.body;
  const sql = 'INSERT INTO conversas (remetente_id, destinatario_id, mensagem) VALUES (?, ?, ?)';
  connection.query(sql, [remetente_id, destinatario_id, mensagem], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao enviar mensagem' });
    res.status(201).json({ mensagem: 'Mensagem enviada!' });
  });
});

// ✅ GET Conversas por usuário
app.get('/api/conversas/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  const sql = `
    SELECT * FROM conversas 
    WHERE remetente_id = ? OR destinatario_id = ?
    ORDER BY data_envio ASC`;
  connection.query(sql, [usuario_id, usuario_id], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar conversas' });
    res.status(200).json(results);
  });
});

// ✅ Inicia servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const usuariosRoutes = require("./routes/usuarios");
app.use("/usuarios", usuariosRoutes);
const loginRoutes = require("./routes/login");
app.use("/login", loginRoutes);
