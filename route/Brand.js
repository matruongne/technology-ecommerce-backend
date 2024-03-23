const express = require('express')
const { createBrand, getAllBrand } = require('../controller/Brand')
const router = express.Router()

router.post('/', createBrand).get('/', getAllBrand)

module.exports = router
