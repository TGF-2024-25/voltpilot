import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  autonomiaButton: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#E7DFE8',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fafafa',
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  acceptButton: {
    backgroundColor: '#a96c9f',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#CCCCCC',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;