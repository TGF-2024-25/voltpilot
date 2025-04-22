/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { routingAPI } from '../services/api';
import styles from "../styles/autonomiaStyle";

const Autonomia = forwardRef((props, ref) => {
  
  const [modalVisible, setModalVisible] = useState(false);
  const [loading_data, set_loading_data] = useState(true);
  const [ini, set_ini] = useState(30);
  const [min, set_min] = useState(15);
  const [totalKm, set_totalKm] = useState(100);
  const [uid, set_uid] = useState(null);

  const data_autonomia = {
    uid: uid,
    inicial: ini,
    minima: min,
    total: totalKm,
  };

  const fetch_autonomia_data = async () => {
    try {
      if (!uid) return;

      const data = await routingAPI.getAutonomia(uid);

      if(data) {
        set_ini(data.inicial);
        set_min(data.minima);
        set_totalKm(data.total);
      }
    } catch (error) { 
      console.error('Error de red al obtener autonomía: ', error);
    } finally {
      set_loading_data(false);
    }
  }

  const send_autonomia_data = async () => {
    try {
      const data = await routingAPI.setAutonomia(data_autonomia);

      console.log('Autonomía enviada correctamente:', data);
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

  useImperativeHandle(ref, () => ({
    getAutonomia: () => ({
      inicialKm: (ini / 100) * totalKm,
      minimaKm: (min / 100) * totalKm,
      totalKm: totalKm,
    }),
  })); 
  
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
        transparent
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
                  <Text style={styles.label}>Autonomía Mínima: {min}%</Text>
                  <Slider
                    style={styles.slider}
                    value={min}
                    minimumValue={0}
                    maximumValue={100}
                    step={5}
                    onValueChange={(value) => set_min(value)}
                    minimumTrackTintColor="#1FB28A"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#1FB28A"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Autonomía total del vehículo (km):</Text>
                  <TextInput
                    style={styles.input}
                    value={totalKm.toString()}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      set_totalKm(Number(numericValue));
                    }}
                    keyboardType="numeric"
                  />
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={function_accept}
                >
                  <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );

});



export default Autonomia;