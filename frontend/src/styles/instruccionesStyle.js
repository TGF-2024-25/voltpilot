import { StyleSheet, Dimensions } from "react-native";

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  instruccionesButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#65558F",
    padding: 15,
    borderRadius: 30,
    elevation: 5,
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
    marginBottom: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  instruccionesContainerWrapper: {
    maxHeight: screenHeight * 0.75,
  },
  instruccionesContainer: {
    paddingBottom: 20,
  },
  instruccionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  instruccionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  instruccionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginTop: 10,
  },
  footer: {
    marginTop: 0,
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
    marginHorizontal: 20,
  },
  backButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;

