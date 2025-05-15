import { TouchableOpacity } from "react-native";
import { Text, StyleSheet } from "react-native";

// Botón reutilizable para "Aplicar"
export const ApplyButton = ({ onPress, text = "Aplicar", style, textStyle, testID }) => (
  <TouchableOpacity style={[styles.applyButton, style]} onPress={onPress} testID={testID}>
    <Text style={[styles.applyButtonText, textStyle]}>{text}</Text>
  </TouchableOpacity>
);

// Botón reutilizable para "Cancelar"
export const CancelButton = ({ onPress, text = "Cancelar", style, textStyle, testID }) => (
  <TouchableOpacity style={[styles.clearButton, style]} onPress={onPress} testID={testID}>
    <Text style={[styles.clearButtonText, textStyle]}>{text}</Text>
  </TouchableOpacity>
);

// Estilos genéricos para los botones reutilizables
const styles = StyleSheet.create({
  applyButton: {
    backgroundColor: "#65558F", // Fondo morado
    paddingVertical: 12, // Altura genérica
    paddingHorizontal: 20, // Ancho genérico
    borderRadius: 8, // Bordes redondeados
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: "white", // Texto blanco
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#d3d3d3", // Fondo gris claro
    paddingVertical: 12, // Altura genérica
    paddingHorizontal: 20, // Ancho genérico
    borderRadius: 8, // Bordes redondeados
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: "#333", // Texto gris oscuro
    fontSize: 16,
    fontWeight: "bold",
  },
});
