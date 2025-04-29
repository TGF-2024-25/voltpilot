import userModel from "../models/userModel.js";
import { auth } from "../config/firebaseAdmin.js";

const userController = {
  /**
   * Crea un nuevo usuario
   * POST /api/users/createUser
   * Los datos que se guardan en Firestore: uid, email, name, [phoneNumber]
   */
  createUser: async (req, res) => {
    try {
      const { email, password, name, phoneNumber } = req.body;

      // Verifica si el usuario ya existe
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "El email ya está registrado",
        });
      }

      // Crea el usuario en Firebase Admin
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name || "",
        phoneNumber: phoneNumber || undefined,
        emailVerified: false,
      });

      // Guarda el usuario en Firestore
      const userData = {
        id: userRecord.uid,
        email,
        name: name || "",
        phoneNumber: phoneNumber || null,
      };

      await userModel.createUser(userData);

      // Devuelve el mensaje de usuario creado
      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
      });
    } catch (error) {
      console.error("Usuario no ha sido creado correctamente:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear el usuario",
        error: error.message,
      });
    }
  },

  /**
   * Obtiene el perfil del usuario
   * GET /api/users/getUserProfile
   */
  getUserProfile: async (req, res) => {
    try {
      const userId = req.user.uid;

      // Obtiene los datos del usuario desde Firestore
      const userProfile = await userModel.findById(userId);

      // Devuelve el perfil del usuario, excluyendo información sensible
      res.status(200).json({
        success: true,
        user: userProfile,
      });
    } catch (error) {
      console.error("Error al conseguir datos de usuario:", error);
      res.status(500).json({
        success: false,
        message: "Ha ocurrido un error al conseguir datos de usuario",
        error: error.message,
      });
    }
  },

  /**
   * Actualiza el perfil del usuario
   * PUT /api/users/updateUserProfile
   */
  updateUserProfile: async (req, res) => {
    try {
      const userId = req.body.uid;
      const password = req.body.passwordupdate;
      const { name, email, phoneNumber, address} = req.body;

      // Prepara los datos para actualizar
      const updateData = {};
      if (email) updateData.email = email;
      if (name) updateData.name = name;
      if (phoneNumber) updateData.phone = phoneNumber;
      if (address) updateData.address = address;

      // Actualiza el email en Firebase Admin
      if (email) {
        await auth.updateUser(userId, {
          email: email,
          emailVerified: false,
        });
      }

      if (password!== "") {
        // Actualiza la contraseña en Firebase Admin
        await auth.updateUser(userId, {
          password: password,
        });
      }
      // Actualiza el usuario en Firestore
      const userDetail = await userModel.updateUser(userId, updateData);

      res.status(200).json({
        success: true,
        message: "Datos de usuario actualizados exitosamente",
        data: {userDetail: userDetail}
      });
    } catch (error) {
      console.error("Error al actualizar datos de usuario:", error);

      let statusCode = 500;
      let message = "  ";

      res.status(statusCode).json({
        success: false,
        message,
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  /**
   * Obtiene un usuario por su ID
   * GET /api/users/getUserById
   */
  getUserById: async (req, res) => {
    // Implementación pendiente
  },

  /**
   * Elimina un usuario
   * DELETE /api/users/deleteUser
   */
  deleteUser: async (req, res) => {
    // Implementación pendiente
  },
};

export default userController;

