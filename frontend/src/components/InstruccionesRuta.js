import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import Feather from "react-native-vector-icons/Feather";

import styles from "../styles/instruccionesStyle";

const Instrucciones = ({ instruccionesRuta }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.instruccionesButton} onPress={() => setModalVisible(true)}>
        <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>Cómo llegar</Text>
      </TouchableOpacity>

      <Modal testID="modal" transparent animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Instrucciones de la Ruta</Text>
            </View>

            <View style={styles.instruccionesContainerWrapper}>
              <ScrollView contentContainerStyle={styles.instruccionesContainer}>
                {instruccionesRuta.map((inst, index) => (
                  <View
                    key={index}
                    style={[
                      styles.instruccionContainer,
                      { backgroundColor: index % 2 === 0 ? "#E6E1F2" : "#D9D3ED" },
                    ]}
                  >
                    <View style={styles.instruccionItem}>
                      <Text style={styles.instruccionText}>
                        {inst.instruction}: {inst.distanceMeters} metros
                      </Text>
                    </View>
                    <View style={styles.separator} />
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.backButtonText}>Cerrar</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Instrucciones;
