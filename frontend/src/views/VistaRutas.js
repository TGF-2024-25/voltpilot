/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, Modal, ScrollView } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";

import Favoritos from "../components/Favoritos.js";
import Autonomia from "../components/Autonomia.js";
import SearchBar from "../components/SearchBar.js";
import UserLocation from "../components/UserLocation.js";
import Preferencias from "../components/Preferencias.js";
import InformacionRuta from "../components/InformacionRuta.js";
import InstruccionesRuta from "../components/InstruccionesRuta.js";

import { routingAPI } from "../services/api.js";
import {
  formatConnectorType,
  centrarEnUbicacion,
  centrarEnDestino,
  addDestino,
  eliminarDestino,
  filtrar_estaciones,
  make_tramos,
  make_instrucciones,
  reducirRuta,
  addEstacionAsDestino,
} from "../utils/rutaUtils.js";

import styles from "../styles/routesStyle.js";
import stylesEstacion from "../styles/rutaEstacionStyle.js";

export default function VistaRutas() {
  const [origen, setOrigen] = UserLocation();
  const [destinos, setDestinos] = useState([]);
  const [modRuta, setModRuta] = useState(false);
  const [ruta, setRuta] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const autonomiaRef = useRef(null);
  const preferenciasRef = useRef();
  const yaParadoRef = useRef(false);
  const [infoRuta, setInfoRuta] = useState([]);
  const [instruccionesRuta, setInstruccionesRuta] = useState([]);

  const [modalEstacionVisible, setModalEstacionVisible] = useState(false);
  const [estConsultada, setEstConsultada] = useState(null);
  const [estSeleccionadas, setEstSeleccionadas] = useState([]);
  const [indiceTramoConEstacion, setIndiceTramoConEstacion] = useState(null);

  const mapRef = useRef(null);

  // Función principal que recalcula la ruta completa (con origen y todos los destinos intermedios)
  const fetchRoute = async () => {
    if (destinos.length === 0 || !destinos[0]) return;

    const autonomiaKm = autonomiaRef.current?.getAutonomia(); // Obtener autonomía en km
    const preferencias = preferenciasRef.current?.getPreferencias(); // Obtenemos las preferencias de Ruta

    try {
      let rutaCompleta = [];
      let tot_estaciones = [];
      let infoTramos = [];
      let instruccionesCompleta = [];

      // Calcular la ruta por tramos: origen -> destino1, destino1 -> destino2...
      let origenActual = origen;

      for (let i = 0; i < destinos.length; i++) {
        const destinoActual = destinos[i];
        if (!destinoActual) continue;

        const data = await routingAPI.getRoute(origenActual, destinoActual, preferencias);
        rutaCompleta = [...rutaCompleta, ...data.route];

        // Guardamos la Información de los Tramos
        const tramos = make_tramos(origenActual, destinoActual, data, estSeleccionadas, i);
        infoTramos.push(...tramos);

        // Procesamos las instrucciones de la ruta
        const instruccionesTramo = make_instrucciones(data.steps);
        instruccionesCompleta = [...instruccionesCompleta, ...instruccionesTramo];

        // Solo mostrar estaciones para el primer tramo de momento
        let ruta_reduced = data.route;
        if (data.distanciaKm > 300) ruta_reduced = reducirRuta(data.route, 10);

        // Evitar buscar estaciones si ya es una estación seleccionada
        const esEstacionSeleccionada = estSeleccionadas.some(
          (est) => est.latitude === destinoActual.latitude && est.longitude === destinoActual.longitude,
        );

        if (!esEstacionSeleccionada) {
          const res_estaciones = await routingAPI.getEstacionesRuta(ruta_reduced, autonomiaKm, data.distanciaKm);
          const filtradas = filtrar_estaciones(res_estaciones.estaciones);

          if (filtradas.length > 0) {
            tot_estaciones = filtradas;
            setIndiceTramoConEstacion(i);
            break; // Esperar selección
          }
        }

        origenActual = destinoActual;
      }

      setRuta(rutaCompleta);
      setInstruccionesRuta(instruccionesCompleta);
      setEstaciones(tot_estaciones);
      setInfoRuta(infoTramos);
      setModRuta(true);
    } catch (error) {
      console.log("ERROR : Error obtenido en la ruta: ", error);
    }
  };

  // Cuando el usuario selecciona una estación, se añade como nuevo destino y se recalcula la ruta
  const seleccionarEstacion = async (estacion) => {
    setEstSeleccionadas((prev) => [...prev, estacion]);
    setModalEstacionVisible(false);

    setDestinos((prev) => addEstacionAsDestino(prev, indiceTramoConEstacion, estacion));

    autonomiaRef.current?.resetAutonomia();
    yaParadoRef.current = true;
    setEstaciones([]); // Limpia las estaciones para evitar seguir viendolas tras selección
  };

  // Cada vez que el array de destinos cambia, se recalcula la ruta
  useEffect(() => {
    if (destinos.length > 0 && destinos[0]?.latitude && destinos[0]?.longitude) {
      fetchRoute(yaParadoRef.current);
    }
  }, [destinos]);

  // Si cambia el origen, se recalcula la ruta también
  useEffect(() => {
    if (modRuta && destinos.length > 0 && destinos[0]?.latitude && destinos[0]?.longitude) {
      fetchRoute(yaParadoRef.current);
    }
  }, [origen]);

  // Antes de seleccionar, permitimos consultar las 3 estaciones filtradas
  const consultarEstacion = (estacion) => {
    setEstConsultada(estacion);
    setModalEstacionVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {!modRuta ? (
          // Primer paso: seleccionar destino principal
          <SearchBar
            placeholder="Seleccione un destino"
            onSelect={(coords) => {
              centrarEnDestino(mapRef, coords);
              setDestinos([{ ...coords, name: coords.name || "Destino principal" }]);
            }}
          />
        ) : (
          // Una vez se empieza a modificar la ruta, se muestran todas las paradas
          <View>
            <SearchBar
              placeholder={origen?.name || "Ubicación actual"}
              initialValue={origen} // Esto hace editable el origen
              onSelect={(coords) => {
                centrarEnDestino(mapRef, coords);
                setOrigen({
                  ...coords,
                  name: coords.name || "Origen personalizado",
                  latitudeDelta: coords.latitudeDelta ?? 0.1,
                  longitudeDelta: coords.longitudeDelta ?? 0.1,
                });
              }}
            />

            {destinos.map((destino, index) => (
              <View key={index} style={styles.searchBarContainer}>
                <SearchBar
                  placeholder={destino?.name ? destino.name : `Parada ${index + 1}`}
                  initialValue={destino} // Esto hace editable la parada
                  onSelect={(coords) => {
                    centrarEnDestino(mapRef, coords);
                    const actualizados = [...destinos];
                    actualizados[index] = { ...coords, name: coords.name || `Parada ${index + 1}` };
                    setDestinos(actualizados);
                  }}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => eliminarDestino(setDestinos, destinos, index, setModRuta, yaParadoRef)}
                >
                  <Text style={styles.deleteText}>x</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Botón nuevos destinos */}
        {modRuta && (
          <TouchableOpacity style={styles.botonAgregar} onPress={() => addDestino(setDestinos, destinos)}>
            <Icon name="add-location-alt" size={26} color="#9b59b6" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.lowerLogos}>
        {/* Botón para componente Favoritos */}
        <Favoritos
          on_selected_destino={(favorito) => {
            const location = favorito.location;
            location.name = location.name || favorito.description || "Destino favorito";
            centrarEnDestino(mapRef, location);
            setDestinos((prevDestinos) => [...prevDestinos, location]);
            setModRuta(false);
          }}
        />

        {/* Botón para componente Autonomía */}
        <Autonomia ref={autonomiaRef} />

        {/* Botón para componente Preferencias */}
        <Preferencias ref={preferenciasRef} />

        {/* Botón para centrar la ubicación */}
        <TouchableOpacity style={styles.myLocationButton} onPress={() => centrarEnUbicacion(mapRef, origen)}>
          <Icon name="my-location" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Vista de los componentes del mapa y marcadores de elementos */}
      {origen && (
        <MapView
          style={styles.map}
          ref={mapRef}
          region={origen}
          provider={PROVIDER_DEFAULT}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/*<Marker coordinate={origen} pinColor="lightblue" />*/}

          {destinos.map((destino, id) => (destino ? <Marker key={id} coordinate={destino} pinColor="#65558F" /> : null))}

          {estaciones.map((estacion) => (
            <Marker
              key={estacion.id}
              coordinate={{
                latitude: estacion.latitude,
                longitude: estacion.longitude,
              }}
              pinColor="#76C2EA"
              onPress={() => consultarEstacion(estacion)} // Elegimos la Estación seleccionada como parada
            />
          ))}

          {ruta.length > 0 && modRuta && <Polyline coordinates={ruta} strokeWidth={5} strokeColor="#B093FD" />}
        </MapView>
      )}

      {/* Botón para componente que muestra las instrucciones conducción de la ruta */}
      {modRuta && <InstruccionesRuta instruccionesRuta={instruccionesRuta} />}

      {/* Botón con Desplegable para Información de la Ruta*/}
      {modRuta && <InformacionRuta infoRuta={infoRuta} />}

      {/* Modal Estacion Info */}
      {modalEstacionVisible && (
        <Modal transparent animationType="slide" visible={modalEstacionVisible} onRequestClose={() => setModalEstacionVisible(false)}>
          <View style={stylesEstacion.overlay}>
            <View style={stylesEstacion.modalContent}>
              <View style={stylesEstacion.header}>
                <Text style={stylesEstacion.title}>{estConsultada.name || "Sin nombre"}</Text>
              </View>

              <View style={stylesEstacion.infoWrapper}>
                <ScrollView contentContainerStyle={stylesEstacion.infoContainer} showsVerticalScrollIndicator={false}>
                  <Text style={stylesEstacion.infoText}>Distancia a ruta: {(estConsultada.distanceToRuta / 1000).toFixed(2)} km</Text>

                  {estConsultada.evChargeOptions ? (
                    <View style={stylesEstacion.evChargeInfo}>
                      <Text style={stylesEstacion.infoText}>Total de conectores: {estConsultada.evChargeOptions.connectorCount}</Text>

                      {estConsultada.evChargeOptions.connectorAggregation.map((connector, index) => (
                        <View key={index} style={stylesEstacion.connectorInfo}>
                          <Text style={stylesEstacion.infoText}>Tipo de conector: {formatConnectorType(connector.type)}</Text>
                          <Text style={stylesEstacion.infoText}>Tasa de carga máxima: {connector.maxChargeRateKw} kW</Text>
                          <Text style={stylesEstacion.infoText}>
                            Conectores disponibles: {connector.availableCount || connector.count} / {connector.count}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={stylesEstacion.infoText}>No hay opciones de carga disponibles.</Text>
                  )}
                </ScrollView>
              </View>

              <View style={stylesEstacion.buttonsContainer}>
                <TouchableOpacity onPress={() => setModalEstacionVisible(false)} style={stylesEstacion.backButton}>
                  <Text style={stylesEstacion.backButtonText}>Cerrar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => seleccionarEstacion(estConsultada)} style={stylesEstacion.selectButton}>
                  <Text style={stylesEstacion.selectButtonText}>Seleccionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
