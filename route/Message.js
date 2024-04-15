const express = require('express')
const { createMessage } = require('../controller/Message')
const router = express.Router()

router.post('/', createMessage)

module.exports = router
