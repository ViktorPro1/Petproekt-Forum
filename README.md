Forum PetProject – Повний опис проекту

Структура папок:
forum/
├── forum-frontend/ # React фронтенд
│ ├── src/
│ │ ├── components/
│ │ │ ├── Register.js # Форма реєстрації
│ │ │ ├── Login.js # Форма логіну
│ │ │ ├── PostList.js # Список постів з вибором активного
│ │ │ ├── PostForm.js # Створення нового посту
│ │ │ ├── CommentList.js # Список коментарів для посту
│ │ │ └── CommentForm.js # Форма додавання коментаря
│ │ └── App.js # Головний компонент React
│ └── package.json
└── forum-backend/ # Node.js + Express бекенд
├── routes/
│ ├── auth.js # Маршрути /register, /login
│ ├── posts.js # Маршрути для постів
│ └── comments.js # Маршрути для коментарів
├── controllers/
│ └── authController.js # Логіка реєстрації та логіну
├── middleware/
│ └── auth.js # Перевірка JWT токена
├── config/
│ └── db.js # Налаштування MySQL з'єднання
└── package.json

Функціонал проекту:

1. Реєстрація нового користувача з хешуванням паролю bcrypt
2. Логін користувача та отримання JWT токена
3. Захищені маршрути для створення постів та коментарів
4. Створення постів та коментарів у MySQL базі
5. Вивід списку постів та коментарів у React фронтенді
6. Вибір посту для відображення коментарів
7. Підтримка оновлення списку коментарів після додавання нового
8. Фронтенд підключається до бекенду на localhost:5000/api
9. Фронтенд та бекенд розділені в окремі папки (forum-frontend, forum-backend)
10. Підтримка виходу користувача (logout) та видалення токена з localStorage

Ключові моменти:

- Використовується React useState та useEffect для станів і завантаження даних
- Для авторизації запити до захищених маршрутів відправляються з заголовком:
  Authorization: Bearer <JWT token>
- Компоненти PostList та CommentList підтримують оновлення при зміні посту або додаванні нового коментаря
- Для стилізації можна підключити TailwindCSS (npm install -D tailwindcss postcss autoprefixer; npx tailwindcss init -p)

Важливо:

- Назви папок повинні відповідати forum-frontend і forum-backend
- App.js управляє авторизацією та відображенням форм/списків постів і коментарів
- Backend повинен запускатись через npm run dev у папці forum-backend
- Frontend через npm start у папці forum-frontend
- MySQL база містить таблицю users з полями: id, username, email, password, role, created_at
- Таблиця posts: id, title, content, user_id, created_at
- Таблиця comments: id, post_id, user_id, content, created_at

Команди для запуску:

# Запуск бекенду:

cd forum-backend
npm install # якщо ще не встановлені залежності
npm run dev # запускає сервер на localhost:5000

# Запуск фронтенду:

cd forum-frontend
npm install # якщо ще не встановлені залежності
npm start # запускає React фронтенд на localhost:3000

cd ~/Стільниця/forum/forum-backend
npm run dev

cd ~/Стільниця/forum/forum-frontend
npm start
