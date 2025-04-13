import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
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
            <MaterialIcons name="account-circle" size={80} color="#0066CC" style={styles.profileIcon} />
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
            <MaterialIcons name="person" size={24} color="#0066CC" />
            <Text style={styles.optionText}>Detalles de Usuario</Text>
            <MaterialIcons name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => navigation.navigate('MisVehiculos')}
          >
            <MaterialIcons name="electric-car" size={24} color="#0066CC" />
            <Text style={styles.optionText}>Mis Vehículos</Text>
            <MaterialIcons name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>
          
          <Text style={styles.sectionTitle}>Actividad</Text>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => navigation.navigate('MisPagos')}
          >
            <MaterialIcons name="payment" size={24} color="#0066CC" />
            <Text style={styles.optionText}>Mis Pagos</Text>
            <MaterialIcons name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => navigation.navigate('MiHistoriaDeRecarga')}
          >
            <MaterialIcons name="history" size={24} color="#0066CC" />
            <Text style={styles.optionText}>Mi Historia de Recarga</Text>
            <MaterialIcons name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>
          
          <Text style={styles.sectionTitle}>Información</Text>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => navigation.navigate('TerminosYPrivacidad')}
          >
            <MaterialIcons name="security" size={24} color="#0066CC" />
            <Text style={styles.optionText}>Términos y Privacidad</Text>
            <MaterialIcons name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.option, styles.logoutOption]}
            onPress={() => {
              AsyncStorage.clear();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
          >
            <MaterialIcons name="logout" size={24} color="#FF3B30" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    backgroundColor: '#F8F9FA',
    borderRadius: 40,
    overflow: 'hidden',
  },
  userInfoContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  logoutOption: {
    marginTop: 20,
    borderLeftColor: '#FF3B30',
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: '#FF3B30',
    fontWeight: '500',
  },
});