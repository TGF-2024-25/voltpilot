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
import { routingAPI } from '../services/api.js';

export default function VistaRutas() {
  const [origen, setOrigen] = UserLocation();
  const [destinos, setDestinos] = useState([]);
  const [modRuta, setModRuta] = useState(false);
  const [ruta, setRuta] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const autonomiaRef = useRef(null);

  const mapRef = useRef(null);

  // Añadir un nuevo destino vacío (cuando se presiona "Agregar nuevo destino")
  const addDestino = () => {
    setDestinos([...destinos, null]);
  };

  // Filtrar estaciones para devolver solo las 3 más cercanas a la ruta
  const filtrar_estaciones = (est) => {
    if (!Array.isArray(est)) return [];

    if (est.length <= 3) return est;

    const ordenadas = est.sort((a, b) => a.distanceToRuta - b.distanceToRuta);
    return ordenadas.slice(0, 3);
  };

  // Función principal que recalcula la ruta completa (con origen y todos los destinos intermedios)
  const fetchRoute = async () => {
    if (destinos.length === 0 || !destinos[0]) return;

    const autonomiaKm = autonomiaRef.current?.getAutonomia(); // Obtener autonomía en km

    try {
      let rutaCompleta = [];
      let estacionesTotales = [];

      // Calcular la ruta por tramos: origen -> destino1, destino1 -> destino2...
      let puntoInicio = origen;

      for (let i = 0; i < destinos.length; i++) {
        const destinoActual = destinos[i];
        if (!destinoActual) continue;

        const data = await routingAPI.getRoute(puntoInicio, destinoActual);
        rutaCompleta = [...rutaCompleta, ...data.route];

        // Solo mostrar estaciones para el primer tramo de momento
        if (i === 0) {
          const estacionesResp = await routingAPI.getEstacionesRuta(data.route, autonomiaKm, data.distanciaKm);
          const filtradas = filtrar_estaciones(estacionesResp.estaciones);
          estacionesTotales = filtradas;
        }

        puntoInicio = destinoActual;
      }

      setRuta(rutaCompleta);
      setEstaciones(estacionesTotales);
      setModRuta(true);

    } catch (error) {
      console.log("ERROR : Error obtenido en la ruta: ", error);
    }
  };

  // Cuando el usuario selecciona una estación, se añade como nuevo destino y se recalcula la ruta
  const seleccionarEstacion = async (estacion) => {
    const coords = {
      latitude: estacion.latitude,
      longitude: estacion.longitude,
      name: estacion.name || "Estacion sin nombre",
    };

    setDestinos((prev) => [...prev, coords]); // Añadir a la lista de destinos
    setEstaciones([]); // Vaciar estaciones para evitar solapamientos visuales
    setModRuta(true);

    await fetchRoute(); // Recalcular ruta con nueva parada
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {!modRuta ? (
          // Primer paso: seleccionar destino principal
          <SearchBar
            placeholder="Seleccione un destino"
            onSelect={(coords) => setDestinos([coords])}
          />
        ) : (
          // Una vez se empieza a modificar la ruta, se muestran todas las paradas
          <View>
            <TextInput
              style={styles.textInput}
              value="Ubicación actual"
              editable={false}
            />
            {destinos.map((destino, index) => (
              <SearchBar
                key={index}
                placeholder={
                  destino?.name ? destino.name : `Parada ${index + 1}`
                }
                initialValue={destino} // Esto hace editable la parada
                onSelect={(coords) => {
                  const actualizados = [...destinos];
                  actualizados[index] = coords;
                  setDestinos(actualizados);
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

          {destinos.map((destino, id) =>
            destino ? <Marker key={id} coordinate={destino} /> : null
          )}

          {estaciones.map((estacion) => (
            <Marker
              key={estacion.place_id}
              coordinate={{
                latitude: estacion.latitude,
                longitude: estacion.longitude,
              }}
              pinColor="#9370DB"
              onPress={() => seleccionarEstacion(estacion)} // Elegimos la Estación seleccionada como parada
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
