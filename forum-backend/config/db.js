const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "forum_db"
});

connection.connect(err => {
    if (err) {
        console.error("Помилка підключення до БД:", err);
    } else {
        console.log("Підключено до БД MySQL");
    }
});

module.exports = connection;
