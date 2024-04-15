const User = require('../model/User')
const User_mgo = require('../model/User_mgo')

const getUserById = async (req, res) => {
	const { id } = req.user

	try {
		const user = await User.findOne({ where: { id: id } })
		res.status(200).json({
			id: user.id,
			name: user.name,
			addresses: user.addresses,
			images: user.images,
			email: user.email,
			role: user.role,
		})
	} catch (err) {
		res.status(400).json(err)
	}
}

const updateUser = async (req, res) => {
	const { id } = req.params
	try {
		const updateUser = await User.update({ ...req.body }, { where: { id: id } })
		const updateUser_mgo = await User_mgo.findByIdAndUpdate({ _id: id }, { ...req.body })

		console.log(updateUser_mgo)
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
