import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider"; // Biblioteca para sliders
import { ApplyButton, CancelButton } from "../components/Botones";

export default function EstacionFiltro({ onClose, onApplyFilters, initialFilters }) {
  const [selectedConnectors, setSelectedConnectors] = useState(initialFilters.selectedConnectors || []);
  const [minKwh, setMinKwh] = useState(initialFilters.minKwh || 0);
  const [searchRadius, setSearchRadius] = useState(initialFilters.searchRadius || 1);

  const connectors = [
    { id: "1", name: "Tipo 2" },
    { id: "2", name: "CHAdeMO" },
    { id: "3", name: "Tesla" },
    { id: "4", name: "CCS Combo 2" },
  ];

  const toggleConnector = (id) => {
    if (selectedConnectors.includes(id)) {
      setSelectedConnectors(selectedConnectors.filter((connector) => connector !== id));
    } else {
      setSelectedConnectors([...selectedConnectors, id]);
    }
  };

  const handleApplyFilters = () => {
    // Llama a la función de callback con los valores de los filtros
    onApplyFilters({
      selectedConnectors,
      minKwh,
      searchRadius,
    });
    onClose(); // Cierra la vista de filtros
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Filtros</Text>
      </View>

      {/* Selector de conectores */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Conectores</Text>
        <View style={styles.connectorContainer}>
          {connectors.map((connector) => (
            <TouchableOpacity
              key={connector.id}
              style={[styles.connectorButton, selectedConnectors.includes(connector.id) && styles.connectorButtonSelected]}
              onPress={() => toggleConnector(connector.id)}
            >
              <Text style={[styles.connectorButtonText, selectedConnectors.includes(connector.id) && styles.connectorButtonTextSelected]}>
                {connector.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Slider para kWh mínimo */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>kWh mínimo</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={minKwh}
          onSlidingComplete={(value) => setMinKwh(value)} // Actualiza el estado solo al finalizar
          minimumTrackTintColor="#65558F"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#65558F"
        />
        <Text style={styles.sliderValue}>{minKwh} kWh</Text>
      </View>

      {/* Slider para restringir el área de búsqueda */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Radio de búsqueda</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={1}
          value={searchRadius}
          onSlidingComplete={(value) => setSearchRadius(value)} // Actualiza el estado solo al finalizar
          minimumTrackTintColor="#65558F"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#65558F"
        />
        <Text style={styles.sliderValue}>{searchRadius} km</Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* Botón para aplicar los filtros */}
        <ApplyButton onPress={handleApplyFilters} text="Aplicar filtros" />

        {/* Botón para borrar los filtros */}
        <CancelButton
          onPress={() => {
            setSelectedConnectors([]); // Restablece los conectores seleccionados
            setMinKwh(1); // Restablece el kWh mínimo
            setSearchRadius(1); // Restablece el radio de búsqueda
          }}
          text="Borrar filtros"
        />

        {/* Botón para volver */}
        <CancelButton onPress={onClose} text="Cerrar" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#65558F", // Fondo morado
    paddingVertical: 15, // Espaciado vertical
    alignItems: "center", // Centrar el texto
    borderBottomLeftRadius: 10, // Bordes redondeados en la parte inferior
    borderBottomRightRadius: 10, // Bordes redondeados en la parte inferior
    marginBottom: 20, // Separación del contenido
  },
  headerText: {
    color: "white", // Texto blanco
    fontSize: 20, // Tamaño de fuente
    fontWeight: "bold", // Texto en negrita
  },
  filterSection: {
    marginBottom: 40,
    paddingHorizontal: 20, // Agregar margen izquierdo y derecho
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  connectorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  connectorButton: {
    backgroundColor: "#d3d3d3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  connectorButtonSelected: {
    backgroundColor: "#65558F",
  },
  connectorButtonText: {
    color: "#333",
    fontSize: 14,
  },
  connectorButtonTextSelected: {
    color: "white",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderValue: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  applyButton: {
    backgroundColor: "#65558F", // Fondo morado
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20, // Margen izquierdo y derecho
  },
  applyButtonText: {
    color: "white", // Texto blanco
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#d3d3d3", // Fondo gris claro
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10, // Separación del botón de "Aplicar filtros"
    marginHorizontal: 20, // Margen izquierdo y derecho
  },
  backButtonText: {
    color: "#333", // Texto gris oscuro
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20, // Separación superior
    paddingHorizontal: 20, // Espaciado a los lados
    gap: 10, // Espaciado entre los botones
  },
});
