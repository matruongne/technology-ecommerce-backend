const Post = require('../model/Post')
const Comment = require('../model/Comment')

const createComment = async (req, res) => {
	try {
		const { text, postId } = req.body
		const { id: commentator } = req.user

		const newComment = new Comment({ text, commentator })

		await newComment.save()

		await Post.findOneAndUpdate(
			{ _id: postId },
			{
				$push: {
					comments: newComment,
				},
			},
			{ new: true }
		)
		return res.status(201).json({ message: 'success' })
	} catch (error) {
		console.error('Error creating Comment:', error)
		return res.status(500).json({ message: `Error creating Comment ${error}` })
	}
}

const deleteComment = async (req, res) => {
	try {
		const { id } = req.params

		await Promise.all([
			Comment.findByIdAndDelete({ _id: id }),
			Post.updateMany({}, { $pull: { comments: id } }),
		])
			.then(() => {
				return res.status(201).json({ message: 'success' })
			})
			.catch(() => {
				return res.status(500).json({ message: 'failed' })
			})
	} catch (error) {
		console.error('Error creating Comment:', error)
		return res.status(500).json({ message: `Error creating Comment ${error}` })
	}
}
module.exports = { createComment, deleteComment }
