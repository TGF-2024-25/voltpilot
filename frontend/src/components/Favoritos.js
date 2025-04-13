import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Modal, TextInput, FlatList } from "react-native";
import Feather from "react-native-vector-icons/Feather";

const Favoritos = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [favoritos, setFavoritos] = useState([]);
    const [newFavorito, setNewFavorito] = useState('');

    const addFavorito = () => {
        if(newFavorito.trim() !== '') {
            setFavoritos([...favoritos, newFavorito]);
            setNewFavorito('');
        }
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

              <View style={styles.favoritosFijos}>
                <Text style={styles.fijo}> Casa </Text>
                <Text style={styles.fijo}> Trabajo </Text>
              </View>

              <Text style={styles.favoritos}> Otros favoritos: </Text>
              <FlatList
                data={favoritos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Text style={styles.item}>{item}</Text>
                )}
                style={{ maxHeight: 200 }}
              />

              <TextInput  
                placeholder="Nuevo favorito"
                value={newFavorito}
                onChangeText={setNewFavorito}
                style={styles.input}
              />
              <TouchableOpacity style={styles.botonAñadir} onPress={addFavorito}>
                <Text style={styles.botonTexto}>Añadir</Text>
              </TouchableOpacity>

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
    modal: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'stretch',
        elevation: 6,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    botonAñadir: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    botonTexto: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
});