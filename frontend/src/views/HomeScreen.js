import React, { useRef, useState, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { StyleSheet } from "react-native";
import { Callout } from "react-native-maps";
import { Text } from "react-native";
// import Constants from "expo-constants";
import "react-native-get-random-values";
import { GOOGLE_MAPS_API_KEY } from "@env";

// const apiBaseUrl =
//   Constants.expoConfig?.hostUri?.split(":").shift()?.concat(":5001") ??
//   "https://tu-api-en-produccion.com";

export default function VistaEstaiones() {
  const [region, setRegion] = useState({
    latitude: 40.416775,
    longitude: -3.70379,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [cargadores, setCargadores] = useState([]);
  const mapRef = useRef(null);

  // useEffect(() => {
  //   console.log("Cargadores actualizado:", cargadores);
  // }, [cargadores]);

  const obtenerCargadores = async (lat, lng) => {
    try {
      const response = await fetch(
        // 10.0.2.2 es la ip que Android Emulator accede como localhost el emulador de functions
        // Ejecutar si se accede desde dispositivo externo: adb -s b3060cfe reverse tcp:5001 tcp:5001
        `http://127.0.0.1:5001/voltpilot-410ae/us-central1/api/getChargers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: lat,
            longitude: lng,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la petición");
      }

      let data = await response.json();
      setCargadores(data);
    } catch (error) {
      console.error("Error al obtener cargadores:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <GooglePlacesAutocomplete
          fetchDetails={true}
          placeholder="Buscar en Mapas"
          onPress={(data, details = null) => {
            if (details) {
              const { lat, lng } = details.geometry.location;
              const newRegion = {
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              };
              // Actualizar estado de nuevo region
              setRegion(newRegion);

              // Recuperar estaciones de carga cercanas
              obtenerCargadores(newRegion.latitude, newRegion.longitude);

              // Actualizar mapa
              mapRef.current?.animateToRegion(newRegion, 1500);
            }
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: "es",
          }}
          styles={{
            textInput: {
              backgroundColor: "white",
              borderRadius: 25,
              paddingHorizontal: 15,
              fontSize: 16,
            },
            listView: {
              backgroundColor: "#FFF",
              borderRadius: 10,
              marginTop: 10,
            },
          }}
        />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        region={region}
      >
        {cargadores.map((cargador) => (
          <Marker
            key={cargador.id}
            coordinate={{
              latitude: cargador.location.latitude,
              longitude: cargador.location.longitude,
            }}
            title={cargador.displayName.text}
            icon={getIconCargador(cargador)}
            style={styles.markerImage}
          >
            {/* <Callout>
              <View>
                <Text>{cargador.id}</Text>
                <Text>{cargador.name}</Text>
                <Text>{cargador.latitude}</Text>
                <Text>{cargador.longitude}</Text>
              </View>
            </Callout> */}
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const getIconCargador = (cargador) => {
  if (!cargador.evChargeOptions) {
    return require("../assets/Marcador_4.png");
  }

  let availableCount = 0;

  // Obtiene el availableCount del primer cargador si tiene
  if (
    cargador.evChargeOptions.connectorAggregation[0]?.availableCount !==
    undefined
  ) {
    availableCount +=
      cargador.evChargeOptions.connectorAggregation[0].availableCount;
  }

  // Recorre el resto de los conectores
  for (
    let i = 1;
    i < cargador.evChargeOptions.connectorAggregation.length;
    i++
  ) {
    const currentConnector = cargador.evChargeOptions.connectorAggregation[i];
    if (currentConnector?.availableCount !== undefined) {
      availableCount += currentConnector.availableCount;
    }
  }

  // Si no se encontró ningún count disponible, retonar el marcador gris
  if (availableCount === 0) {
    return require("../assets/Marcador_3.png");
  }

  // Calcular la ratio de disponibilidad de los cargadores
  const availabilityRatio =
    availableCount / cargador.evChargeOptions.connectorCount;

  // Selecciona el icono basado en la disponibilidad
  if (availabilityRatio >= 0.5) {
    return require("../assets/Marcador_1.png");
  }
  if (availabilityRatio > 0) {
    return require("../assets/Marcador_2.png");
  }

  return require("../assets/Marcador_3.png");
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchBarContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  markerImage: {
    width: 35,
    height: 35,
  },
});
