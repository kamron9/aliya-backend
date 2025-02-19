import cors from 'cors'
import dotenv from 'dotenv'
import 'dotenv/config'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { connectDB } from './db.js'
import authRoutes from './routes/authRoutes.js'
import carouselRoutes from './routes/carouselRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: 'https://admin.aliya.uz',
		methods: ['GET', 'POST'],
	},
})

app.use('/auth', authRoutes)
app.use('/uploads', express.static('uploads'))
app.use('/api', uploadRoutes)
app.use('/api', productRoutes)
app.use('/api', categoryRoutes)
app.use('/api', carouselRoutes)
app.use('/api', orderRoutes)
app.use('/api', contactRoutes)

io.on('connection', socket => {
	console.log('Foydalanuvchi ulandi:', socket.id)

	socket.on('disconnect', () => {
		console.log('Foydalanuvchi uzildi:', socket.id)
	})
})

app.set('socketio', io)

const PORT = process.env.PORT || 5555

const startApp = async () => {
	try {
		await connectDB()
		server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
	} catch (err) {
		console.log(err)
	}
}
startApp()
