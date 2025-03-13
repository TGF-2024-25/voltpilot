import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import styles from "../styles/appStyle";
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('MiPerfil')}>
        <Text style={styles.optionText}>Mi Perfil</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('MisVehiculos')}>
        <Text style={styles.optionText}>Mis Vehículos</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('MisPagos')}>
        <Text style={styles.optionText}>Mis Pagos</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('MiHistoriaDeRecarga')}>
        <Text style={styles.optionText}>Mi Historia de Recarga</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('TerminosYPrivacidad')}>
        <Text style={styles.optionText}>Términos y la Privacidad</Text>
      </TouchableOpacity>
    </View>
  );
}
