const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/auth");

// -----------------------------
// Отримати всі пости або пости конкретної категорії
// -----------------------------
router.get("/", (req, res) => {
    const categoryId = req.query.category_id; // id категорії з фронтенду
    let query = "SELECT posts.*, users.username FROM posts LEFT JOIN users ON posts.user_id = users.id";
    const params = [];

    if (categoryId) {
        query += " WHERE posts.category_id = ?";
        params.push(categoryId);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Помилка сервера при отриманні постів" });
        }
        res.json(results);
    });
});

// -----------------------------
// Створити пост (тільки авторизовані)
// -----------------------------
router.post("/", authMiddleware, (req, res) => {
    const { category_id, title, content } = req.body;
    const user_id = req.user.id; // беремо з JWT

    if (!category_id || !title || !content) {
        return res.status(400).json({ message: "Всі поля обов'язкові" });
    }

    db.query(
        "INSERT INTO posts (user_id, category_id, title, content) VALUES (?, ?, ?, ?)",
        [user_id, category_id, title, content],
        (err, result) => {
            if (err) {
                console.error("ERROR:", err.message); // <-- ДОДАЙ ЦЕЙ РЯДОК
                return res.status(500).json({ message: "Помилка сервера при створенні поста" });
            }
            res.status(201).json({ message: "Пост створено", postId: result.insertId });
        }
    );
});

module.exports = router;

