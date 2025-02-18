import express from 'express'
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductById,
	getProductsByCategory,
	updateProduct,
} from '../controllers/productController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/products', getAllProducts)

router.get('/products/:id', getProductById)

router.post('/products', verifyToken, createProduct)

router.put('/products/:id', verifyToken, updateProduct)

router.delete('/products/:id', verifyToken, deleteProduct)

router.get('/category', getProductsByCategory)

export default router
