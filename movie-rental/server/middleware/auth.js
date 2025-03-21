const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

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
        res.status(400).json({ message: "User registration failed", error: err.message })
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (!user.rows.length) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user.rows[0].id }, JWT_Secret, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

const authenticate = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }
    jwt.verify(token, JWT_Secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = authenticate;