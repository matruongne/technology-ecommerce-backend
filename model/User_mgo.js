const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	_id: { type: mongoose.Types.ObjectId, auto: false },
	email: { type: String, required: true, unique: true },
	role: { type: String, required: true, default: 'user' },
	addresses: { type: Object },
	images: { type: String, required: false },
	name: { type: String },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
})

const User_mgo = mongoose.model('User_mgo', userSchema)
module.exports = User_mgo
