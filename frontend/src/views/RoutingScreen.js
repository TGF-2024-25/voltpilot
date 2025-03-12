import React, { useState, useRef } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import MapView, {Marker, PROVIDER_DEFAULT} from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
// eslint-disable-next-line import/no-unresolved
import { GOOGLE_MAPS_API_KEY } from '@env';
//import { Button } from "react-native-web";
import * as Location from "expo-location"

export default function VistaRutas() {

  const [origen, setOrigen] = useState({                  // Constante para guardar la ubicación del usuario
    latitude: 40.416775,
    longitude: -3.70379,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [destinos, setDestinos] = useState([]);           // Constante para guardar todos los destinos posibles de la Ruta
  
  const mapRef = useRef(null);
  
  React.useEffect(() => {                                 // Solicitar permisos de ubicación al usuario al cargar la pantalla
    getLocationPermission();
  }, [])
  async function getLocationPermission() {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted') {
      alert('Permission Denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    }

    setOrigen(current);
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
       <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Selecciona Destinos"
        onPress={(data, details = null) => {
          if (details) {
            const { lat, lng } = details.geometry.location;
            const newDest = {
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            };
            // Metemos el nuevo destino en el array de destinos
            setDestinos([...destinos, newDest]); // Idea: ¿Maximo 3 --> Si se supera el máximo, borrar el más antiguo?

            mapRef.current?.animateToRegion(newDest, 1500);
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
        region={origen}
        provider={PROVIDER_DEFAULT}
        >  
      <Marker
          coordinate={origen}
          pinColor="lightblue"
        />
        {destinos.map((destino, id) => (
          <Marker
            key={id}
            coordinate={destino}
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
