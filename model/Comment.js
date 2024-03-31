const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema({
	_id: { type: mongoose.Types.ObjectId, auto: true },
	text: {
		type: String,
		trim: true,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	post: {
		type: mongoose.Types.ObjectId,
		ref: 'Post',
	},
	Commentator: { type: mongoose.Types.ObjectId, ref: 'User_mgo' },
})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment
