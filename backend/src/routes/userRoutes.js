import express from 'express';
import userController from '../controller/userController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// PUBLIC ROUTES
router.post('/register', userController.createUser);

// PRIVATE ROUTES
router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateUserProfile);
router.get('/:id', authMiddleware, userController.getUserById);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;