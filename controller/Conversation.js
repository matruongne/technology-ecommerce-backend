const Conversation = require('../model/Conversation')

const createConversation = async (req, res) => {
	try {
		const { user1Id, user2Id, name } = req.body
		console.log(user1Id, user2Id, name)
		// Check if a conversation with these users already exists
		const existingConversation = await Conversation.findOne({
			users: { $all: [user1Id, user2Id] },
		})

		if (existingConversation) {
			console.error('Conversation existing')
			return res.status(500).json({ message: 'Existing Conversation' })
		}

		const newConversation = new Conversation({
			name,
			users: [user1Id, user2Id],
		})

		await newConversation.save()
		return res.status(201).json({ conversation: newConversation })
	} catch (error) {
		console.error('Error creating conversation:', error)
		return res.status(500).json({ message: 'Error creating conversation' })
	}
}

const getConversation = async (req, res) => {
	try {
		// const { user1Id, user2Id } = req.body
		// console.log(user1Id, user2Id)
		// Check if a conversation with these users already exists
		// const existingConversation = await Conversation.findOne({
		// 	users: { $all: [user1Id, user2Id] },
		// })

		const existingConversation2 = await Conversation.find().populate('users').populate('messages')

		return res.status(201).json({ conversation: existingConversation2 })
	} catch (err) {
		console.error('Error get conversation:', err)
		return res.status(500).json({ message: 'Error get conversation' })
	}
}

module.exports = { createConversation, getConversation }
