const { sequelize } = require('../core/mySqlConnect')
const { DataTypes } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

const Order = sequelize.define(
	'Order',
	{
		id: {
			type: DataTypes.STRING(24),
			defaultValue: () => uuidv4().replace(/-/g, '').slice(0, 24),
			primaryKey: true,
		},
		totalAmount: {
			type: DataTypes.DECIMAL(10, 2),
		},
		totalItems: {
			type: DataTypes.INTEGER,
		},
		paymentMethod: {
			type: DataTypes.ENUM('card', 'cash'),
			allowNull: false,
			validate: {
				isIn: {
					args: [['card', 'cash']],
					msg: 'Invalid payment method. Valid options are card or cash.',
				},
			},
		},
		paymentStatus: {
			type: DataTypes.STRING,
			defaultValue: 'pending',
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: 'pending',
		},
		selectedAddress: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = Order
