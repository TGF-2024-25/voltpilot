import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#E085DB',
      borderRadius: 10,
      padding: 20,
      width: '80%',
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#fff',
      textAlign: 'center',
    },
    section: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      color: '#fff',
      marginBottom: 5,
    },
    slider: {
      width: '100%',
    },
    input: {
      backgroundColor: '#fff',
      paddingHorizontal: 10,
      height: 40,
      borderRadius: 5,
    },
    closeButton: {
      backgroundColor: '#1FB28A',
      paddingVertical: 10,
      borderRadius: 5,
      marginTop: 15,
    },
    buttonText: {
      textAlign: 'center',
      color: '#fff',
      fontWeight: 'bold',
    },
  });

  export default styles;