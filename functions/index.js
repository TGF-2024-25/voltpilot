import express from "express";
import cors from "cors";
import { onRequest } from "firebase-functions/v2/https";
// import { defineSecret } from "firebase-functions/params";
// import pkg from "firebase-functions/v2";
// import * as admin from "firebase-admin";
// const { functions } = pkg;
// admin.initializeApp();

// Utiliza el Secret Manager para recupear la api key
// const GOOGLE_MAPS_API_KEY = defineSecret("GOOGLE_MAPS_API_KEY");

// Crea instancia de Express
const app = express();

// Para propósito de prueba, habilita llamadas desde cualquier origen
app.use(cors({ origin: true }));

// Configurar Express para manejar JSON
app.use(express.json());

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// Realiza una llamada para recuperar una foto de portada para la estacion
app.post("/getChargerPhoto", async (req, res) => {
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
});

// Recibe {latitud, longitud} y devuelve el JSON de las estaciones de cargas cercanas
app.post("/getChargers", async (req, res) => {
  const { latitude, longitude, radius } = req.body;
  // const apiKey = GOOGLE_MAPS_API_KEY.value();

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
    res.status(500).json({ error: "Error al obtener cargadores." });
  }
});

// Exportar la función para que Firebase la maneje y decirle que se utiliza un secreto
// export const api = onRequest({ secrets: [GOOGLE_MAPS_API_KEY] }, app);
export const api = onRequest(app);

