import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  connectorBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  connectorRow: {
    flexDirection: "row", // Alinea los elementos horizontalmente
    justifyContent: "space-between", // Espacia los elementos a los lados
    alignItems: "center", // Centra verticalmente los elementos
  },
  connectorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  availabilityBox: {
    marginTop: 10, // Espaciado superior
    borderRadius: 10, // Bordes redondeados
    padding: 10, // Relleno interno
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333", // Texto oscuro para buena legibilidad
    textAlign: "center", // Centrar el texto
  },
  updateTime: {
    fontSize: 12,
    color: "#888",
  },
  noDataContainer: {
    justifyContent: "flex-start", // Posiciona el contenido hacia la parte superior
    alignItems: "center", // Centrar horizontalmente
    padding: 20,
    marginTop: 50, // Ajusta la distancia desde la parte superior
  },
  noDataText: {
    fontSize: 16,
    color: "#888", // Texto gris para indicar que es un mensaje informativo
    textAlign: "center",
  },
  shareButtonContainer: {
    marginTop: 20, // Espaciado superior
    alignItems: "center", // Centrar el botón horizontalmente
  },
  shareButton: {
    backgroundColor: "#65558F", // Color de fondo del botón
    borderRadius: 25, // Bordes redondeados
    paddingVertical: 10, // Espaciado vertical interno
    paddingHorizontal: 20, // Espaciado horizontal interno
  },
  shareButtonText: {
    color: "white", // Color del texto
    fontSize: 16, // Tamaño de la fuente
    fontWeight: "bold", // Texto en negrita
    textAlign: "center", // Centrar el texto
  },
});
