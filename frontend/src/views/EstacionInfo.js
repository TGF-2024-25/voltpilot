import { View, Text, FlatList, Image } from "react-native";
import { useCargador } from "../contexts/EstacionContext";
import styles from "../styles/estacionInfoStyle";

// Formatea la información de horarios de apertura
export const formatOpeningHours = (currentOpeningHours) => {
  if (!currentOpeningHours || !currentOpeningHours.periods || currentOpeningHours.periods.length === 0) {
    return "Sin información";
  }

  // Tomar el primer período
  const period = currentOpeningHours.periods[0];
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
