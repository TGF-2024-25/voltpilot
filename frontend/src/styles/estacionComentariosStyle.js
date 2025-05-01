import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row", // Alinear la foto y el contenido horizontalmente
    padding: 16,
    alignItems: "flex-start",
  },
  authorPhoto: {
    width: 50, // Tamaño de la foto
    height: 50,
    borderRadius: 25, // Hacer la foto circular
    marginRight: 10, // Espaciado entre la foto y el contenido
  },
  commentContent: {
    flex: 1, // Permitir que el contenido ocupe el espacio restante
  },
  headerRow: {
    flexDirection: "row", // Alinear el nombre y el tiempo horizontalmente
    justifyContent: "space-between", // Espaciar el nombre y el tiempo
    alignItems: "center",
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  publishTime: {
    fontSize: 12,
    color: "#888",
    marginLeft: 10, // Espaciado entre el nombre y el tiempo
    textAlign: "right", // Alinear el tiempo a la derecha
  },
  ratingContainer: {
    flexDirection: "row", // Alinear la estrella y el texto horizontalmente
    alignItems: "center",
    marginVertical: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 4, // Espaciado entre la estrella y el texto
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    marginVertical: 4,
  },
  noCommentText: {
    color: "#888", // Color gris para el texto "El usuario no ha dejado comentarios"
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  noCommentsContainer: {
    justifyContent: "flex-start", // Posiciona el contenido hacia la parte superior
    alignItems: "center", // Centrar horizontalmente
    padding: 20,
    marginTop: 50, // Ajusta la distancia desde la parte superior
  },
  noCommentsText: {
    fontSize: 16,
    color: "#888",
  },
  commentSource: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#65558F",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  floatingButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // Elimina el fondo gris semitransparente
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: "top", // Asegura que el texto comience desde la parte superior
    height: 200, // Altura fija para el cuadro de texto
    width: 280, // Ancho completo del modal
    overflow: "hidden", // Evita que el contenido desborde
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  placeholderPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#CCC", // Fondo gris para el ícono
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  deleteIcon: {
    marginLeft: 10,
    marginTop: -5, // Mueve el ícono un poco hacia arriba
    color: "#65558F", // Color de la temática de la aplicación
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
});
