import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Slider from '@react-native-community/slider';

const Autonomia = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [autonomia, setAutonomia] = useState(50);

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Feather name="battery-charging" size={40} color="#1FB28A" />
        </TouchableOpacity>

        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccione autonomía</Text>
              <Text style={styles.value}>{autonomia} km</Text>

              <Slider
                style={{ width: 200, height: 40 }}
                value={autonomia}
                minimumValue={0}
                maximumValue={100}
                step={5}
                onValueChange={(value) => setAutonomia(value)}
                minimumTrackTintColor="#000"
                maximumTrackTintColor="#333"
                thumbTintColor="#1FB28A"
              />

               <Slider
                style={{ width: 200, height: 40 }}
                value={autonomia}
                minimumValue={0}
                maximumValue={100}
                step={5}
                onValueChange={(value) => setAutonomia(value)}
                minimumTrackTintColor="#000"
                maximumTrackTintColor="#333"
                thumbTintColor="#1FB28A"
              />

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
}

export default Autonomia;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 2
    },
})