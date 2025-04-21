import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { useCargador } from "../contexts/EstacionContext";

// Formatea la información de horarios de apertura
const formatOpeningHours = (currentOpeningHours) => {
  if (!currentOpeningHours || !currentOpeningHours.periods || currentOpeningHours.periods.length === 0) {
    return "Sin información";
  }

  const period = currentOpeningHours.periods[0]; // Tomar el primer período
  const { open, close } = period;

  // Verificar si es 24 horas
  if (open.hour === 0 && open.minute === 0 && close.hour === 23 && close.minute === 59) {
    return "Abierto 24 horas";
  }

  // Formatear las horas y minutos
  const formatTime = (hour, minute) => {
    const formattedHour = hour.toString().padStart(2, "0");
    const formattedMinute = minute.toString().padStart(2, "0");
    return `${formattedHour}:${formattedMinute}`;
  };

  const openTime = formatTime(open.hour, open.minute);
  const closeTime = formatTime(close.hour, close.minute);

  return `Abierto ${openTime} - ${closeTime}`;
};

export default function VistaEstacionInfo() {
  const { selectedCargador } = useCargador();

  // Datos con íconos y descripciones
  const descripciones = [
    {
      icon: require("../assets/location_icon.png"),
      text: selectedCargador.formattedAddress || "Sin información",
    },
    {
      icon: require("../assets/schedule_icon.png"),
      text:
        formatOpeningHours(selectedCargador.currentOpeningHours) ||
        formatOpeningHours(selectedCargador.regularOpeningHours) ||
        "Sin información",
    },
    {
      icon: require("../assets/phone_icon.png"),
      text: selectedCargador.nationalPhoneNumber || selectedCargador.internationalPhoneNumber || "Sin información",
    },
    {
      icon: require("../assets/internet_icon.png"),
      text: selectedCargador.websiteUri || "Sin información",
    },
  ];

  // Función para renderizar cada ítem
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.descriptionText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={descripciones}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row", // Alinear ícono y texto horizontalmente
    alignItems: "center", // Centrar verticalmente
    padding: 16,
  },
  icon: {
    width: 24, // Tamaño del ícono
    height: 24,
    marginRight: 10, // Espaciado entre el ícono y el texto
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1, // Permitir que el texto se ajuste en lugar de desbordarse
    marginRight: 10, // Espaciado adicional a la derecha
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
});
