import React, { useRef, useState } from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { StyleSheet } from "react-native";
import { Callout } from "react-native-maps";
import { Text } from "react-native";
import "react-native-get-random-values";
// eslint-disable-next-line import/no-unresolved
import { GOOGLE_MAPS_API_KEY } from "@env";

export default function VistaEstaciones() {
  const [region, setRegion] = useState({
    latitude: 40.416775,
    longitude: -3.70379,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [cargadores, setCargadores] = useState([]);
  const mapRef = useRef(null);

  const fetchEVChargers = async (lat, lng) => {
    try {
      const response = await fetch(
        "https://places.googleapis.com/v1/places:searchNearby",
        {
          method: "POST",
          headers: {
            "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask": "places.displayName,places.location,places.id",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            includedTypes: ["electric_vehicle_charging_station"],
            maxResultCount: 10,
            locationRestriction: {
              circle: {
                center: {
                  latitude: lat,
                  longitude: lng,
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
      console.log(data.places);

      if (data?.places) {
        const listaCargadores = data.places.map((cargador) => ({
          id: cargador.id,
          name: cargador.displayName?.text || "Desconocido",
          latitude: cargador.location.latitude,
          longitude: cargador.location.longitude,
        }));
        console.log(listaCargadores);
        setCargadores(listaCargadores);
      } else {
        console.log("No se encontraron cargadores.");
        setCargadores([]);
      }
    } catch (error) {
      console.log("Error al obtener cargadores:", error);
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
              fetchEVChargers(newRegion.latitude, newRegion.longitude);

              // Actualizar mapa
              mapRef.current?.animateToRegion(newRegion, 2000);
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
              latitude: cargador.latitude,
              longitude: cargador.longitude,
            }}
            pinColor="purple"
          >
            <Callout>
              <View>
                <Text>{cargador.id}</Text>
                <Text>{cargador.name}</Text>
                <Text>{cargador.latitude}</Text>
                <Text>{cargador.longitude}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

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
});
