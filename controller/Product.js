const Brand = require('../model/Brand')
const Category = require('../model/Category')
const Inventory = require('../model/Inventory')
const Product = require('../model/Product')

const createProduct = async (req, res) => {
	const discountPrice = Math.round(req.body.price * (1 - req.body.discountPercentage / 100))
	Inventory.create({ quality: req.body.quality })
		.then((result) => {
			Product.create({ ...req.body, InventoryId: result.id, discountPrice })
				.then((result) => {
					return res.status(201).json(result)
				})
				.catch((error) => {
					console.error('Failed to create a new product : ', error)
					res.status(400).json({ error: error })
				})
		})
		.catch((error) => {
			console.error('Failed to create a new quality : ', error)
			res.status(400).json({ error: error })
		})
}
const getAllProduct = async (req, res) => {
	Product.findAll({
		include: [
			{
				model: Brand,
			},
			{
				model: Category,
			},
		],
	})
		.then((result) => {
			return res.status(201).json(result)
		})
		.catch((error) => {
			console.error('Failed to get products : ', error)
			res.status(400).json({ error: error })
		})
}
module.exports = { createProduct, getAllProduct }
