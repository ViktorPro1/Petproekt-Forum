const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/auth");
const { isModerator } = require("../middleware/roleCheck");

// Отримати всі пости або пости конкретної категорії + РОЛЬ КОРИСТУВАЧА
router.get("/", (req, res) => {
    const categoryId = req.query.category_id;
    // ВАЖЛИВО: Додали users.role до SELECT
    let query = "SELECT posts.*, users.username, users.role FROM posts LEFT JOIN users ON posts.user_id = users.id";
    const params = [];

    if (categoryId) {
        query += " WHERE posts.category_id = ?";
        params.push(categoryId);
    }

    query += " ORDER BY posts.created_at DESC";

    db.query(query, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Помилка сервера при отриманні постів" });
        }
        res.json(results);
    });
});

// Створити пост (тільки авторизовані)
router.post("/", authMiddleware, (req, res) => {
    const { category_id, title, content } = req.body;
    const user_id = req.user.id;

    if (!category_id || !title || !content) {
        return res.status(400).json({ message: "Всі поля обов'язкові" });
    }

    db.query(
        "INSERT INTO posts (user_id, category_id, title, content) VALUES (?, ?, ?, ?)",
        [user_id, category_id, title, content],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Помилка сервера при створенні поста" });
            }
            res.status(201).json({ message: "Пост створено", postId: result.insertId });
        }
    );
});

// МОДЕРАЦІЯ: Видалити пост (тільки модератори та адміни)
router.delete("/:id", authMiddleware, isModerator, (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log(`User ${userId} (${userRole}) attempting to delete post ${postId}`);

    db.query(
        "SELECT user_id FROM posts WHERE id = ?",
        [postId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Помилка сервера" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Пост не знайдено" });
            }

            const postAuthorId = results[0].user_id;

            if (userRole === 'admin' || userRole === 'moderator' || postAuthorId === userId) {
                db.query(
                    "DELETE FROM posts WHERE id = ?",
                    [postId],
                    (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ message: "Помилка при видаленні поста" });
                        }
                        res.json({ message: "Пост видалено" });
                    }
                );
            } else {
                return res.status(403).json({ message: "Немає прав на видалення цього поста" });
            }
        }
    );
});

module.exports = router;