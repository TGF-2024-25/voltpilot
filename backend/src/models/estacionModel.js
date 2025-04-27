import { db } from "../config/firebaseAdmin.js";

const estacionModel = {
  /**
   * Obtiene los comentarios de la colección "estaciones" según el placeId (que es igual al doc.id).
   * @param {string} placeId - El placeId que corresponde al doc.id en Firestore.
   * @returns {Promise<Array>} - Una promesa que resuelve con un array de comentarios.
   */
  getComentariosByPlaceId: async (placeId) => {
    if (!placeId) {
      throw new Error("placeId es requerido");
    }

    try {
      // Obtener el documento de la colección "estaciones" por placeId
      const estacionDoc = await db.collection("estaciones").doc(placeId).get();

      if (!estacionDoc.exists) {
        return []; // Devuelve un array vacío si no se encuentra el documento
      }

      const estacionData = estacionDoc.data();
      const comentariosArray = estacionData.comentarios || []; // Array de { userId, commentId }

      if (comentariosArray.length === 0) {
        return []; // Si no hay comentarios, devuelve un array vacío
      }

      // Obtener los comentarios de la colección "comentarios" usando los commentId
      const comentariosPromises = comentariosArray.map(async ({ commentId, userId }) => {
        const comentarioDoc = await db.collection("comentarios").doc(commentId).get();

        if (!comentarioDoc.exists) {
          return null; // Si el comentario no existe, devolver null
        }

        const comentarioData = comentarioDoc.data();

        // Obtener los datos del usuario de la colección "users" usando userId
        const userDoc = await db.collection("users").doc(userId).get();
        const userData = userDoc.exists ? userDoc.data() : { name: "Usuario desconocido" };

        // Combinar los datos del comentario y del usuario
        return {
          commentId,
          comentarioData,
          userData: {
            id: userId,
            name: userData.name || "Usuario desconocido",
          },
        };
      });

      const comentariosDocs = await Promise.all(comentariosPromises);

      // Filtrar los comentarios válidos (que no sean null)
      const comentarios = comentariosDocs.filter((comentario) => comentario !== null);

      return comentarios; // Devuelve los comentarios completos con datos del usuario
    } catch (error) {
      console.error("Error al obtener comentarios desde Firestore:", error);
      throw new Error("Error al obtener comentarios desde Firestore");
    }
  },

  /**
   * Agrega un comentario a la colección "estaciones" según el placeId (que es igual al doc.id).
   * Si no existe una entrada para el placeId, crea una nueva.
   * @param {string} placeId - El placeId que corresponde al doc.id en Firestore.
   * @param {Object} comentario - El comentario a agregar.
   * @returns {Promise<void>}
   */
  addComentario: async (placeId, comentario) => {
    if (!placeId) {
      throw new Error("placeId es requerido");
    }

    const { text, rating, timestamp } = comentario;

    if (!text || !rating || !timestamp) {
      throw new Error("El comentario debe tener text, rating y timestamp");
    }

    try {
      // Generar un commentId único para el nuevo comentario
      const commentRef = db.collection("comentarios").doc();
      const commentId = commentRef.id;

      // Paso 1: Agregar el comentario a la colección "comentarios"
      const comentarioCompleto = {
        text,
        rating,
        timestamp,
      };

      await commentRef.set(comentarioCompleto);

      // Actualizar el array de comentarios en la colección "estaciones"
      const estacionRef = db.collection("estaciones").doc(placeId);
      const estacionDoc = await estacionRef.get();
      const userId = comentario.userId;

      if (!estacionDoc.exists) {
        // Si no existe, crea una nueva entrada con el array de comentarios
        const nuevaEstacion = {
          comentarios: [{ userId, commentId }], // Solo userId y commentId
        };

        await estacionRef.set(nuevaEstacion);
      } else {
        // Si existe, agrega el nuevo comentario al array de comentarios
        const estacionData = estacionDoc.data();
        const comentariosActualizados = [...(estacionData.comentarios || []), { userId, commentId }];

        await estacionRef.update({ comentarios: comentariosActualizados });
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      throw new Error("Error al agregar comentario");
    }
  },

  /**
   * Elimina un comentario de la colección "estaciones" según el placeId (que es igual al doc.id) y commentId.
   * @param {string} placeId - El placeId que corresponde al doc.id en Firestore.
   * @param {string} commentId - El commentId del comentario a eliminar.
   * @returns {Promise<void>}
   */
  deleteComentario: async (placeId, commentId) => {
    if (!placeId) {
      throw new Error("placeId es requerido");
    }

    if (!commentId) {
      throw new Error("commentId es requerido");
    }

    try {
      // Localizar el documento en la colección "estaciones"
      const estacionRef = db.collection("estaciones").doc(placeId);
      const estacionDoc = await estacionRef.get();

      if (!estacionDoc.exists) {
        throw new Error("No se encontró una estación con el placeId proporcionado");
      }

      const estacionData = estacionDoc.data();
      const comentarios = estacionData.comentarios || [];

      // Filtrar el array de comentarios para eliminar la entrada con el commentId
      const comentariosActualizados = comentarios.filter((comentario) => comentario.commentId !== commentId);

      // Actualizar el documento con el array de comentarios filtrado
      await estacionRef.update({
        comentarios: comentariosActualizados,
      });

      // Eliminar el comentario de la colección "comentarios"
      const comentarioRef = db.collection("comentarios").doc(commentId);
      await comentarioRef.delete();
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      throw new Error("Error al eliminar comentario");
    }
  },
};

export default estacionModel;
