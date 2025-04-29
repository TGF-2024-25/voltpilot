/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, Modal, ScrollView } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import Icon from 'react-native-vector-icons/MaterialIcons';

import Favoritos from "../components/Favoritos.js";
import Autonomia from "../components/Autonomia.js";
import SearchBar from "../components/SearchBar.js";
import UserLocation from "../components/UserLocation.js";
import Preferencias from "../components/Preferencias.js";
import InformacionRuta from "../components/InformacionRuta.js";

import styles from "../styles/routesStyle.js";
import stylesEstacion from "../styles/rutaEstacionStyle.js";
import { routingAPI } from '../services/api.js';

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

  const [modalEstacionVisible, setModalEstacionVisible] = useState(false);
  const [estConsultada, setEstConsultada] = useState(null);
  const [estSeleccionadas, setEstSeleccionadas] = useState([]);

  const mapRef = useRef(null);

  // Para formatear el tipo de conexión
  const formatConnectorType = (type) => {
    return type
      .replace("EV_CONNECTOR_TYPE_", "") // Eliminar el prefijo
      .replace(/_/g, " ") // Reemplazar guiones bajos por espacios
      .toLowerCase() // Convertir a minúsculas
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalizar cada palabra
  };

  // Función para centrar el mapa en la ubicación del usuario
  const centrarEnUbicacion = () => {
    if (mapRef.current && origen) {
      mapRef.current.animateToRegion(
        {
          latitude: origen.latitude,
          longitude: origen.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000,
      );
    }
  };

  // Funcion para centrar el mapa en destino seleccionado.
  const centrarEnDestino = ({ latitude, longitude }) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  // Añadir un nuevo destino vacío (cuando se presiona "Agregar nuevo destino")
  const addDestino = () => {
    setDestinos([...destinos, null]);
  };

  // Borrar Destino de la SearchBar
  const eliminarDestino = (index) => {
    const nuevosDestinos = destinos.filter((_, idx) => idx !== index);
    setDestinos(nuevosDestinos);

    // Si no hay destinos, quitamos polilinea y modo ruta
    if (nuevosDestinos.length === 0) setModRuta(false);
  };

  // Filtrar estaciones para devolver solo las 3 más cercanas a la ruta
  const filtrar_estaciones = (est) => {
    if (!Array.isArray(est)) return [];

    if (est.length <= 3) return est;

    const ordenadas = est.sort((a, b) => a.distanceToRuta - b.distanceToRuta);
    return ordenadas.slice(0, 3);
  };

  // Formar el tramo según sea estación de carga o destino
  const make_tramos = (origenActual, destinoActual, data, estSeleccionadas, index) => {
    const esEstacion = estSeleccionadas.some(
      (est) => Math.abs(est.latitude - destinoActual.latitude) < 0.0001 && Math.abs(est.longitude - destinoActual.longitude) < 0.0001,
    );

    const tramos = [];

    // Siempre añadimos el tramo de desplazamiento
    tramos.push({
      tipo: "normal",
      origen: origenActual.name || `Parada ${index}`,
      destino: destinoActual.name || `Parada ${index + 1}`,
      distancia: data.distanciaKm,
      duracion: data.duration,
    });

    // Si además es estación, añadimos el tramo de carga
    if (esEstacion) {
      tramos.push({
        tipo: "carga",
        estacion: destinoActual.name || `Estación ${index + 1}`,
        tiempoCarga: "20 min",
      });
    }

    return tramos;
  };

  // Función principal que recalcula la ruta completa (con origen y todos los destinos intermedios)
  const fetchRoute = async (yaParado = false) => {
    if (destinos.length === 0 || !destinos[0]) return;

    const autonomiaKm = autonomiaRef.current?.getAutonomia(); // Obtener autonomía en km
    const preferencias = preferenciasRef.current?.getPreferencias(); // Obtenemos las preferencias de Ruta

    try {
      let rutaCompleta = [];
      let tot_estaciones = [];
      let infoTramos = [];

      // Calcular la ruta por tramos: origen -> destino1, destino1 -> destino2...
      let origenActual = origen;
      let paradaRealizada = yaParado;

      for (let i = 0; i < destinos.length; i++) {
        const destinoActual = destinos[i];
        if (!destinoActual) continue;

        const data = await routingAPI.getRoute(origenActual, destinoActual, preferencias);
        rutaCompleta = [...rutaCompleta, ...data.route];

        // Guardamos la Información de los Tramos
        const tramos = make_tramos(origenActual, destinoActual, data, estSeleccionadas, i);
        infoTramos.push(...tramos);

        // Solo mostrar estaciones para el primer tramo de momento
        if (i === 0 && !paradaRealizada) {
          const res_estaciones = await routingAPI.getEstacionesRuta(data.route, autonomiaKm, data.distanciaKm);
          const filtradas = filtrar_estaciones(res_estaciones.estaciones);
          tot_estaciones = filtradas;
        }

        origenActual = destinoActual;
        paradaRealizada = true;
      }

      setRuta(rutaCompleta);
      setEstaciones(tot_estaciones);
      setInfoRuta(infoTramos);
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
      name: estacion.name || "Estación sin nombre",
    };

    setEstSeleccionadas((prev) => [...prev, estacion]);
    setModalEstacionVisible(false);

    setDestinos((prev) => {
      if (prev.length < 1) return [coords];
      const nuevosDestinos = [...prev];
      nuevosDestinos.splice(0, 0, coords); // Inserta justo después del origen
      return nuevosDestinos;
    });

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
    if (modRuta && destinos.length > 0 && destinos[0]?.latitude  && destinos[0]?.longitude) {
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
              centrarEnDestino(coords);
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
                centrarEnDestino(coords);
                setOrigen({ ...coords, name: coords.name || "Origen personalizado" });
              }}
            />

            {destinos.map((destino, index) => (
              <View key={index} style={styles.searchBarContainer}>
                <SearchBar
                  placeholder={destino?.name ? destino.name : `Parada ${index + 1}`}
                  initialValue={destino} // Esto hace editable la parada
                  onSelect={(coords) => {
                    centrarEnDestino(coords);
                    const actualizados = [...destinos];
                    actualizados[index] = { ...coords, name: coords.name || `Parada ${index + 1}` };
                    setDestinos(actualizados);
                  }}
                />
                <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarDestino(index)}>
                  <Text style={styles.deleteText}>x</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Botón nuevos destinos */}
        {modRuta && (
          <TouchableOpacity style={styles.botonAgregar} onPress={addDestino}>
            <Icon name="add-location-alt" size={26} color="#9b59b6" />
          </TouchableOpacity>
        )}
      </View>
      
      {/*}
      <View style={styles.upperLogos}>
        <Favoritos
          on_selected_destino={(favorito) => {
            const location = favorito.location;
            location.name = location.name || favorito.description || "Destino favorito";
            centrarEnDestino(location);
            setDestinos((prevDestinos) => [...prevDestinos, location]);
            setModRuta(false);
          }}
        />

        <Autonomia ref={autonomiaRef} />
      </View>
      */}

      <View style={styles.lowerLogos}>
        <Favoritos
          on_selected_destino={(favorito) => {
            const location = favorito.location;
            location.name = location.name || favorito.description || "Destino favorito";
            centrarEnDestino(location);
            setDestinos((prevDestinos) => [...prevDestinos, location]);
            setModRuta(false);
          }}
        />

        <Autonomia ref={autonomiaRef} />
        
        <Preferencias ref={preferenciasRef} />

        {/* Botón personalizado para centrar la ubicación */}
        <TouchableOpacity style={styles.myLocationButton} onPress={centrarEnUbicacion}>
          <Icon name="my-location" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {origen && (
        <MapView style={styles.map} ref={mapRef} region={origen} provider={PROVIDER_DEFAULT} showsUserLocation={true}>
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

          {ruta.length > 0 && modRuta && (<Polyline coordinates={ruta} strokeWidth={5} strokeColor="#B093FD" /> )}
        </MapView>
      )}

      {/* Botón que calcula la Ruta con uno o varios Destinos */}
      <TouchableOpacity style={styles.floatingButton} onPress={fetchRoute}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Cómo llegar</Text>
      </TouchableOpacity>

      {/* Botón con Desplegable para Información de la Ruta ¿Posible Componente aparte? */}
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
