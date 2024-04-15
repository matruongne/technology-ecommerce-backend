const express = require('express')
const { createConversation, getConversation } = require('../controller/Conversation')
const router = express.Router()

router.get('/:userId', getConversation).post('/', createConversation)

module.exports = router
