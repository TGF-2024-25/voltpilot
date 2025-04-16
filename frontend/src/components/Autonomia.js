/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { routingAPI } from '../services/api';
import styles from "../styles/autonomiaStyle";

const Autonomia = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading_data, set_loading_data] = useState(true);
  const [ini, set_ini] = useState(30);
  const [fin, set_fin] = useState(60);
  const [min, set_min] = useState(15);
  const [uid, set_uid] = useState(null);

  const data_autonomia = {
    uid: uid,
    inicial: ini,
    final: fin,
    minima: min,
  };

  const fetch_autonomia_data = async () => {
    try {
      if (!uid) return;

      const response = await routingAPI.getAutonomia(uid);

      if(response.ok) {
        const data = await response.json();
        if(data) {
          set_ini(data.inicial);
          set_fin(data.final);
          set_min(data.minima);
        }
      } else if (response.status === 404) { 
        console.log('No hay datos de autonomía para el usuario:', uid, '. Se utilizarán los valores por defecto.');
      } else {
        console.error('Error al obtener los datos de autonomía:', response.status);
      }
    } catch (error) { 
      console.error('Error de red al obtener autonomía: ', error);
    } finally {
      set_loading_data(false);
    }
  }

  const send_autonomia_data = async () => {
    try {
      const response = await routingAPI.setAutonomia(data_autonomia);
  
      if (response.ok) {
        const data = await response.json();
        console.log('Autonomía enviada correctamente:', data);
      } else {
        console.error('Error al enviar la autonomía:', response.status);
      }
    } catch (error) {
      console.error('Error de red al guardar la autonomía:', error);
    }
  };

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

  // Getting autonomia data when charging component
  useEffect(() => {
    if(uid) fetch_autonomia_data();
  }, [uid]);
  
  const function_accept = async () => {
    await send_autonomia_data();
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

            {loading_data ? (
              <ActivityIndicator size="large" color="#1FB28A" />
            ) : (
              <>              
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
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Autonomia;