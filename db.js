import mongoose from 'mongoose'

export const connectDB = async () => {
	try {
		mongoose.connect(
			'mongodb+srv://kamron:Kamron.99@store.r33dr.mongodb.net/?retryWrites=true&w=majority&appName=store'
		)
		console.log('MongoDB connected')
	} catch (err) {
		console
			.log(err)
			.catch(err => console.error('MongoDB ulanish xatoligi:', err))
	}
}
