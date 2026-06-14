const { CartItem, Tour } = require('../database/models');

class CartController {
    // Получение корзины пользователя
    async getCart(req, res) {
        try {
            console.log(`🛒 Запрос корзины пользователя ${req.user.id}`);
            
            const cartItems = await CartItem.findAll({
                where: { user_id: req.user.id },
                include: [{
                    model: Tour,
                    attributes: ['id', 'name', 'country', 'price', 'duration', 'stars']
                }]
            });
            
            console.log(`✅ В корзине ${cartItems.length} товаров`);
            res.json(cartItems);
        } catch (error) {
            console.error('❌ Ошибка получения корзины:', error);
            res.status(500).json({ error: 'Ошибка получения корзины' });
        }
    }
    
    // Добавление в корзину
    async addToCart(req, res) {
        try {
            const { tourId, quantity = 1 } = req.body;
            console.log(`➕ Добавление в корзину: User ${req.user.id}, Tour ${tourId}, x${quantity}`);
            
            // Проверка существования тура
            const tour = await Tour.findByPk(tourId);
            if (!tour) {
                console.log(`❌ Тур ${tourId} не найден`);
                return res.status(404).json({ error: 'Тур не найден' });
            }
            
            // Проверка, не в корзине ли уже
            const existingItem = await CartItem.findOne({
                where: { user_id: req.user.id, tour_id: tourId }
            });
            
            if (existingItem) {
                console.log(`⚠️ Тур уже в корзине, обновляем количество`);
                await existingItem.update({ quantity: existingItem.quantity + quantity });
                return res.json(existingItem);
            }
            
            const cartItem = await CartItem.create({
                user_id: req.user.id,
                tour_id: tourId,
                quantity
            });
            
            console.log(`✅ Тур добавлен в корзину: ${tour.name}`);
            res.status(201).json(cartItem);
        } catch (error) {
            console.error('❌ Ошибка добавления в корзину:', error);
            res.status(500).json({ error: 'Ошибка добавления в корзину' });
        }
    }
    
    // Обновление количества
    async updateQuantity(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            console.log(`🔄 Обновление количества в корзине ID: ${id} -> ${quantity}`);
            
            const cartItem = await CartItem.findOne({
                where: { id, user_id: req.user.id }
            });
            
            if (!cartItem) {
                return res.status(404).json({ error: 'Товар не найден в корзине' });
            }
            
            await cartItem.update({ quantity });
            console.log(`✅ Количество обновлено`);
            
            res.json(cartItem);
        } catch (error) {
            console.error('❌ Ошибка обновления количества:', error);
            res.status(500).json({ error: 'Ошибка обновления количества' });
        }
    }
    
    // Удаление из корзины
    async removeFromCart(req, res) {
        try {
            const { id } = req.params;
            console.log(`🗑️ Удаление из корзины ID: ${id}`);
            
            const cartItem = await CartItem.findOne({
                where: { id, user_id: req.user.id }
            });
            
            if (!cartItem) {
                return res.status(404).json({ error: 'Товар не найден в корзине' });
            }
            
            await cartItem.destroy();
            console.log(`✅ Товар удален из корзины`);
            
            res.json({ message: 'Товар удален из корзины' });
        } catch (error) {
            console.error('❌ Ошибка удаления из корзины:', error);
            res.status(500).json({ error: 'Ошибка удаления из корзины' });
        }
    }
}

module.exports = new CartController();