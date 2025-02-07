import mongoose from 'mongoose'

export const connectDB = async () => {
	try {
		mongoose.connect(process.env.DB_URL)
		console.log('MongoDB connected')
	} catch (err) {
		console
			.log(err)
			.catch(err => console.error('MongoDB ulanish xatoligi:', err))
	}
}
