const { Favorite, Tour } = require('../database/models');

class FavoriteController {
    // Получение избранного пользователя
    async getFavorites(req, res) {
        try {
            console.log(`❤️ Запрос избранного пользователя ${req.user.id}`);
            
            const favorites = await Favorite.findAll({
                where: { user_id: req.user.id },
                include: [{
                    model: Tour,
                    where: { is_active: true },
                    attributes: ['id', 'name', 'country', 'price', 'duration', 'stars', 'description']
                }]
            });
            
            const tours = favorites.map(f => f.Tour);
            console.log(`✅ В избранном ${tours.length} туров`);
            
            res.json(tours);
        } catch (error) {
            console.error('❌ Ошибка получения избранного:', error);
            res.status(500).json({ error: 'Ошибка получения избранного' });
        }
    }
    
    // Добавление в избранное
    async addToFavorites(req, res) {
        try {
            const { tourId } = req.body;
            console.log(`❤️ Добавление в избранное: User ${req.user.id}, Tour ${tourId}`);
            
            // Проверка существования тура
            const tour = await Tour.findByPk(tourId);
            if (!tour) {
                console.log(`❌ Тур ${tourId} не найден`);
                return res.status(404).json({ error: 'Тур не найден' });
            }
            
            // Проверка, не в избранном ли уже
            const existing = await Favorite.findOne({
                where: { user_id: req.user.id, tour_id: tourId }
            });
            
            if (existing) {
                console.log(`⚠️ Тур уже в избранном`);
                return res.status(400).json({ error: 'Тур уже в избранном' });
            }
            
            const favorite = await Favorite.create({
                user_id: req.user.id,
                tour_id: tourId
            });
            
            console.log(`✅ Тур добавлен в избранное: ${tour.name}`);
            res.status(201).json({ message: 'Тур добавлен в избранное', favorite });
        } catch (error) {
            console.error('❌ Ошибка добавления в избранное:', error);
            res.status(500).json({ error: 'Ошибка добавления в избранное' });
        }
    }
    
    // Удаление из избранного
    async removeFromFavorites(req, res) {
        try {
            const { tourId } = req.params;
            console.log(`💔 Удаление из избранного: User ${req.user.id}, Tour ${tourId}`);
            
            const favorite = await Favorite.findOne({
                where: { user_id: req.user.id, tour_id: tourId }
            });
            
            if (!favorite) {
                return res.status(404).json({ error: 'Тур не найден в избранном' });
            }
            
            await favorite.destroy();
            console.log(`✅ Тур удален из избранного`);
            
            res.json({ message: 'Тур удален из избранного' });
        } catch (error) {
            console.error('❌ Ошибка удаления из избранного:', error);
            res.status(500).json({ error: 'Ошибка удаления из избранного' });
        }
    }
    
    // Проверка, в избранном ли тур
    async isFavorite(req, res) {
        try {
            const { tourId } = req.params;
            console.log(`🔍 Проверка избранного: User ${req.user.id}, Tour ${tourId}`);
            
            const favorite = await Favorite.findOne({
                where: { user_id: req.user.id, tour_id: tourId }
            });
            
            res.json({ isFavorite: !!favorite });
        } catch (error) {
            console.error('❌ Ошибка проверки избранного:', error);
            res.status(500).json({ error: 'Ошибка проверки избранного' });
        }
    }
}

module.exports = new FavoriteController();