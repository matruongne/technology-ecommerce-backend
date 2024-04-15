const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('phuocqu1_ecommerce', 'phuocqu1_root', 'Truong.123', {
	host: '103.200.23.126',
	port: 3306,
	dialect: 'mysql',
})

module.exports = { sequelize }
