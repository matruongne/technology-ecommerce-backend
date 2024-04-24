const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
const http = require('http')

const session = require('express-session')
const passport = require('passport')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { sequelize } = require('./core/mySqlConnect')
const { sanitizeUser, cookieExtractor, isAuth } = require('./service/common')

const conversationRouter = require('./route/Conversation')
const messageRouter = require('./route/Message')
const authRouter = require('./route/Auth')
const productRouter = require('./route/Product')
const brandRouter = require('./route/Brand')
const categoryRouter = require('./route/Category')
const cartRouter = require('./route/Cart')
const orderRouter = require('./route/Order')
const userRouter = require('./route/User')
const postRouter = require('./route/Post')
const commentRouter = require('./route/Comment')

const User = require('./model/User')
const Category = require('./model/Category')
const Product = require('./model/Product')
const Brand = require('./model/Brand')
const Cart = require('./model/Cart')
const Order = require('./model/Order')
const Inventory = require('./model/Inventory')
const OrderItems = require('./model/OrderItem')
const path = require('path')

const app = express()

const server = http.createServer(app)

const mongoDB = 'mongodb://localhost:27017/conversation'
const mongoDB1 =
	'mongodb+srv://matruong052003:Truong.123@cluster0.puwkhhj.mongodb.net/conversation?retryWrites=true&w=majority&appName=Cluster0'
const PORT = process.env.PORT || 3300
const PORT_SOCKET = 3200

const SECRET_KEY = 'SECRET_KEY'
// JWT options
const opts = {}
opts.jwtFromRequest = cookieExtractor
opts.secretOrKey = SECRET_KEY

//middleware
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(
	session({
		secret: 'keyboard cat',
		resave: true, // don't save session if unmodified
		saveUninitialized: false, // don't create session until something stored
	})
)
app.use(passport.authenticate('session'))

app.use(
	cors({
		exposedHeaders: ['X-Total-Count'],
	})
)

app.get('/', (req, res) => {
	res.json({ status: 'success' })
})

app.use('/api/conversations', isAuth(), conversationRouter)
app.use('/api/auth', authRouter)
app.use('/api/products', isAuth(), productRouter)
app.use('/api/brands', isAuth(), brandRouter)
app.use('/api/categories', isAuth(), categoryRouter)
app.use('/api/cart', isAuth(), cartRouter)
app.use('/api/orders', isAuth(), orderRouter)
app.use('/api/user', isAuth(), userRouter)
app.use('/api/post', isAuth(), postRouter)
app.use('/api/message', isAuth(), messageRouter)
app.use('/api/comment', isAuth(), commentRouter)

//Passport strategies
passport.use(
	'local',
	new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async function (
		email,
		password,
		done
	) {
		// by default passport uses username
		try {
			const user = await User.findOne({ where: { email: email } })
			console.log(email, password, user)
			if (!user) {
				return done(null, false, { message: 'invalid credentials' }) // for safety
			} else
				crypto.pbkdf2(
					password,
					user.salt,
					310000,
					32,
					'sha256',
					async function (err, hashedPassword) {
						if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
							return done(null, false, { message: 'invalid credentials' })
						}
						const token = jwt.sign(sanitizeUser(user), SECRET_KEY)
						return done(null, token) // this lines sends to serializer
					}
				)
		} catch (err) {
			return done(err)
		}
	})
)

passport.use(
	'jwt',
	new JwtStrategy(opts, async function (jwt_payload, done) {
		try {
			const user = await User.findOne({ where: { id: jwt_payload.id } })
			if (user) {
				return done(null, user) // this calls serializer
			} else {
				return done(null, false, { message: 'invalid credentials' })
			}
		} catch (err) {
			return done(err, false)
		}
	})
)
// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, { id: user.id, role: user.role })
	})
})

// this changes session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user)
	})
})

sequelize
	.authenticate()
	.then(() => console.log('Connect to database sequelize(sql) successfully.'))
	.catch((error) => console.error('Unable to connect to the database:', error))

Category.hasMany(Product)
Product.belongsTo(Category)

Brand.hasMany(Product)
Product.belongsTo(Brand)

Inventory.hasMany(Product)
Product.belongsTo(Inventory)

User.hasOne(Cart)
Cart.belongsTo(User)

Product.hasMany(Cart)
Cart.belongsTo(Product)

Order.hasMany(OrderItems)
OrderItems.belongsTo(Order)

Product.hasOne(OrderItems)
OrderItems.belongsTo(Product)

User.hasMany(Order)
Order.belongsTo(User)

const socketIo = require('socket.io')(server, {
	cors: {
		origin: '*',
	},
})

socketIo.on('connection', (socket) => {
	console.log(`User Connected: ${socket.id}`)

	socket.on('join_room', (data) => {
		socket.join(data)
		console.log(`User with ID: ${socket.id} joined room: ${data}`)
	})

	socket.on('send_message', (data) => {
		console.log(data)
		socket.to(data.room).emit('receive_message', data)
	})

	socket.on('disconnect', () => {
		console.log('User Disconnected', socket.id)
	})
})

sequelize.sync()
mongoose
	.connect(mongoDB)
	.then(() => console.log('Connect to database mongoDB successfully'))
	.catch((error) => console.error('Unable to connect to the database:', error))

server.listen(PORT_SOCKET, () => console.log(`Server is Quannected to Port ${PORT_SOCKET}`))

app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`))
