const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/auth");

// Отримати реакції для поста
router.get("/post/:post_id", (req, res) => {
    const { post_id } = req.params;

    const query = `
        SELECT 
            reaction_type,
            COUNT(*) as count,
            GROUP_CONCAT(users.username) as usernames
        FROM reactions
        LEFT JOIN users ON reactions.user_id = users.id
        WHERE reactions.post_id = ?
        GROUP BY reaction_type
    `;

    db.query(query, [post_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Помилка при отриманні реакцій" });
        }

        // Форматуємо результат
        const reactions = {
            like: { count: 0, users: [] },
            heart: { count: 0, users: [] },
            handshake: { count: 0, users: [] }
        };

        results.forEach(row => {
            reactions[row.reaction_type] = {
                count: row.count,
                users: row.usernames ? row.usernames.split(',') : []
            };
        });

        res.json(reactions);
    });
});

// Отримати реакції для коментаря
router.get("/comment/:comment_id", (req, res) => {
    const { comment_id } = req.params;

    const query = `
        SELECT 
            reaction_type,
            COUNT(*) as count,
            GROUP_CONCAT(users.username) as usernames
        FROM reactions
        LEFT JOIN users ON reactions.user_id = users.id
        WHERE reactions.comment_id = ?
        GROUP BY reaction_type
    `;

    db.query(query, [comment_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Помилка при отриманні реакцій" });
        }

        const reactions = {
            like: { count: 0, users: [] },
            heart: { count: 0, users: [] },
            handshake: { count: 0, users: [] }
        };

        results.forEach(row => {
            reactions[row.reaction_type] = {
                count: row.count,
                users: row.usernames ? row.usernames.split(',') : []
            };
        });

        res.json(reactions);
    });
});

// Отримати реакцію користувача для поста
router.get("/post/:post_id/user", authMiddleware, (req, res) => {
    const { post_id } = req.params;
    const user_id = req.user.id;

    db.query(
        "SELECT reaction_type FROM reactions WHERE post_id = ? AND user_id = ?",
        [post_id, user_id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Помилка сервера" });
            }
            res.json({ reaction: results.length > 0 ? results[0].reaction_type : null });
        }
    );
});

// Отримати реакцію користувача для коментаря
router.get("/comment/:comment_id/user", authMiddleware, (req, res) => {
    const { comment_id } = req.params;
    const user_id = req.user.id;

    db.query(
        "SELECT reaction_type FROM reactions WHERE comment_id = ? AND user_id = ?",
        [comment_id, user_id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Помилка сервера" });
            }
            res.json({ reaction: results.length > 0 ? results[0].reaction_type : null });
        }
    );
});

// Додати або змінити реакцію на пост
router.post("/post", authMiddleware, (req, res) => {
    const { post_id, reaction_type } = req.body;
    const user_id = req.user.id;

    if (!post_id || !reaction_type) {
        return res.status(400).json({ message: "post_id та reaction_type обов'язкові" });
    }

    if (!['like', 'heart', 'handshake'].includes(reaction_type)) {
        return res.status(400).json({ message: "Невірний тип реакції" });
    }

    // Спочатку перевіряємо чи є вже реакція
    db.query(
        "SELECT * FROM reactions WHERE post_id = ? AND user_id = ?",
        [post_id, user_id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Помилка сервера" });
            }

            if (results.length > 0) {
                // Якщо та сама реакція - видаляємо
                if (results[0].reaction_type === reaction_type) {
                    db.query(
                        "DELETE FROM reactions WHERE post_id = ? AND user_id = ?",
                        [post_id, user_id],
                        (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ message: "Помилка при видаленні реакції" });
                            }
                            res.json({ message: "Реакцію видалено", action: "removed" });
                        }
                    );
                } else {
                    // Інакше - оновлюємо
                    db.query(
                        "UPDATE reactions SET reaction_type = ? WHERE post_id = ? AND user_id = ?",
                        [reaction_type, post_id, user_id],
                        (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ message: "Помилка при оновленні реакції" });
                            }
                            res.json({ message: "Реакцію оновлено", action: "updated" });
                        }
                    );
                }
            } else {
                // Додаємо нову реакцію
                db.query(
                    "INSERT INTO reactions (user_id, post_id, reaction_type) VALUES (?, ?, ?)",
                    [user_id, post_id, reaction_type],
                    (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ message: "Помилка при додаванні реакції" });
                        }
                        res.json({ message: "Реакцію додано", action: "added" });
                    }
                );
            }
        }
    );
});

// Додати або змінити реакцію на коментар
router.post("/comment", authMiddleware, (req, res) => {
    const { comment_id, reaction_type } = req.body;
    const user_id = req.user.id;

    if (!comment_id || !reaction_type) {
        return res.status(400).json({ message: "comment_id та reaction_type обов'язкові" });
    }

    if (!['like', 'heart', 'handshake'].includes(reaction_type)) {
        return res.status(400).json({ message: "Невірний тип реакції" });
    }

    db.query(
        "SELECT * FROM reactions WHERE comment_id = ? AND user_id = ?",
        [comment_id, user_id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Помилка сервера" });
            }

            if (results.length > 0) {
                if (results[0].reaction_type === reaction_type) {
                    // Видаляємо
                    db.query(
                        "DELETE FROM reactions WHERE comment_id = ? AND user_id = ?",
                        [comment_id, user_id],
                        (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ message: "Помилка при видаленні реакції" });
                            }
                            res.json({ message: "Реакцію видалено", action: "removed" });
                        }
                    );
                } else {
                    // Оновлюємо
                    db.query(
                        "UPDATE reactions SET reaction_type = ? WHERE comment_id = ? AND user_id = ?",
                        [reaction_type, comment_id, user_id],
                        (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ message: "Помилка при оновленні реакції" });
                            }
                            res.json({ message: "Реакцію оновлено", action: "updated" });
                        }
                    );
                }
            } else {
                // Додаємо
                db.query(
                    "INSERT INTO reactions (user_id, comment_id, reaction_type) VALUES (?, ?, ?)",
                    [user_id, comment_id, reaction_type],
                    (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ message: "Помилка при додаванні реакції" });
                        }
                        res.json({ message: "Реакцію додано", action: "added" });
                    }
                );
            }
        }
    );
});

module.exports = router;