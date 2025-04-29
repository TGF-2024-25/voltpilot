import express from "express";
import estacionController from "../controller/estacionController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/getCargadores", estacionController.getCargadores);
router.post("/getCargadorFotos", estacionController.getCargadorFotos);
router.post("/getComentarios", estacionController.getComentarios); // Recupera comentarios de nuetra base de datos
router.post("/getInfoCargador", estacionController.getInfoCargador); // Recupera información de un cargador específico

// Rutas protegidas por el middleware de autenticación
router.post("/createComentario", authMiddleware, estacionController.createComentario); // Agreaga un comentario a la base de datos
router.post("/deleteComentario", authMiddleware, estacionController.deleteComentario); // Elimina un comentario de la base de datos
router.post("/getEstacionesFavoritas", authMiddleware, estacionController.getEstacionesFavoritas); // Recupera las estaciones favoritas de un usuario
router.post("/addEstacionFavorita", authMiddleware, estacionController.addEstacionFavorita); // Agrega una estación a la lista de favoritas de un usuario
router.post("/deleteEstacionFavorita", authMiddleware, estacionController.deleteEstacionFavorita); // Elimina una estación de la lista de favoritas de un usuario
export default router;
