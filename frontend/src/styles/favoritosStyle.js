import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
    borderRadius: 10,
    padding: 10,
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
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 45,
    marginBottom: 5,
    width: "60%",
    backgroundColor: "#fafafa",
  },
  addButton: {
    backgroundColor: "#a96c9f", // morado claro
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10, // separación con el listado
    width: "100%",
  },
  favoritoContainer: {
    marginHorizontal: 15,
    marginBottom: 12, // separa visualmente los items
  },
  favoritoBotones: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  favItemButton: {
    flex: 14,
    backgroundColor: '#65558F',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  delItemButton: {
    flex: 2,
    backgroundColor: '#AA4A44',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
