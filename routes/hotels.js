const express = require('express');
const router = express.Router();
const Hotel = require('../database/models/Hotel');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Получить все отели (доступно всем)
router.get('/', async (req, res) => {
    try {
        const hotels = await Hotel.findAll({ where: { is_active: true } });
        console.log(`📋 Запрошены отели, найдено: ${hotels.length}`);
        res.json(hotels);
    } catch (error) {
        console.error('Ошибка получения отелей:', error);
        res.status(500).json({ error: 'Ошибка получения отелей' });
    }
});

// Получить отель по ID
router.get('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);
        if (!hotel) return res.status(404).json({ error: 'Отель не найден' });
        res.json(hotel);
    } catch (error) {
        console.error('Ошибка получения отеля:', error);
        res.status(500).json({ error: 'Ошибка получения отеля' });
    }
});

// Создать отель (только админ)
router.post('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const hotel = await Hotel.create(req.body);
        console.log(`✅ Создан отель: ${hotel.name}`);
        res.status(201).json(hotel);
    } catch (error) {
        console.error('Ошибка создания отеля:', error);
        res.status(500).json({ error: 'Ошибка создания отеля' });
    }
});

// Обновить отель (только админ)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);
        if (!hotel) return res.status(404).json({ error: 'Отель не найден' });
        await hotel.update(req.body);
        console.log(`✅ Обновлен отель: ${hotel.name}`);
        res.json(hotel);
    } catch (error) {
        console.error('Ошибка обновления отеля:', error);
        res.status(500).json({ error: 'Ошибка обновления отеля' });
    }
});

// Удалить отель (только админ)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);
        if (!hotel) return res.status(404).json({ error: 'Отель не найден' });
        await hotel.destroy();
        console.log(`✅ Удален отель: ${hotel.name}`);
        res.json({ message: 'Отель удален' });
    } catch (error) {
        console.error('Ошибка удаления отеля:', error);
        res.status(500).json({ error: 'Ошибка удаления отеля' });
    }
});

module.exports = router;