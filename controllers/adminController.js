const { User, Tour, Order, OrderItem } = require('../database/models');
const { Op } = require('sequelize');

class AdminController {
    // Статистика
    async getStats(req, res) {
        try {
            console.log('📊 Запрос статистики админом');
            
            const totalUsers = await User.count();
            const totalTours = await Tour.count();
            const activeTours = await Tour.count({ where: { is_active: true } });
            const totalOrders = await Order.count();
            const completedOrders = await Order.count({ where: { status: 'completed' } });
            
            const revenue = await Order.sum('total_amount', {
                where: { status: { [Op.in]: ['completed', 'paid'] } }
            });
            
            console.log(`✅ Статистика: Пользователи: ${totalUsers}, Туры: ${totalTours}, Заказы: ${totalOrders}, Выручка: ${revenue || 0}₽`);
            
            res.json({
                totalUsers,
                totalTours,
                activeTours,
                totalOrders,
                completedOrders,
                revenue: revenue || 0
            });
        } catch (error) {
            console.error('❌ Ошибка получения статистики:', error);
            res.status(500).json({ error: 'Ошибка получения статистики' });
        }
    }
    
    // Получение всех пользователей
    async getAllUsers(req, res) {
        try {
            console.log('👥 Запрос списка пользователей');
            
            const users = await User.findAll({
                attributes: { exclude: ['password'] },
                order: [['created_at', 'DESC']]
            });
            
            console.log(`✅ Найдено пользователей: ${users.length}`);
            res.json(users);
        } catch (error) {
            console.error('❌ Ошибка получения пользователей:', error);
            res.status(500).json({ error: 'Ошибка получения пользователей' });
        }
    }
    
    // Изменение роли пользователя
    async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            console.log(`👑 Изменение роли пользователя ${id} на ${role}`);
            
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            
            await user.update({ role });
            console.log(`✅ Роль пользователя ${user.email} изменена на ${role}`);
            
            res.json({ message: 'Роль обновлена', user: { id: user.id, email: user.email, role: user.role } });
        } catch (error) {
            console.error('❌ Ошибка изменения роли:', error);
            res.status(500).json({ error: 'Ошибка изменения роли' });
        }
    }
    
    // Получение всех заказов
    async getAllOrders(req, res) {
        try {
            console.log('📋 Запрос всех заказов админом');
            
            const orders = await Order.findAll({
                include: [
                    { model: User, attributes: ['id', 'name', 'email'] },
                    { model: OrderItem }
                ],
                order: [['created_at', 'DESC']]
            });
            
            console.log(`✅ Найдено заказов: ${orders.length}`);
            res.json(orders);
        } catch (error) {
            console.error('❌ Ошибка получения заказов:', error);
            res.status(500).json({ error: 'Ошибка получения заказов' });
        }
    }
    
    // Обновление статуса заказа
    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            console.log(`🔄 Обновление статуса заказа ${id} на ${status}`);
            
            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ error: 'Заказ не найден' });
            }
            
            await order.update({ status });
            console.log(`✅ Статус заказа #${order.order_number} обновлен на ${status}`);
            
            res.json({ message: 'Статус заказа обновлен', order });
        } catch (error) {
            console.error('❌ Ошибка обновления статуса:', error);
            res.status(500).json({ error: 'Ошибка обновления статуса' });
        }
    }
}

module.exports = new AdminController();