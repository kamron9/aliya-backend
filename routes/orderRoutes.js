import { Router } from 'express';

import { createOrder,deleteOrder,getAllOrders,getOrderById,updateOrder } from '../controllers/orderController.js';

import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/orders', verifyToken, getAllOrders);
router.get('/orders/:id', verifyToken, getOrderById);
router.post('/orders',verifyToken, createOrder);
router.put('/orders/:id', verifyToken, updateOrder);
router.delete('/orders/:id', verifyToken, deleteOrder);

export default router;