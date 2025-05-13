import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import Feather from "react-native-vector-icons/Feather";

import styles from "../styles/infoRutaStyle";

// Componente Información Ruta
const InformacionRuta = ({ infoRuta }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Función para cambiar el formato de route.duracion
  const get_timeFormat = (tot_segs) => {
    let horas = Math.floor(tot_segs / 3600);
    let minutos = Math.floor((tot_segs % 3600) / 60);
    let segundos = Math.floor(tot_segs % 60);

    if (segundos >= 1)
      minutos += 1;

    return `${horas}h ${minutos}m`;
  };

  // Función que calcula la información Total de la Ruta.
  const get_total = () => {
    let totalDistancia = 0;
    let totalTiempo = 0;
    let tiempoEsperaTotal = 0;

    // Recorremos los tramos para calcular las distancias y tiempos
    infoRuta.forEach((tramo) => {
      if (tramo.tipo === "normal") {
        // Sumamos la distancia + duración (segundos) del tramo i
        totalDistancia += tramo.distancia;
        const duracion = parseInt(tramo.duracion.split(" ")[0], 10);
        totalTiempo += duracion;
      } else if (tramo.tipo === "carga") {
        // Sumamos el tiempo de espera de carga de parada i (viene en minutos --> convertir a segundos)
        const tiempoCarga = parseInt(tramo.tiempoCarga.split(" ")[0], 10);
        tiempoEsperaTotal += tiempoCarga * 60;
      }
    });

    totalTiempo += tiempoEsperaTotal; // Sumamos el tiempo de espera total a la duración total
    return { totalDistancia, totalTiempo };
  };

  const { totalDistancia, totalTiempo } = get_total();

  // Vista del Componente InformacionRuta
  return (
    <>
      <TouchableOpacity testID="infoRutaButton" style={styles.infoRutaButton} onPress={() => setModalVisible(true)}>
        <Feather name="info" size={24} color="white" />
      </TouchableOpacity>

      <Modal transparent animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Información de la Ruta</Text>
            </View>

            <View style={styles.infoContainerWrapper}>
              <ScrollView contentContainerStyle={styles.infoContainer}>
                {infoRuta.map((tramo, index) => (
                  <View
                    key={index}
                    style={[styles.tramoContainer, tramo.tipo === "carga" ? styles.cargaContainer : styles.tramoNormalContainer]}
                  >
                    {tramo.tipo === "carga" ? (
                      <View style={styles.tramoCarga}>
                        <Feather name="battery" size={24} color="#65558F" style={{ transform: [{ rotate: "270deg" }] }} />
                        <View style={styles.cargaTextoContainer}>
                          <Text style={styles.infoText}>{tramo.estacion}</Text>
                          <Text style={styles.infoText}>{tramo.tiempoCarga} de espera</Text>
                        </View>
                        <Feather name="battery-charging" size={24} color="#65558F" style={{ transform: [{ rotate: "270deg" }] }} />
                      </View>
                    ) : (
                      <>
                        <View style={styles.tramoContenido}>
                          <View style={styles.paradaItem}>
                            <Feather name="map-pin" size={24} color="#65558F" />
                            <Text style={styles.infoText}>{tramo.origen}</Text>
                          </View>

                          <View style={styles.flechaCentro}>
                            <Text style={styles.distanciaTexto}>{tramo.distancia} km</Text>
                            <Feather name="arrow-right" size={24} color="#65558F" />
                            <Text style={styles.infoText}>{get_timeFormat(parseInt(tramo.duracion.split("s")[0], 10))}</Text>
                          </View>

                          <View style={styles.paradaItem}>
                            <Feather name="map-pin" size={24} color="#65558F" />
                            <Text style={styles.infoText}>{tramo.destino}</Text>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.totalRutaContainer}>
              <Text style={styles.totalRutaText}>Total de la Ruta</Text>
              <Text style={styles.totalRutaText}>{totalDistancia.toFixed(1)} km</Text>
              <Text style={styles.totalRutaText}>{get_timeFormat(totalTiempo)}</Text>
            </View>

            <View style={styles.footer}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.backButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};


export default InformacionRuta;