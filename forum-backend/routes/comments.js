const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/auth");

// Отримати коментарі до посту (публічно)
router.get("/:post_id", (req, res) => {
    const { post_id } = req.params;
    db.query(
        "SELECT * FROM comments WHERE post_id = ?",
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

module.exports = router;
