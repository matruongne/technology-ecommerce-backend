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
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM3MDAyZWM2Y2U5YTQxMDRhN2NhYjIxMiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzEzMjAwNjcyfQ.gvXep-2w5LW28ELsZh9A1rVyU78z6LDhDnSgQPPURoY'
	return token
}

module.exports = { isAuth, sanitizeUser, cookieExtractor }
