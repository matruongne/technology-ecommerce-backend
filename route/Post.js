const express = require('express')
const {
	getAllPosts,
	CreatePost,
	getPostsByUserId,
	getPostById,
	updatePost,
	deletePost,
} = require('../controller/Post')
const router = express.Router()

router
	.post('/', CreatePost)
	.get('/', getAllPosts)
	.get('/own', getPostsByUserId)
	.get('/:id', getPostById)
	.patch('/:id', updatePost)
	.delete('/:id', deletePost)

module.exports = router
