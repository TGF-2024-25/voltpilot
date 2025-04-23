import express from 'express';
import rutaController from '../controller/rutaController.js';

const router = express.Router();

router.post("/route", rutaController.getRoute);
router.get("/autonomia/:uid", rutaController.getAutonomia);
router.post("/autonomia", rutaController.setAutonomia);
router.post("/estaciones", rutaController.getEstacionesRuta);
router.get("/preferencias/:uid", rutaController.getPreferencias);
router.post("/preferencias", rutaController.setPreferencias);
router.get("/favoritos/:uid", rutaController.getFavoritos);
router.post("/favoritos", rutaController.setFavorito);
router.delete("/favoritos", rutaController.deleteFavorito);

export default router;