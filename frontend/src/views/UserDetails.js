import React, { useState, useEffect,useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { userAPI } from '../services/api';
import { AuthContext } from "../contexts/AuthContext"; 
import styles from '../styles/userDetailStyle';


export default function MiPerfil() {
  const { checkToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const [password, setPassword] = useState({
    password: '',
    confirmPassword: '',
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // carga datos de usuario
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setLoading(true);
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const parsedData = JSON.parse(userJson);
          setUserData(parsedData);
          setOriginalData(parsedData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'No se pudo cargar la información del usuario');
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  // entrada de datos de usuario
  const handleChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };
  const handleChangepass = (field, value) => {
    setPassword(prev => ({ ...prev, [field]: value }));
  };

  // guarda los datos de usuario a firestore
  const handleSave = async () => {
    try {
      setLoading(true);
      const uid = await AsyncStorage.getItem('uid');
      if (password.password !== password.confirmPassword) {
        password.password = '';
        password.confirmPassword = '';
        Alert.alert('Error', 'Las contraseñas no coinciden');
        setLoading(false);
        return;
      }
      const passwordupdate = password.password;
      const userDataToUpdate = { ...userData,passwordupdate,uid };
      const response = await userAPI.updateProfile(userDataToUpdate);
      
      await AsyncStorage.setItem('user', JSON.stringify(response.data.userDetail));
      setOriginalData(response.data.userDetail);
      setUserData(response.data.userDetail);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
      await checkToken();
    }
  };

  // cancelar los cambios
  const handleCancel = () => {
    setUserData(originalData);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" testID="ActivityIndicator" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={userData.name}
            onChangeText={(text) => handleChange('name', text)}
            placeholder="Ingresa tu nombre"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            value={userData.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder="Ingresa tu correo"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={userData.phoneNumber}
            onChangeText={(text) => handleChange('phoneNumber', text)}
            placeholder="Ingresa tu teléfono"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            value={userData.address}
            onChangeText={(text) => handleChange('address', text)}
            placeholder="Ingresa tu dirección"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nueva contraseña</Text>
          <TextInput
            style={styles.input}
            value={password.password}
            onChangeText={(text) => handleChangepass('password', text)}
            placeholder="Ingresa tu nueva contraseña"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Confirma nueva contraseña</Text>
          <TextInput
            style={styles.input}
            value={password.confirmPassword}
            onChangeText={(text) => handleChangepass('confirmPassword', text)}
            placeholder="Confirma tu nueva contraseña"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

