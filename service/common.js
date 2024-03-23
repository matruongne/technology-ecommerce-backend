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
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ3OGUwZTczNjZiZDQ1ZGNhMWU1MmI4MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzExMjAyMjEzfQ.72HHvGPGGyfbF0088AWCe8Uo8ujLAL7c3jhFk76Ay2Y'
	return token
}

module.exports = { isAuth, sanitizeUser, cookieExtractor }
