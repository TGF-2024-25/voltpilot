import express from "express";
import cors from "cors";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
// import pkg from "firebase-functions/v2";
// import * as admin from "firebase-admin";
// const { functions } = pkg;
// admin.initializeApp();

// Utiliza el Secret Manager para recupear la api key
const GOOGLE_MAPS_API_KEY = defineSecret("GOOGLE_MAPS_API_KEY");

// Crea instancia de Express
const app = express();

// Para propósito de prueba, habilita llamadas desde cualquier origen
app.use(cors({ origin: true }));

// Configurar Express para manejar JSON
app.use(express.json());

// Recibe {latitud, longitud} y devuelve el JSON de las estaciones de cargas cercanas
app.post("/getChargers", async (req, res) => {
  const { latitude, longitude } = req.body;
  const apiKey = GOOGLE_MAPS_API_KEY.value();

  // Fetch de las estaciones de carga
  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.displayName,places.location,places.id,places.evChargeOptions",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          includedTypes: ["electric_vehicle_charging_station"],
          maxResultCount: 10,
          locationRestriction: {
            circle: {
              center: {
                latitude: latitude,
                longitude: longitude,
              },
              radius: 500,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const data = await response.json();

    if (data?.places) {
      const listaCargadores = data.places.map((cargador) => ({
        id: cargador.id,
        name: cargador.displayName?.text || "Desconocido",
        latitude: cargador.location.latitude,
        longitude: cargador.location.longitude,
      }));
      res.json(listaCargadores);
    } else {
      console.log("No se encontraron cargadores.");
      res.json([]);
    }
  } catch (error) {
    console.log("Error al obtener cargadores:", error);
    res.status(500).json({ error: "Error al obtener cargadores." });
  }
});

// Exportar la función para que Firebase la maneje y decirle que se utiliza un secreto
export const api = onRequest({ secrets: [GOOGLE_MAPS_API_KEY] }, app);
