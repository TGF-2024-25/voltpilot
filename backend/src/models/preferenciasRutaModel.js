import { db } from "../config/firebaseAdmin.js";

class PreferenciasRutaModel {
    // collection --> preferenciasRuta || document --> userId (UID) || fields --> 

  async findById(uid) {
    try {
      const doc = await db.collection("preferenciasRuta").doc(uid).get();

      if (!doc.exists) return null;

      return doc.data();
    } catch (error) {
      console.error("Error obteniendo preferencias por UID:", error);
      throw new Error(`Error obteniendo preferencias por UID: ${error.message}`);
    }
  }

  async saveOrCreate(data) {
    try {
        const { uid, ...preferenciasDB } = data; // Guardamos preferencias sin uid como campos
        await db.collection("preferenciasRuta").doc(uid).set(preferenciasDB);

    } catch (error) {
        console.error("Error al guardar/actualizar preferencias:", error);
        throw new Error(`Error al guardar/actualizar preferencias: ${error.message}`);
    }
  }
}

export default new PreferenciasRutaModel();
