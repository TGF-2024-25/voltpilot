import { StyleSheet, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

const infoRutaStyle = StyleSheet.create({
  infoRutaButton: {
    position: "absolute",
    bottom: 70,
    left: 20,
    backgroundColor: '#65558F',
    padding: 10,
    borderRadius: 25,
    elevation: 5,
    alignItems: 'center',
    justifyContent: "center",
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
  },
  modalContent: {
    flex: 1,
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
    marginBottom: 5,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainerWrapper: {
    flex: 1,
  },
  infoContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  tramoContainer: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 2,
    width: "100%",
    borderWidth: 1,
  },
  cargaContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f2f9",
    borderColor: "#e0d9ed",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tramoNormalContainer: {
    backgroundColor: "#edf1f9",
    borderColor: "#c6d1e6",
    flexDirection: "column",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginVertical: 2,
  },
  distanciaTexto: {
    textAlign: "center",
    fontSize: 14,
    color: "#65558F",
    marginBottom: 6,
  },
  tramoContenido: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paradaItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  flechaCentro: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    flex: 1,
  },
  tramoCarga: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  cargaTextoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  totalRutaContainer: {
    padding: 15,
    backgroundColor: "#f0f0f0", 
    marginBottom: 10,           
    borderTopWidth: 1,
    borderTopColor: "#ddd",   
    alignItems: "center",
    justifyContent: "center",
  },
  
  totalRutaText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#65558F",             // Mismo color que los elementos de la ruta
    marginBottom: 5,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
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

export default infoRutaStyle;
