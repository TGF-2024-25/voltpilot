import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#E7DFE8", 
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 30, // espacio después del botón de guardar
    color: "#fff",
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    width: "100%",
    backgroundColor: "#fafafa",
  },
  addButton: {
    backgroundColor: "#a96c9f", // morado claro
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20, // separación con el listado
    width: "100%",
  },
  botonTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  favButton: {
    backgroundColor: "#8e7cc3", // morado más fuerte
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
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
});

export default styles;
