const Brand = require('../model/Brand')
const Product = require('../model/Product')

const createBrand = async (req, res) => {
	Brand.create({ ...req.body })
		.then((result) => {
			res.status(200).json({ result })
		})
		.catch((error) => {
			console.error('Failed to create a new record : ', error)
			res.status(400).json({ error: error })
		})
}

const getAllBrand = async (req, res) => {
	Brand.findAll({
		include: [
			{
				model: Product,
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

module.exports = { createBrand, getAllBrand }
