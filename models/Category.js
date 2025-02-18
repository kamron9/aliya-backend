import { Schema, model } from 'mongoose'


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


const CategorySchema = new Schema({
	title: languageSchema,
	image: {
		type: String,
		required: true,
	},
	urlSlug: {
		type: String,
		required: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
})
export default model('Category', CategorySchema)
