const express = require('express')
const {
	createProduct,
	getAllProduct,
	getProductById,
	updateProduct,
	searchProduct,
} = require('../controller/Product')
const router = express.Router()

router
	.get('/search', searchProduct)
	.get('/', getAllProduct)
	.get('/:id', getProductById)
	.post('/', createProduct)
	.patch('/:id', updateProduct)

module.exports = router
