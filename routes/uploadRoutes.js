import express from 'express'
import multer from 'multer'
import path from 'path'
const router = express.Router()

const uploadFolder = 'uploads/'

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadFolder)
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, uniqueSuffix + path.extname(file.originalname)) // Unikal nom berish
	},
})

const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png|gif/
	const extname = allowedTypes.test(
		path.extname(file.originalname).toLowerCase()
	)
	const mimetype = allowedTypes.test(file.mimetype)

	if (extname && mimetype) {
		return cb(null, true)
	} else {
		return cb(new Error('Faqat rasm fayllarini yuklash mumkin!'))
	}
}

// Multer middleware
const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter,
})

router.post('/uploads', upload.single('image'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: 'Fayl yuklanmadi!' })
	}

	const imageUrl = `/uploads/${req.file.filename}`
	res.json({ imageUrl })
})

export default router
