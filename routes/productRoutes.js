import express from 'express'
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductById,
	updateProduct,
} from '../controllers/productController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/products', getAllProducts)

router.get('/products/:id', getProductById)

router.post('/products', verifyToken, createProduct)

router.put('/products/:id', verifyToken, updateProduct)

router.delete('/products/:id', verifyToken, deleteProduct)

export default router
