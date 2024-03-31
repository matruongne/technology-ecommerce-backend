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
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxMzZjNjVmMjY1YTQyOTM4OGFmM2VkOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzExODE2MDExfQ.BXBKyPof0Kyx966SpBzmH1HOCmlTy_GQ97h2HN3hiDk'
	return token
}

module.exports = { isAuth, sanitizeUser, cookieExtractor }
