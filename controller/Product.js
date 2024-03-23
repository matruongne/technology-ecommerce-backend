const Brand = require('../model/Brand')
const Product = require('../model/Product')

const createProduct = async (req, res) => {
	const discountPrice = Math.round(req.body.price * (1 - req.body.discountPercentage / 100))
	Product.create({ ...req.body, discountPrice })
		.then((result) => {
			return res.status(201).json(result)
		})
		.catch((error) => {
			console.error('Failed to create a new record : ', error)
			res.status(400).json({ error: error })
		})
}
const getAllProduct = async (req, res) => {
	Product.findAll({
		include: [
			{
				model: Brand,
			},
		],
	})
		.then((result) => {
			return res.status(201).json(result)
		})
		.catch((error) => {
			console.error('Failed to create a new record : ', error)
			res.status(400).json({ error: error })
		})
}
module.exports = { createProduct, getAllProduct }
