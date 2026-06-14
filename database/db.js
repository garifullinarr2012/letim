const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: (msg) => console.log(`[SQL] ${msg}`),
    define: {
        timestamps: true,
        underscored: true
    }
});

module.exports = sequelize;