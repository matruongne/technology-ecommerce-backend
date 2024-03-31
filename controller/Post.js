const Post = require('../model/Post')

const CreatePost = async (req, res) => {
	try {
		const { title, text, poster } = req.body

		const newPost = new Post({ title, text, poster })

		await newPost.save()
		return res.status(201).json({ message: 'success' })
	} catch (error) {
		console.error('Error creating Post:', error)
		return res.status(500).json({ message: `Error creating Post ${error}` })
	}
}

const getAllPosts = async (req, res) => {
	// sort = {_sort:"createdAt",_order="desc"}
	// sort = {_sort:"_commentsCount",_order="desc"}
	// pagination = {_page:1,_limit=10}
	const { _sort, _order, _page, _limit } = req.query

	let queryOptions = {}

	if (_sort && _order) {
		queryOptions.sort = { [_sort]: _order.toUpperCase() === 'DESC' ? -1 : 1 }
	} else {
		queryOptions.sort = { createdAt: -1 }
	}

	if (_page && _limit) {
		const skip = (_page - 1) * _limit
		queryOptions.skip = skip
		queryOptions.limit = parseInt(_limit, 10)
	}
	console.log(queryOptions)
	try {
		const [count, rows] = await Promise.all([
			Post.countDocuments(queryOptions),
			Post.find().sort(queryOptions.sort).skip(queryOptions.skip).limit(queryOptions.limit),
		])

		res.set('X-Total-Count', count)
		res.status(200).json(rows)
	} catch (error) {
		console.error('Error creating Post:', error)
		return res.status(500).json({ message: 'Error creating Post' })
	}
}

const getPostsByUserId = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).json({ message: 'Missing required fields: id of user' })
		}
		const { id } = req.user
		const posts = await Post.find({ poster: id })
		return res.status(201).json({ posts })
	} catch (error) {
		console.error('Error creating Post:', error)
		return res.status(500).json({ message: 'Error creating Post' })
	}
}

const getPostById = async (req, res) => {
	const { id } = req.params

	try {
		const post = await Post.findById({ _id: id })
		res.status(200).json({ post })
	} catch (err) {
		res.status(400).json(err)
	}
}

const updatePost = async (req, res) => {
	const { id } = req.params

	console.log(req.body)
	try {
		const post = await Post.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true })
		if (post) {
			res.status(200).json({ message: 'success', post })
		}
		res.status(200).json({ message: 'failed' })
	} catch (err) {
		res.status(400).json(err)
	}
}

const deletePost = async (req, res) => {
	const { id } = req.params

	try {
		const post = await Post.findByIdAndDelete({ _id: id })
		if (post) {
			res.status(200).json({ message: 'success', post })
		}
		res.status(200).json({ message: 'failed' })
	} catch (err) {
		res.status(400).json(err)
	}
}
module.exports = { CreatePost, getAllPosts, getPostsByUserId, getPostById, updatePost, deletePost }
