import React, { useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useCargador } from "../contexts/EstacionContext";
import { estacionAPI } from "../services/api";
import VistaEstacionConectores from "./EstacionConectores";
import VistaEstacionInfo from "./EstacionInfo";
import VistaEstacionComentarios from "./EstacionComentarios";
import VistaEstacionFotos from "./EstacionFotos";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../styles/EstacionTabViewStyle";

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
  const [esFavorito, setEsFavorito] = useState(null); // Estado para saber si es favorito
  const [Comentarios, setComentarios] = useState([]); // Estado para almacenar los comentarios de la base de datos

  const [routes] = useState([
    { key: "first", title: "Conectores" },
    { key: "second", title: "Información" },
    { key: "third", title: "Reseñas" },
    { key: "fourth", title: "Fotos" },
  ]);
  const { selectedCargador } = useCargador();

  useEffect(() => {
    // Función para obtener comentarios de la base de datos
    const getComentarios = async () => {
      try {
        const data = await estacionAPI.getEstacionComentarios({ placeId: selectedCargador.id });
        setComentarios(data); // Guardar los comentarios de la base de datos
      } catch (error) {
        console.error("Error al obtener comentarios de la base de datos:", error);
      }
    };
    getComentarios(); // Obtener comentarios de la base de datos al cargar el componente
  }, [selectedCargador]);

  // Se llama cada vez que se selecciona una estacion
  useEffect(() => {
    const obtenerImagenEstacion = async (name) => {
      try {
        // Llamar a la API para obtener la foto
        const data = await estacionAPI.getEstacionFotos({ name: name });

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

  useEffect(() => {
    const comprobarSiEsFavorito = async () => {
      try {
        const favoriteIds = await estacionAPI.getEstacionesFavoritas(); // Obtén los IDs favoritos
        const favorito = favoriteIds.includes(selectedCargador.id); // Comprueba si es favorito

        if (favorito !== esFavorito) {
          setEsFavorito(favorito);
        }
      } catch (error) {
        console.error("Error al comprobar si la estación es favorita:", error);
      }
    };

    comprobarSiEsFavorito();
  }, [selectedCargador]);

  const onPressFavorite = async () => {
    try {
      if (esFavorito) {
        // Llamada al servidor para eliminar de favoritos
        await estacionAPI.deleteEstacionFavorita({ placeId: selectedCargador.id });
      } else {
        // Llamada al servidor para agregar a favoritos
        await estacionAPI.addEstacionFavorita({ placeId: selectedCargador.id });
      }
      setEsFavorito(!esFavorito); // Cambia el estado
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
    }
  };

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

        <View style={styles.ratingAndFavoriteRow}>
          {/* Contenedor para la valoración de Google */}
          <View style={styles.ratingRow}>
            <Text style={styles.infoText}>{selectedCargador.rating ? selectedCargador.rating : 0}</Text>
            <Icon name="star" size={16} color={"#65558F"} style={styles.ratingIcon} />
            <Text style={styles.userRatingCount}>({selectedCargador.userRatingCount ? selectedCargador.userRatingCount : 0})</Text>
            <Text style={styles.sourceText}>Google</Text>
          </View>

          {/* Contenedor para la valoración de Voltipilot */}
          <View style={[styles.ratingRow, { marginLeft: 20 }]}>
            <Text style={styles.infoText}>
              {Comentarios.length > 0
                ? (Comentarios.reduce((sum, comentario) => sum + comentario.comentarioData.rating, 0) / Comentarios.length).toFixed(1)
                : 0}
            </Text>
            <Icon name="star" size={16} color={"#65558F"} style={styles.ratingIcon} />
            <Text style={styles.userRatingCount}>({Comentarios.length})</Text>
            <Text style={styles.sourceText}>Voltipilot</Text>
          </View>

          {/* Contenedor para el ícono de corazón */}
          <TouchableOpacity onPress={onPressFavorite} style={styles.favoriteContainer}>
            <Icon name={esFavorito ? "heart" : "heart-o"} size={20} color="#65558F" style={styles.favoriteIcon} />
          </TouchableOpacity>
        </View>
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

export default EstacionTabView;
