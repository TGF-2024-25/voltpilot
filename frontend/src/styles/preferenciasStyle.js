import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterButton: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    height: screenHeight,
  },
  header: {
    backgroundColor: "#65558F",
    paddingVertical: 20,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  label: {
    marginLeft: 12,
    fontSize: 16,
    color: "#5e2e7e",
  },
  button: {
    backgroundColor: "#65558F", // Fondo morado
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 250,
    marginHorizontal: 20, // Margen izquierdo y derecho
  },
  buttonText: {
    color: "white", // Texto blanco
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#d3d3d3",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    marginHorizontal: 20,
  },
  backButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});
  






  export default styles;