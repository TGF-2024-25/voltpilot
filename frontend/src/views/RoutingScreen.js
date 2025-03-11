import React, { useState, useRef } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import MapView, {PROVIDER_DEFAULT} from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
// eslint-disable-next-line import/no-unresolved
import { GOOGLE_MAPS_API_KEY } from '@env';

export default function VistaRutas() {

  const [region, setRegion] = useState({
    latitude: 40.416775,
    longitude: -3.70379,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const mapRef = useRef(null);


  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
       <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Selecciona Destinos"
        onPress={(data, details = null) => {
          if (details) {
            const { lat, lng } = details.geometry.location;
            const newRegion = {
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            };

            setRegion(newRegion);

            mapRef.current?.animateToRegion(newRegion, 1500);
          }
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: "es",
        }}
        styles={{
          textInput: styles.textInput,
          listView: styles.listView, 
        }}
        />
      </View>
      <MapView 
        style={styles.map}
        ref={mapRef}
        region={region}
        provider={PROVIDER_DEFAULT}
        >  
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
  searchBar: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
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
})
