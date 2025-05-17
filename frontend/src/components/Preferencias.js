/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Switch, Modal, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { routingAPI } from '../services/api';
import styles from "../styles/preferenciasStyle";

const Preferencias = forwardRef((props, ref) => {

  const [modalPosition] = useState(new Animated.Value(800)); // Lo mantengo fuera de la pantalla

  const [modalVisible, setModalVisible] = useState(false);
  const [loading_data, set_loading_data] = useState(true);

  const [uid, set_uid] = useState(null);
  const [peajes, set_peajes] = useState(false);
  const [autopista, set_autopista] = useState(false);
  const [ferry, set_ferry] = useState(true);
  const [traffic, set_traffic] = useState(true);

  const fetch_preferencias = async() => {
    try {
      if (!uid) return;

      const data = await routingAPI.getPreferencias(uid);

      if (data) {
        set_peajes(data.peajes);
        set_autopista(data.autopista);
        set_ferry(data.ferry);
        set_traffic(data.traffic);
      }
    } catch (err) {
      console.error("Error de red al obtener preferencias:", err);
    } finally {
      set_loading_data(false);
    }
  };

  const send_preferencias = async() => {
      const preferencias_data = { uid, peajes, autopista, traffic, ferry };

      try {
        const data = await routingAPI.setPreferencias(preferencias_data);

        console.log('Preferencias enviadas correctamente:', data);
      } catch (err) {
        console.error("Error de red al guardar preferencias:", err);
      }
  };

  const slideIn = () => {
    Animated.timing(modalPosition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
    
  const slideOut = () => {
    Animated.timing(modalPosition, {
      toValue: 800,
      duration: 300,
      useNativeDriver: true,
    }).start();
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

  useEffect(() => {       
    if (uid) fetch_preferencias();
  }, [uid]);

  useImperativeHandle(ref, () => ({
      getPreferencias: () => ({
        peajes,
        autopista,
        ferry,
        traffic,
      }),
  }));
  
  const toggleSwitch = (key) => {
    if (key === 'peajes') set_peajes((prev) => !prev);
    else if (key === 'autopista') set_autopista((prev) => !prev);
    else if (key === 'traffic') set_traffic((prev) => !prev);
    else if (key === 'ferry') set_ferry((prev) => !prev);
  };

  const function_accept = async () => {
    await send_preferencias();
    setModalVisible(false);
    slideOut();
  };
    
  const openModal = () => {
    setModalVisible(true);
    slideIn();
  };
  
return (
  <View style={styles.container}>
    {/* Botón flotante para abrir preferencias */}
    <TouchableOpacity testID="filterButton" style={styles.filterButton} onPress={openModal}>
      <Feather name="filter" size={24} color="white" />
    </TouchableOpacity>

    {/* Modal de preferencias deslizante */}
    <Modal transparent animationType="slide" visible={modalVisible} onRequestClose={() => {
        setModalVisible(false); slideOut();
    }}>
          
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: modalPosition }] }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Preferencias de Ruta</Text>
          </View>

          {loading_data ? (
            <ActivityIndicator size="large" color="#1FB28A" />
          ) : (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Evitar ferris</Text>
                <Switch
                  trackColor={{ false: "#ccc", true: "#b066c3" }}
                  thumbColor={ferry ? "#76048e" : "#f4f3f4"}
                  value={ferry}
                  onValueChange={() => toggleSwitch("ferry")}
                />
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Evitar autopistas</Text>
                <Switch
                  trackColor={{ false: "#ccc", true: "#b066c3" }}
                  thumbColor={autopista ? "#76048e" : "#f4f3f4"}
                  value={autopista}
                  onValueChange={() => toggleSwitch("autopista")}
                />
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Evitar peajes</Text>
                <Switch
                  trackColor={{ false: "#ccc", true: "#b066c3" }}
                  thumbColor={peajes ? "#76048e" : "#f4f3f4"}
                  testID="switch-peajes"
                  value={peajes}
                  onValueChange={() => toggleSwitch("peajes")}
                />
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Tráfico en tiempo real</Text>
                <Switch
                  trackColor={{ false: "#ccc", true: "#b066c3" }}
                  thumbColor={traffic ? "#76048e" : "#f4f3f4"}
                  value={traffic}
                  onValueChange={() => toggleSwitch("traffic")}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={function_accept}
              >
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.backButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  </View>
);
});
  
export default Preferencias;