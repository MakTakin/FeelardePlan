const Sequelize = require('sequelize')
const db = require('../database/database')

const Card = db.define('card', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING
    },
    done: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

module.exports = Card