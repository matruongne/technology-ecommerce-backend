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
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZmVlM2I2NDMxZjQzMzQ4MWViMDNmMyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzExMjk1MjE0fQ.txWA5eqIxvoIE58A_87NgACOPnP9bKbnrWR6vuVbK2M'
	return token
}

module.exports = { isAuth, sanitizeUser, cookieExtractor }
