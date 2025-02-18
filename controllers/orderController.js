import Order from '../models/Order.js'
import { sendOrderToAdmin } from '../socket.js'

export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find()
			.populate({
				path: 'products.product',
				select: 'title price description isExist colors sizes',
			})
			.exec()
		res.status(200).json(orders)
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const getOrderById = async (req, res) => {
	try {
		const { id } = req.params
		const order = await Order.findById(id)
		if (!order) {
			return res.status(404).json({ message: 'Buyurtma topilmadi' })
		}
		res.status(200).json(order)
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const createOrder = async (req, res) => {
	try {
		const { username, phone, products, status } = req.body
		const order = new Order({ username, phone, products, status })
		await order.save()

		const io = req.app.get('socketio')

		sendOrderToAdmin(order, io)

		res.status(201).json(order)
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const updateOrder = async (req, res) => {
	try {
		const { id } = req.params
		const { status } = req.body
		const updatedOrder = await Order.findByIdAndUpdate(
			id,
			{ status },
			{
				new: true,
				runValidators: true,
			}
		)
		if (!updatedOrder) {
			return res.status(404).json({ message: 'Buyurtma topilmadi' })
		}

		res
			.status(200)
			.json({ message: 'Buyurtma yangilandi', order: updatedOrder })
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const deleteOrder = async (req, res) => {
	try {
		const { id } = req.params
		const deletedOrder = await Order.findByIdAndDelete(id)
		if (!deletedOrder) {
			return res.status(404).json({ message: 'Buyurtma topilmadi' })
		}

		res.status(200).json({ message: 'Buyurtma o`chirildi' })
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}
