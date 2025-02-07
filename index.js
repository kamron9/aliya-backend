import cors from 'cors'
import dotenv from 'dotenv'
import 'dotenv/config'
import express from 'express'
import { connectDB } from './db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/auth', authRoutes)
app.use('/uploads', express.static('uploads'))
app.use('/api', uploadRoutes)
app.use('/api', productRoutes)
app.use('/api', categoryRoutes)

const PORT = process.env.PORT || 5555

const startApp = async () => {
	try {
		await connectDB()
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
	} catch (err) {
		console.log(err)
	}
}
startApp()
