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
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const connectorTypes = [
  { label: "Seleccionar tipo de conector", value: "" },
  { label: "Tipo 1 (SAE J1772)", value: "Tipo 1" },
  { label: "Tipo 2 (Mennekes)", value: "Tipo 2" },
  { label: "CHAdeMO", value: "CHAdeMO" },
  { label: "CCS Combo 1", value: "CCS Combo 1" },
  { label: "CCS Combo 2", value: "CCS Combo 2" },
  { label: "Tesla", value: "Tesla" },
  { label: "Schuko (Enchufe doméstico)", value: "Schuko" },
  { label: "Otro", value: "Otro" }
];

export default function VehicleScreen() {
  //recibir datos de vehiculo
  const route = useRoute();
  const editVehicleData = route.params?.vehicleData || {
    vid: '',
    marca: '',
    modelo: '',
    autonomia: '',
    tipo: '',
    seleccionado: false,
  };  const isEditMode = !!editVehicleData;

  const navigation = useNavigation();
  const [vehicleData, setVehicleData] = useState(editVehicleData);
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // carga datos de vehiculo de usuario
  
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        console.log('editVehicleData', editVehicleData);
        setLoading(true);
        setOriginalData(editVehicleData);
        await new Promise(resolve => setTimeout(resolve, 100));

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

      // const vid = vehicleData.vid || ''; // ID del vehículo
      if (!vehicleData?.marca || !vehicleData?.modelo || !vehicleData?.autonomia || !vehicleData?.tipo) {
        Alert.alert('Error', 'Todos los campos son obligatorios. Por favor complete todos los datos del vehículo.',[{ text: 'OK' }]);
        return;
      }
      
      // validar la autonomia
      const autonomia = parseInt(vehicleData.autonomia);
      if (isNaN(autonomia) || autonomia <= 0) {
        Alert.alert('Error', 'La autonomía debe ser un número válido mayor que cero.',[{ text: 'OK' }]);
        return;
      }
      // 
      
      const completeVehicleData = {
        marca: vehicleData.marca || '',
        modelo: vehicleData.modelo || '',
        autonomia: vehicleData.autonomia || '',
        tipo: vehicleData.tipo || '',
        seleccionado: vehicleData.seleccionado || false,
        vid:vehicleData.vid,
        uid
      };
      console.log('datos que va a guarda:', JSON.stringify(completeVehicleData));

      const response = await userAPI.updateVehicle(completeVehicleData);
      
      if (response.data && response.data.userDetail) {
        const updatedVehicles = response.data.userDetail.vehicles;
        await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
        setOriginalData(updatedVehicles);
        setVehicleData(updatedVehicles);

        //await AsyncStorage.setItem("autonomia", updatedVehicles.autonomia);
        //await AsyncStorage.setItem("tipo", updatedVehicles.tipo);
        Alert.alert(
          'Éxito', 
          'Vehículo actualizado correctamente',
          [
            { 
              text: 'OK', 
              onPress: () => {
                navigation.navigate('VehiclesList', { 
                  refreshVehicles: true,
                  timestamp: Date.now()
                });
              }
            }
          ]
        );
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
    navigation.goBack(); // Regresar a la pantalla anterior
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" testID="loading-indicator" />
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
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={vehicleData?.tipo || ''}
              style={styles.picker}
              onValueChange={(itemValue) => handleChange('tipo', itemValue)}
            >
              {connectorTypes.map((connector) => (
                <Picker.Item 
                  key={connector.value} 
                  label={connector.label} 
                  value={connector.value} 
                />
              ))}
            </Picker>
          </View>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
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