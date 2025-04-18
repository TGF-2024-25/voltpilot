import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function MarcadoresInfo({ onClose }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Título con fondo morado */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Información</Text>
      </View>

      {/* Contenido de la pantalla */}
      <View style={styles.body}>
        <Text style={styles.title}>Leyenda de Marcadores</Text>
        <View style={styles.legendItem}>
          <Image source={require("../assets/Marcador_1.png")} style={styles.legendIcon} />
          <Text style={styles.legendText}>Disponibilidad alta</Text>
        </View>
        <View style={styles.legendItem}>
          <Image source={require("../assets/Marcador_2.png")} style={styles.legendIcon} />
          <Text style={styles.legendText}>Disponibilidad media</Text>
        </View>
        <View style={styles.legendItem}>
          <Image source={require("../assets/Marcador_3.png")} style={styles.legendIcon} />
          <Text style={styles.legendText}>Sin disponibilidad</Text>
        </View>
        <View style={styles.legendItem}>
          <Image source={require("../assets/Marcador_4.png")} style={styles.legendIcon} />
          <Text style={styles.legendText}>Sin información</Text>
        </View>

        {/* Botón para cerrar el modal */}
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#65558F",
    padding: 15,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  legendIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
    color: "#333",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#65558F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
