const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleCheck");

// Отримати всі категорії (публічно)
router.get("/", (req, res) => {
    db.query("SELECT * FROM categories ORDER BY name", (err, results) => {
        if (err) return res.status(500).json({ message: err });
        res.json(results);
    });
});

// Створити категорію (ТІЛЬКИ АДМІНИ)
router.post("/", authMiddleware, isAdmin, (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Назва категорії обов'язкова" });
    }

    console.log(`Admin ${req.user.id} creating category: ${name}`);

    db.query(
        "INSERT INTO categories (name, description) VALUES (?, ?)",
        [name, description || null],
        (err, result) => {
            if (err) {
                console.error(err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "Категорія з такою назвою вже існує" });
                }
                return res.status(500).json({ message: "Помилка при створенні категорії" });
            }
            res.status(201).json({
                message: "Категорію створено",
                categoryId: result.insertId
            });
        }
    );
});

// Видалити категорію (ТІЛЬКИ АДМІНИ)
router.delete("/:id", authMiddleware, isAdmin, (req, res) => {
    const categoryId = req.params.id;

    console.log(`Admin ${req.user.id} deleting category: ${categoryId}`);

    // Перевірка чи є пости в цій категорії
    db.query(
        "SELECT COUNT(*) as count FROM posts WHERE category_id = ?",
        [categoryId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Помилка сервера" });
            }

            const postsCount = results[0].count;

            if (postsCount > 0) {
                return res.status(400).json({
                    message: `Не можна видалити категорію - в ній є ${postsCount} постів. Спочатку видаліть пости.`
                });
            }

            // Видаляємо категорію
            db.query(
                "DELETE FROM categories WHERE id = ?",
                [categoryId],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: "Помилка при видаленні категорії" });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({ message: "Категорію не знайдено" });
                    }

                    res.json({ message: "Категорію видалено" });
                }
            );
        }
    );
});

module.exports = router;