const express = require('express')
const {
	createOrder,
	getOrdersByUser,
	deleteOrder,
	updateOrder,
	getAllOrders,
} = require('../controller/Order')
const router = express.Router()

router
	.post('/', createOrder)
	.get('/own', getOrdersByUser)
	.get('/', getAllOrders)
	.delete('/:id', deleteOrder)
	.patch('/:id', updateOrder)

module.exports = router
