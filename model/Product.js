const { sequelize } = require('../core/mySqlConnect')
const { DataTypes } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

const Product = sequelize.define('Product', {
	id: {
		type: DataTypes.STRING(24),
		defaultValue: () => uuidv4().replace(/-/g, '').slice(0, 24),
		primaryKey: true,
	},
	title: {
		type: DataTypes.STRING(255),
		allowNull: false,
		unique: true,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	price: {
		type: DataTypes.DECIMAL(10, 2),
		allowNull: false,
		validate: {
			min: {
				args: [1],
				msg: 'Price must be between 1 and 10000',
			},
			max: {
				args: [10000],
				msg: 'Price must be between 1 and 10000',
			},
		},
	},
	discountPercentage: {
		type: DataTypes.DECIMAL(2, 2),
		allowNull: false,
		validate: {
			min: {
				args: [1],
				msg: 'Discount percentage must be between 1 and 99',
			},
			max: {
				args: [99],
				msg: 'Discount percentage must be between 1 and 99',
			},
		},
	},
	rating: {
		type: DataTypes.TINYINT,
		defaultValue: 0,
		validate: {
			min: {
				args: [0],
				msg: 'Rating must be between 0 and 5',
			},
			max: {
				args: [5],
				msg: 'Rating must be between 0 and 5',
			},
		},
	},
	stock: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
			min: {
				args: [0],
				msg: 'Stock must be 0 or greater',
			},
		},
	},
	thumbnail: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	images: {
		type: DataTypes.JSON,
	},
	colors: {
		type: DataTypes.JSON,
	},
	highlights: {
		type: DataTypes.JSON,
	},
	discountPrice: {
		type: DataTypes.DECIMAL(10, 2),
	},
	deleted: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
})

module.exports = Product
