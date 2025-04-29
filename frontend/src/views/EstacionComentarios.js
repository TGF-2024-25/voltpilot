import React, { use, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity, Modal, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useCargador } from "../contexts/EstacionContext";
import { FlatList } from "react-native-gesture-handler";
import { ApplyButton, CancelButton } from "../components/Botones";
import { estacionAPI } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VistaEstacionComentarios() {
  const { selectedCargador } = useCargador();
  const googleComentarios = selectedCargador?.reviews || [];

  // Estados para el modal de comentarios
  const [bdComentarios, setBdComentarios] = useState([]);
  const [allComentarios, setAllComentarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Función para obtener comentarios de la base de datos
    const getBdComentarios = async () => {
      try {
        const data = await estacionAPI.getEstacionComentarios({ placeId: selectedCargador.id });
        setBdComentarios(data); // Guardar los comentarios de la base de datos
        console.log("Comentarios de la base de datos:", data);
      } catch (error) {
        console.error("Error al obtener comentarios de la base de datos:", error);
      }
    };
    getBdComentarios(); // Obtener comentarios de la base de datos al cargar el componente
  }, [selectedCargador]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        const userDetail = JSON.parse(userData);
        setUserId(userDetail.id); // Guardar el userId del usuario
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Normalizar los comentarios para que tengan un formato uniforme
    const normalizarComentarios = () => {
      const comentariosGoogleNormalizados = googleComentarios.map((comentario) => ({
        authorName: comentario.authorAttribution?.displayName || "Usuario de Google",
        photoUri: comentario.authorAttribution?.photoUri || null,
        text: comentario.originalText?.text || comentario.text?.text || "El usuario no ha dejado comentarios",
        rating: comentario.rating || 0,
        source: "Google",
        timestamp: comentario.relativePublishTimeDescription || "Reciente",
      }));

      const comentariosBdNormalizados = bdComentarios.map((comentario) => ({
        userId: comentario.userData.id,
        commentId: comentario.commentId,
        authorName: comentario.userData.name || "Usuario",
        photoUri: null,
        text: comentario.comentarioData.text || "El usuario no ha dejado comentarios",
        rating: comentario.comentarioData.rating || 0,
        source: "Voltipilot",
        timestamp: new Date(comentario.comentarioData.timestamp).toLocaleDateString("es-ES"), // Convertir timestamp a formato legible
      }));

      setAllComentarios([...comentariosGoogleNormalizados, ...comentariosBdNormalizados]);
      console.log("Comentarios normalizados:", [...comentariosGoogleNormalizados, ...comentariosBdNormalizados]);
    };

    if (googleComentarios.length > 0 || bdComentarios.length > 0) {
      normalizarComentarios();
    }
  }, [bdComentarios]);

  // Función para obtener comentarios de la base de datos
  const getBdComentarios = async () => {
    try {
      const data = await estacionAPI.getEstacionComentarios({ placeId: selectedCargador.id });
      setBdComentarios(data); // Guardar los comentarios de la base de datos
    } catch (error) {
      console.error("Error al obtener comentarios de la base de datos:", error);
    }
  };

  // Función para manejar el envío del comentario
  const handleSendComment = async () => {
    if (!newComment || rating === 0) {
      Alert.alert("Error", "Por favor, escribe un comentario y selecciona una calificación.");
      return;
    }

    try {
      // Enviar el comentario al servidor
      await estacionAPI.createEstacionComentario({
        placeId: selectedCargador.id,
        comentario: { text: newComment, rating: rating },
      });

      console.log("Comentario enviado:", { newComment, rating });

      // Obtener los comentarios actualizados desde la base de datos
      await getBdComentarios();

      // Cerrar el modal y limpiar los campos
      setModalVisible(false);
      setNewComment("");
      setRating(0);
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      Alert.alert("Error", "No se pudo enviar el comentario.");
    }
  };

  const openDeleteModal = async (commentId) => {
    setSelectedCommentId(commentId);
    setDeleteModalVisible(true);
  };

  // Función para manejar la eliminación de un comentario
  const handleDeleteComment = async () => {
    try {
      await estacionAPI.deleteEstacionComentario({
        placeId: selectedCargador.id,
        commentId: selectedCommentId,
      });
      // Actualiza los comentarios desde la base de datos
      await getBdComentarios();

      // Cierra el modal
      setDeleteModalVisible(false);
      setSelectedCommentId(null);
      setSelectedCommentId(null);
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      Alert.alert("Error", "No se pudo eliminar el comentario.");
    }
  };

  // Función para renderizar cada comentario
  const renderItem = ({ item }) => (
    <View style={styles.commentContainer}>
      {/* Foto del autor o ícono predeterminado */}
      {item.photoUri ? (
        <Image source={{ uri: item.photoUri }} style={styles.authorPhoto} />
      ) : (
        <View style={styles.placeholderPhoto}>
          <Icon name="user" size={24} color="#FFF" />
        </View>
      )}
      <View style={styles.commentContent}>
        {/* Nombre del autor */}
        <View style={styles.headerRow}>
          <Text style={styles.authorName}>{item.authorName}</Text>
          {/* Ícono de eliminar si el userId coincide */}
          {item.userId === userId && (
            <TouchableOpacity onPress={() => openDeleteModal(item.commentId)}>
              <Icon name="close" size={20} color="#65558F" style={styles.deleteIcon} />
            </TouchableOpacity>
          )}
        </View>
        {/* Tiempo relativo de publicación */}
        <Text style={styles.publishTime}>{item.timestamp}</Text>
        {/* Calificación */}
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#65558F" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        {/* Texto del comentario */}
        <Text style={[styles.commentText, item.text === "El usuario no ha dejado comentarios" && styles.noCommentText]}>{item.text}</Text>
        {/* Fuente del comentario */}
        <Text style={styles.commentSource}>Fuente: {item.source}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {allComentarios.length > 0 ? (
        <FlatList
          data={allComentarios}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyboardShouldPersistTaps="handled" // Permitir interacción con el teclado abierto
        />
      ) : (
        <View style={styles.noCommentsContainer}>
          <Text style={styles.noCommentsText}>No hay comentarios disponibles.</Text>
        </View>
      )}

      {/* Botón flotante para abrir el modal */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.floatingButtonText}>Comentar</Text>
      </TouchableOpacity>

      {/* Modal para escribir un comentario */}
      <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escribir un comentario</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe tu comentario aquí..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>Calificación:</Text>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Icon name="star" size={24} color={star <= rating ? "#65558F" : "#CCC"} style={styles.starIcon} />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <CancelButton
                onPress={() => {
                  setModalVisible(false);
                  setNewComment("");
                  setRating(0);
                }}
                text="Cancelar"
              />
              <ApplyButton onPress={handleSendComment} text="Enviar" />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={deleteModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Eliminar comentario?</Text>
            <Text style={styles.modalMessage}>Esta acción no se puede deshacer.</Text>
            <View style={styles.modalButtons}>
              <CancelButton onPress={() => setDeleteModalVisible(false)} text="Cancelar" />
              <ApplyButton onPress={handleDeleteComment} text="Eliminar" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row", // Alinear la foto y el contenido horizontalmente
    padding: 16,
    alignItems: "flex-start",
  },
  authorPhoto: {
    width: 50, // Tamaño de la foto
    height: 50,
    borderRadius: 25, // Hacer la foto circular
    marginRight: 10, // Espaciado entre la foto y el contenido
  },
  commentContent: {
    flex: 1, // Permitir que el contenido ocupe el espacio restante
  },
  headerRow: {
    flexDirection: "row", // Alinear el nombre y el tiempo horizontalmente
    justifyContent: "space-between", // Espaciar el nombre y el tiempo
    alignItems: "center",
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  publishTime: {
    fontSize: 12,
    color: "#888",
    marginLeft: 10, // Espaciado entre el nombre y el tiempo
    textAlign: "right", // Alinear el tiempo a la derecha
  },
  ratingContainer: {
    flexDirection: "row", // Alinear la estrella y el texto horizontalmente
    alignItems: "center",
    marginVertical: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 4, // Espaciado entre la estrella y el texto
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    marginVertical: 4,
  },
  noCommentText: {
    color: "#888", // Color gris para el texto "El usuario no ha dejado comentarios"
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  noCommentsContainer: {
    justifyContent: "flex-start", // Posiciona el contenido hacia la parte superior
    alignItems: "center", // Centrar horizontalmente
    padding: 20,
    marginTop: 50, // Ajusta la distancia desde la parte superior
  },
  noCommentsText: {
    fontSize: 16,
    color: "#888",
  },
  commentSource: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#65558F",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  floatingButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // Elimina el fondo gris semitransparente
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: "top", // Asegura que el texto comience desde la parte superior
    height: 200, // Altura fija para el cuadro de texto
    width: 280, // Ancho completo del modal
    overflow: "hidden", // Evita que el contenido desborde
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  placeholderPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#CCC", // Fondo gris para el ícono
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  deleteIcon: {
    marginLeft: 10,
    marginTop: -5, // Mueve el ícono un poco hacia arriba
    color: "#65558F", // Color de la temática de la aplicación
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
});
