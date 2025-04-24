import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  autonomiaButton: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  overlay: {
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
    marginBottom: 50,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
    marginLeft: 15,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  input: {
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
    borderBottomColor: "#5e2e7e",
    borderBottomWidth: 2,
    color: "5e2e7e",
  },
  acceptButton: {
    backgroundColor: "#65558F", // Fondo morado
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 160,
    marginHorizontal: 20, // Margen izquierdo y derecho
  },
  acceptButtonText: {
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