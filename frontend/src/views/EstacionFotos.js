import { useState, useEffect } from "react";
import { View, Text, Image, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { useCargador } from "../contexts/EstacionContext";
import { FlatList } from "react-native-gesture-handler";
import { estacionAPI } from "../services/api";
import Icon from "react-native-vector-icons/FontAwesome"; // Importar íconos
import styles from "../styles/estacionFotosStyle"; // Importar estilos

export default function VistaEstacionFotos() {
  const { selectedCargador } = useCargador();
  const [photoUrls, setPhotoUrls] = useState([]); // URLs precargadas de las fotos
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Foto seleccionada para ampliar
  const [loading, setLoading] = useState(false); // Estado de carga para la imagen ampliada

  // Obtener las fotos de la estación
  const fotos = selectedCargador?.photos || [];

  // Función para obtener la URL de la foto desde la API
  const obtenerImagenEstacion = async (name) => {
    try {
      // Llamar a la API para obtener la foto
      const data = await estacionAPI.getEstacionFotos({ name: name });

      // Devolver la URL de la foto
      return data.photoUri;
    } catch (error) {
      console.error("Error al obtener imagen de la estación:", error);
      return null;
    }
  };

  // Precargar todas las URLs de las fotos al cargar la vista
  useEffect(() => {
    const precargarFotos = async () => {
      setLoading(true);
      const urls = await Promise.all(
        fotos.map(async (foto) => {
          const url = await obtenerImagenEstacion(foto.name);
          return url;
        }),
      );
      setPhotoUrls(urls);
      setLoading(false);
    };

    if (fotos.length > 0) {
      precargarFotos();
    }
  }, [fotos]);

  // Función para renderizar cada miniatura
  const renderItem = ({ item, index }) => (
    <View style={styles.thumbnailContainer}>
      <TouchableOpacity onPress={() => setSelectedPhoto(photoUrls[index])}>
        <Image source={{ uri: photoUrls[index] }} style={styles.thumbnail} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#65558F" />
        </View>
      ) : photoUrls.length > 0 ? (
        <FlatList
          data={photoUrls}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2} // Mostrar las fotos en 2 columnas
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noPhotosContainer}>
          <Text style={styles.noPhotosText}>No hay fotos disponibles.</Text>
        </View>
      )}

      {/* Modal para mostrar la imagen ampliada */}
      <Modal visible={!!selectedPhoto} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedPhoto }} style={styles.fullImage} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPhoto(null)} // Cerrar el modal
          >
            <View style={styles.closeButtonIconContainer}>
              <Icon name="close" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
