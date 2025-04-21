import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Constants from "expo-constants";
import "react-native-get-random-values";
import { GOOGLE_MAPS_API_KEY } from "@env"; // Importar la clave de API de Google Maps
import { useCargador } from "../contexts/EstacionContext";
import EstacionTabView from "../components/EstacionTabView";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialIcons"; // Importar íconos
import MarcadoresInfo from "./MarcadoresInfo";
import EstacionFiltro from "./EstacionFiltro";

// Ejecutar para probar Expo Go en móvil android físico (No borrar)
// adb -s b3060cfe reverse tcp:5000 tcp:5000

// Constantes
const statusBarHeight = Constants.statusBarHeight;

// Definición de los tipos de conectores
const tipoConectores = [
  { id: "1", name: "EV_CONNECTOR_TYPE_TYPE_2" },
  { id: "2", name: "EV_CONNECTOR_TYPE_CHADEMO" },
  { id: "3", name: "EV_CONNECTOR_TYPE_TESLA" },
  { id: "4", name: "EV_CONNECTOR_TYPE_CCS_COMBO_2" },
];

// Función para obtener el id del conector por su nombre
const obtenerIdPorNombre = (name) => {
  const conector = tipoConectores.find((conector) => conector.name === name);
  return conector ? conector.id : null; // Devuelve el id si se encuentra, o null si no
};

// Componente principal
export default function VistaEstacionInicio() {
  // Variables de estado
  const [cargadores, setCargadores] = useState([]); // Estado para almacenar los cargadores obtenidos de la ultima búsqueda
  const [cargadoresFiltrados, setCargadoresFiltrados] = useState([]); // Estado para almacenar los cargadores filtrados
  const { setSelectedCargador } = useCargador(); // Hook para establecer el cargador seleccionado en el contexto
  const [infoModalVisible, setInfoModalVisible] = useState(false); // Estado que determina la visibilidad del modal de información
  const [filterModalVisible, setFilterModalVisible] = useState(false); // Estado que determina la visibilidad del modal de filtros

  // Estado para almacenar la región a mostrar del mapa
  const [region, setRegion] = useState({
    latitude: 40.416775,
    longitude: -3.70379,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  });

  // Estado para almacenar los filtros aplicados
  const [filtros, setFiltros] = useState({
    selectedConnectors: [],
    minKwh: 1,
    searchRadius: 1,
  });

  // Referencias
  const mapRef = useRef(null);
  const bottomSheetModalRef = useRef(null);

  // Se llama al entrar por primera vez para solicitar permisos de ubicación
  useEffect(() => {
    const solicitarPermisosYBuscar = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permiso de ubicación denegado");
        return;
      }

      // Obtener la ubicación actual del usuario
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      // Actualizar la región del mapa con la ubicación actual
      const nuevaRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(nuevaRegion);

      // Buscar cargadores en la ubicación actual
      await handleRegionChange(nuevaRegion);
    };

    solicitarPermisosYBuscar();
  }, []);

  // Llamada a endpoint de servidor Back para obtener info de los cargadores de la zona
  const obtenerCargadores = async (lat, lng, rad) => {
    try {
      const response = await fetch(`http://localhost:5000/api/estaciones/getCargadores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng, radius: rad }),
      });

      if (!response.ok) throw new Error("Error en la petición");

      const data = await response.json();
      setCargadores(data); // Actualiza el estado
      console.log("Cargadores actualizados!");
      return data; // Devuelve los datos
    } catch (error) {
      console.error("Error al obtener cargadores:", error);
      return [];
    }
  };

  // Se llama cada vez que se cambia la región del mapa
  const filtrarCargadores = (cargadores) => {
    const cargadoresFiltrados = cargadores.filter((cargador) => {
      // Verificar si evChargeOptions y connectorAggregation existen
      if (!cargador.evChargeOptions || !cargador.evChargeOptions.connectorAggregation) {
        return false; // Si no existen, el cargador no cumple los filtros
      }

      // Filtrar por conectores que cumplan ambos criterios: tipo y kWh mínimo
      const tieneConectorValido = cargador.evChargeOptions.connectorAggregation.some((conector) => {
        const idConector = obtenerIdPorNombre(conector.type); // Obtener el ID del conector

        // Verificar que el conector esté seleccionado y cumpla con el kWh mínimo
        const cumpleConectorSeleccionado =
          filtros.selectedConnectors.length === 0 || // Si no hay conectores seleccionados, no se filtra por este criterio
          (idConector && filtros.selectedConnectors.includes(idConector));

        const cumpleKwhMinimo =
          conector.maxChargeRateKw !== undefined && conector.maxChargeRateKw !== null && conector.maxChargeRateKw >= filtros.minKwh;

        // El conector debe cumplir ambos criterios
        return cumpleConectorSeleccionado && cumpleKwhMinimo;
      });

      // Devuelve true si al menos un conector cumple ambos filtros
      return tieneConectorValido;
    });

    setCargadoresFiltrados(cargadoresFiltrados); // Actualiza el estado con los cargadores filtrados
  };

  // Evento cuando se pulsa un marcador
  const handleMarkerPress = (cargador) => {
    // Estación carga seleccionada para mostrar en el modal
    setSelectedCargador(cargador);
    // Expande la pestaña al tocar un marcador
    bottomSheetModalRef.current?.present();
  };

  // Se llama cada vez que se hace una búsqueda
  const handleRegionChange = async (newRegion) => {
    console.log(newRegion);
    console.log("Filtros aplicados:", filtros);

    // Obtén los cargadores y luego aplica los filtros
    await obtenerCargadores(newRegion.latitude, newRegion.longitude, filtros.searchRadius);
    filtrarCargadores(cargadores);
    // console.log("Cargadores obtenidos:", cargadores);
  };

  // Función que se invoca al pulsar el botón de ubicación
  const centrarEnUbicacion = async () => {
    const { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;

    // Buscar cargadores en la ubicación del usuario
    handleRegionChange({ latitude, longitude });

    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000,
    );
  };

  // Función para obtener el icono del cargador según su disponibilidad
  const getIconCargador = (cargador) => {
    if (!cargador.evChargeOptions) {
      return require("../assets/Marcador_4.png");
    }

    let availableCount = 0;

    // Obtiene el availableCount del primer cargador si tiene
    if (cargador.evChargeOptions.connectorAggregation[0]?.availableCount !== undefined) {
      availableCount += cargador.evChargeOptions.connectorAggregation[0].availableCount;
    }

    // Recorre el resto de los conectores
    for (let i = 1; i < cargador.evChargeOptions.connectorAggregation.length; i++) {
      const currentConnector = cargador.evChargeOptions.connectorAggregation[i];
      if (currentConnector?.availableCount !== undefined) {
        availableCount += currentConnector.availableCount;
      }
    }

    // Si no se encontró ningún count disponible, retonar el marcador gris
    if (availableCount === 0) {
      return require("../assets/Marcador_3.png");
    }

    // Calcular la ratio de disponibilidad de los cargadores
    const availabilityRatio = availableCount / cargador.evChargeOptions.connectorCount;

    // Selecciona el icono basado en la disponibilidad
    if (availabilityRatio >= 0.5) {
      return require("../assets/Marcador_1.png");
    }
    if (availabilityRatio > 0) {
      return require("../assets/Marcador_2.png");
    }

    return require("../assets/Marcador_3.png");
  };

  useEffect(() => {
    // Aplica los filtros automáticamente cuando cambien
    handleRegionChange(region);
  }, [filtros]); // Se ejecuta cada vez que los filtros cambien

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        {/* La vista del mapa */}
        <View>
          <MapView ref={mapRef} style={styles.map} provider={PROVIDER_DEFAULT} initialRegion={region} showsUserLocation={true}>
            {cargadoresFiltrados.map((cargador) => (
              <Marker
                key={cargador.id}
                coordinate={{
                  latitude: cargador.location.latitude,
                  longitude: cargador.location.longitude,
                }}
                title={cargador.displayName.text}
                icon={getIconCargador(cargador)}
                onPress={() => handleMarkerPress(cargador)}
              />
            ))}
          </MapView>
        </View>

        {/* Botón personalizado para centrar la ubicación */}
        <TouchableOpacity style={styles.myLocationButton} onPress={centrarEnUbicacion}>
          <Icon name="my-location" size={24} color="white" />
        </TouchableOpacity>

        {/* Botón de filtro */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)} // Mostrar el modal de filtros
        >
          <Icon name="filter-list" size={24} color="white" />
        </TouchableOpacity>

        {/* Botón de información */}
        <TouchableOpacity style={styles.infoButton} onPress={() => setInfoModalVisible(true)}>
          <Icon name="info" size={24} color="white" />
        </TouchableOpacity>

        {/* Contenedor de la barra de búsqueda */}
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
                setRegion(newRegion); // Actualizar la región del mapa
                handleRegionChange(newRegion);

                // Actualizar la vista con la nueva región
                mapRef.current?.animateToRegion(newRegion, 2000);
              }
            }}
            query={{ key: GOOGLE_MAPS_API_KEY, language: "es" }}
            styles={styles.searchBarTextInput}
          />
        </View>

        {/* Modal inferior que aparece cuando se pulsa sobre marcador */}
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={["40%", "95%"]}
            backgroundComponent={(props) => <BottomSheetBackground {...props} />}
            style={styles.bottomSheetModal}
          >
            <BottomSheetView style={styles.bottomTabContainer}>
              <View style={{ backgroundColor: "white" }}>
                <EstacionTabView></EstacionTabView>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>

        {/* Modal de información */}
        <Modal
          visible={infoModalVisible}
          transparent={false} // El modal ocupará toda la pantalla
          animationType="slide" // Animación para que aparezca desde la derecha
          onRequestClose={() => setInfoModalVisible(false)} // Cerrar el modal al pulsar fuera
        >
          <MarcadoresInfo
            onClose={() => setInfoModalVisible(false)} // Pasar una función para cerrar el modal
          />
        </Modal>

        {/* Modal de filtros */}
        <Modal visible={filterModalVisible} transparent={false} animationType="slide" onRequestClose={() => setFilterModalVisible(false)}>
          <EstacionFiltro
            onClose={() => setFilterModalVisible(false)} // Cerrar el modal
            onApplyFilters={(filters) => {
              setFiltros(filters); // Actualiza los filtros en el estado del componente padre
            }}
            initialFilters={filtros} // Pasa los valores iniciales de los filtros
          />
        </Modal>
      </GestureHandlerRootView>
    </View>
  );
}

// Asi se tiene que aplicar el estilo al BottomSheetModal
const BottomSheetBackground = ({ style }) => {
  return (
    <View
      style={[
        {
          backgroundColor: "#f8f9fa", // Fondo gris claro
          borderRadius: 15,
        },
        { ...style },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  // Estilos del contenedor principal y mapa
  container: { flex: 1, backgroundColor: "#fff" },
  map: { width: "100%", height: "100%" },
  // Estilos de la barra de busqueda
  searchBarTextInput: {
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
  },
  searchBarContainer: {
    position: "absolute",
    marginTop: statusBarHeight + 15,
    left: 10,
    right: 10,
  },
  // Estilos de bottomTab
  bottomTabContainer: {
    flex: 1,
    alignItems: "center",
  },
  bottomSheetModal: {
    zIndex: 10, // Asegura que el modal esté por encima de otros elementos
    position: "absolute", // Superpone el modal
  },
  myLocationButton: {
    position: "absolute",
    bottom: 70, // Ajustar para que no se superponga al modal
    right: 20, // Mantenerlo en la esquina derecha
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
  filterButton: {
    position: "absolute",
    marginTop: statusBarHeight + 160,
    right: 20, // Mantenerlo en la esquina derecha
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
  infoButton: {
    position: "absolute",
    marginTop: statusBarHeight + 100,
    right: 20, // Mantenerlo en la esquina derecha
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  legendIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#65558F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    backgroundColor: "#65558F",
    padding: 15,
    alignItems: "center",
  },
  modalHeaderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
});
