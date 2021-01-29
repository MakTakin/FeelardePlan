const {Sequelize} = require('sequelize')

const database = new Sequelize('testdb', 'postgres', 'ahjyn123', {
  dialect: 'postgres'
})
module.exports = database