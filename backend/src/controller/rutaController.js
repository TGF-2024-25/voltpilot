import axios from 'axios';
import polyline from '@mapbox/polyline';

const rutaController = {

    // Función para obtener la ruta desde la API de Google
    getRoute: async (req, res) => {
        const { origen, destino } = req.body;  // Recibe los datos del origen y destino desde el frontend
    
        const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
    
        const body = {
        origin: {
            location: {
            latLng: {
                latitude: origen.latitude,
                longitude: origen.longitude,
            },
            },
        },
        destination: {
            location: {
            latLng: {
                latitude: destino.latitude,
                longitude: destino.longitude,
            },
            },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
        routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false,
        },
        languageCode: "es",
        units: "METRIC",
        };
    
        try {
        const response = await axios.post(url, body, {
            headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
            },
        });
    
        // Procesamos la respuesta de la API de Google para obtener los puntos de la polilínea
        if (response.data.routes && response.data.routes.length > 0) {
            const polylinePoints = polyline.decode(response.data.routes[0].polyline.encodedPolyline)
            .map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
    
            // Enviamos la respuesta con los puntos de la ruta
            res.json({ route: polylinePoints });
        } else {
            res.status(404).json({ message: "No se encontró una ruta válida" });
        }
        } catch (error) {
        console.error("Error en la obtención de la ruta:", error);
        res.status(500).json({ message: "Error al obtener la ruta" });
        }
    },

   /* getPlaces: async (req, res) => {
        const { query } = req.body;  // Recibe la consulta de búsqueda desde el frontend
      
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
      
        try {
          const response = await axios.get(url, {
            params: {
              query: query,
              key: GOOGLE_MAPS_API_KEY,
            },
          });
      
          if (response.data.results) {
            res.json({ places: response.data.results });
          } else {
            res.status(404).json({ message: "No se encontraron lugares" });
          }
        } catch (error) {
          console.error("Error en la obtención de lugares:", error);
          res.status(500).json({ message: "Error al obtener lugares" });
        }
    }*/

};

export default rutaController;
