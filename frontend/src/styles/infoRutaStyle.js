import { StyleSheet } from 'react-native';
import { Dimensions } from "react-native";

const screenHeight = Dimensions.get('window').height;

const infoRutaStyle = StyleSheet.create({
    infoRutaButton: {
        position: "absolute",
        bottom: 20,
        left: 170,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
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
        marginBottom: 20,
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    infoContainer: {
        alignItems: "center",
      },
    tramoContainer: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        width: "100%",
        borderWidth: 1,
    },
    cargaContainer: {
        flexDirection: "row",
        backgroundColor: "#f5f2f9",
        borderColor: "#e0d9ed",
    },
    tramoNormalContainer: {
        backgroundColor: "#edf1f9",
        borderColor: "#c6d1e6",
    },
    infoText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 4,
    },
    origen: {
        fontWeight: "bold",
    },
    destino: {
        fontWeight: "bold",
    },
    flechaContainer: {
        justifyContent: "space-between",
        marginVertical: 4,
    },
});

export default infoRutaStyle;