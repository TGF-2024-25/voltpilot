//const { db } = require('../config/firebase');
import { db } from "../config/firebaseAdmin.js";

class UserModel {
  /**
   *
   * uid, email, name, phoneNumber
   */
  async createUser(userData) {
    try {
      const userId = userData.id;
      const newUser = {
        email: userData.email,
        name: userData.name || "",
        phoneNumber: userData.phoneNumber || null,
      };

      // guarda usuario en Firestore
      await db.collection("users").doc(userId).set(newUser);
      return userId;
    } catch (error) {
      console.error("error crear usuario:", error);
      throw new Error(`error crear usuario: ${error.message}`);
    }
  }

  /**
   * findByEmail
   * @param {string} email - email del usuario
   * @returns {Promise<Object|null>} - usurio encontrado o null si no existe
   */
  async findByEmail(email) {
    try {
      // 使用新的 Firestore API
      const snapshot = await db
        .collection("users")
        .where("email", "==", email)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error("error buscar usuario:", error);
      throw new Error(`error buscar usuario: ${error.message}`);
    }
  }

  async updateUser(id, data) {
    try {
      const userRef = db.collection("users").doc(id);

      const updateData = {};

      if (data.email) updateData.email = data.email;
      if (data.name) updateData.name = data.name;
      if (data.phone) updateData.phoneNumber = data.phoneNumber;
      if (data.address) updateData.address = data.address;

      await userRef.update(updateData);

      // conseguir usuario actualizado para actualizar el vista
      const updatedUser = await this.findById(id);
      return updatedUser;
    } catch (error) {
      console.error("error actualizar usuario:", error);
      throw new Error(`error actualizar usuario: ${error.message}`);
    }
  }

  async updateVehicle(uid, vid, data) {
    try {
      const vehicleRef = db.collection("users").doc(uid).collection("vehicles").doc(vid);
      const vehicle = {};

      if (data.marca) vehicle.marca = data.marca;
      if (data.modelo) vehicle.modelo = data.modelo;
      if (data.autonomia) vehicle.autonomia = data.autonomia;
      if (data.tipo) vehicle.tipo = data.tipo;

      await vehicleRef.update(vehicle);

      // conseguir usuario actualizado para actualizar el vista
      const updatedUser = await this.findById(uid);
      return updatedUser;
    } catch (error) {
      console.error("error actualizar vehiculo:", error);
      throw new Error(`error actualizar vehiculo: ${error.message}`);
    }
  }
  
  async deleteVehicle(uid, vid) {
    try {
      const vehicleRef = db.collection("users").doc(uid).collection("vehicles").doc(vid);
      await vehicleRef.delete();
      
      // conseguir usuario actualizado para actualizar el vista
      const updatedUser = await this.findById(uid);
      return updatedUser;
    } catch (error) {
      console.error("error actualizar vehiculo:", error);
      throw new Error(`error actualizar vehiculo: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const doc = await db.collection("users").doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error("error buscar usuario por ID:", error);
      throw new Error(`error buscar usuario por ID: ${error.message}`);
    }
  }
}

export default new UserModel();

