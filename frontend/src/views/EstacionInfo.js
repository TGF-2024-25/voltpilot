import { View, Text, FlatList, Image } from "react-native";
import { useCargador } from "../contexts/EstacionContext";
import styles from "../styles/estacionInfoStyle";
import { formatOpeningHours } from "../utils/estacionUtils";

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
