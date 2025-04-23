/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { routingAPI } from '../services/api';
import SearchBar from "../components/SearchBar.js";
import styles from "../styles/favoritosStyle.js";

const Favoritos = ({ on_selected_destino }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [loading_data, set_loading_data] = useState(true);

  const [uid, set_uid] = useState(null);
  const [favoritos, set_favoritos] = useState([]);
  const [nuevo, set_nuevo] = useState({ description: "", location: null });

  const fetch_favoritos = async() => {
    try {
      if(!uid) return;

      const data = await routingAPI.getFavoritos(uid);

      if(data) 
        set_favoritos(data);

    } catch (err) {
      console.error("Error de red al obtener favoritos: ", err);
    } finally {
      set_loading_data(false);
    }
  }

  const send_favorito = async() => {
    if (!nuevo.location || !nuevo.description.trim()) return;

    const favorito_data = { description: nuevo.description, location: nuevo.location, uid: uid, };

    try {
      const data = await routingAPI.setFavorito(favorito_data);

      console.log('Favorito enviado correctamente:', data);
      set_nuevo({ description: "", location: null });

      fetch_favoritos();
    } catch (err) {
      console.error("Error al enviar favorito: ", err);
    }
  }

  const delete_favorito = async (favorito) => {
    try {
      const data = {
        uid: uid,
        description: favorito.description,
        location: favorito.location
      };
  
      await routingAPI.deleteFavorito(data); 

      fetch_favoritos();
    } catch (err) {
      console.error("Error al eliminar favorito:", err);
    }
  }

  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('uid');
        if (userId) {
          set_uid(userId);
        } else {
          console.error('No se encontró el UID en AsyncStorage.');
        }
      } catch (e) {
          console.error('Error al obtener el UID desde AsyncStorage:', e);
      }
    };
        
    getCurrentUserId();
  }, []);

  useEffect(() => {       
    if (uid) fetch_favoritos();
  }, [uid]);

  const select_favorito = (favorito) => {
    if (on_selected_destino) {
      on_selected_destino(favorito); // Lo pasas como destino seleccionado
    }
    setModalVisible(false);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.favButton} onPress={() => setModalVisible(true)}>
        <Feather name="star" size={24} color="white" />
      </TouchableOpacity>

      <Modal animationType="slide" visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.searchTitle}>Añadir nuevo favorito</Text>

            <View style={styles.searchContainer}>
              <SearchBar
                placeholder="Buscar nuevo favorito"
                onSelect={(location) => {
                  set_nuevo({ ...nuevo, location });
                }}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nombre personalizado"
              value={nuevo.description}
              onChangeText={(text) => set_nuevo({ ...nuevo, description: text })} 
             />

            <TouchableOpacity
              style={[styles.addButton, (!nuevo.location || !nuevo.description.trim()) && { opacity: 0.6 }]}
              onPress={send_favorito}
              disabled={!nuevo.location || !nuevo.description.trim()}
            >
              <Text style={styles.botonTexto}>Guardar como Favorito</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Favoritos</Text>
            <FlatList
              data={favoritos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.favoritoContainer}>
      <View style={styles.favoritoBotones}>

                  <TouchableOpacity style={styles.delItemButton} onPress={() => delete_favorito(item)}>
                    <Feather name="trash-2" size={20} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.favItemButton} onPress={() => select_favorito(item)}>
                    <Text style={styles.botonTexto}>{item.description}</Text>
                  </TouchableOpacity>
</View>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyMessage}>¡Aún no tienes favoritos! Añade uno nuevo.</Text>}
              style={styles.list}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Favoritos;
