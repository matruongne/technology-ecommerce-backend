const mongoose = require('mongoose')
const { Schema } = mongoose

const conversationSchema = new Schema({
	_id: { type: mongoose.Types.ObjectId, auto: true },
	name: { type: String, lowercase: true, required: false },
	createAt: { type: Date, default: Date.now },
	messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
	users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
})

const Conversation = mongoose.model('Conversation', conversationSchema)

module.exports = Conversation
