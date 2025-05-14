import express from 'express';
import paymentsController from '../controller/paymentController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// rutas para el manejo de métodos de pago
router.post('/save-method', authMiddleware, paymentsController.savePaymentMethod);
router.get('/saved-methods/:uid', authMiddleware, paymentsController.getSavedPaymentMethods);
router.post('/delete-saved-method', authMiddleware, paymentsController.deleteSavedPaymentMethod);

export default router;