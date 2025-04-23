import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    filterButton: {
      backgroundColor: "#65558F",
      padding: 10,
      borderRadius: 25,
      elevation: 5,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: '#b066c3',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 30,
      marginVertical: 10,
      shadowColor: '#76048e',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 5,
    },
    buttonText: {
      color: '#fff',
      marginLeft: 8,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'flex-start',
    },
    modalContent: {
      backgroundColor: '#f4e3f7',
      padding: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 5,
      height: screenHeight * 0.45,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#b066c3',
      padding: 10,
      borderRadius: 12,
      marginBottom: 16,
    },
    title: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomColor: '#ddd',
      borderBottomWidth: 1,
    },
    label: {
      fontSize: 16,
      color: '#5e2e7e',
    },
  });
  
  export default styles;