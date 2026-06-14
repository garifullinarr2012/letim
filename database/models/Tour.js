const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tour = sequelize.define('Tour', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    stars: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        validate: { min: 1, max: 5 }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'tours',
    timestamps: true,
    hooks: {
        afterCreate: (tour) => console.log(`✨ Создан тур: ${tour.name}`),
        afterUpdate: (tour) => console.log(`📝 Обновлен тур: ${tour.name}`),
        afterDestroy: (tour) => console.log(`🗑️ Удален тур: ${tour.name}`)
    }
});

module.exports = Tour;