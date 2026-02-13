const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Реєстрація користувача
const register = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Заповніть всі поля" });
    }

    // Перевірка, чи вже існує email
    const checkSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkSql, [email], (err, results) => {
        if (err) {
            console.error("Помилка БД при перевірці email:", err);
            return res.status(500).json({ message: err.sqlMessage });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "Email вже використовується" });
        }

        // Хешуємо пароль
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error("Помилка bcrypt:", err);
                return res.status(500).json({ message: "Помилка bcrypt" });
            }

            // Додаємо користувача в БД
            const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
            db.query(sql, [username, email, hash], (err, result) => {
                if (err) {
                    console.error("Помилка БД при створенні користувача:", err);
                    return res.status(500).json({ message: err.sqlMessage });
                }

                res.status(201).json({ message: "Користувача створено" });
            });
        });
    });
};

// Логін користувача
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Заповніть всі поля" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Помилка БД при логіні:", err);
            return res.status(500).json({ message: err.sqlMessage });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Користувач не знайдений" });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Помилка bcrypt при логіні:", err);
                return res.status(500).json({ message: "Помилка bcrypt" });
            }

            if (!isMatch) {
                return res.status(400).json({ message: "Невірний пароль" });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({ token, username: user.username, role: user.role });
        });
    });
};

module.exports = { register, login };
