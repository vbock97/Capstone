const express = require("express");
const db = require("../db");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.post("/rentals", authenticate, async (req, res) => {
  const { movie_id, return_by } = req.body;
  const userId = req.userId;

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
        INSERT INTO rentals (movie_id, user_id, return_by)
        VALUES ($1, $2) RETURNING *;
        `;
    const rentalValues = [movie_id, userId, return_by];
    const rentalResult = await db.query(rentalQuery, rentalValues);

    await db.query("UPDATE movies SET available = FALSE WHERE id = $1", [
      movie_id,
    ]);
    res.status(201).json(rentalResult.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:rental_id", authenticate, async (req, res) => {
  const { rental_id } = req.params;

  try {
    const updateRental = `
        UPDATE rentals SET returned_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *
        `;
    const rentalResult = await db.query(updateRental, [rental_id]);
    if (rentalResult.rows.length === 0) {
      return res.status(404).json({ message: "Rental not found" });
    }
    const rental = rentalResult.rows[0];
    const movie_id = rental.movie_id;
    const updateRentalQuery = `
        UPDATE rentals SET returned_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;
    `;
    await db.query(updateRentalQuery, [rental_id]);
    await db.query("UPDATE movies SET available = TRUE WHERE id = $1", [
      movie_id,
    ]);
    res.json({ message: "Movie returned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
