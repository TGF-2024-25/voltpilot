import React, { useState, useEffect,useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { userAPI } from '../services/api';
import { AuthContext } from "../contexts/AuthContext"; 
import { useRoute } from '@react-navigation/native';
import styles from '../styles/userVehicleStyle';




export default function UserVehicleScreen() {
  const route = useRoute();
  const { checkToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState({
    vid: '',
    marca: '',
    modelo: '',
    autonomia: '',
    tipo: '',
    seleccionado: false,
  });

  // Cargar vehículos del usuario
  useEffect(() => {
    if (route.params?.refreshVehicles) {
      loadUserVehicles();
      navigation.setParams({ refreshVehicles: undefined });
    }else{
      loadUserVehicles();
    }
  }, [route.params?.refreshVehicles]);

  const loadUserVehicles = async () => {
    try {
      setLoading(true);
      const vehiclejson = await AsyncStorage.getItem('vehicles');
      if (vehiclejson) {
        const parsedData = JSON.parse(vehiclejson);
        // Verificar si user.vehicles existe, si no, crear un array vacío
        const userVehicles = parsedData || [];
        setVehicles(userVehicles);
      }
    } catch (error) {
      console.error('Error loading user vehicles:', error);
      Alert.alert('Error', 'No se pudo cargar la información de vehículos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVehicle = async (item) => {
    try {
      setLoading(true);
      const uid = await AsyncStorage.getItem('uid');
      
      // deja en todo deseleccionado los vehiculos
      const updatedVehicles = vehicles.map(vehicle => ({
        ...vehicle,
        seleccionado: false
      }));   

      let finalResponse = null;
      // actualiza en firestore
       for (let i = 0; i < updatedVehicles.length; i++) {
        const currentVehicle = updatedVehicles[i];
        finalResponse = await userAPI.updateVehicle({
          ...currentVehicle,
          uid
        });
      }

      const vehicleIndex = updatedVehicles.findIndex(vehicle => vehicle.vid === item.vid);
      if (vehicleIndex !== -1) {
        updatedVehicles[vehicleIndex].seleccionado = true;
      }

      finalResponse = await userAPI.updateVehicle({...updatedVehicles[vehicleIndex],uid});
      
      if (finalResponse.data && finalResponse.data.userDetail) {
        const updatedVehiclesFromServer = finalResponse.data.userDetail.vehicles || [];
        await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehiclesFromServer));
        await AsyncStorage.setItem("autonomia", item.autonomia); // Guardar autonomía del primer vehículo seleccionado
        await AsyncStorage.setItem("tipo",item.tipo); 
        setVehicles(updatedVehiclesFromServer);
        Alert.alert('Éxito', 'Vehículo seleccionado correctamente');
        loadUserVehicles();
        checkToken();
      }
    } catch (error) {
      console.error('Error selecting vehicle:', error);
      Alert.alert('Error', 'No se pudo seleccionar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  //  deletevehicle: ({uid,vid}) => apiRequest('/users/vehicle', 'DELETE', {uid,vid}, true),
  const handleDeleteVehicle = async (vid) => {    
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro que desea eliminar este vehículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const uid = await AsyncStorage.getItem('uid');
              console.log('uid:', uid);
              console.log('vid:', vid);
              // Eliminar el vehículo de la API y actualizar el estado local
              const response = await userAPI.deletevehicle({ uid, vid});
              const vehiclesData = response.data.userDetail.vehicles || []; // Asegúrate de que vehiclesData sea un array
              await AsyncStorage.setItem('vehicles', JSON.stringify(vehiclesData));              
              setVehicles(vehiclesData || []); // Actualiza el estado de vehículos
              Alert.alert('Éxito', 'Vehículo eliminado correctamente');
              await checkToken(); // refresca el view
            } catch (error) {
              console.error('Error deleting vehicle:', error);
              Alert.alert('Error', 'No se pudo eliminar el vehículo');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Modifica la función handleEditVehicle para navegar a Vehicle.js
const handleEditVehicle = (item) => {
  console.log('datos que va a edita:', JSON.stringify(item));
  navigation.navigate('Vehiculo', { 
    vehicleData: item 
  });
};

  const handleAddVehicle = () => {
    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newVehicleData = {
      vid: randomId,
      marca: '',
      modelo: '',
      autonomia: '',
      tipo: '',
      seleccionado: false,
    };
    
    navigation.navigate('Vehiculo', { vehicleData: newVehicleData });
  };

  

// Simplifica el renderVehicleItem para un diseño más limpio
const renderVehicleItem = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.marca} {item.modelo}</Text>
      <Text style={styles.cardDetail}>Autonomía: {item.autonomia} km</Text>
      <Text style={styles.cardDetail}>Tipo: {item.tipo}</Text>
      {item.seleccionado && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedText}>Seleccionado</Text>
        </View>
      )}
    </View>
    <View style={styles.cardActions}>
    {!item.seleccionado && (
        <TouchableOpacity 
          style={[styles.actionButton, styles.selectButton]} 
          onPress={() => handleSelectVehicle(item)}
        >
          <Text style={{fontSize: 20}}>✅</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => handleEditVehicle(item)}
      >
        <Text style={{fontSize: 20, color: "#007bff"}}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => handleDeleteVehicle(item.vid)}
      >
        <Text style={{fontSize: 20, color: "#ff3b30"}}>🗑️</Text>
      </TouchableOpacity>
    </View>
  </View>
);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" testID="loading-indicator"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Vehículos</Text>
      
      {vehicles.length > 0 ? (
        <FlatList
        data={vehicles}
        renderItem={renderVehicleItem}
        keyExtractor={(item) => item.vid}
        contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes vehículos registrados</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddVehicle}
      >
        <Text style={{fontSize: 24, color: "white"}}>➕</Text>
        <Text style={styles.addButtonText}>Añadir Vehículo</Text>
      </TouchableOpacity>
    </View>
  );
}

