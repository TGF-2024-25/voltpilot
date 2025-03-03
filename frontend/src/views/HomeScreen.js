import React, { useRef, useState } from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
import { StyleSheet } from "react-native";
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

  const fetchEVChargers = async (latitude, longitude) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=charging_station&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        const listaCargadores = data.results.map((cargador) => ({
          id: cargador.place_id,
          name: cargador.name,
          latitude: cargador.geometry.location.lat,
          longitude: cargador.geometry.location.lng,
        }));
        setCargadores(listaCargadores);
      }
    } catch (error) {
      console.error("Error al obtener estaciones de carga:", error);
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
              console.log(cargadores);

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
        <Marker coordinate={region} pinColor="purple"></Marker>
        {cargadores.map((cargador) => (
          <Marker
            key={cargador.id}
            coordinate={{
              latitude: cargador.latitude,
              longitude: cargador.longitude,
            }}
            title={cargador.name}
            pinColor="purple"
          />
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
