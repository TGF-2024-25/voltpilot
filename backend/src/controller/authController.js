import { auth } from '../config/firebaseAdmin.js';
import userModel from '../models/userModel.js';
import fetch from 'node-fetch';

const authController = {
  
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // verifica email y contrasenia mediante Firebase Auth REST API
      const API_KEY = process.env.FIREBASE_API_KEY;
      const authResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true
          })
        }
      );
      
      const authData = await authResponse.json();
      
      if (!authResponse.ok) {
        throw new Error(authData.error?.message || 'Error de autenticación');
      }
      
      // si el login es exitoso, obtenemos el usuario de firebase
      const userRecord = await auth.getUser(authData.localId);
      const userDetails = await userModel.findById(userRecord.uid);
      
      res.status(200).json({
        success: true,
        message: 'login exito',
        data: {
          userDetail: userDetails,//devuelve datos d usuario de firestore
          token: authData.idToken,//devuelve token de usuario para operaciones futuras
          refreshToken: authData.refreshToken,
          expiresIn: authData.expiresIn
        }
      });
    } catch (error) {
      console.error('login error:', error);
      
      let message = 'login no ha sido exito';
      let statusCode = 400;
      
      if (error.message.includes('EMAIL_NOT_FOUND') || 
          error.message.includes('INVALID_PASSWORD') ||
          error.message.includes('INVALID_LOGIN_CREDENTIALS')) {
        message = 'email o contraseña incorrectos';
      }
      
      res.status(statusCode).json({
        success: false,
        message,
        error: error.message
      });
    }
  },

  /**
   * verifica token
   * POST /api/auth/verify-token
   */
  verifyToken: async (req, res) => {
    try {
      const { idToken } = req.body;
      
      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: 'no existe token'
        });
      }   
      
      // 验证令牌
      const decodedToken = await auth.verifyIdToken(idToken);
      const userRecord = await auth.getUser(decodedToken.uid);
      
      res.status(200).json({
        success: true,
        message: 'token valido',
        data: {
          userId: userRecord.uid,
          email: userRecord.email
        }
      });
    } catch (error) {
      console.error('token error:', error);
      
      res.status(401).json({
        success: false,
        message: 'token no valido'
      });
    }   
  },
};

export default authController;