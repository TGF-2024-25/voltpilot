import { StyleSheet } from 'react-native';

const rutaEstacionStyle = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: '#76C2EA',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#fff',
  },
  evChargeInfo: {
    marginTop: 10,
  },
  connectorInfo: {
    marginTop: 10,
  },
});

export default rutaEstacionStyle;