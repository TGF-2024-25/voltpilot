import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row", // Alinear ícono y texto horizontalmente
    alignItems: "center", // Centrar verticalmente
    padding: 16,
  },
  icon: {
    width: 24, // Tamaño del ícono
    height: 24,
    marginRight: 10, // Espaciado entre el ícono y el texto
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1, // Permitir que el texto se ajuste en lugar de desbordarse
    marginRight: 10, // Espaciado adicional a la derecha
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
});
