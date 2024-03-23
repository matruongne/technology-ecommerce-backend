const Conversation = require('../model/Conversation')
const Message = require('../model/Message')

const createMessage = async (req, res) => {
	try {
		const { body, image, conversationId, seenId, senderId } = req.body

		const newMessage = new Message({
			body,
			image,
			conversationId,
			seenId,
			senderId,
		})
		await newMessage.save()
		//add message to conversation
		await Conversation.findOneAndUpdate(
			{ _id: conversation },
			{
				$push: {
					messages: newMessage,
				},
			},
			{ new: true }
		)

		return res.status(201).json({ message: newMessage })
	} catch (error) {
		console.error('Error creating message:', error)
		return res.status(500).json({ message: 'Error creating message' })
	}
}

module.exports = { createMessage }
