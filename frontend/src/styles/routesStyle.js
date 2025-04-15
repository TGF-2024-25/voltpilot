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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
      right: 20,
      backgroundColor: "#007AFF",
      padding: 15,
      borderRadius: 30,
      elevation: 5,
    },
    menuIcon: {
      marginLeft: 10,
    },
    floatingLogos: {
      position: "absolute",
      marginTop: 150,
      right: 20,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 2,
    },
  });

  export default styles;