import React, { useState, useEffect } from 'react';
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

export default function MiPerfil() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
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
      userData.password
      const uid = await AsyncStorage.getItem('uid');
      if (password.password !== password.confirmPassword) {
        password.password = '';
        password.confirmPassword = '';
        Alert.alert('Error', 'Las contraseñas no coinciden');
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
    }
  };

  // cancelar los cambios
  const handleCancel = () => {
    setUserData(originalData);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
            value={userData.phone}
            onChangeText={(text) => handleChange('phone', text)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#007bff',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#333',
  },
});