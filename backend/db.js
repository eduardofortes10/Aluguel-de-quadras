// db.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
 password: 'Dudu110608@', // coloque sua senha aqui, se tiver
  database: 'aluguel_quadras',
});

db.connect((err) => {
  if (err) throw err;
  console.log('🟢 Conectado ao MySQL');
});

module.exports = db;
