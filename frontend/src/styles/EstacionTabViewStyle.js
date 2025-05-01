import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
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
