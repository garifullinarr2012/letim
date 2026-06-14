const { Tour, Favorite } = require('../database/models');
const { Op } = require('sequelize');

class TourController {
    // Получение всех туров
    async getAllTours(req, res) {
        try {
            console.log('📋 Запрос всех туров');
            const { country, stars, minPrice, maxPrice } = req.query;
            
            const where = { is_active: true };
            
            if (country) {
                where.country = { [Op.like]: `%${country}%` };
                console.log(`  Фильтр по стране: ${country}`);
            }
            if (stars) {
                where.stars = parseInt(stars);
                console.log(`  Фильтр по звездам: ${stars}`);
            }
            if (minPrice) {
                where.price = { [Op.gte]: parseFloat(minPrice) };
                console.log(`  Фильтр по мин. цене: ${minPrice}`);
            }
            if (maxPrice) {
                where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
                console.log(`  Фильтр по макс. цене: ${maxPrice}`);
            }
            
            const tours = await Tour.findAll({ where, order: [['price', 'ASC']] });
            console.log(`✅ Найдено туров: ${tours.length}`);
            
            res.json(tours);
        } catch (error) {
            console.error('❌ Ошибка получения туров:', error);
            res.status(500).json({ error: 'Ошибка получения туров' });
        }
    }
    
    // Получение тура по ID
    async getTourById(req, res) {
        try {
            const { id } = req.params;
            console.log(`🔍 Запрос тура ID: ${id}`);
            
            const tour = await Tour.findByPk(id);
            if (!tour) {
                console.log(`❌ Тур ${id} не найден`);
                return res.status(404).json({ error: 'Тур не найден' });
            }
            
            console.log(`✅ Тур найден: ${tour.name}`);
            res.json(tour);
        } catch (error) {
            console.error('❌ Ошибка получения тура:', error);
            res.status(500).json({ error: 'Ошибка получения тура' });
        }
    }
    
    // Создание тура (только админ)
    async createTour(req, res) {
        try {
            console.log('➕ Создание нового тура');
            const tourData = req.body;
            
            const tour = await Tour.create(tourData);
            console.log(`✅ Тур создан: ${tour.name} (ID: ${tour.id})`);
            
            res.status(201).json(tour);
        } catch (error) {
            console.error('❌ Ошибка создания тура:', error);
            res.status(500).json({ error: 'Ошибка создания тура' });
        }
    }
    
    // Обновление тура (только админ)
    async updateTour(req, res) {
        try {
            const { id } = req.params;
            console.log(`📝 Обновление тура ID: ${id}`);
            
            const tour = await Tour.findByPk(id);
            if (!tour) {
                return res.status(404).json({ error: 'Тур не найден' });
            }
            
            await tour.update(req.body);
            console.log(`✅ Тур обновлен: ${tour.name}`);
            
            res.json(tour);
        } catch (error) {
            console.error('❌ Ошибка обновления тура:', error);
            res.status(500).json({ error: 'Ошибка обновления тура' });
        }
    }
    
    // Удаление тура (только админ)
    async deleteTour(req, res) {
        try {
            const { id } = req.params;
            console.log(`🗑️ Удаление тура ID: ${id}`);
            
            const tour = await Tour.findByPk(id);
            if (!tour) {
                return res.status(404).json({ error: 'Тур не найден' });
            }
            
            await tour.destroy();
            console.log(`✅ Тур удален: ${tour.name}`);
            
            res.json({ message: 'Тур удален успешно' });
        } catch (error) {
            console.error('❌ Ошибка удаления тура:', error);
            res.status(500).json({ error: 'Ошибка удаления тура' });
        }
    }
}

module.exports = new TourController();