import express from 'express';
import rutaController from '../controller/rutaController.js';

const router = express.Router();

router.post("/route", rutaController.getRoute);
router.get("/autonomia", rutaController.getAutonomia);
router.post("/autonomia", rutaController.setAutonomia);
router.post("/estaciones", rutaController.getEstacionesRuta);

export default router;