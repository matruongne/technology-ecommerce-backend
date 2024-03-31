const express = require('express')
const {
	createProduct,
	getAllProduct,
	getProductById,
	updateProduct,
} = require('../controller/Product')
const router = express.Router()

router
	.get('/', getAllProduct)
	.get('/:id', getProductById)
	.post('/', createProduct)
	.patch('/:id', updateProduct)

module.exports = router
