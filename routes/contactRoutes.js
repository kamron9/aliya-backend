import {createContact,deleteContact,getContact,getContacts,updateContact}from '../controllers/contactController.js';
import { Router } from 'express';
import {verifyToken} from '../middleware/authMiddleware.js';

const router = Router();

router.post('/contact',verifyToken, createContact);
router.get('/contact',verifyToken, getContacts);	
router.get('/contact/:id',verifyToken, getContact);
router.put('/contact/:id',verifyToken, updateContact);
router.delete('/contact/:id',verifyToken, deleteContact);

export default router;