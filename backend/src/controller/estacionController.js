import estacionModel from "../models/estacionModel.js";
import favoritosModel from "../models/favoritosModel.js";

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

const estacionController = {
  getCargadores: async (req, res) => {
    const { latitude, longitude, radius } = req.body;

    // Fetch de las estaciones de carga
    try {
      const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
        method: "POST",
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.displayName,places.location,places.evChargeOptions,places.internationalPhoneNumber,places.formattedAddress,places.currentOpeningHours,places.businessStatus,places.shortFormattedAddress,places.rating,places.websiteUri,places.googleMapsUri,places.userRatingCount,places.id,places.photos,places.reviews,places.regularOpeningHours,places.nationalPhoneNumber",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          includedTypes: ["electric_vehicle_charging_station"],
          maxResultCount: 20,
          locationRestriction: {
            circle: {
              center: {
                latitude: latitude,
                longitude: longitude,
              },
              radius: radius * 1000, // Convertir kilómetros a metros
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      }

      const data = await response.json();

      if (data?.places) {
        res.json(data.places);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Error al obtener cargadores." });
    }
  },

  getCargadorFotos: async (req, res) => {
    const { name } = req.body;

    // Construimos la URL de la foto
    const url = `https://places.googleapis.com/v1/${name}/media?maxHeightPx=500&maxWidthPx=500&skipHttpRedirect=true&key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {},
      });

      if (!response.ok) {
        throw new Error("Error fetching photo");
      }

      const data = await response.json();

      // Verifica si la respuesta contiene la URI de la foto
      if (!data.photoUri) {
        return res.status(404).json({ error: "Photo URI not found" });
      }

      return res.json({ photoUri: data.photoUri });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Error fetching photo" });
    }
  },

  getComentarios: async (req, res) => {
    const { placeId } = req.body;

    if (!placeId) {
      return res.status(400).json({ error: "placeId es requerido" });
    }

    try {
      const respuesta = await estacionModel.getComentariosByPlaceId(placeId);
      return res.json(respuesta || []); // Devuelve el primer documento y su array de comentarios
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      return res.status(500).json({ error: "Error al obtener comentarios de la base de datos" });
    }
  },

  createComentario: async (req, res) => {
    const { placeId, comentario } = req.body;

    if (!placeId) {
      return res.status(400).json({ error: "placeId es requerido" });
    }

    if (!comentario || !comentario.text || !comentario.rating) {
      return res.status(400).json({
        error: "El comentario debe tener text, timestamp y rating",
      });
    }

    comentario.timestamp = new Date().toISOString();
    comentario.userId = req.user.uid;

    try {
      await estacionModel.addComentario(placeId, comentario);
      return res.status(200).json({ message: "Comentario creado exitosamente" });
    } catch (error) {
      console.error("Error al crear comentario:", error);
      return res.status(500).json({ error: "Error al crear comentario" });
    }
  },

  // Eliminar comentario (DELETE)
  deleteComentario: async (req, res) => {
    const { placeId, commentId } = req.body;

    if (!placeId) {
      return res.status(400).json({ error: "placeId es requerido" });
    }

    if (!commentId) {
      return res.status(400).json({ error: "commentId es requerido" });
    }

    try {
      await estacionModel.deleteComentario(placeId, commentId);
      return res.status(200).json({ message: "Comentario eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      return res.status(500).json({ error: "Error al eliminar comentario" });
    }
  },

  getEstacionesFavoritas: async (req, res) => {
    const userId = req.user.uid;

    if (!userId) {
      return res.status(400).json({ error: "userId es requerido" });
    }

    try {
      const estacionesFavoritas = await favoritosModel.getEstacionesFavoritas(userId);
      return res.status(200).json(estacionesFavoritas);
    } catch (error) {
      console.error("Error al obtener estaciones favoritas:", error);
      return res.status(500).json({ error: "Error al obtener estaciones favoritas" });
    }
  },

  /**
   * Agrega una estación a la lista de favoritas de un usuario.
   */
  addEstacionFavorita: async (req, res) => {
    const { placeId } = req.body;
    const userId = req.user.uid;

    if (!userId) {
      return res.status(400).json({ error: "userId es requerido" });
    }

    if (!placeId) {
      return res.status(400).json({ error: "placeId es requerido" });
    }

    try {
      await favoritosModel.addEstacionFavorita(userId, placeId);
      return res.status(200).json({ message: "Estación agregada a favoritos exitosamente" });
    } catch (error) {
      console.error("Error al agregar estación favorita:", error);
      return res.status(500).json({ error: "Error al agregar estación favorita" });
    }
  },

  /**
   * Elimina una estación de la lista de favoritas de un usuario.
   */
  deleteEstacionFavorita: async (req, res) => {
    const { placeId } = req.body;
    const userId = req.user.uid;

    if (!userId) {
      return res.status(400).json({ error: "userId es requerido" });
    }

    if (!placeId) {
      return res.status(400).json({ error: "placeId es requerido" });
    }

    try {
      await favoritosModel.deleteEstacionFavorita(userId, placeId);
      return res.status(200).json({ message: "Estación eliminada de favoritos exitosamente" });
    } catch (error) {
      console.error("Error al eliminar estación favorita:", error);
      return res.status(500).json({ error: "Error al eliminar estación favorita" });
    }
  },

  /**
   * Recupera información detallada de un cargador específico.
   */
  getInfoCargador: async (req, res) => {
    const { placeId } = req.body; // Se espera que el placeId venga como parámetro de consulta

    if (!placeId) {
      return res.status(400).json({ error: "placeId es requerido" });
    }

    try {
      // Construimos la URL para obtener la información del cargador
      const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,displayName,location,evChargeOptions,internationalPhoneNumber,formattedAddress,currentOpeningHours,businessStatus,shortFormattedAddress,rating,websiteUri,googleMapsUri,userRatingCount,,photos,reviews,regularOpeningHours,nationalPhoneNumber&key=${apiKey}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {},
      });

      if (!response.ok) {
        throw new Error(`Error al obtener información del cargador: ${response.status}`);
      }

      const data = await response.json();

      // Verifica si la respuesta contiene los datos esperados
      if (!data) {
        return res.status(404).json({ error: "No se encontró información para el placeId proporcionado" });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error al obtener información del cargador:", error);
      return res.status(500).json({ error: "Error al obtener información del cargador" });
    }
  },
};

export default estacionController;
