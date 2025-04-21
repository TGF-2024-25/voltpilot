import React, { useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, View, Image } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import VistaEstacionConectores from "../views/EstacionConectores";
import VistaEstacionInfo from "../views/EstacionInfo";
import VistaEstacionComentarios from "../views/EstacionComentarios";
import VistaEstacionFotos from "../views/EstacionFotos";
import { useCargador } from "../contexts/EstacionContext";
import Icon from "react-native-vector-icons/FontAwesome";

const renderScene = SceneMap({
  first: VistaEstacionConectores,
  second: VistaEstacionInfo,
  third: VistaEstacionComentarios,
  fourth: VistaEstacionFotos,
});

const renderTabBar = (props) => (
  <TabBar {...props} style={styles.tabBar} indicatorStyle={styles.tabIndicator} tabStyle={styles.tabLabel} scrollEnabled={true} />
);

const EstacionTabView = () => {
  const [index, setIndex] = useState(0);
  const [fotoUrl, setFotoUrl] = useState(null);
  const [routes] = useState([
    { key: "first", title: "Conectores" },
    { key: "second", title: "Información" },
    { key: "third", title: "Reseñas" },
    { key: "fourth", title: "Fotos" },
  ]);
  const { selectedCargador } = useCargador();

  // Se llama cada vez que se selecciona una estacion
  useEffect(() => {
    const obtenerImagenEstacion = async (name) => {
      try {
        const response = await fetch(`http://localhost:5000/api/estaciones/getCargadorFotos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name }),
        });

        if (!response.ok) throw new Error("Error en la petición");

        const data = await response.json();
        setFotoUrl(data.photoUri); // Asignar la URL de la foto a estado
      } catch (error) {
        console.error("Error al obtener imagen de la estacion:", error);
      }
    };

    if (!selectedCargador?.photos?.[0]?.name) {
      setFotoUrl(null); // Limpiar la URL si no hay fotos válidas
      return;
    }

    obtenerImagenEstacion(selectedCargador.photos[0].name);
  }, [selectedCargador]);

  return (
    <View>
      {/* Contenedor de la imagen */}
      {fotoUrl && (
        <View style={styles.superiorTab}>
          <Image
            source={{ uri: fotoUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover" // Ajusta la imagen para que se vea completa sin recortes
          />
        </View>
      )}

      {/* Contenedor blanco debajo de la imagen */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text
            style={[styles.infoText, { maxWidth: "60%" }]} // Limita el ancho al 70%
            numberOfLines={2} // Permite un máximo de 2 líneas
            ellipsizeMode="tail" // Trunca el texto con "..." si excede las 2 líneas
          >
            {selectedCargador.displayName.text}
          </Text>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  selectedCargador.currentOpeningHours?.openNow === true || selectedCargador.regularOpeningHours?.openNow === true
                    ? "green"
                    : selectedCargador.currentOpeningHours?.openNow === false || selectedCargador.regularOpeningHours?.openNow === false
                      ? "red"
                      : "#888", // Color gris oscuro para "Sin información"
              },
            ]}
          >
            {selectedCargador.currentOpeningHours?.openNow === true || selectedCargador.regularOpeningHours?.openNow === true
              ? "Abierto"
              : selectedCargador.currentOpeningHours?.openNow === false || selectedCargador.regularOpeningHours?.openNow === false
                ? "Cerrado"
                : "Sin información"}
          </Text>
        </View>

        {/* Contenedor para la valoración, estrella y número de valoraciones */}
        {selectedCargador.rating && (
          <View style={styles.ratingRow}>
            <Text style={styles.infoText}>{selectedCargador.rating}</Text>
            <Icon name="star" size={16} color="#65558F" style={styles.ratingIcon} />
            <Text style={styles.userRatingCount}>({selectedCargador.userRatingCount})</Text>
          </View>
        )}
      </View>

      {/* TabView */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={renderTabBar} // Usar la barra de pestañas personalizada
      />
    </View>
  );
};

const styles = StyleSheet.create({
  superiorTab: {
    width: "100%", // Ocupa todo el ancho del contenedor
    height: 200, // Altura fija
    backgroundColor: "#f0f0f0", // Color de fondo opcional
    justifyContent: "center", // Centrar contenido verticalmente
    alignItems: "center", // Centrar contenido horizontalmente
  },
  infoContainer: {
    width: "100%", // Ocupa todo el ancho del contenedor
    backgroundColor: "#f8f9fa", // Fondo blanco
    paddingVertical: 10, // Espaciado uniforme arriba y abajo
    paddingHorizontal: 10, // Espaciado interno a los lados
    borderBottomWidth: 1, // Línea inferior opcional
    borderBottomColor: "#ccc", // Color de la línea inferior
    justifyContent: "center", // Centrar contenido verticalmente
  },
  infoRow: {
    flexDirection: "row", // Alinea los elementos horizontalmente
    justifyContent: "space-between", // Espacia el título y el estado
    alignItems: "center", // Alinea verticalmente los elementos
  },
  ratingRow: {
    flexDirection: "row", // Alinea la estrella, valoración y número de valoraciones horizontalmente
    alignItems: "center", // Centra verticalmente los elementos
    marginTop: 10, // Espaciado superior para separar del displayName
  },
  ratingIcon: {
    marginLeft: 5, // Espaciado entre la valoración y la estrella
  },
  userRatingCount: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5, // Espaciado entre la estrella y el número de valoraciones
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Color del texto
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tabBar: {
    backgroundColor: "#65558F",
    elevation: 5,
    height: 50,
  },
  tabIndicator: {
    backgroundColor: "white",
  },
  tabLabel: {
    fontWeight: "bold",
    fontSize: 9,
  },
});

export default EstacionTabView;
