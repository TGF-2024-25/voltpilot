import { db } from '../config/firebaseAdmin.js';

class AutonomiaModel {      
    // collection --> autonomia || document --> userId (UID) || fields --> inicial, final, minima

    async findById(uid) {
        try {
          const doc = await db.collection('autonomia').doc(uid).get();
          
          if (!doc.exists) return null;
          
          return doc.data();
        } catch (error) {
            console.error('Error obteniendo autonomia por UID:', error);
            throw new Error(`Error obteniendo autonomia por UID: ${error.message}`);
        }
    }

    async saveOrCreate(data) {
        try {
            const { uid, ...autonomiaDB } = data;   // Separamos uid de data para guarda solo los campos de autonomia en BD para documento UID
            await db.collection('autonomia').doc(uid).set(autonomiaDB);

        } catch (error) {
            console.error('Error al guardar/actualizar autonomía:', error);
            throw new Error(`Error al guardar/actualizar autonomía: ${error.message}`);
        }
    }

}

export default new AutonomiaModel();