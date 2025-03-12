import functions from "firebase-functions/v2";
import express from "express";
import cors from "cors";
// import { GOOGLE_MAPS_API_KEY } from "@env";
// import admin from "firebase-admin";

// // Por si luego se utiliza el FireStore o Auth
// admin.initializeApp();

// Crea instancia de Express
const app = express();

// Para propósito de prueba, habilita llamadas desde cualquier origen
app.use(cors({ origin: true }));

// Configurar Express para manejar JSON
app.use(express.json());

// Recibe {latitud, longitud} y devuelve el JSON de las estaciones de cargas cercanas
app.post("/getChargers", async (req, res) => {
  const { latitude, longitude } = req.body;

  // Fetch de las estaciones de carga
  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "X-Goog-Api-Key": "AIzaSyCOCit5fXDeoxDl3BjY30Y97BJtXUmvM7I",
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

// Exportar la función para que Firebase la maneje
export const api = functions.https.onRequest(app);
