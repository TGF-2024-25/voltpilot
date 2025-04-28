import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  favButton: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    position: "absolute",
    marginTop: 70,
    width: "100%",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "lightgrey",
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  input: {
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
    borderBottomColor: "#5e2e7e",
    borderBottomWidth: 2,
    color: "5e2e7e",
  },
  addButton: {
    backgroundColor: "#a96c9f", // morado claro
    marginTop: 10,
    marginLeft: 50,
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 35,
    alignItems: "center",
  },
  listContainer: {
    marginTop: 230,
    width: "100%",
    borderRadius: 10,
    padding: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  favoritoContainer: {
    marginHorizontal: 15,
    marginBottom: 12,
  },
  favoritoBotones: {
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  favItemButton: {
    flex: 14,
    backgroundColor: "#65558F",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  delItemButton: {
    flex: 2,
    backgroundColor: "#AA4A44",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    maxHeight: 200,
    width: "100%",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 10,
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
