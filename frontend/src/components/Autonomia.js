import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Slider from '@react-native-community/slider';

const Autonomia = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [ini, set_ini] = useState(30);
  const [fin, set_fin] = useState(60);
  const [min, set_min] = useState(15);

  const data_autonomia = {
    data_ini: ini,
    data_fin: fin,
    data_min: min,
  };

  const send_autonomia_data = async () => {
    try {
      const response = await fetch('RUTA BACKEND', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_autonomia)
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Autonomía enviada correctamente:', data);
      } else {
        console.error('Error al enviar la autonomía:', response.status);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };
  
  const function_accept = async () => {
    await send_autonomia_data();

    console.log('Valores de autonomía:', data_autonomia);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Feather name="battery-charging" size={40} color="#1FB28A" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configuración de autonomía</Text>

            <View style={styles.section}>
              <Text style={styles.label}>Auntonomía Inicial: {ini}%</Text>
              <Slider
                style={styles.slider}
                value={ini}
                minimumValue={0}
                maximumValue={100}
                step={5}
                onValueChange={(value) => set_ini(value)}
                minimumTrackTintColor="#1FB28A"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#1FB28A"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Autonomía Final: {fin}%</Text>
              <Slider
                style={styles.slider}
                value={fin}
                minimumValue={0}
                maximumValue={100}
                step={5}
                onValueChange={(value) => set_fin(value)}
                minimumTrackTintColor="#1FB28A"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#1FB28A"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Autonomía mínima durante el viaje:</Text>
              <TextInput
                style={styles.input}
                value={min.toString()}
                onChangeText={(text) => set_min(Number(text))}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={function_accept}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Autonomia;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#E085DB',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: '#1FB28A',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});