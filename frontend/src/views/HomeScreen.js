import React from "react";
import { useState } from "react";
import { View } from "react-native";
import "react-native-get-random-values";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import styles from "../styles/appStyle";

export default function VistaEstaciones() {
  const [origen, setOrigen] = useState({
    latitude: 40.416775, // Latitud de Madrid
    longitude: -3.70379, // Longitud de Madrid
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={origen}
      ></MapView>
      <View style={styles.searchBarContainer}>
        <GooglePlacesAutocomplete
          placeholder="Buscar en Mapas"
          onPress={(data, details = null) => {
            console.log(details);
            // const { lat, lng } = details.geometry.location;
            // setOrigen({
            //   latitude: lat,
            //   longitude: lng,
            //   latitudeDelta: 0.01,
            //   longitudeDelta: 0.01,
            // });
          }}
          query={{
            key: process.env.GOOGLE_MAPS_API_KEY,
            language: "es", // Idioma de las sugerencias
          }}
          styles={{
            textInputContainer: {
              backgroundColor: "transparent",
            },
            textInput: {
              backgroundColor: "#FFF",
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
        ></GooglePlacesAutocomplete>
      </View>
    </View>
  );
}
