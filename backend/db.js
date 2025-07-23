const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "Dudu110608@",
  database: "aluguel_quadras",
});

module.exports = db;
