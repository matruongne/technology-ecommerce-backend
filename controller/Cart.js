const Cart = require('../model/Cart')
const Product = require('../model/Product')

const addToCart = async (req, res) => {
	const { id } = req.user

	Cart.create({ ...req.body, UserId: id })
		.then(async (response) => {
			const result = await Cart.findByPk(response.id, {
				include: [
					{
						model: Product,
					},
				],
			})

			res.status(200).json({ result })
		})
		.catch((error) => {
			console.error('Failed to create a new record : ', error)
			res.status(400).json({ error: error })
		})
}

const deleteFromCart = async (req, res) => {
	const { id } = req.params

	Cart.destroy({
		where: {
			id: id,
		},
	})
		.then(() => {
			res.status(200).json({ status: 'Success' })
		})
		.catch((err) => {
			console.error('Failed to delete a record : ', err)
			res.status(400).json(err)
		})
}

const updateCart = async (req, res) => {
	const { id } = req.params

	const { quantity, color, decrement } = req.body
	if (decrement) {
		await Cart.decrement('quantity', {
			by: quantity,
			where: { id: id },
		})
	} else {
		await Cart.increment('quantity', {
			by: quantity,
			where: { id: id },
		})
	}

	Cart.update(
		{
			colors: color,
		},
		{
			where: {
				id: id,
			},
		}
	)
		.then(async () => {
			const result = await Cart.findByPk(id, {
				include: [
					{
						model: Product,
					},
				],
			})
			res.status(200).json(result)
		})
		.catch((err) => {
			console.error('Failed to update a record : ', err)
			res.status(400).json(err)
		})
}

const getCartByUser = async (req, res) => {
	const { id } = req.user

	Cart.findAll(
		{
			include: [
				{
					model: Product,
				},
			],
		},
		{ where: { UserId: id } }
	)
		.then((result) => {
			res.status(200).json(result)
		})
		.catch((err) => {
			console.error('Failed to get by User : ', err)
			res.status(400).json(err)
		})
}

module.exports = { addToCart, deleteFromCart, updateCart, getCartByUser }
