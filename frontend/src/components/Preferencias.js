/* eslint-disable react/display-name */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Switch, Modal, TouchableOpacity, Animated, Dimensions, ActivityIndicator } from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { routingAPI } from '../services/api';
import styles from "../styles/preferenciasStyle";

const screenHeight = Dimensions.get('window').height;

const Preferencias = forwardRef(({ preferencias, setPreferencias }, ref) => {

    const slideAnim = useRef(new Animated.Value(-screenHeight)).current;
    const [modalPosition] = useState(new Animated.Value(-500)); // Lo mantengo fuera de la pantalla

    const [modalVisible, setModalVisible] = useState(false);
    const [loading_data, set_loading_data] = useState(true);
    const [uid, set_uid] = useState(null);
    const [peajes, set_peajes] = useState(false);
    const [autopista, set_autopista] = useState(false);
    const [ferry, set_ferry] = useState(false);
    const [traffic, set_traffic] = useState(false);

    const fetch_preferencias = async() => {
        try {
            if (!uid) return;

            const response = await routingAPI.getPreferencias(uid);

            if (response.ok) {
              const data = await response.json();
              if (data) {
                set_peajes(data.corta);
                set_autopista(data.rapida);
                set_ferry(data.evitarPeajes);
                set_traffic(data.traffic);
              }
            } else if (response.status === 404) {
              console.log("No hay preferencias guardadas para el usuario: ", uid ,". Se utilizarán los valores por defecto.");
            } else {
              console.error("Error al obtener preferencias:", response.status);
            }
          } catch (err) {
            console.error("Error de red al obtener preferencias:", err);
          } finally {
            set_loading_data(false);
          }
    };

    const send_preferencias = async() => {
        const data = { uid, peajes, autopista, traffic, ferry };

        try {
          const response = await routingAPI.setPreferencias(data);

          if (response.ok) {
            const data = await response.json();
            console.log('Preferencias enviadas correctamente:', data);
          } else {
            console.error("Error al guardar preferencias:", response.status);
          }
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
          toValue: -500,
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
      setPreferencias((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
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
        <TouchableOpacity onPress={openModal}>
          <Feather name="settings" size={40} color="#1FB28A" />
        </TouchableOpacity>

        {/* Modal de preferencias deslizante */}
        <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={() => {
            setModalVisible(false); slideOut();
        }}>
            
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.header}>
                <Text style={styles.title}>Preferencias de Ruta</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Feather name="x" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {loading_data ? (
                <ActivityIndicator size="large" color="#1FB28A" />
              ) : (
                <>
                  {[
                    { key: "avoidFerries", label: "Evitar ferris", value: ferry },
                    { key: "avoidHighways", label: "Evitar autopistas", value: autopista },
                    { key: "avoidTolls", label: "Evitar peajes", value: peajes },
                    { key: "trafficAware", label: "Tráfico en tiempo real", value: traffic },
                  ].map((pref) => (
                    <View key={pref.key} style={styles.row}>
                      <Text style={styles.label}>{pref.label}</Text>
                      <Switch
                        trackColor={{ false: "#ccc", true: "#b066c3" }}
                        thumbColor={preferencias[pref.key] ? "#76048e" : "#f4f3f4"}
                        value={preferencias[pref.key]}
                        onValueChange={() => toggleSwitch(pref.key)}
                      />
                    </View>
                  ))}

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
            </Animated.View>
          </View>
        </Modal>
      </View>
    );
});
  
export default Preferencias;

 








