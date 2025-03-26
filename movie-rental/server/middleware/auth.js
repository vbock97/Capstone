const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;

const authenticate = async (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "Access denied" });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userQuery = "SELECT * FROM users WHERE username = $1";
        const result = await db.query(userQuery, [username]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, {
            expiresIn: "1h",
        });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = "user";
        const query = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3) RETURNING *;
    `;
        const values = [username, email, hashedPassword];
        const result = await db.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { authenticate, login, register };
