// import dotenv from 'dotenv'
// import { Dropbox } from 'dropbox'
// import express from 'express'
// import multer from 'multer'
// import fetch from 'node-fetch'
// import { DROPBOX_ACCESS_TOKEN } from '../tokens.js'

// dotenv.config()

// const router = express.Router()
// const upload = multer({ storage: multer.memoryStorage() })
// console.log(DROPBOX_ACCESS_TOKEN)

// const dbx = new Dropbox({
// 	accessToken: DROPBOX_ACCESS_TOKEN,
// 	fetch: fetch,
// })

// router.post('/uploads', upload.single('image'), async (req, res) => {
// 	try {
// 		if (!req.file) {
// 			return res.status(400).json({ error: 'Fayl yuklanmadi!' })
// 		}

// 		const fileName = `/uploads/${Date.now()}_${req.file.originalname}`
// 		const fileBuffer = req.file.buffer

// 		const uploadResponse = await dbx.filesUpload({
// 			path: fileName,
// 			contents: fileBuffer,
// 			mode: { '.tag': 'overwrite' },
// 		})

// 		const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
// 			path: uploadResponse.result.path_display,
// 			settings: { requested_visibility: 'public' },
// 		})

// 		console.log('Shared link:', sharedLinkResponse)

// 		const imageUrl = sharedLinkResponse.result.url.replace('&dl=0', '&raw=1')

// 		res.json({ message: 'Fayl muvaffaqiyatli yuklandi!', url: imageUrl })
// 	} catch (error) {
// 		console.error('Dropbox Error:', error)
// 		res
// 			.status(500)
// 			.json({ error: 'Rasm yuklashda xatolik yuz berdi!', message: error })
// 	}
// })

// export default router


import dotenv from 'dotenv'
import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

dotenv.config()

const router = express.Router()

const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true })
	console.log('📁 uploads papkasi yaratildi')
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir)
	},
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}_${file.originalname}`
		cb(null, uniqueName)
	},
})

const upload = multer({ storage })


router.post('/uploads', upload.single('file'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'Fayl yuklanmadi!' })
		}

		const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

		res.json({
			message: '✅ Fayl muvaffaqiyatli yuklandi!',
			url: fileUrl,
		})
	} catch (error) {
		console.error('Upload Error:', error)
		res
			.status(500)
			.json({ error: 'Rasm yuklashda xatolik yuz berdi!', message: error })
	}
})

export default router
