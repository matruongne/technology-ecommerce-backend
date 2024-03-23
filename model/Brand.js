const { sequelize } = require('../core/mySqlConnect')
const { DataTypes } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

const Brand = sequelize.define('Brand', {
	id: {
		type: DataTypes.STRING(24),
		defaultValue: () => uuidv4().replace(/-/g, '').slice(0, 24),
		primaryKey: true,
	},
	label: {
		type: DataTypes.STRING(255),
		allowNull: false,
		unique: true,
	},
	value: {
		type: DataTypes.STRING(255),
		allowNull: false,
		unique: true,
	},
})

module.exports = Brand
