// backend/db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,                        // ex: mysql-aluguel-de-quadras.alwaysdata.net
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,                        // ex: 425759_joao
  password: process.env.DB_PASSWORD,                // garanta a VAR no painel da Render
  database: process.env.DB_NAME,                    // ex: aluguel-de-quadras_10

  // Pool (mysql2 v3)
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
  maxIdle: Number(process.env.DB_POOL_MAX_IDLE || 10),  // conexões ociosas mantidas
  idleTimeout: Number(process.env.DB_POOL_IDLE_MS || 60000), // fecha idle após 60s
  queueLimit: 0,

  // Timeouts/KeepAlive
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 30000), // conexão inicial
  enableKeepAlive: true,
  keepAliveInitialDelay: Number(process.env.DB_KEEPALIVE_DELAY || 10000),

  // Fuso (opcional; 'Z' = UTC). Remova se preferir timezone do MySQL.
  timezone: "Z",

  // SSL: descomente se o provedor exigir TLS
  // ssl: { rejectUnauthorized: true },
});

// Testa pool ao subir
async function ensureConnection() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ MySQL pool conectado e respondendo");
  } catch (e) {
    console.error("❌ Falha ao conectar no MySQL:", e.message || e);
  }
}
ensureConnection();

// Ping periódico (evita queda por ociosidade em alguns provedores)
const PING_MS = Number(process.env.DB_PING_MS || 30000);
const pingTimer = setInterval(() => {
  pool.query("SELECT 1").catch(() => {});
}, PING_MS);

// Encerramento gracioso (Render/containers)
function shutdown() {
  clearInterval(pingTimer);
  pool.end().then(() => {
    console.log("🧹 Pool MySQL encerrado com sucesso");
    process.exit(0);
  }).catch((e) => {
    console.error("⚠️ Erro ao encerrar pool:", e.message || e);
    process.exit(1);
  });
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

module.exports = pool;
