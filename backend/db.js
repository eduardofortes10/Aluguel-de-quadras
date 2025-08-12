// backend/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,                 // mysql-aluguel-de-quadras.alwaysdata.net
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,                 // 425759_joao
  password: process.env.DB_PASSWORD,         // <<< usa DB_PASSWORD
  database: process.env.DB_NAME,             // aluguel-de-quadras_10
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
  queueLimit: 0,
  connectTimeout: 30000,
  acquireTimeout: 30000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  timezone: 'Z',
  // SSL geralmente não é obrigatório no AlwaysData; se quiser/precisar:
  // ssl: { rejectUnauthorized: true },
});

async function ensureConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ MySQL pool conectado e respondendo');
  } catch (e) {
    console.error('❌ Falha ao conectar no MySQL:', e);
  }
}
ensureConnection();

// ping periódico (evita derrube por ociosidade)
setInterval(() => {
  pool.query('SELECT 1').catch(() => {});
}, 30000);

module.exports = pool;
