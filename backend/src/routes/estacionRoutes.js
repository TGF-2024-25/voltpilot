import express from "express";
import estacionController from "../controller/estacionController.js";

const router = express.Router();

router.post("/getCargadores", estacionController.getCargadores);
router.post("/getCargadorFotos", estacionController.getCargadorFotos);

export default router;
