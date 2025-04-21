import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard"; // Importar Clipboard desde expo-clipboard
import { useCargador } from "../contexts/EstacionContext";
import { FlatList } from "react-native-gesture-handler";

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
      await Clipboard.setStringAsync(placeUri); // Copiar el enlace al portapapeles
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
                    <Text style={styles.updateTime}>
                      Actualizado {formatUpdateTime(item.availabilityLastUpdateTime)}
                    </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  connectorBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  connectorRow: {
    flexDirection: "row", // Alinea los elementos horizontalmente
    justifyContent: "space-between", // Espacia los elementos a los lados
    alignItems: "center", // Centra verticalmente los elementos
  },
  connectorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  availabilityBox: {
    marginTop: 10, // Espaciado superior
    borderRadius: 10, // Bordes redondeados
    padding: 10, // Relleno interno
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333", // Texto oscuro para buena legibilidad
    textAlign: "center", // Centrar el texto
  },
  updateTime: {
    fontSize: 12,
    color: "#888",
  },
  noDataContainer: {
    justifyContent: "flex-start", // Posiciona el contenido hacia la parte superior
    alignItems: "center", // Centrar horizontalmente
    padding: 20,
    marginTop: 50, // Ajusta la distancia desde la parte superior
  },
  noDataText: {
    fontSize: 16,
    color: "#888", // Texto gris para indicar que es un mensaje informativo
    textAlign: "center",
  },
  shareButtonContainer: {
    marginTop: 20, // Espaciado superior
    alignItems: "center", // Centrar el botón horizontalmente
  },
  shareButton: {
    backgroundColor: "#65558F", // Color de fondo del botón
    borderRadius: 25, // Bordes redondeados
    paddingVertical: 10, // Espaciado vertical interno
    paddingHorizontal: 20, // Espaciado horizontal interno
  },
  shareButtonText: {
    color: "white", // Color del texto
    fontSize: 16, // Tamaño de la fuente
    fontWeight: "bold", // Texto en negrita
    textAlign: "center", // Centrar el texto
  },
});
