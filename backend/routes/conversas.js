const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Criar uma nova conversa (se ainda não existir) e adicionar mensagem
router.post("/", async (req, res) => {
  const { cliente_id, locador_id, autor_id, mensagem } = req.body;

  try {
    // Verifica se a conversa já existe
    const [conversasExistentes] = await db.query(
  "SELECT * FROM conversas WHERE cliente_id = ? AND locador_id = ?",
  [cliente_id, locador_id]
);


    let conversaId;

    if (conversasExistentes.length > 0) {
      conversaId = conversasExistentes[0].id;
    } else {
      // Cria nova conversa
      const [nova] = await db.query(
        "INSERT INTO conversas (cliente_id, locador_id, data_inicio) VALUES (?, ?, NOW())",
        [cliente_id, locador_id]
      );
      conversaId = nova.insertId;
    }

    // Insere nova mensagem
    await db.query(
      "INSERT INTO mensagens (conversa_id, autor_id, mensagem, data_envio) VALUES (?, ?, ?, NOW())",
      [conversaId, autor_id, mensagem]
    );

    res.status(201).json({ sucesso: true, conversa_id: conversaId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar conversa ou mensagem." });
  }
});

// ✅ Buscar mensagens de uma conversa
router.get("/mensagens/:conversa_id", async (req, res) => {
  const { conversa_id } = req.params;

  try {
    const [mensagens] = await db.query(
      "SELECT * FROM mensagens WHERE conversa_id = ? ORDER BY data_envio ASC",
      [conversa_id]
    );

    res.json(mensagens);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar mensagens." });
  }
});

// ✅ Buscar todas as conversas de um usuário
// ✅ Buscar todas as conversas de um usuário
router.get("/ultimas/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const [conversas] = await db.query(`
  SELECT 
    c.id AS conversa_id,
    c.cliente_id,
    c.locador_id,
    u.nome,
    (
      SELECT m.mensagem 
      FROM mensagens m 
      WHERE m.conversa_id = c.id 
      ORDER BY m.data_envio DESC 
      LIMIT 1
    ) AS ultima_mensagem,
    (
      SELECT m.data_envio 
      FROM mensagens m 
      WHERE m.conversa_id = c.id 
      ORDER BY m.data_envio DESC 
      LIMIT 1
    ) AS ultima_data
  FROM conversas c
  JOIN usuarios u 
    ON u.id = IF(c.cliente_id = ?, c.locador_id, c.cliente_id)
  WHERE c.cliente_id = ? OR c.locador_id = ?
  ORDER BY ultima_data DESC
`, [usuario_id, usuario_id, usuario_id]);

res.json(conversas);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar conversas." });
  }
});


// ✅ Excluir uma mensagem por ID
router.delete("/mensagens/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM mensagens WHERE id = ?", [id]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao excluir mensagem." });
  }
});

module.exports = router;
