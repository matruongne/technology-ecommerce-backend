const mongoose = require('mongoose')

const { Schema } = mongoose

const postSchema = new Schema(
	{
		_id: { type: mongoose.Types.ObjectId, auto: true },
		title: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		text: {
			type: String,
			trim: true,
			required: true,
		},
		images: [{ type: String, required: false }],
		poster: { type: mongoose.Types.ObjectId, ref: 'User_mgo', required: true },
		comments: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Comment',
			},
		],
		_commentsCount: {
			type: Number,
			virtual: true,
			get: function () {
				return this.comments.length
			},
		},
	},
	{
		timestamps: true,
	}
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post
