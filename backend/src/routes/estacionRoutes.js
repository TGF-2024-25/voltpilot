import express from "express";
import estacionController from "../controller/estacionController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/getCargadores", estacionController.getCargadores);
router.post("/getCargadorFotos", estacionController.getCargadorFotos);
router.post("/getComentarios", estacionController.getComentarios); // Recupera comentarios de nuetra base de datos

// Rutas protegidas por el middleware de autenticación
router.post("/createComentario", authMiddleware, estacionController.createComentario); // Agreaga un comentario a la base de datos
router.post("/deleteComentario", authMiddleware, estacionController.deleteComentario); // Elimina un comentario de la base de datos

export default router;
