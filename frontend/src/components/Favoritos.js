/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from "@env";
import { routingAPI  } from '../services/api.js';
import axios from 'axios' // Lo querré borrar seguramente

const Favoritos = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [favoritos, set_favoritos] = useState([]);

    useEffect(() => {
      // Aquí iría la lógica para obtener los favoritos de la base de datos
      // ejemplo: axios.get('/api/favoritos').then(response => setFavoritos(response.data));
      //favoritos = await routingAPI.getRoute(origen, destinos[0]);
    }, []);

    const select_function = (data, details) => {
      const favorito = {
        description: data.description,
        location: details.geometry.location,
      }

      // Guardar favorito en BD
      axios
        .post('URL PARA MANEJAR', favorito)
        .then((response) => {
          set_favoritos((lst) => [...lst, favorito]); // Añadir a la lista de favoritos locales
          setModalVisible(false);
        })
        .catch((error) => console.error("ERROR >>> Error al guardar el favorito: ", error));
    }

    const add_destino = (favorito) => {
      // Logica para guardar el seleccionado favorito como destino
      console.log("Favorito seleccionado: ", favorito);
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Feather name="star" size={40} color="#1FB28A" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          visible={modalVisible}
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Favoritos</Text>

              <FlatList
                data={favoritos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.favButton}
                    onPress={() => add_destino(item)}
                  >
                    <Text style={styles.botonTexto}>{item.description}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyMessage}>¡Aún no tienes favoritos! Añade uno nuevo.</Text>}
                style={styles.list}
              />

              {/* Botón para añadir un nuevo favorito */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.botonTexto}>Añadir Nuevo Favorito</Text>
              </TouchableOpacity>
              
              <GooglePlacesAutocomplete
                fetchDetails={true}
                placeholder="Selecciona Destinos"
                onPress={(data, details = null) => {
                  if (details) {
                    select_function(data, details);
                  }
                }}
                query={{ key: GOOGLE_MAPS_API_KEY, language: "es" }}
                styles={{ textInput: styles.textInput }}
              />

            </View>
          </View>
        </Modal>
      </View>
    );
}

export default Favoritos;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
  },
  overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  modalContent: {
      width: '80%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      elevation: 6,
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
  },
  favButton: {
      backgroundColor: '#1FB28A',
      padding: 15,
      marginVertical: 10,
      borderRadius: 5,
      width: '80%',
      alignItems: 'center',
  },
  addButton: {
      backgroundColor: '#007AFF',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
  },
  botonTexto: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
  },
  list: {
      maxHeight: 200,
      marginBottom: 15,
  },
  textInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },  
});