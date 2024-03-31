const { sequelize } = require('../core/mySqlConnect')
const { DataTypes } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

const Inventory = sequelize.define('Inventory', {
	id: {
		type: DataTypes.STRING(24),
		defaultValue: () => uuidv4().replace(/-/g, '').slice(0, 24),
		primaryKey: true,
	},
	quantity: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
			min: {
				args: [0],
				msg: 'quantity must be 0 or greater',
			},
		},
	},
})

module.exports = Inventory
