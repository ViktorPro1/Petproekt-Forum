const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Підключення маршрутів
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

app.use("/api/categories", categoryRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

// Тестовий маршрут
app.get("/", (req, res) => {
    res.json({ message: "Forum API працює" });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server запущено на порту ${PORT}`);
});
