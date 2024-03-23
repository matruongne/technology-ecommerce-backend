const Category = require('../model/Category')
const Product = require('../model/Product')

const createCategory = async (req, res) => {
	Category.create({ ...req.body })
		.then((result) => {
			res.status(200).json({ result })
		})
		.catch((error) => {
			console.error('Failed to create a new record : ', error)
			res.status(400).json({ error: error })
		})
}

const getAllCategory = async (req, res) => {
	Category.findAll({
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
			console.error('Failed to get records : ', error)
			res.status(400).json({ error: error })
		})
}

module.exports = { createCategory, getAllCategory }
