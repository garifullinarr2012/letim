const express = require('express');
const router = express.Router();
const { CartItem, Tour, Hotel } = require('../database/models');
const { authenticate } = require('../middleware/auth');
const { Op } = require('sequelize');

// Получение корзины пользователя
router.get('/', authenticate, async (req, res) => {
    try {
        const cartItems = await CartItem.findAll({ where: { user_id: req.user.id } });
        console.log(`🛒 Корзина пользователя ${req.user.id}: ${cartItems.length} товаров`);
        res.json(cartItems);
    } catch (error) {
        console.error('Ошибка получения корзины:', error);
        res.status(500).json({ error: 'Ошибка получения корзины' });
    }
});

// Добавление в корзину (поддержка tourId и hotelId)
router.post('/', authenticate, async (req, res) => {
    try {
        const { tourId, hotelId, quantity = 1, price, name, type } = req.body;
        
        let itemData = {
            user_id: req.user.id,
            quantity: quantity,
            price: price,
            name: name
        };
        
        if (tourId) {
            itemData.tour_id = tourId;
            itemData.type = 'tour';
        } else if (hotelId) {
            itemData.hotel_id = hotelId;
            itemData.type = 'hotel';
        } else {
            return res.status(400).json({ error: 'Не указан ID тура или отеля' });
        }
        
        // Проверяем, не добавлено ли уже
        const existing = await CartItem.findOne({
            where: {
                user_id: req.user.id,
                ...(tourId ? { tour_id: tourId } : { hotel_id: hotelId })
            }
        });
        
        if (existing) {
            await existing.update({ quantity: existing.quantity + quantity });
            console.log(`🛒 Обновлено количество в корзине: ${existing.name} -> ${existing.quantity}`);
            return res.json(existing);
        }
        
        const cartItem = await CartItem.create(itemData);
        console.log(`🛒 Добавлено в корзину: ${name} (x${quantity})`);
        res.status(201).json(cartItem);
    } catch (error) {
        console.error('Ошибка добавления в корзину:', error);
        res.status(500).json({ error: 'Ошибка добавления в корзину' });
    }
});

// Обновление количества
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await CartItem.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });
        
        if (!cartItem) {
            return res.status(404).json({ error: 'Товар не найден в корзине' });
        }
        
        await cartItem.update({ quantity });
        res.json(cartItem);
    } catch (error) {
        console.error('Ошибка обновления количества:', error);
        res.status(500).json({ error: 'Ошибка обновления количества' });
    }
});

// Удаление из корзины
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const cartItem = await CartItem.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });
        
        if (!cartItem) {
            return res.status(404).json({ error: 'Товар не найден в корзине' });
        }
        
        await cartItem.destroy();
        res.json({ message: 'Товар удален из корзины' });
    } catch (error) {
        console.error('Ошибка удаления из корзины:', error);
        res.status(500).json({ error: 'Ошибка удаления из корзины' });
    }
});

module.exports = router;