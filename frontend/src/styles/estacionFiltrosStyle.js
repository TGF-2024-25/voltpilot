import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#65558F", // Fondo morado
    paddingVertical: 15, // Espaciado vertical
    alignItems: "center", // Centrar el texto
    borderBottomLeftRadius: 10, // Bordes redondeados en la parte inferior
    borderBottomRightRadius: 10, // Bordes redondeados en la parte inferior
    marginBottom: 20, // Separación del contenido
  },
  headerText: {
    color: "white", // Texto blanco
    fontSize: 20, // Tamaño de fuente
    fontWeight: "bold", // Texto en negrita
  },
  filterSection: {
    marginBottom: 40,
    paddingHorizontal: 20, // Agregar margen izquierdo y derecho
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  connectorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  connectorButton: {
    backgroundColor: "#d3d3d3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  connectorButtonSelected: {
    backgroundColor: "#65558F",
  },
  connectorButtonText: {
    color: "#333",
    fontSize: 14,
  },
  connectorButtonTextSelected: {
    color: "white",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderValue: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  applyButton: {
    backgroundColor: "#65558F", // Fondo morado
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20, // Margen izquierdo y derecho
  },
  applyButtonText: {
    color: "white", // Texto blanco
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#d3d3d3", // Fondo gris claro
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10, // Separación del botón de "Aplicar filtros"
    marginHorizontal: 20, // Margen izquierdo y derecho
  },
  backButtonText: {
    color: "#333", // Texto gris oscuro
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20, // Separación superior
    paddingHorizontal: 20, // Espaciado a los lados
    gap: 10, // Espaciado entre los botones
  },
});
