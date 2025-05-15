import { View, Text, FlatList, Modal, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { estacionAPI } from "../services/api";
import { ApplyButton, CancelButton } from "../components/Botones";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCargador } from "../contexts/EstacionContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import React from "react";
import styles from "../styles/estacionesFavoritasStyle";

const VistaEstacionesFavoritas = () => {
  const [idEstacionesFavoritas, setIdEstacionesFavoritas] = useState([]);
  const [estacionesFavoritas, setEstacionesFavoritas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null); // Para almacenar el placeId seleccionado
  const navigation = useNavigation(); // Navegación para ir a la vista de estaciones
  const { setEstacionFavorita, setSelectedCargador } = useCargador();

  // Obtener los IDs de las estaciones favoritas
  useFocusEffect(
    React.useCallback(() => {
      const obtenerIdEstacionesFavoritas = async () => {
        try {
          const data = await estacionAPI.getEstacionesFavoritas();
          setIdEstacionesFavoritas(data);
        } catch (error) {
          console.error("Error al obtener estaciones favoritas:", error);
        }
      };

      obtenerIdEstacionesFavoritas();
    }, []),
  );

  // Obtener la información de las estaciones favoritas cuando los IDs estén disponibles
  useEffect(() => {
    if (idEstacionesFavoritas.length === 0) return;

    const obtenerEstacionesFavoritas = async () => {
      try {
        const estaciones = [];
        for (const placeId of idEstacionesFavoritas) {
          try {
            const estacion = await estacionAPI.getInfoCargador({ placeId: placeId });
            estaciones.push(estacion);
          } catch (error) {
            console.error(`Error al obtener información del cargador con placeId ${placeId}:`, error);
          }
        }
        setEstacionesFavoritas(estaciones);
      } catch (error) {
        console.error("Error al obtener estaciones favoritas:", error);
      }
    };

    obtenerEstacionesFavoritas();
  }, [idEstacionesFavoritas]);

  const onDeleteFavorito = async () => {
    try {
      await estacionAPI.deleteEstacionFavorita({ placeId: selectedPlaceId });
      setIdEstacionesFavoritas((prev) => prev.filter((id) => id !== selectedPlaceId)); // Actualiza el estado de idEstacionesFavoritas
      setModalVisible(false); // Cierra el modal después de eliminar
    } catch (error) {
      console.error(`Error al eliminar la estación favorita con placeId ${selectedPlaceId}:`, error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedCargador(item); // Guarda el cargador seleccionado en el contexto
        setEstacionFavorita(item); // Guarda la estación favorita en el contexto
        navigation.navigate("Estaciones"); // Navega a la vista de estaciones.
      }} // Navega al TabView con los datos de la estación
      style={styles.card}
      testID={`station-card-${item.id}`} // ID de prueba para la tarjeta de estación
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.displayName.text}</Text>
        <Icon
          name="close"
          size={24}
          color="#65558F"
          onPress={() => {
            setSelectedPlaceId(item.id);
            setModalVisible(true);
          }}
          style={styles.closeIcon}
          testID={`delete-icon-${item.id}`}
        />
      </View>
      <Text style={styles.cardText}>{item.formattedAddress}</Text>
      <Text style={styles.cardText}>{item.rating ? `Rating: ${item.rating}` : "Sin calificación"}</Text>
      <Text style={styles.cardStatus}>
        {item.currentOpeningHours?.openNow === true || item.regularOpeningHours?.openNow === true
          ? "Abierto"
          : item.currentOpeningHours?.openNow === false || item.regularOpeningHours?.openNow === false
            ? "Cerrado"
            : "Sin información"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={estacionesFavoritas}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Cierra el modal al presionar atrás
        testID="delete-modal"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar esta estación de tus favoritos?</Text>
            <View style={styles.modalButtons}>
              <ApplyButton text="Eliminar" onPress={onDeleteFavorito} testID="delete-button" />
              <CancelButton text="Cancelar" onPress={() => setModalVisible(false)} testID="cancel-button" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VistaEstacionesFavoritas;
