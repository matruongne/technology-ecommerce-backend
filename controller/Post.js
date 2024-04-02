const Comment = require('../model/Comment')
const Post = require('../model/Post')
var ObjectId = require('mongoose').Types.ObjectId

const CreatePost = async (req, res) => {
	try {
		const { title, text } = req.body
		const { id: poster } = req.user

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
			Post.aggregate()
				.addFields({ _commentsCount: { $size: '$comments' } })
				.sort(queryOptions.sort)
				.skip(queryOptions.skip || 0)
				.limit(queryOptions.limit || 25)
				.lookup({
					from: 'comments',
					localField: 'comments',
					foreignField: '_id',
					as: 'comments',
				})
				.project({ _id: 1, title: 1, text: 1, comments: 1, poster: 1, _commentsCount: 1 }),
		])

		res.set('X-Total-Count', count)
		res.status(200).json({ posts: rows })
	} catch (error) {
		console.error('Error get Posts:', error)
		return res.status(500).json({ message: 'Error get Posts' })
	}
}

const getPostsByUserId = async (req, res) => {
	try {
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
			.populate({
				path: 'comments',
				populate: {
					path: 'commentator',
				},
			})
			.populate('poster')
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
		} else res.status(200).json({ message: 'failed' })
	} catch (err) {
		res.status(400).json(err)
	}
}

const deletePost = async (req, res) => {
	const { id } = req.params

	try {
		const post = await Post.aggregate()
			.match({ _id: new ObjectId(id) })
			.project({ _id: 1, comments: 1 })

		console.log(post)

		await Promise.all([
			Comment.deleteMany({ _id: { $in: post[0].comments } }),
			Post.deleteOne({ _id: id }),
		])
			.then(() => {
				res.status(200).json({ message: 'success' })
			})
			.catch((err) => {
				res.status(400).json({ message: 'failed', err })
			})
	} catch (err) {
		res.status(400).json({ message: 'failed', err })
	}
}
module.exports = { CreatePost, getAllPosts, getPostsByUserId, getPostById, updatePost, deletePost }
