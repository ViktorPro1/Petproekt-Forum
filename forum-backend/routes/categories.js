const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Отримати всі категорії
router.get("/", (req, res) => {
    db.query("SELECT * FROM categories", (err, results) => {
        if (err) return res.status(500).json({ message: err });
        res.json(results);
    });
});

// Створити категорію
router.post("/", (req, res) => {
    const { name, description } = req.body;
    db.query(
        "INSERT INTO categories (name, description) VALUES (?, ?)",
        [name, description],
        (err, result) => {
            if (err) return res.status(500).json({ message: err });
            res.status(201).json({ message: "Категорію створено" });
        }
    );
});

module.exports = router;
