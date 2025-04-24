import axios from 'axios';
import polyline from '@mapbox/polyline';
import haversine from 'haversine-distance';
import autonomiaModel from '../models/autonomiaModel.js';
import preferenciasRutaModel from '../models/preferenciasRutaModel.js';
import FavoritosRutaModel from '../models/favoritosRutaModel.js';

const rutaController = {

    // Función para obtener la ruta desde la API de Google
    getRoute: async (req, res) => {
        const { origen, destino, preferencias } = req.body;  // Recibe los datos del origen y destino desde el frontend
            
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
          routingPreference: preferencias?.traffic ? "TRAFFIC_AWARE" : "TRAFFIC_UNAWARE",
          computeAlternativeRoutes: false,
          routeModifiers: {
            avoidTolls: preferencias?.peajes ?? false,
            avoidHighways: preferencias?.autopista ?? false,
            avoidFerries: preferencias?.ferry ?? false,
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
          const routeData = response.data.routes[0];

          const polylinePoints = polyline.decode(routeData.polyline.encodedPolyline).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
          
          const distanciaKm = routeData.distanceMeters / 1000;
          const duration = routeData.duration;
          
          res.json({ route: polylinePoints, distanciaKm, duration });

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
        const {uid} = req.params;

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
    }, 

    getPreferencias: async (req, res) => {
      try {
        const { uid } = req.params;
    
        if (!uid)
          return res.status(400).json({ error: "No se ha proporcionado el uid del usuario" });
    
        const data = await preferenciasRutaModel.findById(uid);
    
        if (!data)
          return res.status(404).json({ error: "No se han encontrado las preferencias del usuario" });
    
        return res.status(200).json(data);
      } catch (error) {
        console.error("Error al obtener las preferencias en el servidor:", error);
        return res.status(500).json({ error: "Error en el servidor" });
      }
    },

    setPreferencias: async (req, res) => {
      try {
        const data = req.body;
    
        if (!data || !data.uid)
          return res.status(400).json({ error: "No se han proporcionado las preferencias del usuario" });
    
        await preferenciasRutaModel.saveOrCreate(data);
    
        return res.status(200).json({ message: "Preferencias guardadas correctamente", data });
      } catch (error) {
        console.error("Error al guardar las preferencias en el servidor:", error);
        return res.status(500).json({ error: "Error en el servidor" });
      }
    },

    getFavoritos: async (req, res) => {
      try {
        const { uid } = req.params;
  
        if (!uid) {
          return res.status(400).json({ message: "No se ha proporcionado el uid del usuario" });
        }
  
        const data = await FavoritosRutaModel.getAllById(uid);
  
        return res.status(200).json(data);
      } catch (error) {
        console.error('Error en getFavoritos (controller):', error);
        return res.status(500).json({ error: "Error en el servidor" });
      }
    },

    setFavorito: async (req, res) => {
      try {
        const data = req.body;
  
        if (!data || !data.uid) {
          return res.status(400).json({ message: "No se ha proporcionado un favorito del usuario" });
        }
  
        await FavoritosRutaModel.add(data);
  
        return res.status(200).json({  message: "Favoritos guardados correctamente", data  });
      } catch (error) {
        console.error('Error en setFavorito (controller):', error);
        return res.status(500).json({ message: "Error en el servidor" });
      }
    },

    deleteFavorito: async (req, res) => {
      try {
        const data = req.body;
    
        if (!data || !data.uid) {
          return res.status(400).json({ message: "No se ha proporcionado el uid del usuario" });
        }
    
        await FavoritosRutaModel.remove(data);
    
        return res.status(200).json({ message: "Favorito eliminado correctamente" });
      } catch (error) {
        console.error('Error en deleteFavorito (controller):', error);
        return res.status(500).json({ message: "Error al eliminar el favorito" });
      }
    },

    getEstacionesRuta: async (req, res) => {
      const { ruta, autonomia, distancia } = req.body;

      // Variables de configuración segun distancia total del viaje

      let safety; // Km por encima de la minimaKm para empezar a buscar estacion carga
      let searchPoints; // Cantidad de puntos a buscar en la ruta (llamar a la API de Google Places)
      let searchRadius; // Radio de búsqueda en metros
      let pointGap; // Cantidad de puntos que dejo entre una llamada y otra

      if (distancia <= 15) {
        safety = 3;
        searchPoints = 3;
        searchRadius = 1000;
        pointGap = 3;
      } else if (distancia <= 50) {
        safety = 7;
        searchPoints = 7;
        searchRadius = 2500;
        pointGap = 10;
      } else if (distancia <= 120) {
        safety = 15;
        searchPoints = 10;
        searchRadius = 3000;
        pointGap = 30;
      } else {
        safety = 20;
        searchPoints = 15;
        searchRadius = 3500;
        pointGap = 50;
      }

      const recorrible = autonomia.inicialKm - autonomia.minimaKm + safety; // Distancia que puedo recorrer antes de recargar

      console.log('Datos necesarios. Distancia: ', distancia, '  recorrible: ', recorrible, '  autonomia: ', autonomia);

      // No necesita recargar
      if (distancia <= recorrible) {
        return res.json({ estaciones: [] });
      }

      let sum_distancia = 0; // Distancia acumulada recorrida
      const estaciones = [];
      const coordenadasConsultadas = new Set();

      // Recorremos la ruta
      for (let i = 1; i < ruta.length; i++) {
        const puntoA = ruta[i - 1];
        const puntoB = ruta[i];

        const tramo_distancia = haversine(puntoA, puntoB) / 1000; // metros a km
        sum_distancia += tramo_distancia;

        if (sum_distancia >= recorrible) {  // Empezamos a busxar estaciones de carga

          console.log("Buscando estaciones de carga...");

          for (let k = 0; k < searchPoints; k++) {
            const j = i + k * pointGap;

            if (j >= ruta.length) break;

            const { latitude, longitude } = ruta[j];
            const clave = `${latitude.toFixed(4)}_${longitude.toFixed(4)}`;   // Agrupamos las coordenadas para no hacer consultas prácticamente iguales
            if (coordenadasConsultadas.has(clave)) continue;        // Saltamos al proximo ciclo si esa clave ya esta consultada... minimizando llamadas a API

            coordenadasConsultadas.add(clave);

            try {
              const url = `https://places.googleapis.com/v1/places:searchNearby`;

              const response = await axios.post(
                url,
                { includedTypes: ["electric_vehicle_charging_station"], maxResultCount: 5, openNow: true, locationRestriction: { circle: { center: { latitude, longitude }, radius: searchRadius } } },
                { headers: { 
                  "Content-Type": "application/json", 
                  "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY, 
                  "X-Goog-FieldMask": 
                    "places.displayName,places.location,places.businessStatus,places.id,places.formattedAddress,places.evChargeOptions"
                   } 
                }
              );
    
              const resultados = response.data.places || [];

              resultados.forEach((estacion) => {
                // Calcular la distancia desde la estación hasta el punto de la ruta
                const estacionLat = estacion.location.latitude;
                const estacionLng = estacion.location.longitude
            
                const distanceToRuta = haversine({ latitude: estacionLat, longitude: estacionLng }, { latitude, longitude });

                // Evitar agregar estaciones duplicadas
                if (!estaciones.find((e) => e.id === estacion.id)) {
                  estaciones.push({
                    id: estacion.id,
                    name: estacion.displayName?.text || "Sin nombre",
                    distanceToRuta,
                    latitude: estacionLat,
                    longitude: estacionLng,
                    address: estacion.formattedAddress || "",
                    business_status: estacion.businessStatus || null,
                    evChargeOptions: estacion.evChargeOptions || null
                  });
                }
              });
            } catch (err) {
              console.error("Error consultando Google Places API (New)", err.message);
            }
          }

          break;
        }
      }
      return res.json({ estaciones });
    }

};

export default rutaController;

