const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Hotel = sequelize.define('Hotel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stars: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        validate: { min: 1, max: 5 }
    },
    resort: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: { min: 0, max: 10 }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'hotels',
    timestamps: true,
    hooks: {
        afterCreate: (hotel) => console.log(`✨ Создан отель: ${hotel.name}`),
        afterUpdate: (hotel) => console.log(`📝 Обновлен отель: ${hotel.name}`),
        afterDestroy: (hotel) => console.log(`🗑️ Удален отель: ${hotel.name}`)
    }
});

module.exports = Hotel;