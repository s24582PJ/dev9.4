const express = require("express");

module.exports = (pool, redisClient) => {
  const router = express.Router();

  router.post("/users", async (req, res) => {
    const { name } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO users (name) VALUES ($1) RETURNING *",
        [name]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/messages", async (req, res) => {
    const { message } = req.body;
    try {
      const id = await redisClient.incr("message_id");
      await redisClient.set(`message:${id}`, message);
      res.status(201).json({ id, message });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/messages/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const message = await redisClient.get(`message:${id}`);
      if (message) {
        res.status(200).json({ id, message });
      } else {
        res.status(404).json({ error: "Message not found" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
