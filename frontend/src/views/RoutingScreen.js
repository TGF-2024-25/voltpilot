/* eslint-disable import/no-unresolved */
import React, { useState, useRef } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { Entypo } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Favoritos from "../components/Favoritos";
import Autonomia from "../components/Autonomia";
import SearchBar from "../components/SearchBar";
import UserLocation from "../components/UserLocation.js";
import styles from "../styles/routesStyle.js";
import { routingAPI  } from '../services/api.js';

export default function VistaRutas() {
  const [origen, setOrigen] = UserLocation();
  const [destinos, setDestinos] = useState([]);
  const [modRuta, setModRuta] = useState(false);
  const [ruta, setRuta] = useState([]);
  const [estaciones, setEstaciones] = useState([])
  const autonomiaRef = useRef(null);

  const mapRef = useRef(null);

  const addDestino = () => {
    setDestinos([...destinos, null]);
  };

  const filtrar_estaciones = (est) => {
    if (!Array.isArray(est)) return [];

    if (est.length <= 3) return est;

    const ordenadas = est.sort((a, b) => a.distanceToRuta - b.distanceToRuta);
    return ordenadas.slice(0, 3);
  };

  const fetchRoute = async () => {
    if (destinos.length === 0 || !destinos[0]) return;

    // Obtener la autonomía actual y pasarla a km
    const autonomiaKm = autonomiaRef.current?.getAutonomia();
    console.log("Autonomía actual:", autonomiaKm);
  
    try {
      const data = await routingAPI.getRoute(origen, destinos[0]);
      setRuta(data.route);
      setModRuta(true);

      console.log("Despues de ruta: ", data);

      const response_sinFiltrar = await routingAPI.getEstacionesRuta(data.route, autonomiaKm, data.distanciaKm);
      
      const filtradas = filtrar_estaciones(response_sinFiltrar.estaciones);
      console.log("🚀 Estaciones filtradas:", filtradas);
      
      setEstaciones(filtradas);
      
    } catch (error) {
      console.log("ERROR : Error obtenido en la ruta: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {!modRuta ? (
          <SearchBar
            placeholder="Seleccione un destino"
            onSelect={(coords) => setDestinos([coords])}
          />
        ) : (
          <View>
            <TextInput
              style={styles.textInput}
              value="Ubicación actual"
              editable={false}
            />
            {destinos.map((_, index) => (
              <SearchBar
                key={index}
                placeholder="Selecciona destino"
                onSelect={(coords) => {
                  const updated = [...destinos];
                  updated[index] = coords;
                  setDestinos(updated);
                }}
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
        <Autonomia ref={autonomiaRef} />
      </View>

      {origen && (
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

          {estaciones.map((estacion, id) => (
            <Marker
              key={estacion.place_id}
              coordinate={{
                latitude: estacion.latitude,
                longitude: estacion.longitude,
              }}
              pinColor="#9370DB"
            />

          ))}

          {ruta.length > 0 && (
            <Polyline
              coordinates={ruta}
              strokeWidth={5}
              strokeColor="#ba66ff"
            />
          )}
        </MapView>
      )}

      <TouchableOpacity style={styles.floatingButton} onPress={fetchRoute}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Cómo llegar</Text>
      </TouchableOpacity>
    </View>
  );
}
