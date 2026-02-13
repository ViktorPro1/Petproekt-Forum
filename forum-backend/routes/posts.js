const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/auth");

// Отримати всі пости (публічно)
router.get("/", (req, res) => {
    db.query("SELECT * FROM posts", (err, results) => {
        if (err) return res.status(500).json({ message: err });
        res.json(results);
    });
});

// Створити пост (тільки авторизовані)
router.post("/", authMiddleware, (req, res) => {
    const { category_id, title, content } = req.body;
    const user_id = req.user.id; // беремо з JWT

    db.query(
        "INSERT INTO posts (user_id, category_id, title, content) VALUES (?, ?, ?, ?)",
        [user_id, category_id, title, content],
        (err, result) => {
            if (err) return res.status(500).json({ message: err });
            res.status(201).json({ message: "Пост створено" });
        }
    );
});

module.exports = router;
