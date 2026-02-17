// middleware/roleCheck.js
// Middleware для перевірки ролей користувачів

const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user має бути встановлений через authMiddleware
        if (!req.user) {
            return res.status(401).json({ message: "Не авторизовано" });
        }

        // Перевірка чи роль користувача дозволена
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Доступ заборонено. Потрібна роль: " + allowedRoles.join(" або ")
            });
        }

        next();
    };
};

// Швидкі хелпери
const isAdmin = checkRole('admin');
const isModerator = checkRole('moderator', 'admin');
const isUser = checkRole('user', 'moderator', 'admin');

module.exports = {
    checkRole,
    isAdmin,
    isModerator,
    isUser
};