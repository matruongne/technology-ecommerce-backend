const express = require('express')
const { createOrder } = require('../controller/Order')
const router = express.Router()

router.post('/', createOrder)

module.exports = router
