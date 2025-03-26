const express = require("express");
const db = require("../db");

const router = express.Router();
const authenticate = require ("../middleware/auth")

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM movies");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/movies", async (req, res) => {
  if (req.role !== "admin") {
    const movie = req.body;
    res.status(201).json({ message: "Movie added successfully", movie });
    return res.status(403).json({ message: "Permission denied" });
  }

  const { title, genre, director, release_year, rental_price } = req.body;
  const query = `
    INSERT INTO movies (title, genre, director, release_year, rental_price)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [title, genre, director, release_year, rental_price];

  try {
    const result = await db.query(query, values);
    const movie = req.body;
    res.status(201).json({ message: "Movie added successfully", movie });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
