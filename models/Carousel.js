import { model, Schema } from 'mongoose'

const languageSchema = new Schema({
	uz: {
		type: String,
		required: true,
	},
	ru: {
		type: String,
		required: true,
	},
})

const CarouselSchema = new Schema({
	title: languageSchema,
	description: languageSchema,
	image: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
})

export default model('Carousel', CarouselSchema)
