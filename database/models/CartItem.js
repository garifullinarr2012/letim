const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tour_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    hotel_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('tour', 'hotel'),
        defaultValue: 'tour'
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: { min: 1 }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'cart_items',
    timestamps: true,
    hooks: {
        afterCreate: (item) => console.log(`🛒 Добавлено в корзину: ${item.name}`),
        afterDestroy: (item) => console.log(`🗑️ Удалено из корзины: ${item.name}`)
    }
});

module.exports = CartItem;