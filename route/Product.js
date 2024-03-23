const express = require('express')
const { createProduct, getAllProduct } = require('../controller/Product')
const router = express.Router()

router.post('/', createProduct)
router.get('/', getAllProduct)

module.exports = router
