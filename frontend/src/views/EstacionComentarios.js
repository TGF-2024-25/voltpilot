import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useCargador } from "../contexts/EstacionContext";
import { FlatList } from "react-native-gesture-handler";

export default function VistaEstacionComentarios() {
  const { selectedCargador } = useCargador();

  // Obtener los comentarios de selectedCargador
  const comentarios = selectedCargador?.reviews || [];

  // Función para renderizar cada comentario
  const renderItem = ({ item }) => (
    <View style={styles.commentContainer}>
      {/* Foto del autor */}
      <Image source={{ uri: item.authorAttribution.photoUri }} style={styles.authorPhoto} />
      <View style={styles.commentContent}>
        {/* Nombre del autor */}
        <View style={styles.headerRow}>
          <Text style={styles.authorName}>{item.authorAttribution.displayName}</Text>
          {/* Tiempo relativo de publicación */}
          <Text style={styles.publishTime}>{item.relativePublishTimeDescription}</Text>
        </View>
        {/* Calificación */}
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#65558F" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        {/* Texto del comentario */}
        <Text
          style={[
            styles.commentText,
            !item.text?.text && styles.noCommentText, // Aplica el estilo gris si no hay texto
          ]}
        >
          {item.originalText?.text || item.text?.text || "El usuario no ha dejado comentarios"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {comentarios.length > 0 ? (
        <FlatList
          data={comentarios}
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
});
