# ⚡ ШВИДКА ДОВІДКА - Команди та шпаргалки

## 🚀 Запуск проекту

### Стандартний запуск:

```bash
# Terminal 1 - Backend
cd ~/Стільниця/forum/forum-backend
npm run dev

# Terminal 2 - Frontend
cd ~/Стільниця/forum/forum-frontend
npm start
```

### Якщо щось не працює:

```bash
# Очистити кеш frontend
cd ~/Стільниця/forum/forum-frontend
rm -rf node_modules/.cache
npm start

# Перезапустити backend
cd ~/Стільниця/forum/forum-backend
# Ctrl+C (зупинити)
npm run dev
```

---

## 🗄️ MySQL команди

### Зробити себе адміном:

```sql
USE forum_db;
UPDATE users SET role = 'admin' WHERE email = 'твій-email@example.com';
```

### Перевірити ролі:

```sql
SELECT id, username, email, role FROM users;
```

### Створити модератора:

```sql
UPDATE users SET role = 'moderator' WHERE email = 'moderator@example.com';
```

### Додати роль до таблиці (якщо немає):

```sql
ALTER TABLE users ADD COLUMN role ENUM('user', 'moderator', 'admin') DEFAULT 'user' AFTER email;
```

---

## 🎨 Зміна теми

### В браузері:

- Натисни на іконку 🌙/☀️ в navbar

### Програмно (консоль браузера F12):

```javascript
// Встановити темну тему
localStorage.setItem("theme", "dark");
document.documentElement.setAttribute("data-theme", "dark");

// Встановити світлу тему
localStorage.setItem("theme", "light");
document.documentElement.setAttribute("data-theme", "light");
```

---

## 🔐 Перевірка ролі

### В консолі браузера (F12):

```javascript
// Перевірити свою роль
console.log(localStorage.getItem("userRole"));

// Перевірити токен
console.log(localStorage.getItem("token"));

// Очистити все
localStorage.clear();
```

---

## 🐛 Troubleshooting

### Помилка "Cannot find module"

```bash
cd ~/Стільниця/forum/forum-backend
npm install bcryptjs jsonwebtoken mysql2 express cors dotenv
npm run dev
```

### Кнопки не стильні

```bash
cd ~/Стільниця/forum/forum-frontend
rm -rf node_modules/.cache
npm start
# Hard reload браузера: Ctrl+Shift+R
```

### Не бачу бейджів ролей

1. Перевір backend (routes/posts.js, routes/comments.js)
2. Перелогінься на форумі
3. Hard reload: Ctrl+Shift+R

### База даних не підключається

1. Перевір MySQL запущений: `sudo systemctl status mysql`
2. Перевір .env файл
3. Перевір що база створена: `CREATE DATABASE forum_db;`

---

## 📝 Швидке створення структури БД

```sql
-- Створити базу
CREATE DATABASE forum_db;
USE forum_db;

-- Таблиця користувачів
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця категорій
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця постів
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Таблиця коментарів
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔑 Ролі та права

```
┌─────────────┬──────┬───────────┬───────┐
│ Дія         │ User │ Moderator │ Admin │
├─────────────┼──────┼───────────┼───────┤
│ Створити    │  ✅  │    ✅     │  ✅   │
│ пост        │      │           │       │
├─────────────┼──────┼───────────┼───────┤
│ Видалити    │ Свій │  Будь-    │ Будь- │
│ пост        │      │   який    │ який  │
├─────────────┼──────┼───────────┼───────┤
│ Видалити    │ Свій │  Будь-    │ Будь- │
│ коментар    │      │   який    │ який  │
├─────────────┼──────┼───────────┼───────┤
│ Створити    │  ❌  │    ❌     │  ✅   │
│ категорію   │      │           │       │
├─────────────┼──────┼───────────┼───────┤
│ Видалити    │  ❌  │    ❌     │  ✅   │
│ категорію   │      │           │       │
└─────────────┴──────┴───────────┴───────┘
```

---

## 🎯 Корисні шорткати

### VS Code:

- `Ctrl+P` - швидкий пошук файлів
- `Ctrl+Shift+F` - пошук по всьому проекту
- `Ctrl+` - термінал
- `F2` - переіменувати символ всюди

### Chrome DevTools:

- `F12` - відкрити DevTools
- `Ctrl+Shift+R` - hard reload
- `Ctrl+Shift+C` - інспектор елементів

### Terminal:

- `Ctrl+C` - зупинити процес
- `Ctrl+L` - очистити екран
- `cd ..` - вийти з папки
- `ls` - показати файли

---

## 📂 Структура файлів (важливі)

```
forum/
├── forum-backend/
│   ├── routes/
│   │   ├── auth.js          ← JWT токен, роль
│   │   ├── categories.js    ← admin тільки
│   │   ├── posts.js         ← роль в SELECT
│   │   └── comments.js      ← роль в SELECT
│   ├── middleware/
│   │   ├── auth.js          ← перевірка токена
│   │   └── roleCheck.js     ← перевірка ролей
│   └── .env                 ← налаштування
│
└── forum-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Categories.js     ← delete для адмінів
    │   │   ├── CategoryForm.js   ← тільки адміни
    │   │   ├── PostList.js       ← бейджі + delete
    │   │   ├── CommentList.js    ← бейджі + delete
    │   │   └── Login.js          ← зберігає роль
    │   ├── App.js                ← темна тема, layout
    │   └── index.css             ← стилі, шрифти
    └── package.json
```

---

## 🎨 Змінити кольори теми

### В файлі `index.css`:

```css
:root {
  /* Змінити акцентний колір */
  --accent-primary: #0969da; /* Синій → змінити на свій */

  /* Інші кольори */
  --success: #1a7f37; /* Зелений */
  --danger: #cf222e; /* Червоний */
  --warning: #fb8500; /* Помаранчевий */
}
```

---

## 📊 Моніторинг логів

### Backend:

```bash
cd ~/Стільниця/forum/forum-backend
npm run dev
# Дивись консоль - там будуть логи запитів
```

### Frontend (браузер):

```
F12 → Console
# Дивись помилки та логи
```

---

## 🔄 Оновити залежності

```bash
# Backend
cd ~/Стільниця/forum/forum-backend
npm update

# Frontend
cd ~/Стільниця/forum/forum-frontend
npm update
```

---

## 💾 Бекап бази даних

```bash
# Експорт
mysqldump -u root -p forum_db > forum_backup.sql

# Імпорт
mysql -u root -p forum_db < forum_backup.sql
```

---

## 🎉 Чеклист перед продакшеном

- [ ] Змінити JWT_SECRET в .env
- [ ] Змінити DB_PASSWORD
- [ ] Встановити CORS origin (не '\*')
- [ ] Додати rate limiting
- [ ] Додати input validation
- [ ] Тестування на різних браузерах
- [ ] Мобільна версія
- [ ] Оптимізація зображень
- [ ] HTTPS
- [ ] Backup бази даних

---

Все найнеобхідніше в одному місці! 🚀
