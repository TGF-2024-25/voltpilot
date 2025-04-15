import express from 'express';
import rutaController from '../controller/rutaController.js';

const router = express.Router();

router.post('/route', rutaController.getRoute);
//router.post("/places", rutaController.getPlaces);

export default router;