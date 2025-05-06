import React, { useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons'; // Make sure you have expo/vector-icons installed
import { AuthContext } from '../App';


export default function UserVehicleScreen() {
  const { checkToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState({
    marca: '',
    modelo: '',
    autonomia: '',
    tipo: '',
    selecionado: false,
  });

  // Cargar vehículos del usuario
  useEffect(() => {
    loadUserVehicles();
  }, []);

  const loadUserVehicles = async () => {
    try {
      setLoading(true);
      const vehiclejson = await AsyncStorage.getItem('vehicles');
      if (userJson) {
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
const handleEditVehicle = (index) => {
  // Navegar a Vehicle.js pasando los datos del vehículo seleccionado
  navigation.navigate('Vehicle', { 
    vehicleData: vehicles[index],
  });
};

  const handleAddVehicle = () => {
    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    navigation.navigate('Vehicle', randomId);
  };

  

// Simplifica el renderVehicleItem para un diseño más limpio
const renderVehicleItem = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.marca} {item.modelo}</Text>
      <Text style={styles.cardDetail}>Autonomía: {item.autonomia} km</Text>
      <Text style={styles.cardDetail}>Tipo: {item.tipo}</Text>
    </View>
    <View style={styles.cardActions}>
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => handleEditVehicle(item)}
      >
        <Ionicons name="pencil" size={20} color="#007bff" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => handleDeleteVehicle(item.vid)}
      >
        <Ionicons name="trash" size={20} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  </View>
);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Añadir Vehículo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 80, // Espacio para el botón de añadir
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});