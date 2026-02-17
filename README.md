# 🌐 Господарство - Господарство онлайн

> Сучасна платформа для обговорень з підтримкою категорій, системою ролей та красивим UI

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Основні можливості

- 🎨 **Сучасний дизайн** - Discord-style layout, темна тема, красиві анімації
- 🔐 **Система ролей** - User, Moderator, Admin з різними правами
- 📁 **Категорії постів** - організація контенту
- 🛡️ **Модерація** - видалення постів/коментарів для модераторів
- 👑 **Бейджі ролей** - візуальне позначення адмінів та модераторів
- 📱 **Адаптивність** - працює на всіх пристроях
- 🌙 **Темна тема** - з збереженням вибору
- ⚡ **Швидкість** - оптимізований код та skeleton loaders

---

## 🚀 Швидкий старт

### Вимоги

- Node.js 18+
- MySQL 8.0+
- npm або yarn

### Встановлення

```bash
# Клонувати репозиторій
git clone <repository-url>
cd forum

# Backend
cd forum-backend
npm install
cp .env.example .env  # Налаштувати .env
npm run dev

# Frontend (новий термінал)
cd forum-frontend
npm install
npm start
```

### Налаштування бази даних

```sql
CREATE DATABASE forum_db;
USE forum_db;
-- Запустити SQL скрипти з /sql
```

**Детальніше:** [QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md)

---

## 📸 Скріншоти

### Світла тема

![Light theme](./screenshots/light.png)

### Темна тема

![Dark theme](./screenshots/dark.png)

### Модерація

![Moderation](./screenshots/moderation.png)

---

## 🛠️ Технології

### Frontend

- **React** 18.2 - UI фреймворк
- **Tailwind CSS** - стилізація
- **Sora + DM Sans** - шрифти

### Backend

- **Node.js** - runtime
- **Express** - веб-фреймворк
- **MySQL2** - база даних
- **JWT** - автентифікація
- **bcrypt** - хешування паролів

---

## 📚 Документація

- 📖 [Повна документація проекту](./docs/PROJECT_DOCUMENTATION.md)
- ⚡ [Швидка довідка](./docs/QUICK_REFERENCE.md)
- 📝 [Список змін](./docs/CHANGELOG.md)
- 🛡️ [Налаштування адмінів](./docs/ADMIN_SETUP_GUIDE.md)
- 🎨 [Гайд по дизайну](./docs/MODERN_DESIGN_GUIDE.md)

---

## 🎯 Структура проекту

```
forum/
├── forum-frontend/           # React додаток
│   ├── src/
│   │   ├── components/      # React компоненти
│   │   ├── App.js          # Головний компонент
│   │   └── index.css       # Стилі
│   └── package.json
│
├── forum-backend/           # Node.js сервер
│   ├── routes/             # API маршрути
│   ├── controllers/        # Бізнес-логіка
│   ├── middleware/         # Middleware (auth, roles)
│   └── config/            # Конфігурація
│
├── docs/                   # Документація
└── sql/                    # SQL скрипти
```

---

## 🔐 Ролі користувачів

| Роль      | Створ. пости | Видал. свої | Видал. чужі | Керувати категоріями |
| --------- | ------------ | ----------- | ----------- | -------------------- |
| User      | ✅           | ✅          | ❌          | ❌                   |
| Moderator | ✅           | ✅          | ✅          | ❌                   |
| Admin     | ✅           | ✅          | ✅          | ✅                   |

---

## 📋 API Endpoints

### Авторизація

```
POST /api/auth/register  - Реєстрація
POST /api/auth/login     - Логін
```

### Категорії

```
GET    /api/categories       - Список категорій
POST   /api/categories       - Створити (admin)
DELETE /api/categories/:id   - Видалити (admin)
```

### Пости

```
GET    /api/posts            - Список постів
POST   /api/posts            - Створити пост
DELETE /api/posts/:id        - Видалити (moderator+)
```

### Коментарі

```
GET    /api/comments/:post_id  - Коментарі поста
POST   /api/comments           - Додати коментар
DELETE /api/comments/:id       - Видалити (moderator+)
```

---

## 🎨 Особливості дизайну

### Кольорова схема

- **Primary**: #0969da (світла) / #58a6ff (темна)
- **Success**: #1a7f37 / #3fb950
- **Danger**: #cf222e / #f85149

### Шрифти

- **Заголовки**: Sora (700)
- **Текст**: DM Sans (400-700)

### Компоненти

- Стильні кнопки з градієнтами
- Бейджі ролей з іконками
- Анімації fade-in, slide-up
- Адаптивний layout

---

## 🐛 Troubleshooting

### Помилка "Cannot find module"

```bash
cd forum-backend
npm install bcryptjs jsonwebtoken mysql2
```

### Кнопки не стильні

```bash
cd forum-frontend
rm -rf node_modules/.cache
npm start
```

### База даних не підключається

1. Перевір MySQL запущений
2. Перевір .env налаштування
3. Переконайся що база `forum_db` створена

**Більше:** [QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md)

---

## 🚧 Roadmap

- [ ] Пошук по постах
- [ ] Редагування постів
- [ ] Реакції (лайки)
- [ ] Аватарки користувачів
- [ ] Приватні повідомлення
- [ ] Email верифікація
- [ ] Rich text editor
- [ ] Admin panel

---

## 🤝 Внесок

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork проект
2. Створи feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit зміни (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Відкрий Pull Request

---

## 📄 Ліцензія

Цей проект ліцензовано під MIT License - деталі в [LICENSE](LICENSE)

---

## 👨‍💻 Автор

**Господарство онлайн**  
Зроблено з ❤️ в Україні 🇺🇦

---

## 📞 Контакти

- Website: [господарство-онлайн.ua](#)
- Email: support@господарство-онлайн.ua
- GitHub: [@your-username](#)

---

## ⭐ Підтримка

Якщо цей проект вам допоміг, поставте зірку ⭐ на GitHub!

---

**Версія:** 2.0  
**Останнє оновлення:** Лютий 2026
