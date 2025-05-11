import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Modal } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useCargador } from "../contexts/EstacionContext";
import { estacionAPI } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";
import "react-native-get-random-values";
import EstacionTabView from "./EstacionTabView";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialIcons"; // Importar íconos
import MarcadoresInfo from "./MarcadoresInfo";
import EstacionFiltro from "./EstacionFiltro";
import SearchBar from "../components/SearchBar";
import styles from "../styles/estacionInicioStyle";

// Ejecutar para probar Expo Go en móvil android por cable, y servidor back en local
// adb -s b3060cfe reverse tcp:5000 tcp:5000

// Definición de los tipos de conectores
const tipoConectores = [
  { id: "1", name: "EV_CONNECTOR_TYPE_TYPE_2" },
  { id: "2", name: "EV_CONNECTOR_TYPE_CHADEMO" },
  { id: "3", name: "EV_CONNECTOR_TYPE_TESLA" },
  { id: "4", name: "EV_CONNECTOR_TYPE_CCS_COMBO_2" },
];

// Componente principal
export default function VistaEstacionInicio() {
  // Variables de estado
  const [cargadores, setCargadores] = useState([]); // Estado para almacenar los cargadores obtenidos de la API
  const [cargadoresFiltrados, setCargadoresFiltrados] = useState([]); // Estado para almacenar los cargadores filtrados (mostrados en el mapa)
  const { estacionFavorita, setEstacionFavorita, setSelectedCargador } = useCargador(); // Hook personlizado para manejar el cargador seleccionado
  const [infoModalVisible, setInfoModalVisible] = useState(false); // Estado que determina la visibilidad del modal de información
  const [filterModalVisible, setFilterModalVisible] = useState(false); // Estado que determina la visibilidad del modal de filtros
  const [isBottomSheetActive, setIsBottomSheetActive] = useState(false); // Estado que determina si el BottomSheetModal está activo
  const [isInitialRegion, setIsInitialRegion] = useState(true); // Estado para rastrear si es la región inicial

  // Estado para almacenar la región a mostrar en el mapa
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

  useFocusEffect(
    React.useCallback(() => {
      if (estacionFavorita) {
        mapRef.current?.animateToRegion(
          {
            latitude: estacionFavorita.location.latitude,
            longitude: estacionFavorita.location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1500,
        );
        handleMarkerPress(estacionFavorita);
      }
    }, [estacionFavorita]),
  );

  // Solicita permisos para obtener ubicación del usuario al iniciar la aplicación
  useEffect(() => {
    const solicitarPermisos = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permiso de ubicación denegado");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      // Establece la región inicial del mapa a la ubicación actual del usuario
      const userRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(userRegion);
    };
    solicitarPermisos();
  }, []);

  // Actualiza los cargadores mostrados en el mapa cada vez que cambian los filtros
  useEffect(() => {
    if (!isInitialRegion && region !== null) {
      handleRegionChange(region);
    } else {
      setIsInitialRegion(false); // Marca que la región inicial ya fue procesada
    }
  }, [region, filtros]);

  /********************************************* Funciones *******************************************************/

  // Llamada API para obtener info de los cargadores de la zona
  const obtenerCargadores = async (lat, lng, rad) => {
    try {
      // Llamada a la API para obtener cargadores
      const data = await estacionAPI.getEstaciones({ latitude: lat, longitude: lng, radius: rad });

      // Actualiza el estado
      setCargadores(data);
      console.log("Cargadores actualizados!");
      return data;
    } catch (error) {
      console.error("Error función obtenerCargadores: ", error);
      return [];
    }
  };

  // Filtro de cargadores según los criterios seleccionados
  const filtrarCargadores = (cargadores) => {
    // Función para obtener el id del conector por su nombre
    const obtenerIdPorNombre = (name) => {
      const conector = tipoConectores.find((conector) => conector.name === name);
      return conector ? conector.id : null;
    };

    const cargadoresFiltrados = cargadores.filter((cargador) => {
      // Verificar las propiedades evChargeOptions y connectorAggregation
      if (!cargador.evChargeOptions || !cargador.evChargeOptions.connectorAggregation) {
        return false;
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

    // Actualiza el estado con los cargadores filtrados
    setCargadoresFiltrados(cargadoresFiltrados);
  };

  // Evento cuando se pulsa un marcador
  const handleMarkerPress = (cargador) => {
    // Estación seleccionada para mostrar en el modal
    setSelectedCargador(cargador);
    // Expande la pestaña al tocar un marcador
    bottomSheetModalRef.current?.present();
    // Cambia el estado al abrir el modal
    setIsBottomSheetActive(true);
  };

  // Actualiza los cargadores a mostrar en el mapa al cambiar la región
  const handleRegionChange = async (newRegion) => {
    console.log(newRegion);
    console.log("Filtros aplicados:", filtros);

    // Limpiar la estación favorita seleccionada
    setEstacionFavorita(null);

    // Actualiza la región del mapa
    mapRef.current?.animateToRegion(newRegion, 2000);

    // Obtén los cargadores y luego aplica los filtros
    const data = await obtenerCargadores(newRegion.latitude, newRegion.longitude, filtros.searchRadius);
    filtrarCargadores(data);
  };

  // Función que se invoca al pulsar el botón de ubicación
  const centrarEnUbicacion = async () => {
    const { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;

    // Limpiar la estación favorita seleccionada
    setEstacionFavorita(null);

    // Buscar cargadores en la ubicación del usuario
    handleRegionChange({ latitude, longitude });

    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      2000,
    );
  };

  // Obtiene el icono del cargador según su disponibilidad
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

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        {/* La vista del mapa */}
        <View>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={region}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            {/* Renderizar solo el marcador de la estación favorita si está presente */}
            {estacionFavorita ? (
              <Marker
                coordinate={{
                  latitude: estacionFavorita.location.latitude,
                  longitude: estacionFavorita.location.longitude,
                }}
                title={estacionFavorita.displayName.text}
                description={estacionFavorita.formattedAddress}
                icon={require("../assets/Marcador_5.png")} // Cambia el icono si es necesario
                onPress={() => handleMarkerPress(estacionFavorita)}
              />
            ) : (
              /* Renderizar los marcadores filtrados si no hay estación favorita */
              cargadoresFiltrados.map((cargador) => (
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
              ))
            )}
          </MapView>
        </View>

        {/* Botón personalizado para centrar la ubicación */}
        <TouchableOpacity style={styles.myLocationButton} onPress={centrarEnUbicacion}>
          <Icon name="my-location" size={24} color="white" />
        </TouchableOpacity>

        {/* Botón de filtro */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            if (!isBottomSheetActive) {
              setFilterModalVisible(true); // Abre el modal de filtros
            } else {
              bottomSheetModalRef.current?.dismiss(); // Cierra el BottomSheetModal
              setTimeout(() => {
                setFilterModalVisible(true);
              }, 300);
            }
          }}
        >
          <Icon name="filter-list" size={24} color="white" />
        </TouchableOpacity>

        {/* Botón de información */}
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => {
            if (!isBottomSheetActive) {
              setInfoModalVisible(true); // Abre el modal de filtros
            } else {
              bottomSheetModalRef.current?.dismiss(); // Cierra el BottomSheetModal
              setTimeout(() => {
                setInfoModalVisible(true);
              }, 300);
            }
          }}
        >
          <Icon name="info" size={24} color="white" />
        </TouchableOpacity>

        {/* Barra de búsqueda */}
        <View style={styles.searchBarContainer}>
          <SearchBar
            placeholder="Buscar en Mapas"
            onSelect={({ latitude, longitude, name }) => {
              const newRegion = {
                latitude,
                longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              };

              // Actualizar la región del mapa y obtener cargadores
              setRegion(newRegion);
              handleRegionChange(newRegion);
            }}
            showClearButton={true}
          />
        </View>

        {/* Modal inferior que aparece cuando se pulsa sobre marcador */}
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={["50%", "95%"]} // Ajusta los puntos que puede alcanzar el modal
            backgroundComponent={(props) => <BottomSheetBackground {...props} />}
            style={styles.bottomSheetModal}
            onDismiss={() => {
              setIsBottomSheetActive(false); // Actualiza el estado al cerrar el modal
            }}
          >
            <BottomSheetView style={styles.bottomTabContainer}>
              <View style={{ backgroundColor: "white" }}>
                <EstacionTabView></EstacionTabView>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>

        {/* Modal de información de marcadores */}
        <Modal visible={infoModalVisible} transparent={false} animationType="slide" onRequestClose={() => setInfoModalVisible(false)}>
          <MarcadoresInfo onClose={() => setInfoModalVisible(false)} />
        </Modal>

        {/* Modal de filtros */}
        <Modal visible={filterModalVisible} transparent={false} animationType="slide" onRequestClose={() => setFilterModalVisible(false)}>
          <EstacionFiltro
            onClose={() => setFilterModalVisible(false)}
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
