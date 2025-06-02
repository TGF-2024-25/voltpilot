import { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { useCargador } from "../contexts/EstacionContext";
import { FlatList } from "react-native-gesture-handler";
import { ApplyButton, CancelButton } from "../components/Botones";
import { estacionAPI } from "../services/api";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/estacionComentariosStyle";

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
    // Obtener comentarios de la base de datos
    const getBdComentarios = async () => {
      try {
        const data = await estacionAPI.getEstacionComentarios({ placeId: selectedCargador.id });
        setBdComentarios(data); // Guardar los comentarios de la base de datos
        // console.log("Comentarios de la base de datos:", data);
      } catch (error) {
        console.error("Error al obtener comentarios de la base de datos:", error);
      }
    };
    getBdComentarios(); // Obtener comentarios de la base de datos al cargar el componente
  }, [selectedCargador]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const userData = await AsyncStorage.getItem("user");
        // const userDetail = JSON.parse(userData);
        // setUserId(userDetail.id); // Guardar el userId del usuario
        const userID = await AsyncStorage.getItem("uid");
        setUserId(userID); // Guardar el userId del usuario
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
        userId: null,
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
        source: "VoltPilot",
        timestamp: new Date(comentario.comentarioData.timestamp).toLocaleDateString("es-ES"), // Convertir timestamp a formato legible
      }));

      setAllComentarios([...comentariosGoogleNormalizados, ...comentariosBdNormalizados]);
      // console.log("Comentarios normalizados");
    };

    if (googleComentarios.length > 0 || bdComentarios.length > 0) {
      normalizarComentarios();
    }
  }, [bdComentarios]);

  // Función duplicado para obtener comentarios de la base de datos
  const getBdComentarios = async () => {
    try {
      const data = await estacionAPI.getEstacionComentarios({ placeId: selectedCargador.id });
      setBdComentarios(data); // Guardar los comentarios de la base de datos
    } catch (error) {
      console.error("Error al obtener comentarios de la base de datos:", error);
    }
  };

  // Menaja el envío del comentario
  const handleSendComment = async () => {
    if (!newComment || rating === 0) {
      Alert.alert("Error", "Por favor, escriba un comentario y seleccione una calificación.");
      return;
    }

    try {
      // Enviar el comentario al servidor
      await estacionAPI.createEstacionComentario({
        placeId: selectedCargador.id,
        comentario: { text: newComment, rating: rating },
      });

      // console.log("Comentario enviado:", { newComment, rating });

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

  // Función para abrir el modal de eliminación de comentario
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
          {item.userId === userId && item.source === "VoltPilot" && (
            <TouchableOpacity onPress={() => openDeleteModal(item.commentId)} testID={`delete-icon-${item.commentId}`}>
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
          keyboardShouldPersistTaps="handled"
          testID="comments-list"
        />
      ) : (
        <View style={styles.noCommentsContainer} testID="no-comments-message">
          <Text style={styles.noCommentsText}>No hay comentarios disponibles.</Text>
        </View>
      )}

      {/* Botón flotante para abrir el modal */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)} testID="comment-button">
        <Text style={styles.floatingButtonText}>Comentar</Text>
      </TouchableOpacity>

      {/* Modal para escribir un comentario */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        testID="comment-modal"
      >
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
                  <Icon name="star" size={24} color={star <= rating ? "#65558F" : "#CCC"} style={styles.starIcon} testID={`star-${star}`} />
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
                testID={"cancel-button"}
              />
              <ApplyButton onPress={handleSendComment} text="Enviar" testID={"send-button"} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDeleteModalVisible(false)}
        testID="delete-modal"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Eliminar comentario?</Text>
            <Text style={styles.modalMessage}>Esta acción no se puede deshacer.</Text>
            <View style={styles.modalButtons}>
              <CancelButton onPress={() => setDeleteModalVisible(false)} text="Cancelar" testID={"cancel-delete-button"} />
              <ApplyButton onPress={handleDeleteComment} text="Eliminar" testID={"delete-comment-button"} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
