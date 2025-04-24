import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

import styles from "../styles/infoRutaStyle";

const InformacionRuta = ({ infoRuta }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.infoRutaButton} onPress={() => setModalVisible(true)}>
        <Text style={{ color: "white" }}>Info</Text>
      </TouchableOpacity>

      <Modal transparent animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Información de la Ruta</Text>
            </View>

            <View style={styles.infoContainer}>
              {infoRuta.map((tramo, index) => (
                <View
                  key={index}
                  style={[
                    styles.tramoContainer,
                    tramo.tipo === "carga" ? styles.cargaContainer : styles.tramoNormalContainer,
                  ]}
                >
                  {tramo.tipo === "carga" ? (
                    <Text style={styles.infoText}>
                      🔋 Estación de carga: {tramo.estacion} - {tramo.tiempoCarga} de espera
                    </Text>
                  ) : (
                    <>
                      <Text style={[styles.infoText, styles.origen]}>{tramo.origen}</Text>
                      <View style={styles.flechaContainer}>
                        <Text style={styles.infoText}>{tramo.distancia} km</Text>
                        <Text style={styles.infoText}>➤</Text>
                        <Text style={styles.infoText}>{tramo.duracion}</Text>
                      </View>
                      <Text style={[styles.infoText, styles.destino]}>{tramo.destino}</Text>
                    </>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default InformacionRuta;