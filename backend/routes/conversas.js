const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Rota de últimas mensagens (DEVE vir antes das rotas dinâmicas)
router.get("/ultimas/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT u.id, u.nome, MAX(c.data_envio) as ultima_data, (
         SELECT mensagem FROM conversas
         WHERE (remetente_id = ? AND destinatario_id = u.id)
            OR (remetente_id = u.id AND destinatario_id = ?)
         ORDER BY data_envio DESC LIMIT 1
       ) AS ultima_mensagem
       FROM usuarios u
       LEFT JOIN conversas c ON (c.remetente_id = u.id OR c.destinatario_id = u.id)
       WHERE u.id != ?
       GROUP BY u.id, u.nome
       ORDER BY ultima_data DESC`,
      [userId, userId, userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ✅ Rota para enviar mensagem (sem sobrescrever data_envio)
router.post("/", async (req, res) => {
  const { remetente_id, destinatario_id, mensagem } = req.body;

  try {
    const [resultado] = await db.query(
  "INSERT INTO conversas (remetente_id, destinatario_id, mensagem) VALUES (?, ?, ?)",
  [remetente_id, destinatario_id, mensagem]
);

const [mensagemSalva] = await db.query("SELECT * FROM conversas WHERE id = ?", [resultado.insertId]);

res.status(201).json(mensagemSalva[0]);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ✅ Rota para buscar mensagens entre dois usuários
router.get("/:id1/:id2", async (req, res) => {
  const { id1, id2 } = req.params;

  try {
    const [mensagens] = await db.query(
      `SELECT * FROM conversas
       WHERE (remetente_id = ? AND destinatario_id = ?)
       OR (remetente_id = ? AND destinatario_id = ?)
       ORDER BY data_envio ASC`,
      [id1, id2, id2, id1]
    );

    // ✅ Marcar como lidas as mensagens recebidas
    await db.query(
      "UPDATE conversas SET lida = 1 WHERE destinatario_id = ? AND remetente_id = ?",
      [id1, id2]
    );

    res.json(mensagens);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ✅ Deletar mensagem por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM conversas WHERE id = ?", [id]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
