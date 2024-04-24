const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('ecommerce', 'root', '1', {
	host: 'localhost',
	port: 3306,
	dialect: 'mysql',
})

module.exports = { sequelize }
