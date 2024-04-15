const { Op } = require('sequelize')
const { sequelize } = require('../core/mySqlConnect')
const Inventory = require('../model/Inventory')
const Order = require('../model/Order')
const OrderItems = require('../model/OrderItem')
const Product = require('../model/Product')

const getOrdersByUser = async (req, res) => {
	const { id } = req.user

	Order.findAll(
		{
			include: [
				{
					model: OrderItems,
					include: [Product],
				},
			],
		},
		{ where: { UserId: id } }
	)
		.then((result) => {
			res.status(200).json({ result })
		})
		.catch((error) => {
			console.error('Failed to get a record : ', error)
			res.status(400).json({ error: error })
		})
}
const getOrdersById = async (req, res) => {
	const { id } = req.params
	console.log('id', id)
	Order.findOne({
		where: { id: id },
		include: [
			{
				model: OrderItems,
				include: [Product],
			},
		],
	})
		.then((result) => {
			res.status(200).json({ result })
		})
		.catch((error) => {
			console.error('Failed to get a record : ', error)
			res.status(400).json({ error: error })
		})
}

const createOrder = async (req, res) => {
	const { id } = req.user
	const { orderDetails } = req.body

	const transaction = await sequelize.transaction()
	try {
		const newOrder = await Order.create({ ...req.body, UserId: id }, { transaction })

		for (const item of orderDetails) {
			const { ProductId, quantity, color } = item

			const product = await Product.findOne({
				include: [{ model: Inventory }],
				where: { id: ProductId },
				transaction,
			})

			if (!product) {
				await transaction.rollback()
				return res.status(404).json({ message: `Product with ID ${ProductId} not found` })
			}

			if (!quantity || quantity <= 0) {
				await transaction.rollback()
				return res.status(400).json({ message: 'Quantity must be a positive integer' })
			}

			if (product.Inventory.quantity < quantity) {
				await transaction.rollback()
				return res.status(400).json({
					message: `Insufficient product quantity. Available: ${product.Inventory.quantity}, Required: ${quantity}`,
				})
			}

			await Inventory.decrement('quantity', {
				by: quantity,
				where: { id: product.Inventory.id },
				transaction,
			})

			await OrderItems.create({ OrderId: newOrder.id, ProductId, quantity, color }, { transaction })
		}

		await transaction.commit()
		res.status(201).json({ message: 'Order created successfully', order: newOrder })
	} catch (error) {
		await transaction.rollback()
		console.error('Failed to create a new order: ', error)

		const errorMessage = error.message || 'An error occurred while creating the order.'
		res.status(500).json({ message: errorMessage })
	}
}

const deleteOrder = async (req, res) => {
	try {
		const { id } = req.params
		const order = await Order.findOne({
			where: { id: id },
			include: [{ model: OrderItems }],
		})
		if (!order) res.status(400).json(`${id} is not a valid orderId`)

		for (const item of order.OrderItems) {
			await OrderItems.destroy({
				where: {
					id: item.id,
				},
			})
		}

		const deleteOrder = await Order.destroy({
			where: {
				id: id,
			},
		})

		res.status(200).json({ message: 'Success', deleteOrder })
	} catch (error) {
		res.status(400).json(error)
	}
}

const updateOrder = async (req, res) => {
	try {
		const { id } = req.params
		await Order.update(
			{
				...req.body,
			},
			{
				where: {
					id: id,
				},
			}
		).then(async () => {
			const result = await Order.findByPk(id)
			res.status(200).json(result)
		})
	} catch (err) {
		res.status(400).json(err)
	}
}

const getAllOrders = async (req, res) => {
	// sort = {_sort:"price",_order="desc"}
	// pagination = {_page:1,_limit=10}

	let queryOptions = {
		where: { deleted: { [Op.ne]: true } },
	}

	if (req.query._sort && req.query._order) {
		queryOptions.order = [[req.query._sort, req.query._order.toUpperCase()]]
	}
	if (req.query._page && req.query._limit) {
		const offset = (req.query._page - 1) * req.query._limit
		queryOptions.offset = offset
		queryOptions.limit = req.query._limit * 1
	}
	console.log(queryOptions)

	try {
		const { count, rows } = await Order.findAndCountAll(queryOptions)
		res.set('X-Total-Count', count)
		res.status(200).json(rows)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: err })
	}
}

module.exports = {
	createOrder,
	getOrdersByUser,
	deleteOrder,
	getOrdersById,
	updateOrder,
	getAllOrders,
}
