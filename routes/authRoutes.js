import express from 'express'
import { adminLogin, createAdmin } from '../controllers/authController.js'

const router = express.Router()

router.post('/admin/create', createAdmin)
router.post('/admin/login', adminLogin)

export default router
