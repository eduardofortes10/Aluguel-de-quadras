const mysql = require('mysql2/promise'); // Usa o wrapper com suporte a async/await

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Dudu110608@',
  database: 'aluguel_quadras'
});

module.exports = db;
