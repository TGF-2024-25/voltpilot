import React from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard"; // Importar Clipboard desde expo-clipboard
import { useCargador } from "../contexts/EstacionContext";
import { FlatList } from "react-native-gesture-handler";
import styles from "../styles/estacionConectoresStyle"; // Asegúrate de que la ruta sea correcta

export default function VistaEstacionConectores() {
  const { selectedCargador } = useCargador();

  // Formatear el tipo de conector
  const formatConnectorType = (type) => {
    return type
      .replace("EV_CONNECTOR_TYPE_", "") // Eliminar el prefijo
      .replace(/_/g, " ") // Reemplazar guiones bajos por espacios
      .toLowerCase() // Convertir a minúsculas
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalizar cada palabra
  };

  // Formatear la hora de actualización
  const formatUpdateTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, "0"); // Asegurar formato de 2 dígitos
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Asegurar formato de 2 dígitos
    return `${hours}:${minutes}`;
  };

  // Manejar el evento de copiar ubicación
  const handleCopyLocation = async () => {
    const placeUri = selectedCargador?.googleMapsUri;
    if (placeUri) {
      // Copiar el enlace al portapapeles
      await Clipboard.setStringAsync(placeUri);
      Alert.alert("Enlace copiado", "El enlace de la ubicación se ha copiado.");
    } else {
      Alert.alert("Error", "No se pudo obtener información.");
    }
  };

  return (
    <View style={styles.container}>
      {selectedCargador.evChargeOptions?.connectorAggregation?.length > 0 ? (
        <FlatList
          data={selectedCargador.evChargeOptions.connectorAggregation}
          keyExtractor={(item, index) => `${item.type}-${index}`} // Usar el tipo y el índice como clave única
          renderItem={({ item }) => {
            const hasAvailabilityInfo = item.availableCount !== undefined && item.outOfServiceCount !== undefined;

            return (
              <View style={styles.connectorBox}>
                <View style={styles.connectorRow}>
                  <Text style={styles.connectorText}>
                    {formatConnectorType(item.type)} - {item.maxChargeRateKw.toFixed(1)} kW
                  </Text>
                  {item.availabilityLastUpdateTime ? (
                    <Text style={styles.updateTime}>Actualizado {formatUpdateTime(item.availabilityLastUpdateTime)}</Text>
                  ) : null}
                </View>

                {/* Caja de disponibilidad */}
                <View
                  style={[
                    styles.availabilityBox,
                    {
                      backgroundColor: hasAvailabilityInfo && item.availableCount > 0 ? "#d4edda" : "#f8d7da",
                    }, // Verde si hay disponibles, rojo si no o si no hay información
                  ]}
                >
                  <Text style={styles.availabilityText}>
                    {hasAvailabilityInfo ? `${item.availableCount} / ${item.count}` : "Sin información"}
                  </Text>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            <View style={styles.shareButtonContainer}>
              <TouchableOpacity style={styles.shareButton} onPress={handleCopyLocation}>
                <Text style={styles.shareButtonText}>Compartir ubicación</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No se pudo encontrar información sobre conectores.</Text>
        </View>
      )}
    </View>
  );
}
