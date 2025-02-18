import { Router } from 'express';
import { getCarousel,createCarousel,deleteCarousel,updateCarousel } from '../controllers/carouselController.js';
import { verifyToken } from '../middleware/authMiddleware.js'

const router = Router();

router.get('/carousel', getCarousel);
router.post('/carousel', verifyToken, createCarousel);
router.put('/carousel/:id', verifyToken, updateCarousel);
router.delete('/carousel/:id', verifyToken, deleteCarousel);

export default router;