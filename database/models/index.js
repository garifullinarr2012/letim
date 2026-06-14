const Tour = require('./Tour');
const User = require('./User');
const Favorite = require('./Favorite');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Hotel = require('./Hotel');

// User -> Favorite
User.hasMany(Favorite, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

// Tour -> Favorite
Tour.hasMany(Favorite, { foreignKey: 'tour_id', onDelete: 'CASCADE' });
Favorite.belongsTo(Tour, { foreignKey: 'tour_id' });

// Hotel -> Favorite
Hotel.hasMany(Favorite, { foreignKey: 'hotel_id', onDelete: 'CASCADE' });
Favorite.belongsTo(Hotel, { foreignKey: 'hotel_id' });

// User -> CartItem
User.hasMany(CartItem, { foreignKey: 'user_id', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'user_id' });

// Tour -> CartItem
Tour.hasMany(CartItem, { foreignKey: 'tour_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Tour, { foreignKey: 'tour_id' });

// Hotel -> CartItem
Hotel.hasMany(CartItem, { foreignKey: 'hotel_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Hotel, { foreignKey: 'hotel_id' });

// User -> Order
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Order -> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

console.log('✅ Связи между моделями настроены');

module.exports = {
    Tour,
    User,
    Favorite,
    CartItem,
    Order,
    OrderItem,
    Hotel
};