import axios from 'axios';
import polyline from '@mapbox/polyline';
import autonomiaModel from '../models/autonomiaModel.js';

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

    getAutonomia: async (req, res) => {
      try {
        const {uid} = req.query;

        if(!uid) 
          return res.status(400).json({error: 'No se ha proporcionado el uid del usuario'});

        const data = await autonomiaModel.findById(uid);

        if(!data)
          return res.status(404).json({ error: "No se ha encontrado la autonimia del usuario" });

        return res.status(200).json(data);
      } catch (error) {
        console.error('Error al obtener la autonomia en el servidor:', error);
        return res.status(500).json({ error: "Error en el servidor" });
      }
    },
    
    setAutonomia: async (req, res) => {
      try {
        const data = req.body;

        if(!data || !data.uid)
          return res.status(400).json({ error: "No se ha proporcionado la autonimia seleccionada" });

        await autonomiaModel.saveOrCreate(data);

        return res.status(200).json({ message: 'Autonomía guardada correctamente', data });
      } catch (error) {
        console.error('Error al guardar la autonomia en el servidor:', error);
        return res.status(500).json({ error: "Error en el servidor" });
      }
    }

};

export default rutaController;
