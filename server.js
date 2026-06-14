const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const tourRoutes = require('./routes/tours');
const hotelRoutes = require('./routes/hotels');
const cartRoutes = require('./routes/cart');
const favoriteRoutes = require('./routes/favorites');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

// Импорт базы данных и моделей
const sequelize = require('./database/db');
const { User, Tour, Hotel } = require('./database/models');

// УДАЛЯЕМ СТАРУЮ БАЗУ ДАННЫХ, чтобы избежать конфликта схем
const dbPath = './database.sqlite';
if (fs.existsSync(dbPath)) {
    console.log('🗑️ Удаляем старую базу данных...');
    fs.unlinkSync(dbPath);
}

// Middleware для логирования
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0 && !req.url.includes('login') && !req.url.includes('register')) {
        console.log('  Body:', req.body);
    }
    next();
});

// CORS настроен на порт 3003
app.use(cors({ origin: 'http://localhost:3003', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'letim-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(express.static(path.join(__dirname, 'public')));

// Маршруты API
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// HTML страницы
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/index1.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index1.html')));
app.get('/favorites.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'favorites.html')));
app.get('/about.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/auth.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'auth.html')));
app.get('/help.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'help.html')));
app.get('/korz.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'korz.html')));
app.get('/set.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'set.html')));
app.get('/tour.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'tour.html')));
app.get('/zak.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'zak.html')));

// Инициализация тестовых данных
async function initTestData() {
    try {
        // Создание администратора
        const [admin, createdAdmin] = await User.findOrCreate({
            where: { email: 'admin@letim.ru' },
            defaults: {
                name: 'Администратор',
                email: 'admin@letim.ru',
                password: 'admin123',
                phone: '+7 (999) 999-99-99',
                role: 'admin',
                is_active: true
            }
        });
        if (createdAdmin) console.log('👑 Администратор создан: admin@letim.ru / admin123');
        
        // Создание тестового пользователя
        const [testUser, createdTest] = await User.findOrCreate({
            where: { email: 'test@test.com' },
            defaults: {
                name: 'Тестовый Пользователь',
                email: 'test@test.com',
                password: '123456',
                phone: '+7 (900) 123-45-67',
                role: 'user',
                is_active: true
            }
        });
        if (createdTest) console.log('🧪 Тестовый пользователь создан: test@test.com / 123456');
        
        // Создание тестовых туров
        const toursCount = await Tour.count();
        if (toursCount === 0) {
            const tours = [
                { name: "Райский Пхукет", country: "Таиланд", price: 125000, duration: "10 дней", description: "Экскурсии, море, ночная жизнь", stars: 4, image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400", is_active: true },
                { name: "Турецкий рай", country: "Турция", price: 85000, duration: "7 дней", description: "Отель 5*, all inclusive", stars: 5, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", is_active: true },
                { name: "Итальянское лето", country: "Италия", price: 210000, duration: "9 дней", description: "Рим, Флоренция, Венеция", stars: 4, image: "https://images.unsplash.com/photo-1533681904393-9ab6eee7f63a?w=400", is_active: true },
                { name: "Египетское приключение", country: "Египет", price: 75000, duration: "8 дней", description: "Пирамиды, дайвинг", stars: 3, image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400", is_active: true },
                { name: "Мальдивская сказка", country: "Мальдивы", price: 350000, duration: "7 дней", description: "Роскошный отдых на океане", stars: 5, image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400", is_active: true }
            ];
            await Tour.bulkCreate(tours);
            console.log(`✨ Создано ${tours.length} тестовых туров`);
        }
        
        // Создание тестовых отелей
        const hotelsCount = await Hotel.count();
        if (hotelsCount === 0) {
            const hotels = [
                { name: "Sunny Beach Resort", stars: 5, resort: "Анталья", country: "Турция", location: "Анталья", price: 15000, rating: 9.2, description: "Роскошный отель с собственным пляжем", is_active: true },
                { name: "Royal Blue Hotel", stars: 4, resort: "Шарм-эль-Шейх", country: "Египет", location: "Шарм-эль-Шейх", price: 12000, rating: 8.5, description: "Отель с видом на море", is_active: true },
                { name: "Grand Palace", stars: 5, resort: "Пхукет", country: "Таиланд", location: "Пхукет", price: 25000, rating: 9.5, description: "VIP обслуживание", is_active: true },
                { name: "Sea Breeze", stars: 4, resort: "Крит", country: "Греция", location: "Крит", price: 10000, rating: 8.7, description: "Рядом с морем", is_active: true },
                { name: "Mountain View", stars: 4, resort: "Рим", country: "Италия", location: "Рим", price: 12000, rating: 8.8, description: "Вид на город, бассейн", is_active: true }
            ];
            await Hotel.bulkCreate(hotels);
            console.log(`✨ Создано ${hotels.length} тестовых отелей`);
        }
    } catch (error) {
        console.error('❌ Ошибка при создании тестовых данных:', error);
    }
}

// Запуск сервера
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ База данных подключена успешно');
        
        // Вместо alter: true используем sync с force: true, чтобы пересоздать таблицы с правильной схемой
        await sequelize.sync({ force: true });
        console.log('✅ Модели синхронизированы с БД (таблицы пересозданы)');
        
        await initTestData();
        
        app.listen(PORT, () => {
            console.log('=' .repeat(50));
            console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
            console.log(`📊 API доступен по адресу http://localhost:${PORT}/api`);
            console.log('=' .repeat(50));
            console.log('\n📝 Учетные записи для входа:');
            console.log('👑 Администратор: admin@letim.ru / admin123');
            console.log('🧪 Тестовый пользователь: test@test.com / 123456');
            console.log('=' .repeat(50));
        });
    } catch (error) {
        console.error('❌ Ошибка при запуске сервера:', error);
    }
}

startServer();