import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
    borderRadius: 10,
    padding: 10,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative", 
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
  },
  deleteText: {
    fontSize: 24,
    color: '#333333'
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    flex: 1,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#65558F",
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
  upperLogos: {
    position: "absolute",
    marginTop: 150,
    right: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  lowerLogos: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  myLocationButton: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  botonAgregar: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "white",
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default styles;