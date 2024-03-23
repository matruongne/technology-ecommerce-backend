const { sequelize } = require('../core/mySqlConnect')
const { DataTypes } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

const Cart = sequelize.define('Cart', {
	id: {
		type: DataTypes.STRING(24),
		defaultValue: () => uuidv4().replace(/-/g, '').slice(0, 24),
		primaryKey: true,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	colors: {
		type: DataTypes.JSON,
	},
})

module.exports = Cart
