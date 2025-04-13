import userModel from '../models/userModel.js';
import { auth } from '../config/firebaseAdmin.js';

const userController = {
  //creare usuario 
  // los datos que se guarda en firestore: uid, email, name, [phoneNumber]
  createUser: async (req, res) => {
    try {
      const { email, password, name, phoneNumber } = req.body;

      //verificar si el usuario ya existe
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: 'el email ya está registrado' 
        });
      }

      // creaer el usuario en firebaseAdmin
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name || '',
        phoneNumber: phoneNumber || undefined,
        emailVerified: false
      });

      // guarda usuario en Firestore
      const userData = {
        id: userRecord.uid,
        email,
        name: name || '',
        phoneNumber: phoneNumber || null,
      };

      await userModel.createUser(userData);

      //delevuelve el mensaje usuario creado
      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
      });

    } catch (error) {
      console.error('Usuario no ha sido creado correctamente:', error);
      res.status(500).json({
        success: false,
        message: 'erro al crear el usuario',
        error: error.message
      });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const userId = req.user.uid; 
      
      // sacar datos de usuario de firestore
      const userProfile = await userModel.findById(userId);
      
      // 返回用户资料，排除敏感信息      
      res.status(200).json({
        success: true,
        user: userProfile
      });
    } catch (error) {
      console.error('error consiguir datos de usuario:', error);
      res.status(500).json({
        success: false,
        message: 'ha sido error al conseguir datos de usuario',
        error: error.message
      });
    }
  },
  
  updateUserProfile: async (req, res) => {
    try {
      const userId = req.user.uid;
      const { name, email, phoneNumber, address, password} = req.body;
      
      // update user
      const updateData = {};
      if (email) updateData.email = email;
      if (name) updateData.name = name;
      if (phoneNumber) updateData.phone = phoneNumber;
      if (address) updateData.address = address;
            
      
      //actualizar el email en firebaseAdmin
      if (email) {
        await auth.updateUser(userId, {
          email: email,
          emailVerified: false
        });
      }
      //actualizar el password de usuario en firebaseAdmin
      if (password) {
        await auth.updateUser(userId, {
          password: password
        });
      }
      
      // actualizar el usuario en Firestore
      const updatedUser = await userModel.updateUser(userId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'datos de usuario actualizados exitosamente',
        data: updatedUser
      });
    } catch (error) {
      console.error('error de actualizar datos de usuario:', error);
      
      let statusCode = 500;
      let message = 'error de actualizar datos de usuario';
      
      res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  getUserById: async (req, res) => {
  },
  
  deleteUser: async (req, res) => {
  }
};

export default userController;