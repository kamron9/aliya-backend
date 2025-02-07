import express from 'express'
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
} from '../controllers/categoryController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/categories', getAllCategories)

router.get('/categories/:id', getCategoryById)

router.post('/categories', verifyToken, createCategory)

router.put('/categories/:id', verifyToken, updateCategory)

router.delete('/categories/:id', verifyToken, deleteCategory)

export default router