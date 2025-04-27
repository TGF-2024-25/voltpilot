/* eslint-disable import/no-unresolved */
import { apiRequest } from "../../../frontend/src/services/api.js";
import { auth } from "../config/firebaseAdmin.js";
import userModel from "../models/userModel.js";
import fetch from "node-fetch";

const API_KEY = process.env.FIREBASE_API_KEY;

const authController = {
  /**
   * Inicia sesión de usuario
   * POST /api/auth/login
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Verifica email y contraseña mediante Firebase Auth REST API
      const authResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });

      const authData = await authResponse.json();

      // Si la respuesta no es exitosa, lanza un error
      if (!authResponse.ok) {
        throw new Error(authData.error?.message || "Error de autenticación");
      }

      // Si el login es exitoso, obtenemos el usuario de Firebase
      const userRecord = await auth.getUser(authData.localId);
      const userDetails = await userModel.findById(userRecord.uid);

      // Responde con los detalles del usuario y los tokens
      res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        data: {
          userDetail: userDetails, // Devuelve datos del usuario desde Firestore
          token: authData.idToken, // Devuelve el token de usuario para operaciones futuras
          refreshToken: authData.refreshToken,
          expiresIn: authData.expiresIn,
        },
      });
    } catch (error) {
      console.error("Error en login:", error);

      // Manejo de errores específicos
      let message = "Inicio de sesión fallido";
      let statusCode = 400;

      if (
        error.message.includes("EMAIL_NOT_FOUND") ||
        error.message.includes("INVALID_PASSWORD") ||
        error.message.includes("INVALID_LOGIN_CREDENTIALS")
      ) {
        message = "Email o contraseña incorrectos";
      }

      // Responde con el error
      res.status(statusCode).json({
        success: false,
        message,
        error: error.message,
      });
    }
  },

  /**
   * Verifica el token de usuario
   * POST /api/auth/verify-token
   */
  verifyToken: async (req, res) => {
    try {
      const { idToken } = req.body;

      // Si no se proporciona un token, responde con un error
      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: "No se proporcionó un token",
        });
      }

      // Verifica el token de Firebase
      const decodedToken = await auth.verifyIdToken(idToken);
      const userRecord = await auth.getUser(decodedToken.uid);

      // Responde con los detalles del usuario si el token es válido
      res.status(200).json({
        success: true,
        message: "Token válido",
        data: {
          userId: userRecord.uid,
          email: userRecord.email,
        },
      });
    } catch (error) {
      console.error("Error en verificación de token:", error);

      // Responde con un error si el token no es válido
      res.status(401).json({
        success: false,
        message: "Token no válido",
      });
    }
  },
};

export default authController;
