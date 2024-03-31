const Brand = require('../model/Brand')
const Category = require('../model/Category')
const Inventory = require('../model/Inventory')
const Product = require('../model/Product')
const { Op } = require('sequelize')

const createProduct = async (req, res) => {
	const discountPrice = Math.round(req.body.price * (1 - req.body.discountPercentage / 100))

	Inventory.create({ quantity: req.body.quantity })
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

const getProductById = async (req, res) => {
	const { id } = req.params

	try {
		const product = await Product.findOne({ where: { id: id } })
		res.status(200).json(product)
	} catch (err) {
		res.status(400).json(err)
	}
}

const updateProduct = async (req, res) => {
	const { id } = req.params
	try {
		const product = await Product.update({ ...req.body }, { where: { id: id } })
		product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100))
		const updatedProduct = await product.save()
		res.status(200).json(updatedProduct)
	} catch (err) {
		res.status(400).json(err)
	}
}

const getAllProduct = async (req, res) => {
	let whereClause = {}
	if (!req.query.admin) {
		whereClause.where = { deleted: { [Op.ne]: true } }
	}

	if (req.query.category) {
		whereClause.include = [
			{
				model: Category,
				where: { label: { [Op.in]: req.query.category.split(',') } },
			},
		]
	}

	if (req.query.brand) {
		whereClause.include = whereClause.include || []
		whereClause.include.push({
			model: Brand,
			where: { label: { [Op.in]: req.query.brand.split(',') } },
		})
	}

	const queryOptions = {}
	if (req.query._sort && req.query._order) {
		whereClause.order = [[req.query._sort, req.query._order.toUpperCase()]]
	}

	if (req.query._page && req.query._limit) {
		const offset = (req.query._page - 1) * req.query._limit
		queryOptions.offset = offset
		queryOptions.limit = req.query._limit * 1
	}

	try {
		console.log(whereClause)
		console.log(queryOptions)
		const { count, rows } = await Product.findAndCountAll({
			...whereClause,
			queryOptions,
		})

		res.set('X-Total-Count', count)
		res.status(200).json(rows)
	} catch (err) {
		res.status(400).json(err)
	}
}
module.exports = { createProduct, getAllProduct, getProductById, updateProduct }
