const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwedtoken");
const db = require("../backend/db");

const router = express.Router();

const JWT_Secret = process.env.JWT_SECRET || "your_jwt_secret";

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await db.query(
            "INSERT INTO useres (username, email, password) VALUES ($1, $2, $3) RETURNING *"
            [username, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json ({ message: "User registration failed", error: err.message })
    }
});

module.exports = authenticate;