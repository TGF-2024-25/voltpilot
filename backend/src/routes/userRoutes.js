import express from "express";
import userController from "../controller/userController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/*
 * RUTAS PÚBLICAS
 */
router.post("/register", userController.createUser); // Registro de un nuevo usuario

/**
 * RUTAS PRIVADAS
 * Estas rutas requieren autenticación.
 * El `authMiddleware` verifica que el usuario esté autenticado antes de permitir el acceso.
 */
router.get("/profile", authMiddleware, userController.getUserProfile); // Obtiene el perfil del usuario autenticado
router.put("/profile", authMiddleware, userController.updateUserProfile); // Actualiza el perfil del usuario autenticado
router.put("/vehicle", authMiddleware, userController.updateUserVehicle); // Actualiza el vehículo del usuario autenticado
router.get("/:id", authMiddleware, userController.getUserById); // Obtiene un usuario por su ID
router.delete("/:id", authMiddleware, userController.deleteUser); // Elimina un usuario por su ID
router.post("/vehicle", authMiddleware, userController.deleteUserVehicle); // Elimina el vehículo del usuario autenticado
export default router;
