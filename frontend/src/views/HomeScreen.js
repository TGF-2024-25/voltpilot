import React, { useState } from "react";
import { View } from "react-native";
import "react-native-get-random-values";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { StyleSheet } from "react-native";
import { GOOGLE_MAPS_API_KEY } from "@env";

export default function VistaEstaciones() {
  const [region, setRegion] = useState({
    latitude: 40.416775, // Latitud de Madrid
    longitude: -3.70379, // Longitud de Madrid
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [direccion, setDireccion] = useState("");

  return (
    <View>
      <View style={styles.searchBarContainer}>
        <GooglePlacesAutocomplete
          fetchDetails={true}
          placeholder="Buscar en Mapas"
          onPress={(data, details = null) => {
            if (details) {
              const { lat, lng } = details.geometry.location;
              setRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              });
              console.log(region.latitude, region.longitude);
              setDireccion(data.description);
            } else {
              console.log("Detalles no disponibles");
            }
          }}
          onFail={(error) => {
            console.log(error);
          }}
          onError={(error) => {
            console.log(error);
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: "es", // Idioma de las sugerencias
          }}
          componentRestriction={{ country: "es" }}
          region={{}}
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
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        showsUserLocation
        showsUserLocationButton
        Region={region}
      ></MapView>
      <Marker coordinate={region} />
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
