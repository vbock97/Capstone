const express = require("express");
const db = require("../backend/db");

const router = express.Router();

router.post("/", async (req, res) => {
  const { movie_id, return_by } = req.body;

  try {
    const movieResult = await db.query(
      "SELECT * FROM movies WHERE id = $1 AND available = TRUE",
      [movie_id]
    );
    if (movieResult.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Movie is not available for rent" });
    }
    const rentalQuery = `
        INSERT INTO rentals (movie_id, return_by)
        VALUES ($1, $2) RETURNING *;
        `;
    const rentalValues = [movie_id, return_by];
    const rentalResult = await db.query(rentalQuery, rentalValues);

    await db.query("UPDATE movies SET available = FALSE WHERE id = $1", [
      movie_id,
    ]);
    res.status(201).json(rentalResult.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:rental_id", async (req, res) => {
  const { rental_id } = req.params;

  try {
    const updateRental = `
        UPDATE rentals SET returned_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *
        `;
    const rentalResult = await db.query(updateRental, [rental_id]);
    if (rentalResult.rows.length === 0) {
      return res.status(404).json({ message: "Rental not found" });
    }

    const movie_id = rentalResult.rows[0].movie_id;
    await db.query("UPDATE movies SET available = TRUE WHERE id = $1", [
      movie_id,
    ]);
    res.json({ message: "Movie returned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
