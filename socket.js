export const sendOrderToAdmin = (order, io) => {
	io.emit('order', order) 
}

export const sendContactToAdmin = (contact, io) => {
	io.emit('contact', contact)
}