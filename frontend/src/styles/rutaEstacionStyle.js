import { StyleSheet } from 'react-native';
import { Dimensions } from "react-native";

const screenHeight = Dimensions.get('window').height;

const rutaEstacionStyle = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    height: screenHeight * 0.7,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    maxHeight: screenHeight * 0.7,
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: "#5e2e7e",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  connectorInfo: {
    backgroundColor: "#f5f2f9", // fondo suave, tono lila claro
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0d9ed", // borde sutil
  },
  infoText: {
    fontSize: 16,
    color: "#5e2e7e",
    marginBottom: 4, // espacio entre líneas
  },
  evChargeInfo: {
    marginTop: 10,
    width: "90%", // opcional, para mantener un margen
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#d3d3d3",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  backButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
  selectButton: {
    flex: 1,
    backgroundColor: "#65558F",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  selectButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default rutaEstacionStyle;