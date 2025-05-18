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
        const autoKm = await AsyncStorage.getItem('autonomia');
        console.log('autoKM: ', autoKm);
        set_totalKm(autoKm ? parseFloat(autoKm) : 0);
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
    resetAutonomia: () => {
      set_ini(100);
    },
  })); 
  
  const function_accept = async () => {
    await send_autonomia_data();
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity testID="autonomiaButton" style={styles.autonomiaButton} onPress={() => setModalVisible(true)}>
        <Feather name="battery-charging" size={24} color="white" style={{ transform: [{ rotate: '270deg' }] }} />
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Configuración de autonomía</Text>
            </View>

            {loading_data ? (
              <ActivityIndicator size="large" color="#1FB28A" />
            ) : (
              <>
                <View style={styles.section}>
                  <Text style={styles.label}>Auntonomía Inicial: {ini}%</Text>
                  <Slider
                    testID="sliderInicial"
                    style={styles.slider}
                    value={ini}
                    minimumValue={0}
                    maximumValue={100}
                    step={5}
                    onSlidingComplete={(value) => set_ini(value)}
                    minimumTrackTintColor="#65558F"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#65558F"
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
                    onSlidingComplete={(value) => set_min(value)}
                    minimumTrackTintColor="#65558F"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#65558F"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Autonomía total del vehículo (km):</Text>
                  <TextInput
                    style={styles.input}
                    value={totalKm.toString()}
                    editable={false}
                    keyboardType="numeric"
                  />
                </View>


                <TouchableOpacity style={styles.acceptButton} onPress={function_accept}>
                  <Text style={styles.acceptButtonText}>Aceptar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.backButtonText}>Cancelar</Text>
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