const express = require("express");
const db = require("../backend/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM movies");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { title, genre, director, release_year, rental_price } = req.body;
  const query = `
    INSERT INTO movies (title, genre, director, release_year, rental_price)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `;
  const values = [title, genre, director, release_year, rental_price];

  try {
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
