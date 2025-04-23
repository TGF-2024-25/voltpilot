import { db } from '../config/firebaseAdmin.js';
import admin from "firebase-admin";

class FavoritosRutaModel {
  // collection --> autonomia || document --> userId (UID) || fields --> [ {description , location: {lat, long} } , {description , location: {lat, long} } } , ...]

  async getAllById(uid) {
    try {
        const doc = await db.collection('favoritos').doc(uid).get();

        if (!doc.exists) return [];

        const data = doc.data();

        return data.items || [];
    } catch (error) {
        console.error('Error al obtener favoritos por UID:', error);
        throw new Error(`Error al obtener favoritos por UID: ${error.message}`);
    }
  }

  async add(data) {
    try {
        const { uid, ...favoritoDB } = data;   // Separamos uid de data para guarda solo los campos de favoritos en BD para documento UID
       
        await db.collection("favoritos").doc(uid).set(
            { items: admin.firestore.FieldValue.arrayUnion(favoritoDB) },  { merge: true },
          );;

    } catch (error) {
        console.error('Error al guardar/actualizar favorito:', error);
        throw new Error(`Error al guardar/actualizar favorito: ${error.message}`);
    }
  }

  async remove(data) {
    try {
      const { uid, ...favoritoDB } = data;
      
      await db.collection("favoritos").doc(uid).update({
        items: admin.firestore.FieldValue.arrayRemove(favoritoDB)
      });
      
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      throw new Error(`Error al eliminar favorito: ${error.message}`);
    }
  }

}

export default new FavoritosRutaModel();





