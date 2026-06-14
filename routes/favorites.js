const express = require('express');
const router = express.Router();
const { Favorite, Tour, Hotel } = require('../database/models');
const { authenticate } = require('../middleware/auth');
const { Op } = require('sequelize');

// Получение избранного пользователя
router.get('/', authenticate, async (req, res) => {
    try {
        const favorites = await Favorite.findAll({
            where: { user_id: req.user.id }
        });
        
        // Получаем туры и отели отдельно
        const tourIds = favorites.filter(f => f.tour_id).map(f => f.tour_id);
        const hotelIds = favorites.filter(f => f.hotel_id).map(f => f.hotel_id);
        
        const tours = await Tour.findAll({ where: { id: tourIds, is_active: true } });
        const hotels = await Hotel.findAll({ where: { id: hotelIds, is_active: true } });
        
        const result = [...tours, ...hotels];
        console.log(`❤️ Избранное пользователя ${req.user.id}: ${result.length} элементов`);
        res.json(result);
    } catch (error) {
        console.error('Ошибка получения избранного:', error);
        res.status(500).json({ error: 'Ошибка получения избранного' });
    }
});

// Добавление в избранное (поддержка tourId и hotelId)
router.post('/', authenticate, async (req, res) => {
    try {
        const { tourId, hotelId } = req.body;
        
        let favoriteData = {
            user_id: req.user.id
        };
        
        if (tourId) {
            favoriteData.tour_id = tourId;
            favoriteData.type = 'tour';
        } else if (hotelId) {
            favoriteData.hotel_id = hotelId;
            favoriteData.type = 'hotel';
        } else {
            return res.status(400).json({ error: 'Не указан ID тура или отеля' });
        }
        
        // Проверяем, не добавлено ли уже
        const existing = await Favorite.findOne({
            where: {
                user_id: req.user.id,
                ...(tourId ? { tour_id: tourId } : { hotel_id: hotelId })
            }
        });
        
        if (existing) {
            return res.status(400).json({ error: 'Уже в избранном' });
        }
        
        const favorite = await Favorite.create(favoriteData);
        console.log(`❤️ Добавлено в избранное: User ${req.user.id} -> ${tourId ? 'тур' : 'отель'} ${tourId || hotelId}`);
        res.status(201).json(favorite);
    } catch (error) {
        console.error('Ошибка добавления в избранное:', error);
        res.status(500).json({ error: 'Ошибка добавления в избранное' });
    }
});

// Удаление из избранного
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const itemId = parseInt(req.params.id);
        
        const favorite = await Favorite.findOne({
            where: {
                user_id: req.user.id,
                [Op.or]: [
                    { tour_id: itemId },
                    { hotel_id: itemId }
                ]
            }
        });
        
        if (!favorite) {
            return res.status(404).json({ error: 'Не найдено в избранном' });
        }
        
        await favorite.destroy();
        console.log(`💔 Удалено из избранного: User ${req.user.id} -> ${favorite.tour_id ? 'тур' : 'отель'} ${favorite.tour_id || favorite.hotel_id}`);
        res.json({ message: 'Удалено из избранного' });
    } catch (error) {
        console.error('Ошибка удаления из избранного:', error);
        res.status(500).json({ error: 'Ошибка удаления из избранного' });
    }
});

module.exports = router;