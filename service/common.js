const passport = require('passport')

const isAuth = (req, res, done) => {
	return passport.authenticate('jwt')
}
const sanitizeUser = (user) => {
	return { id: user.id, role: user.role }
}

const cookieExtractor = function (req) {
	let token = null
	if (req && req.cookies) {
		token = req.cookies['jwt']
	}
	//TODO : this is temporary token for testing without cookie
	token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQxMDc3ZDY5ZWE1YzRhY2U5M2VkYWExMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMzIzNzMzMn0.S0aRwVr6eNry3qCqSrOwOA6x_Lu7djPdvAcEWFRy7jQ'
	return token
}

module.exports = { isAuth, sanitizeUser, cookieExtractor }
