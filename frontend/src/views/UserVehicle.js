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
  const [vehicleData, setVehicleData] = useState({
    marca: '',
    modelo: '',
    autonomia: '',
    tipo: '',
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // carga datos de vehiculo de usuario
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setLoading(true);
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const parsedData = JSON.parse(userJson);
          const vehicleJson = parsedData.vehicle || {
            marca: '',
            modelo: '',
            autonomia: '',
            tipo: ''
          };
          setVehicleData(vehicleJson);
          setOriginalData(vehicleJson);
        }
      } catch (error) {
        console.error('Error loading user vehicle data:', error);
        Alert.alert('Error', 'No se pudo cargar la información de coche del usuario');
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  // entrada de datos de coche de usuario
  const handleChange = (field, value) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  // guarda los datos de usuario a firestore
  const handleSave = async () => {
    try {
      setLoading(true);
      const uid = await AsyncStorage.getItem('uid');
      
      // 
      const completeVehicleData = {
        marca: vehicleData.marca || '',
        modelo: vehicleData.modelo || '',
        autonomia: vehicleData.autonomia || '',
        tipo: vehicleData.tipo || '',
        uid
      };
      
      const response = await userAPI.updateVehicle(completeVehicleData);
      
      if (response.data && response.data.userDetail) {
        const updatedVehicle = response.data.userDetail.vehicle || vehicleData;
        await AsyncStorage.setItem('user', JSON.stringify(response.data.userDetail));
        setOriginalData(updatedVehicle);
        setVehicleData(updatedVehicle);
        Alert.alert('Éxito', 'Vehículo actualizado correctamente');
      }
    } catch (error) {
      console.error('Error saving vehicle data:', error);
      Alert.alert('Error', 'No se pudo actualizar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  // cancelar los cambios
  const handleCancel = () => {
    setVehicleData(originalData);
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
          <Text style={styles.label}>Marca</Text>
          <TextInput
            style={styles.input}
            value={vehicleData?.marca|| ''}
            onChangeText={(text) => handleChange('marca', text)}
            placeholder="Ingresa marca"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Modelo</Text>
          <TextInput
            style={styles.input}
            value={vehicleData?.modelo|| ''}
            onChangeText={(text) => handleChange('modelo', text)}
            placeholder="Ingresa modelo"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Autonomia</Text>
          <TextInput
            style={styles.input}
            value={vehicleData?.autonomia|| ''}
            onChangeText={(text) => handleChange('autonomia', text)}
            placeholder="Ingresa Autonomia"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Tipo de conector</Text>
          <TextInput
            style={styles.input}
            value={vehicleData?.tipo|| ''}
            onChangeText={(text) => handleChange('tipo', text)}
            placeholder="Ingresa tipo de conector"
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