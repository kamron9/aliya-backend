import { model, Schema } from 'mongoose'

const contactSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		enum: ['unread', 'read'],
		default: 'unread',
	},
})

export default model('Contact', contactSchema)
