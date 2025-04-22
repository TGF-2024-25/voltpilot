/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput } from "react-native";
import Feather from "react-native-vector-icons/Feather";

import SearchBar from "../components/SearchBar.js";
import styles from "../styles/favoritosStyle.js";

//import { routingAPI } from "../../services/ApiService";

const Favoritos = ({ on_selected_destino }) => {

  const [modalVisible, setModalVisible] = useState(false);

  const [favoritos, set_favoritos] = useState([]);
  const [nuevo, set_nuevo] = useState({ description: "", location: null });

  useEffect(() => {
    // Lógica para cargar favoritos desde la BD
    // Ej: routingAPI.get('/favoritos').then(res => set_favoritos(res.data));
  }, []);

  const save_favorito = () => {
    if (!nuevo.location || !nuevo.description.trim()) return;

    const favorito = {
      description: nuevo.description,
      location: nuevo.location,
    };

    // Aquí iría la llamada a la API para guardar
    // Ej: routingAPI.post('/favoritos', favorito).then...

    set_favoritos((prev) => [...prev, favorito]);
    set_nuevo({ description: "", location: null });
  };

  const select_favorito = (favorito) => {
    if (on_selected_destino) {
      on_selected_destino(favorito); // Lo pasas como destino seleccionado
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Feather name="star" size={40} color="#1FB28A" />
      </TouchableOpacity>

      <Modal animationType="slide" visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.searchTitle}>Añadir nuevo favorito</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre personalizado"
              value={nuevo.description}
              onChangeText={(text) => set_nuevo({ ...nuevo, description: text })}
            />

            <View style={{ width: "100%", marginVertical: 10 }}>
              <SearchBar
                placeholder="Buscar nuevo favorito"
                onSelect={(location) => {
                  set_nuevo({ ...nuevo, location });
                }}
              />
            </View>

            <TouchableOpacity
              style={[ styles.addButton, (!nuevo.location || !nuevo.description.trim()) && { opacity: 0.6 } ]}
              onPress={save_favorito}
              disabled={!nuevo.location || !nuevo.description.trim()}
            >

              <Text style={styles.botonTexto}>Guardar como Favorito</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Favoritos</Text>
            <FlatList
              data={favoritos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (

                <TouchableOpacity style={styles.favButton} onPress={() => select_favorito(item)}>
                  <Text style={styles.botonTexto}>{item.description}</Text>
                </TouchableOpacity>
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
