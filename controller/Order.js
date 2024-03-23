const Order = require('../model/Order')

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
module.exports = { createOrder }
