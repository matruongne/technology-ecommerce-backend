const express = require('express')
const { createMessage } = require('../controller/Message')
const router = express.Router()

router.post('/message', createMessage)

module.exports = router
