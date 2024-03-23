const express = require('express')
const { createConversation, getConversation } = require('../controller/Conversation')
const { createMessage } = require('../controller/Message')
const router = express.Router()

router
	.get('/conversation', getConversation)
	.post('/conversation', createConversation)
	.post('/message', createMessage)

module.exports = router
