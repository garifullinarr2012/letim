const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100]
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
                console.log(`🔒 Хеширован пароль для пользователя ${user.email}`);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
                console.log(`🔒 Обновлен пароль для пользователя ${user.email}`);
            }
        },
        afterCreate: (user, options) => {
            console.log(`👤 Создан новый пользователь: ${user.email} (Роль: ${user.role})`);
        }
    }
});

// Метод для проверки пароля
User.prototype.validatePassword = async function(password) {
    const isValid = await bcrypt.compare(password, this.password);
    console.log(`🔐 Проверка пароля для ${this.email}: ${isValid ? 'успешно' : 'неудачно'}`);
    return isValid;
};

module.exports = User;