import Contact from '../models/Contact.js'
import { sendContactToAdmin } from '../socket.js'

export const createContact = async (req, res) => {
	try {
		const contact = new Contact(req.body)
		await contact.save()
		const io = req.app.get('socketio')

		sendContactToAdmin(contact, io)
		res.status(201).json(contact)
	} catch (error) {
		res.status(500).json({ message: 'contactda xatolik' + error.message })
	}
}

export const getContacts = async (req, res) => {
	try {
		const contacts = await Contact.find()
		res.status(200).json(contacts)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

export const getContact = async (req, res) => {
	try {
		const { id } = req.params
		const contact = await Contact.findById(id)
		if (!contact) return res.status(404).json({ message: 'Contact not found' })
		res.status(200).json(contact)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

export const updateContact = async (req, res) => {
	try {
		const { id } = req.params
		const { status } = req.body
		const contact = await Contact.findByIdAndUpdate(id, { status }).exec()
		if (!contact) return res.status(404).json({ message: 'Contact not found' })
		res.status(200).json(contact)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

export const deleteContact = async (req, res) => {
	try {
		const { id } = req.params
		const contact = await Contact.findByIdAndDelete(id)
		if (!contact) return res.status(404).json({ message: 'Contact not found' })
		res.status(200).json(contact)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
