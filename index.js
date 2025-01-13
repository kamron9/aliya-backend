import cors from 'cors'
import dotenv from 'dotenv'
import 'dotenv/config'
import express from 'express'
import { connectDB } from './db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/api', productRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 5000

const startApp = async () => {
	try {
		await connectDB()
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
	} catch (err) {
		console.log(err)
	}
}
startApp()
