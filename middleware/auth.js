const { User } = require('../database/models');

async function authenticate(req, res, next) {
    const userId = req.session.userId;
    
    if (!userId) {
        console.log('Неавторизованный доступ к:', req.url);
        return res.status(401).json({ error: 'Необходимо войти в систему' });
    }
    
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }
        req.user = user;
        console.log(`✅ Авторизован: ${user.email} (${user.role})`);
        next();
    } catch (error) {
        console.error('Ошибка аутентификации:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
}

async function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        console.log(`Доступ запрещен: ${req.user?.email} пытался получить доступ к админ-панели`);
        return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора.' });
    }
    console.log(`Администратор ${req.user.email} получил доступ`);
    next();
}

module.exports = { authenticate, requireAdmin };