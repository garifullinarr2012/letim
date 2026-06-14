const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Favorite = sequelize.define('Favorite', {
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
    }
}, {
    tableName: 'favorites',
    timestamps: true,
    hooks: {
        afterCreate: (favorite) => console.log(`❤️ Добавлено в избранное: User ${favorite.user_id}`),
        afterDestroy: (favorite) => console.log(`💔 Удалено из избранного: User ${favorite.user_id}`)
    }
});

module.exports = Favorite;