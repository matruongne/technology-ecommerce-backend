const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	_id: { type: mongoose.Types.ObjectId, auto: false },
	email: { type: String, required: true, unique: true },
	password: { type: Buffer, required: true },
	role: { type: String, required: true, default: 'user' },
	addresses: { type: Object },
	name: { type: String },
	salt: { type: Buffer },
	resetPasswordToken: { type: String, default: '' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
})

const User_mgo = mongoose.model('User_mgo', userSchema)
module.exports = User_mgo
