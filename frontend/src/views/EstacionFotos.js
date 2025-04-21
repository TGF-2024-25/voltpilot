import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { useCargador } from "../contexts/EstacionContext";
import Icon from "react-native-vector-icons/FontAwesome"; // Importar íconos
import { FlatList } from "react-native-gesture-handler";

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
      const response = await fetch(`http://localhost:5000/api/estaciones/getCargadorFotos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name }),
      });

      if (!response.ok) throw new Error("Error en la petición");

      const data = await response.json();
      return data.photoUri; // Devolver la URL de la foto
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

// Estilos
const styles = StyleSheet.create({
  listContainer: {
    padding: 5, // Espaciado general
  },
  thumbnailContainer: {
    width: "50%", // Cada miniatura ocupa el 50% del ancho (2 columnas)
    aspectRatio: 1, // Mantener proporción cuadrada
    padding: 5, // Espaciado entre miniaturas
  },
  thumbnail: {
    width: "100%", // Ocupa todo el ancho del contenedor
    height: "100%", // Ocupa toda la altura del contenedor
    borderRadius: 8, // Bordes redondeados
  },
  noPhotosContainer: {
    flex: 1,
    marginTop: 50, // Espaciado superior
    justifyContent: "flex-start", // Posiciona el contenido hacia la parte superior
    alignItems: "center", // Centrar horizontalmente
    padding: 20,
  },
  noPhotosText: {
    fontSize: 16,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain", // Ajustar la imagen dentro del modal
  },
  closeButton: {
    position: "absolute",
    top: 40, // Posición en la parte superior
    right: 20, // Posición en la parte derecha
  },
  closeButtonIconContainer: {
    backgroundColor: "#65558F", // Color de fondo del botón
    width: 40, // Ancho fijo
    height: 40, // Altura fija (igual al ancho para que sea un círculo perfecto)
    borderRadius: 20, // Radio igual a la mitad del ancho/alto para hacerlo redondo
    justifyContent: "center", // Centrar el ícono horizontalmente
    alignItems: "center", // Centrar el ícono verticalmente
  },
});
