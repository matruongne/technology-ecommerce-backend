const express = require('express')
const { updateUser, getUserById } = require('../controller/User')
const router = express.Router()

router.get('/own', getUserById).patch('/:id', updateUser)

module.exports = router
