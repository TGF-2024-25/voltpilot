import { db } from "../config/firebaseAdmin.js";

const favoritosModel = {
  /**
   * Recupera la lista de estaciones favoritas de un usuario.
   * @param {string} userId - El ID del usuario.
   * @returns {Promise<string[]>} - Una lista de placeIds.
   */
  getEstacionesFavoritas: async (userId) => {
    if (!userId) {
      throw new Error("userId es requerido");
    }

    try {
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        throw new Error("No se encontró un usuario con el userId proporcionado");
      }

      const userData = userDoc.data();
      return userData.estacionesFavoritas || [];
    } catch (error) {
      console.error("Error al recuperar estaciones favoritas:", error);
      throw new Error("Error al recuperar estaciones favoritas");
    }
  },

  /**
   * Agrega un placeId a la lista de estaciones favoritas de un usuario.
   * @param {string} userId - El ID del usuario.
   * @param {string} placeId - El placeId a agregar.
   * @returns {Promise<void>}
   */
  addEstacionFavorita: async (userId, placeId) => {
    if (!userId || !placeId) {
      throw new Error("userId y placeId son requeridos");
    }

    try {
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new Error("No se encontró un usuario con el userId proporcionado");
      }

      const userData = userDoc.data();
      const estacionesFavoritas = userData.estacionesFavoritas || [];

      if (!estacionesFavoritas.includes(placeId)) {
        estacionesFavoritas.push(placeId);
        await userRef.update({ estacionesFavoritas });
      }
    } catch (error) {
      console.error("Error al agregar estación favorita:", error);
      throw new Error("Error al agregar estación favorita");
    }
  },

  /**
   * Elimina un placeId de la lista de estaciones favoritas de un usuario.
   * @param {string} userId - El ID del usuario.
   * @param {string} placeId - El placeId a eliminar.
   * @returns {Promise<void>}
   */
  deleteEstacionFavorita: async (userId, placeId) => {
    if (!userId || !placeId) {
      throw new Error("userId y placeId son requeridos");
    }

    try {
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new Error("No se encontró un usuario con el userId proporcionado");
      }

      const userData = userDoc.data();
      const estacionesFavoritas = userData.estacionesFavoritas || [];

      const estacionesActualizadas = estacionesFavoritas.filter((id) => id !== placeId);
      await userRef.update({ estacionesFavoritas: estacionesActualizadas });
    } catch (error) {
      console.error("Error al eliminar estación favorita:", error);
      throw new Error("Error al eliminar estación favorita");
    }
  },
};

export default favoritosModel;
