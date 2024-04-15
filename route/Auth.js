const express = require('express')
const { createUser, checkUser, loginUser, logout } = require('../controller/Auth')
const passport = require('passport')

const router = express.Router()

router
	.post('/signup', createUser)
	.post('/login', passport.authenticate('local'), loginUser)
	.get('/check', passport.authenticate('jwt'), checkUser)
	.get('/logout', logout)

module.exports = router
