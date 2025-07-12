const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',        // ou 127.0.0.1
  user: 'root',             // seu usuário do MySQL
  password: 'Dudu110608@',             // coloque sua senha aqui, se tiver
  database: 'aluguel_quadras'  // nome do seu banco
});

// Conectar e mostrar status no console
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message);
  } else {
    console.log('🟢 Conectado ao banco de dados MySQL!');
  }
});

module.exports = connection;
