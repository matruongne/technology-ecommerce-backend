const mongoose = require('mongoose')

const { Schema } = mongoose

const messageSchema = new Schema({
	_id: { type: mongoose.Types.ObjectId, auto: true },
	body: { type: String, required: false },
	image: { type: String, required: false },
	createdAt: { type: Date, default: Date.now },
	seen: { type: mongoose.Types.ObjectId, ref: 'User' },
	conversationId: { type: mongoose.Types.ObjectId, ref: 'Conversation' },
	senderId: { type: mongoose.Types.ObjectId, ref: 'User' },
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
