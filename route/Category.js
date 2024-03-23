const express = require('express')
const { createCategory, getAllCategory } = require('../controller/Category')
const router = express.Router()

router.post('/', createCategory).get('/', getAllCategory)

module.exports = router
