const express = require('express')
const { addToCart, deleteFromCart, updateCart, getCartByUser } = require('../controller/Cart')
const router = express.Router()

router
	.post('/', addToCart)
	.get('/', getCartByUser)
	.delete('/:id', deleteFromCart)
	.patch('/:id', updateCart)

module.exports = router
