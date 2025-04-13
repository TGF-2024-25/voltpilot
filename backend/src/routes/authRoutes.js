import express from 'express';
import authController from '../controller/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// PUBLIC ROUTES
router.post('/login', authController.login);
//router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-token', authController.verifyToken);

// PRIVATE ROUTES
//router.post('/logout', authMiddleware, authController.logout);
//router.post('/change-password', authMiddleware, authController.changePassword);

export default router;