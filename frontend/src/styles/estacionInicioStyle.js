import Constants from "expo-constants";
import { StyleSheet } from "react-native";

const statusBarHeight = Constants.statusBarHeight;

export default styles = StyleSheet.create({
  // Estilos del contenedor principal y mapa
  container: { flex: 1, backgroundColor: "#fff" },
  map: { width: "100%", height: "100%" },
  // Estilos de la barra de busqueda
  searchBarTextInput: {
    textInput: {
      backgroundColor: "white",
      borderRadius: 25,
      paddingHorizontal: 15,
      fontSize: 16,
    },
    listView: {
      backgroundColor: "#FFF",
      borderRadius: 10,
      marginTop: 10,
    },
  },
  searchBarContainer: {
    position: "absolute",
    marginTop: statusBarHeight + 15,
    left: 10,
    right: 10,
  },
  // Estilos de bottomTab
  bottomTabContainer: {
    flex: 1,
    alignItems: "center",
  },
  bottomSheetModal: {
    zIndex: 10, // Asegura que el modal esté por encima de otros elementos
    position: "absolute", // Superpone el modal
  },
  myLocationButton: {
    position: "absolute",
    bottom: 70, // Ajustar para que no se superponga al modal
    right: 20, // Mantenerlo en la esquina derecha
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
  filterButton: {
    position: "absolute",
    marginTop: statusBarHeight + 160,
    right: 20, // Mantenerlo en la esquina derecha
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
  infoButton: {
    position: "absolute",
    marginTop: statusBarHeight + 100,
    right: 20, // Mantenerlo en la esquina derecha
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  legendIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#65558F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    backgroundColor: "#65558F",
    padding: 15,
    alignItems: "center",
  },
  modalHeaderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
});
