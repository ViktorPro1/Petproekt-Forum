const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/auth");
const { isModerator } = require("../middleware/roleCheck");

// Отримати коментарі до посту + ім'я користувача + РОЛЬ
router.get("/:post_id", (req, res) => {
    const { post_id } = req.params;
    // ВАЖЛИВО: Додали users.role до SELECT
    db.query(
        `SELECT comments.*, users.username, users.role
         FROM comments 
         LEFT JOIN users ON comments.user_id = users.id 
         WHERE comments.post_id = ? 
         ORDER BY comments.created_at DESC`,
        [post_id],
        (err, results) => {
            if (err) return res.status(500).json({ message: err });
            res.json(results);
        }
    );
});

// Додати коментар (тільки авторизовані)
router.post("/", authMiddleware, (req, res) => {
    const { post_id, content } = req.body;
    const user_id = req.user.id;

    db.query(
        "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
        [post_id, user_id, content],
        (err, result) => {
            if (err) return res.status(500).json({ message: err });
            res.status(201).json({ message: "Коментар додано" });
        }
    );
});

// МОДЕРАЦІЯ: Видалити коментар (тільки модератори та адміни)
router.delete("/:id", authMiddleware, isModerator, (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log(`User ${userId} (${userRole}) attempting to delete comment ${commentId}`);

    db.query(
        "SELECT user_id FROM comments WHERE id = ?",
        [commentId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Помилка сервера" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Коментар не знайдено" });
            }

            const commentAuthorId = results[0].user_id;

            if (userRole === 'admin' || userRole === 'moderator' || commentAuthorId === userId) {
                db.query(
                    "DELETE FROM comments WHERE id = ?",
                    [commentId],
                    (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ message: "Помилка при видаленні коментаря" });
                        }
                        res.json({ message: "Коментар видалено" });
                    }
                );
            } else {
                return res.status(403).json({ message: "Немає прав на видалення цього коментаря" });
            }
        }
    );
});

module.exports = router;