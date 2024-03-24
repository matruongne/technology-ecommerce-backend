const Order = require('../model/Order')

const getOrdersByUser = async (req, res) => {
	const { id } = req.user
	Order.findAll({ UserId: id })
		.then((result) => {
			res.status(200).json({ result })
		})
		.catch((error) => {
			console.error('Failed to create a new record : ', error)
			res.status(400).json({ error: error })
		})
}

const createOrder = async (req, res) => {
	Order.create({ ...req.body })
		.then((result) => {
			res.status(200).json({ result })
		})
		.catch((error) => {
			console.error('Failed to create a new record : ', error)
			res.status(400).json({ error: error })
		})
}
module.exports = { createOrder, getOrdersByUser }
