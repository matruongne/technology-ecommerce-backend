const { sequelize } = require('../core/mySqlConnect')
const User = require('../model/User')
const crypto = require('crypto')
const { sanitizeUser } = require('../service/common')
const SECRET_KEY = 'SECRET_KEY'
const jwt = require('jsonwebtoken')
const User_mgo = require('../model/User_mgo')

const createUser = async (req, res) => {
	try {
		const salt = crypto.randomBytes(16)
		crypto.pbkdf2(
			req.body.password,
			salt,
			310000,
			32,
			'sha256',
			async function (err, hashedPassword) {
				User.create({ ...req.body, password: hashedPassword, salt })
					.then((result) => {
						req.login(sanitizeUser(result), (err) => {
							// this also calls serializer and adds to session
							const token = jwt.sign(sanitizeUser(result), SECRET_KEY)
							return res
								.cookie('jwt', token, {
									expires: new Date(Date.now() + 3600000),
									httpOnly: true,
								})
								.status(201)
								.json(token)
						})
						return result
					})
					.then(async (result) => {
						const newUser_mgo = new User_mgo({
							_id: result.id,
							...req.body,
						})

						await newUser_mgo.save().catch((error) => {
							console.error('Failed to create a new record : ', error)
							res.status(400).json({ error: error })
						})
					})
					.catch((error) => {
						console.error('Failed to create a new record : ', error)
						res.status(400).json({ error: error })
					})
			}
		)
	} catch (err) {
		res.status(400).json(err)
	}
}

const loginUser = async (req, res) => {
	console.log('req:', req.user)
	console.log(req.message)
	res
		.cookie('jwt', req.user, {
			expires: new Date(Date.now() + 3600000),
			httpOnly: true,
		})
		.status(201)
		.json(req.user)
}
const logout = async (req, res) => {
	res
		.cookie('jwt', null, {
			expires: new Date(Date.now()),
			httpOnly: true,
		})
		.sendStatus(200)
}
const checkUser = async (req, res) => {
	res.json({ status: 'success', user: req.user })
}

module.exports = { createUser, loginUser, checkUser, logout }
