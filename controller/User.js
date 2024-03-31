const User = require('../model/User')

const getUserById = async (req, res) => {
	const { id } = req.user

	try {
		const user = await User.findOne({ where: { id: id } })
		res
			.status(200)
			.json({ id: user.id, addresses: user.addresses, email: user.email, role: user.role })
	} catch (err) {
		res.status(400).json(err)
	}
}

const updateUser = async (req, res) => {
	const { id } = req.params
	try {
		const updateUser = await User.update({ ...req.body }, { where: { id: id } })

		if (updateUser[0] === 0) {
			res.status(200).json({ message: 'Error', updateUser })
		} else {
			res.status(200).json({ message: 'Success', updateUser })
		}
	} catch (err) {
		res.status(400).json(err)
	}
}

module.exports = { getUserById, updateUser }
