import { Schema,model } from 'mongoose'

const CategorySchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
})
export default model('Category', CategorySchema)