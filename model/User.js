const { sequelize } = require('../core/mySqlConnect')
const { DataTypes } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.STRING(24),
			defaultValue: () => uuidv4().replace(/-/g, '').slice(0, 24),
			primaryKey: true,
		},
		email: { type: DataTypes.STRING, allowNull: false, unique: true },
		password: { type: DataTypes.BLOB, allowNull: false },
		role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
		addresses: { type: DataTypes.JSON },
		name: { type: DataTypes.STRING },
		salt: { type: DataTypes.BLOB },
		images: { type: DataTypes.JSON },
		resetPasswordToken: { type: DataTypes.STRING, defaultValue: '' },
	},
	{
		timestamps: true,
	}
)

module.exports = User
