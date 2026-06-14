const { Order, OrderItem, Tour, CartItem } = require('../database/models');
const { Op } = require('sequelize');

class OrderController {
    // Создание заказа из корзины
    async createOrder(req, res) {
        try {
            console.log(`📦 Создание заказа для пользователя ${req.user.id}`);
            const { customer_name, customer_email, customer_phone, payment_method, notes } = req.body;
            
            // Получаем товары из корзины
            const cartItems = await CartItem.findAll({
                where: { user_id: req.user.id },
                include: [Tour]
            });
            
            if (cartItems.length === 0) {
                console.log(`❌ Корзина пуста`);
                return res.status(400).json({ error: 'Корзина пуста' });
            }
            
            // Вычисляем общую сумму
            let totalAmount = 0;
            const orderItems = cartItems.map(item => {
                const price = parseFloat(item.Tour.price);
                const subtotal = price * item.quantity;
                totalAmount += subtotal;
                return {
                    tour_id: item.tour_id,
                    tour_name: item.Tour.name,
                    price: price,
                    quantity: item.quantity
                };
            });
            
            // Генерируем номер заказа
            const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            
            // Создаем заказ
            const order = await Order.create({
                user_id: req.user.id,
                order_number: orderNumber,
                total_amount: totalAmount,
                status: 'pending',
                payment_method,
                customer_name,
                customer_email,
                customer_phone,
                notes
            });
            
            // Создаем элементы заказа
            for (const item of orderItems) {
                await OrderItem.create({
                    order_id: order.id,
                    ...item
                });
            }
            
            // Очищаем корзину
            await CartItem.destroy({ where: { user_id: req.user.id } });
            
            console.log(`✅ Заказ #${orderNumber} создан на сумму ${totalAmount}₽`);
            
            res.status(201).json({
                message: 'Заказ успешно создан',
                order: {
                    id: order.id,
                    order_number: order.order_number,
                    total_amount: order.total_amount,
                    status: order.status
                }
            });
        } catch (error) {
            console.error('❌ Ошибка создания заказа:', error);
            res.status(500).json({ error: 'Ошибка создания заказа' });
        }
    }
    
    // Получение заказов пользователя
    async getUserOrders(req, res) {
        try {
            console.log(`📋 Запрос заказов пользователя ${req.user.id}`);
            
            const orders = await Order.findAll({
                where: { user_id: req.user.id },
                include: [{
                    model: OrderItem,
                    attributes: ['id', 'tour_name', 'price', 'quantity']
                }],
                order: [['created_at', 'DESC']]
            });
            
            console.log(`✅ Найдено заказов: ${orders.length}`);
            res.json(orders);
        } catch (error) {
            console.error('❌ Ошибка получения заказов:', error);
            res.status(500).json({ error: 'Ошибка получения заказов' });
        }
    }
    
    // Получение деталей заказа
    async getOrderDetails(req, res) {
        try {
            const { id } = req.params;
            console.log(`🔍 Запрос деталей заказа ${id}`);
            
            const order = await Order.findOne({
                where: { id, user_id: req.user.id },
                include: [OrderItem]
            });
            
            if (!order) {
                console.log(`❌ Заказ ${id} не найден`);
                return res.status(404).json({ error: 'Заказ не найден' });
            }
            
            console.log(`✅ Детали заказа #${order.order_number}`);
            res.json(order);
        } catch (error) {
            console.error('❌ Ошибка получения деталей заказа:', error);
            res.status(500).json({ error: 'Ошибка получения деталей заказа' });
        }
    }
    
    // Отмена заказа
    async cancelOrder(req, res) {
        try {
            const { id } = req.params;
            console.log(`🚫 Отмена заказа ${id}`);
            
            const order = await Order.findOne({
                where: { id, user_id: req.user.id }
            });
            
            if (!order) {
                return res.status(404).json({ error: 'Заказ не найден' });
            }
            
            if (order.status !== 'pending') {
                console.log(`❌ Нельзя отменить заказ в статусе ${order.status}`);
                return res.status(400).json({ error: 'Нельзя отменить заказ в текущем статусе' });
            }
            
            await order.update({ status: 'cancelled' });
            console.log(`✅ Заказ #${order.order_number} отменен`);
            
            res.json({ message: 'Заказ отменен', order });
        } catch (error) {
            console.error('❌ Ошибка отмены заказа:', error);
            res.status(500).json({ error: 'Ошибка отмены заказа' });
        }
    }
}

module.exports = new OrderController();