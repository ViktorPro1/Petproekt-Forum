# Господарство онлайн – Повний опис проекту (Оновлено 2026)

## 🎯 Опис проекту

Сучасний форум з підтримкою категорій, системою ролей (адміни/модератори), темною темою та Discord-style layout. Повнофункціональний застосунок з красивим UI, модерацією та захищеними маршрутами.

---

## 📁 Структура папок

```
forum/
├── forum-frontend/                # React фронтенд
│   ├── src/
│   │   ├── components/
│   │   │   ├── Register.js       # Форма реєстрації
│   │   │   ├── Login.js          # Форма логіну (+ збереження ролі)
│   │   │   ├── Categories.js     # Список категорій (+ видалення для адмінів)
│   │   │   ├── CategoryForm.js   # Створення категорії (тільки адміни)
│   │   │   ├── PostList.js       # Список постів (+ бейджі ролей, видалення)
│   │   │   ├── PostForm.js       # Створення нового посту
│   │   │   ├── CommentList.js    # Список коментарів (+ бейджі ролей, видалення)
│   │   │   └── CommentForm.js    # Форма додавання коментаря
│   │   ├── services/
│   │   │   └── api.js            # API запити до бекенду
│   │   ├── App.js                # Головний компонент (+ темна тема, layout)
│   │   └── index.css             # Сучасні стилі (Sora, DM Sans, темна тема)
│   ├── tailwind.config.js
│   └── package.json
└── forum-backend/                 # Node.js + Express бекенд
    ├── routes/
    │   ├── auth.js               # /register, /login (+ роль в токені)
    │   ├── categories.js         # CRUD категорій (create/delete тільки адміни)
    │   ├── posts.js              # CRUD постів (delete для модераторів, + роль в SELECT)
    │   └── comments.js           # CRUD коментарів (delete для модераторів, + роль в SELECT)
    ├── controllers/
    │   └── authController.js     # Логіка auth (+ роль в JWT)
    ├── middleware/
    │   ├── auth.js               # Перевірка JWT токена
    │   └── roleCheck.js          # Перевірка ролей (isAdmin, isModerator)
    ├── config/
    │   └── db.js                 # MySQL з'єднання
    ├── server.js                 # Express сервер
    └── package.json
```

---

## ✨ Функціонал проекту

### 🔐 Авторизація та безпека

1. ✅ Реєстрація з хешуванням паролю (bcrypt)
2. ✅ Логін з JWT токеном
3. ✅ Захищені маршрути
4. ✅ Система ролей: **User**, **Moderator**, **Admin**
5. ✅ Middleware для перевірки ролей
6. ✅ Збереження ролі в localStorage

### 📁 Категорії

7. ✅ Створення категорій (тільки адміни)
8. ✅ Видалення категорій (тільки адміни)
9. ✅ Перевірка чи є пости перед видаленням
10. ✅ Фільтрація постів по категорії

### 📝 Пости

11. ✅ Створення постів
12. ✅ Відображення постів з username автора
13. ✅ Видалення постів (модератори/адміни)
14. ✅ Бейджі ролей біля імені автора (👑 АДМІН / 🛡️ МОД)
15. ✅ Вибір посту для перегляду коментарів

### 💬 Коментарі

16. ✅ Додавання коментарів
17. ✅ Відображення коментарів з username
18. ✅ Видалення коментарів (модератори/адміни)
19. ✅ Бейджі ролей біля імені автора
20. ✅ Автооновлення після додавання

### 🎨 Дизайн та UI

21. ✅ **Темна тема** (перемикач + збереження в localStorage)
22. ✅ **Discord-style layout** (3 колонки: категорії, пости, коментарі)
23. ✅ **Сучасна типографіка** (шрифти Sora + DM Sans)
24. ✅ **Стильні кнопки** (градієнти, shadows, hover effects)
25. ✅ **Адаптивний дизайн** (працює на mobile/tablet/desktop)
26. ✅ **Анімації** (fade-in, slide-up, smooth transitions)
27. ✅ **Skeleton loaders** під час завантаження
28. ✅ **Footer** з копірайтом

### 🛡️ Модерація

29. ✅ Червоні кнопки видалення (🗑️) для модераторів
30. ✅ Підтвердження перед видаленням
31. ✅ Відображення ролі користувача в постах/коментарях

---

## 🗄️ База даних MySQL

### Таблиця `users`

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Таблиця `categories`

```sql
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Таблиця `posts`

```sql
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
```

### Таблиця `comments`

```sql
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

## 🎨 Дизайн система

### Шрифти

- **Заголовки**: Sora (700 weight)
- **Тіло тексту**: DM Sans (400-700 weight)

### Кольори

**Світла тема:**

```css
--bg-primary: #fafbfc;
--bg-secondary: #ffffff;
--text-primary: #0d1117;
--accent-primary: #0969da;
```

**Темна тема:**

```css
--bg-primary: #0d1117;
--bg-secondary: #161b22;
--text-primary: #e6edf3;
--accent-primary: #58a6ff;
```

### Бейджі ролей

- **АДМІН**: Червоний градієнт + корона 👑
- **МОД**: Синій градієнт + щит 🛡️

---

## 🚀 Команди для запуску

### Перший запуск (встановлення залежностей)

```bash
# Backend
cd ~/Стільниця/forum/forum-backend
npm install

# Frontend
cd ~/Стільниця/forum/forum-frontend
npm install
```

### Запуск сервера

```bash
# Terminal 1 - Backend (порт 5000)
cd ~/Стільниця/forum/forum-backend
npm run dev

# Terminal 2 - Frontend (порт 3000)
cd ~/Стільниця/forum/forum-frontend
npm start
```

### Очистити кеш (якщо щось не працює)

```bash
cd ~/Стільниця/forum/forum-frontend
rm -rf node_modules/.cache
npm start
```

---

## 🔑 Ключові особливості

### Backend

- **Express** сервер на порту 5000
- **JWT** авторизація (токен в заголовку `Authorization: Bearer <token>`)
- **bcrypt** для хешування паролів
- **MySQL** база даних
- **Middleware** для авторизації та перевірки ролей
- **CORS** для зв'язку з фронтендом

### Frontend

- **React** (useState, useEffect, useCallback)
- **Tailwind CSS** для стилів
- **localStorage** для токену та ролі користувача
- **Inline стилі** для кнопок (для надійності)
- **Responsive design** (mobile-first)
- **Dark mode** з збереженням вибору

### Авторизація

```javascript
// Заголовок для захищених запитів
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
}
```

### Ролі користувачів

```
User       - може створювати пости/коментарі
Moderator  - може видаляти будь-які пости/коментарі
Admin      - може все + створювати/видаляти категорії
```

---

## 📊 Список залежностей

### Backend (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Frontend (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

---

## 🛠️ Налаштування

### .env файл (backend)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=forum_db
JWT_SECRET=your_secret_key_here
PORT=5000
```

### tailwind.config.js (frontend)

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Sora", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

---

## 🔐 Створення першого адміна

```sql
-- В MySQL виконати:
UPDATE users
SET role = 'admin'
WHERE email = 'твій-email@example.com';
```

---

## 📱 Адаптивність

### Desktop (>1280px)

- 3 колонки: категорії (320px) | пости (flex) | коментарі (384px)
- Всі елементи видимі

### Tablet (1024-1280px)

- 2 колонки: категорії + пости
- Коментарі в окремій панелі

### Mobile (<1024px)

- 1 колонка
- Hamburger menu для категорій
- Коментарі в bottom sheet

---

## 🎯 Маршрути API

### Auth

```
POST /api/auth/register - Реєстрація
POST /api/auth/login    - Логін (повертає token + role)
```

### Categories

```
GET    /api/categories     - Отримати всі (публічно)
POST   /api/categories     - Створити (тільки admin)
DELETE /api/categories/:id - Видалити (тільки admin)
```

### Posts

```
GET    /api/posts              - Отримати всі (+ ?category_id=X)
POST   /api/posts              - Створити (авторизовані)
DELETE /api/posts/:id          - Видалити (moderator/admin)
```

### Comments

```
GET    /api/comments/:post_id  - Отримати коментарі поста
POST   /api/comments           - Додати коментар (авторизовані)
DELETE /api/comments/:id       - Видалити (moderator/admin)
```

---

## 🎨 UI Компоненти

### Кнопки

- **Primary**: Синя з градієнтом (головні дії)
- **Secondary**: Біла з рамкою (другорядні дії)
- **Ghost**: Прозора (допоміжні дії)
- **Icon**: Квадратна 40x40px (іконки)
- **Delete**: Червона (видалення)

### Картки

- Заокруглені кути (16px)
- М'які тіні
- Hover effects (піднімання)

### Бейджі

- Rounded (8px)
- Градієнтний фон
- Uppercase текст
- Іконки SVG

---

## 🐛 Troubleshooting

### Помилка "Cannot find module 'bcryptjs'"

```bash
cd ~/Стільниця/forum/forum-backend
npm install bcryptjs jsonwebtoken
```

### Кнопки не стильні

```bash
cd ~/Стільниця/forum/forum-frontend
rm -rf node_modules/.cache
npm start
```

### Не бачу бейджів ролей

1. Перевір що backend оновлений (routes/posts.js, routes/comments.js)
2. Перелогінься на форумі
3. Перезапусти backend

### База даних не підключається

1. Перевір .env файл
2. Перевір що MySQL запущений
3. Перевір що база forum_db створена

---

## 📚 Додаткові файли

### Інструкції

- `ADMIN_SETUP_GUIDE.md` - Налаштування адмінів/модераторів
- `BADGES_AND_CATEGORIES_GUIDE.md` - Бейджі та категорії для адмінів
- `MODERN_DESIGN_GUIDE.md` - Гайд по сучасному дизайну
- `FINAL_SOLUTION.md` - Рішення проблем зі стильними кнопками

### SQL скрипти

- `add_roles.sql` - Додати роль до users
- `create_tables.sql` - Створити всі таблиці

---

## 🎉 Можливості розширення

### Майбутні фічі (ідеї):

- [ ] Пошук по постах
- [ ] Сортування (нові/популярні/старі)
- [ ] Редагування постів/коментарів
- [ ] Аватарки користувачів
- [ ] Реакції на пости (лайки)
- [ ] Приватні повідомлення
- [ ] Нотифікації
- [ ] Rich text editor
- [ ] Прикріплення файлів
- [ ] Admin panel (управління користувачами)
- [ ] Статистика форуму
- [ ] Email верифікація

---

## 📝 Примітки

### Важливо

- Назви папок: `forum-frontend` і `forum-backend`
- Backend на порту **5000**, Frontend на **3000**
- JWT токен зберігається в `localStorage`
- Роль користувача зберігається в `localStorage.userRole`
- Темна тема в `localStorage.theme`

### Безпека

- Паролі хешуються з bcrypt
- JWT токени з терміном дії 24 години
- Ролі перевіряються на backend middleware
- SQL injection захист через підготовлені запити

### Performance

- Skeleton loaders під час завантаження
- Debounce для пошуку (якщо додасте)
- Lazy loading для великих списків (можна додати)
- Стиснення зображень (якщо додасте файли)

---

## 👨‍💻 Автор

**Проект:** Господарство онлайн  
**Версія:** 2.0  
**Дата:** 2026  
**Технології:** React, Node.js, Express, MySQL, Tailwind CSS  
**Назва:** Господарство онлайн

---

**Зроблено з ❤️ в Україні** 🇺🇦
