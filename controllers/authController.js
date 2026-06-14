const { User } = require('../database/models');

class AuthController {
    // Регистрация
    async register(req, res) {
        try {
            console.log('📝 Начало регистрации пользователя');
            const { name, email, password, phone } = req.body;
            
            // Проверка существующего пользователя
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                console.log(`❌ Ошибка регистрации: Email ${email} уже существует`);
                return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
            }
            
            // Создание пользователя
            const user = await User.create({
                name,
                email,
                password,
                phone,
                role: 'user'
            });
            
            // Сохраняем пользователя в сессии
            req.session.userId = user.id;
            
            console.log(`✅ Успешная регистрация: ${email} (ID: ${user.id})`);
            
            res.status(201).json({
                message: 'Регистрация успешна',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('❌ Ошибка при регистрации:', error);
            res.status(500).json({ error: 'Ошибка при регистрации' });
        }
    }
    
    // Вход
    async login(req, res) {
        try {
            console.log('🔑 Попытка входа');
            const { email, password } = req.body;
            
            const user = await User.findOne({ where: { email } });
            if (!user) {
                console.log(`❌ Ошибка входа: Пользователь ${email} не найден`);
                return res.status(401).json({ error: 'Неверный email или пароль' });
            }
            
            const isValid = await user.validatePassword(password);
            if (!isValid) {
                console.log(`❌ Ошибка входа: Неверный пароль для ${email}`);
                return res.status(401).json({ error: 'Неверный email или пароль' });
            }
            
            req.session.userId = user.id;
            
            console.log(`✅ Успешный вход: ${email} (ID: ${user.id}, Роль: ${user.role})`);
            
            res.json({
                message: 'Вход выполнен успешно',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('❌ Ошибка при входе:', error);
            res.status(500).json({ error: 'Ошибка при входе' });
        }
    }
    
    // Выход
    async logout(req, res) {
        const userId = req.session.userId;
        req.session.destroy();
        console.log(`👋 Пользователь ${userId} вышел из системы`);
        res.json({ message: 'Выход выполнен успешно' });
    }
    
    // Получение текущего пользователя
    async getCurrentUser(req, res) {
        try {
            const userId = req.session.userId;
            if (!userId) {
                return res.json({ user: null });
            }
            
            const user = await User.findByPk(userId, {
                attributes: ['id', 'name', 'email', 'phone', 'role']
            });
            
            console.log(`👤 Запрос текущего пользователя: ${user?.email || 'гость'}`);
            res.json({ user });
        } catch (error) {
            console.error('❌ Ошибка при получении пользователя:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}

module.exports = new AuthController();