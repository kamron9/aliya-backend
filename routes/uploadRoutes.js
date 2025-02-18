import dotenv from 'dotenv'
import { Dropbox } from 'dropbox'
import express from 'express'
import multer from 'multer'
import fetch from 'node-fetch'
import { DROPBOX_ACCESS_TOKEN } from '../tokens.js'

dotenv.config()

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

const dbx = new Dropbox({
	accessToken: DROPBOX_ACCESS_TOKEN,
	fetch: fetch,
})

router.post('/uploads', upload.single('image'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'Fayl yuklanmadi!' })
		}

		const fileName = `/uploads/${Date.now()}_${req.file.originalname}`
		const fileBuffer = req.file.buffer

		const uploadResponse = await dbx.filesUpload({
			path: fileName,
			contents: fileBuffer,
			mode: { '.tag': 'overwrite' },
		})

		const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
			path: uploadResponse.result.path_display,
			settings: { requested_visibility: 'public' },
		})

		console.log('Shared link:', sharedLinkResponse)

		const imageUrl = sharedLinkResponse.result.url.replace('&dl=0', '&raw=1')

		res.json({ message: 'Fayl muvaffaqiyatli yuklandi!', url: imageUrl })
	} catch (error) {
		console.error('Dropbox Error:', error)
		res.status(500).json({ error: 'Rasm yuklashda xatolik yuz berdi!' })
	}
})

export default router
