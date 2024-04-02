const express = require('express')
const { createComment, deleteComment } = require('../controller/Comment')
const router = express.Router()

router.post('/', createComment).delete('/:id', deleteComment)

module.exports = router
