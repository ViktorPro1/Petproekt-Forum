// controllers/authController.js
// Оновлений контролер з роллю користувача

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Реєстрація
exports.register = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Всі поля обов'язкові" });
    }

    // Хешування паролю
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: "Помилка хешування паролю" });
        }

        // Вставка користувача (role буде 'user' за замовчуванням)
        db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hash],
            (err, result) => {
                if (err) {
                    console.error(err);
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ message: "Email вже зареєстрований" });
                    }
                    return res.status(500).json({ message: "Помилка сервера" });
                }
                res.status(201).json({ message: "Користувача створено" });
            }
        );
    });
};

// Логін
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email і пароль обов'язкові" });
    }

    // ВАЖЛИВО: Додали role до SELECT
    db.query(
        "SELECT id, email, password, role FROM users WHERE email = ?",
        [email],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Помилка сервера" });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: "Невірний email або пароль" });
            }

            const user = results[0];

            // Перевірка паролю
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ message: "Помилка сервера" });
                }

                if (!isMatch) {
                    return res.status(401).json({ message: "Невірний email або пароль" });
                }

                // ВАЖЛИВО: Додали role до токену
                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        role: user.role  // ← ДОДАНО РОЛЬ
                    },
                    JWT_SECRET,
                    { expiresIn: "24h" }
                );

                res.json({
                    token,
                    role: user.role  // ← ВІДПРАВЛЯЄМО РОЛЬ НА ФРОНТЕНД
                });
            });
        }
    );
};
