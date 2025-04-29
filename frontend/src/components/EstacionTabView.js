import React, { useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import VistaEstacionConectores from "../views/EstacionConectores";
import VistaEstacionInfo from "../views/EstacionInfo";
import VistaEstacionComentarios from "../views/EstacionComentarios";
import VistaEstacionFotos from "../views/EstacionFotos";
import { useCargador } from "../contexts/EstacionContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { estacionAPI } from "../services/api"; // Asegúrate de que la ruta sea correcta

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
  ratingAndFavoriteRow: {
    flexDirection: "row", // Alinea los elementos horizontalmente
    alignItems: "center", // Centra verticalmente los elementos
    justifyContent: "space-between", // Espacia los elementos horizontalmente
    marginTop: 10, // Espaciado superior para separar del displayName
  },
  ratingRow: {
    flexDirection: "row", // Alinea los elementos horizontalmente
    alignItems: "center", // Centra verticalmente los elementos
  },
  ratingIcon: {
    marginLeft: 5, // Espaciado entre el texto del rating y la estrella
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
  sourceText: {
    fontSize: 12, // Tamaño de fuente pequeño
    color: "#888", // Gris apagado
    marginLeft: 5, // Espaciado entre el texto principal y la fuente
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
  favoriteContainer: {
    marginLeft: "auto", // Empuja el ícono de corazón al final del contenedor
  },
});

export default EstacionTabView;
