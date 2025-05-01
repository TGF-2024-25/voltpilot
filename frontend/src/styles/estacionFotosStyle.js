import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  listContainer: {
    padding: 5,
  },
  thumbnailContainer: {
    width: "50%", // Cada miniatura ocupa el 50% del ancho (2 columnas)
    aspectRatio: 1, // Mantener proporción cuadrada
    padding: 5,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  noPhotosContainer: {
    flex: 1,
    marginTop: 50,
    justifyContent: "flex-start", // Posiciona el contenido hacia la parte superior
    alignItems: "center",
    padding: 20,
  },
  noPhotosText: {
    fontSize: 16,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain", // Ajustar la imagen dentro del modal
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  closeButtonIconContainer: {
    backgroundColor: "#65558F",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
