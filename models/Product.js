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

// Ranglar uchun Schema
const colorSchema = new Schema({
	name: languageSchema,
	code: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
})

// Mahsulotlar uchun asosiy Schema
const productSchema = new Schema({
	title: languageSchema,
	description: languageSchema,
	price: {
		type: Number,
		required: true,
	},
	isExist: {
		type: Boolean,
		default: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	colors: [colorSchema],
	sizes: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
})

export default model('Product', productSchema)
