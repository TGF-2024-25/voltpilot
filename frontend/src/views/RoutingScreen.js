/* eslint-disable import/no-unresolved */
import React, { useState, useRef } from "react";
import { View, TextInput, Button, TouchableOpacity } from "react-native";
import { StyleSheet} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "@env";
import * as Location from "expo-location";
import { Entypo } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import polyline from "@mapbox/polyline";
import Feather from "react-native-vector-icons/Feather";
import Favoritos from "../components/Favoritos";
import Autonomia from "../components/Autonomia";

export default function VistaRutas() {
  const [origen, setOrigen] = useState({
    latitude: 40.416775,
    longitude: -3.70379,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [destinos, setDestinos] = useState([]);
  const [modRuta, setModRuta] = useState(false);
  const [ruta, setRuta] = useState([]);

  const mapRef = useRef(null);

  React.useEffect(() => {
    getLocationPermission();
  }, []);

  async function getLocationPermission() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission Denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setOrigen({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
  }

  const addDestino = () => {
    setDestinos([...destinos, null]);
  };

  const fetchRoute = async () => {
    if (destinos.length === 0 || !destinos[0]) return;
    
    const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
    const body = {
      origin: {
        location: {
          latLng: {
            latitude: origen.latitude,
            longitude: origen.longitude,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destinos[0].latitude,
            longitude: destinos[0].longitude,
          },
        },
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false,
      },
      languageCode: "es",
      units: "METRIC",
    };

    try{
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if(data.routes && data.routes.length > 0) { 
        const polylinePoints = polyline.decode(data.routes[0].polyline.encodedPolyline).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
        setRuta(polylinePoints);
        setModRuta(true);
      }
    } catch (error) {
      console.log("ERROR : Error obtenido en la ruta: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {!modRuta ? (
          <GooglePlacesAutocomplete
            fetchDetails={true}
            placeholder="Selecciona Destinos"
            onPress={(data, details = null) => {
              if (details) {
                const { lat, lng } = details.geometry.location;
                setDestinos([{ latitude: lat, longitude: lng }]);
              }
            }}
            query={{ key: GOOGLE_MAPS_API_KEY, language: "es" }}
            styles={{ textInput: styles.textInput }}
          />
        ) : (
          <View>
            <TextInput
              style={styles.textInput}
              value="Ubicación actual"
              editable={false}
            />
            {destinos.map((_, index) => (
              <GooglePlacesAutocomplete
                key={index}
                fetchDetails={true}
                placeholder="Selecciona destino"
                onPress={(data, details = null) => {
                  if (details) {
                    const { lat, lng } = details.geometry.location;
                    const updatedDestinos = [...destinos];
                    updatedDestinos[index] = { latitude: lat, longitude: lng };
                    setDestinos(updatedDestinos);
                  }
                }}
                query={{ key: GOOGLE_MAPS_API_KEY, language: "es" }}
                styles={{ textInput: styles.textInput }}
              />
            ))}
          </View>
        )}

        <Menu>
          <MenuTrigger>
            <Entypo
              name="dots-three-vertical"
              size={24}
              color="darkpruple"
              style={styles.menuIcon}
            />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={addDestino} text="Agregar nuevo destino" />
            <MenuOption
              onSelect={() => alert("Opciones de ruta")}
              text="Tipo de Ruta"
            />
            <MenuOption
              onSelect={() => alert("Buscar en ruta")}
              text="Buscar En Ruta"
            />
          </MenuOptions>
        </Menu>
      </View>

      <View style={styles.floatingLogos}>
        <Favoritos />
        <Autonomia />
      </View>

      <MapView
        style={styles.map}
        ref={mapRef}
        region={origen}
        provider={PROVIDER_DEFAULT}
      >
        <Marker coordinate={origen} pinColor="lightblue" />
        {destinos.map(
          (destino, id) => destino && <Marker key={id} coordinate={destino} />
        )}

        {ruta.length > 0 && (
          <Polyline coordinates={ruta} strokeWidth={5} strokeColor="#ba66ff" />
        )}
      </MapView>

      <TouchableOpacity style={styles.floatingButton} onPress={fetchRoute}>
        <Button title="Cómo llegar" color="white" onPress={fetchRoute} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    flex: 1,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
  menuIcon: {
    marginLeft: 10,
  },
  floatingLogos: {
    position: "absolute",
    marginTop: 150,
    right: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
});
