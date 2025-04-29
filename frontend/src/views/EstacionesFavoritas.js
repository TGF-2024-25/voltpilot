import { View, StyleSheet, Text, FlatList, Modal, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { estacionAPI } from "../services/api";
import Icon from "react-native-vector-icons/MaterialIcons"; // Asegúrate de instalar react-native-vector-icons
import { ApplyButton, CancelButton } from "../components/Botones"; // Importa tus botones personalizados
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React from "react"; // Asegúrate de importar React
import { useCargador } from "../contexts/EstacionContext"; // Asegúrate de que la ruta sea correcta

const VistaEstacionesFavoritas = () => {
  const [idEstacionesFavoritas, setIdEstacionesFavoritas] = useState([]);
  const [estacionesFavoritas, setEstacionesFavoritas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null); // Para almacenar el placeId seleccionado
  const navigation = useNavigation(); // Navegación para ir a la vista de estaciones
  const { setSelectedCargador } = useCargador(); // Asegúrate de que el contexto esté configurado correctamente

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
    }, []), // Se ejecuta cada vez que la pantalla se enfoca
  );

  // Obtener la información de las estaciones favoritas cuando los IDs estén disponibles
  useEffect(() => {
    if (idEstacionesFavoritas.length === 0) return; // No hacer nada si no hay IDs

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
      await estacionAPI.deleteEstacionFavorita({ placeId: selectedPlaceId }); // Llama a la API para eliminar la estación favorita
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
        navigation.navigate("Estaciones", { estacionFavorita: item }); // Navega con el parámetro "fromFavoritos"
      }} // Navega al TabView con los datos de la estación
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.displayName.text}</Text>
        <Icon
          name="close"
          size={24}
          color="#65558F"
          onPress={() => {
            setSelectedPlaceId(item.id); // Establece el placeId seleccionado
            setModalVisible(true); // Muestra el modal
          }}
          style={styles.closeIcon}
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
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar esta estación de tus favoritos?</Text>
            <View style={styles.modalButtons}>
              <ApplyButton text="Eliminar" onPress={onDeleteFavorito} />
              <CancelButton text="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Fondo claro para la pantalla
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFF", // Fondo blanco para las tarjetas
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderLeftWidth: 5, // Indicador de color en el borde izquierdo
    borderLeftColor: "#65558F", // Morado característico
  },
  cardHeader: {
    flexDirection: "row", // Alinea los elementos en una fila
    justifyContent: "space-between", // Espacio entre el texto y el ícono
    alignItems: "center", // Alinea verticalmente el texto y el ícono
    marginBottom: 10, // Espaciado inferior para separar del contenido
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#65558F", // Morado para el título
  },
  closeIcon: {
    padding: 5, // Espaciado alrededor del ícono para facilitar el toque
  },
  cardText: {
    fontSize: 14,
    color: "#333", // Texto oscuro para la información
    marginBottom: 5,
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#65558F", // Morado para el estado (Abierto/Cerrado)
  },
  separator: {
    height: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo transparente oscuro
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default VistaEstacionesFavoritas;
