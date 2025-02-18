import {model, Schema} from 'mongoose';

const orderSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	products: [
		{
			product: {
				type: Schema.Types.ObjectId,
				ref: 'Product',
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
		},
	],
	status: {
		type: String,
		enum: ['active', 'done','cancel'],
		default: 'active',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default model('Order', orderSchema);