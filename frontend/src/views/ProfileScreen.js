import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from "../contexts/AuthContext"; 
import styles from "../styles/profileStyle"; // Import your styles here

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const { checkToken } = useContext(AuthContext);
  /*
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', userDetail);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('expiresIn', expiresIn);
   */
  // Load user data when component mounts
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUserName(userData.name || 'Usuario');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
      
    getUserInfo();
  }, []);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {/* <MaterialIcons name="account-circle" size={80} color="#0066CC" style={styles.profileIcon} /> */}
            <Text style={{fontSize: 80}}>👤</Text>
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.greeting}>¡Hola!</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
        
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Mi Cuenta</Text>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => navigation.navigate('UserDetails')}
          >
            {/* <MaterialIcons name="person" size={24} color="#0066CC" /> */}
            <Text style={{fontSize: 24, color: "#0066CC"}}>🧑</Text>
            <Text style={styles.optionText}>Detalles de Usuario</Text>
            {/* <MaterialIcons name="chevron-right" size={24} color="#888" /> */}
            <Text style={{fontSize: 24, color: "#888"}}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => navigation.navigate('MisVehiculos')}
          >
            {/* <MaterialIcons name="electric-car" size={24} color="#0066CC" /> */}
            <Text style={{fontSize: 24, color: "#0066CC"}}>🚗</Text>
            <Text style={styles.optionText}>Mis Vehículos</Text>
            {/* <MaterialIcons name="chevron-right" size={24} color="#888" /> */}
            <Text style={{fontSize: 24, color: "#888"}}>›</Text>
          </TouchableOpacity>
          
          <Text style={styles.sectionTitle}>Actividad</Text>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => navigation.navigate('MisPagos')}
          >
            {/* <MaterialIcons name="payment" size={24} color="#0066CC" /> */}
            <Text style={{fontSize: 24, color: "#0066CC"}}>💳</Text>
            <Text style={styles.optionText}>Mis Pagos</Text>
            {/* <MaterialIcons name="chevron-right" size={24} color="#888" /> */}
            <Text style={{fontSize: 24, color: "#888"}}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => navigation.navigate('MiHistoriaDeRecarga')}
          >
            {/* <MaterialIcons name="history" size={24} color="#0066CC" /> */}
            <Text style={{fontSize: 24, color: "#0066CC"}}>🕓</Text>
            <Text style={styles.optionText}>Mi Historia de Recarga</Text>
            {/* <MaterialIcons name="chevron-right" size={24} color="#888" /> */}
            <Text style={{fontSize: 24, color: "#888"}}>›</Text>
          </TouchableOpacity>
          
          <Text style={styles.sectionTitle}>Información</Text>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => navigation.navigate('TerminosYPrivacidad')}
          >
            {/* <MaterialIcons name="security" size={24} color="#0066CC" /> */}
            <Text style={{fontSize: 24, color: "#0066CC"}}>🔒</Text>
            <Text style={styles.optionText}>Términos y Privacidad</Text>
            {/* <MaterialIcons name="chevron-right" size={24} color="#888" /> */}
            <Text style={{fontSize: 24, color: "#888"}}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.option, styles.logoutOption]}
            onPress={async () => {
              await AsyncStorage.clear();
              await checkToken();
            }}
          >
            {/* <MaterialIcons name="logout" size={24} color="#FF3B30" /> */}
            <Text style={{fontSize: 24, color: "#FF3B30"}}>🚪</Text>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

