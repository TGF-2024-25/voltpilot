import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import UserVehicleScreen from '../src/views/UserVehicle';
import VehicleScreen from '../src/views/Vehicle';
import { AuthContext } from "../src/contexts/AuthContext";
import { userAPI } from '../src/services/api';

// Simular dependencias pero mantener la navegación real
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../src/services/api', () => ({
  userAPI: { 
    updateVehicle: jest.fn(),
    deletevehicle: jest.fn()
  },
}));

// Simular Alert para seguir las llamadas pero ejecutar los manejadores
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (title === 'Confirmar eliminación' && buttons && buttons.length > 1) {
    // Ejecutar acción de confirmación de eliminación
    buttons[1].onPress && buttons[1].onPress();
    return;
  }

  if (buttons && buttons.length > 0) {
    const botonOK = buttons.find(button => button.text === 'OK');
    if (botonOK) {
      botonOK.onPress && botonOK.onPress();
    }
  }
});

// Simular componente Picker
jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  
  const Picker = ({ children, selectedValue, onValueChange }) => (
    <View testID="picker-container">
      {React.Children.map(children, child => {
        if (child.props.value === selectedValue) {
          return (
            <View testID="selected-item">
              <Text>{child.props.label}</Text>
            </View>
          );
        }
        return (
          <TouchableOpacity 
            testID={`picker-item-${child.props.value}`}
            onPress={() => onValueChange(child.props.value)}
          >
            <Text>{child.props.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
  
  Picker.Item = ({ label, value }) => <View />;
  
  return { Picker };
});

// Crear estructura de navegación real
const Stack = createStackNavigator();

describe('Pruebas de Integración de Vehículo', () => {
  const vehiculosMock = [
    {
      vid: '1',
      marca: 'Tesla',
      modelo: 'Model 3',
      autonomia: '400',
      tipo: 'Tipo 2',
      seleccionado: false,
    },
    {
      vid: '2',
      marca: 'Nissan',
      modelo: 'Leaf',
      autonomia: '250',
      tipo: 'Tipo 1',
      seleccionado: true,
    },
  ];
  
  const uid = 'user123';
  const mockCheckToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar implementación simulada de AsyncStorage
    AsyncStorage.getItem.mockImplementation(async (key) => {
      if (key === 'vehicles') return JSON.stringify(vehiculosMock);
      if (key === 'uid') return uid;
      return null;
    });
    AsyncStorage.setItem.mockResolvedValue();
    
    // Configurar respuestas simuladas de API
    userAPI.updateVehicle.mockResolvedValue({
      data: { 
        userDetail: { 
          vehicles: [
            { ...vehiculosMock[0], modelo: 'Model 3 Updated', autonomia: '450' },
            vehiculosMock[1]
          ] 
        } 
      },
    });
    
    userAPI.deletevehicle.mockResolvedValue({
      data: { userDetail: { vehicles: [vehiculosMock[0]] } },
    });
  });

  const WrapperNavegacion = () => (
    <AuthContext.Provider value={{ checkToken: mockCheckToken }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="VehiclesList" component={UserVehicleScreen} />
          <Stack.Screen name="Vehiculo" component={VehicleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );

  test('completa el flujo de selección de vehículo', async () => {
    const { findByText, getAllByText } = render(<WrapperNavegacion />);
    
    // Cargar la lista de vehículos
    await findByText('Tesla Model 3');
    
    // Seleccionar el primer vehículo (que no está seleccionado actualmente)
    const botonesSeleccionar = getAllByText('✅');
    fireEvent.press(botonesSeleccionar[0]);
    
    // Verificar que se muestra el mensaje de éxito
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Vehículo seleccionado correctamente');
    });
    
    // Verificar que se guardó la autonomía y tipo del vehículo seleccionado
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('autonomia', '400');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('tipo', 'Tipo 2');
    
    // Verificar que se actualizó el token
    expect(mockCheckToken).toHaveBeenCalled();
  });


  test('cancela la edición del vehículo', async () => {
    const { findByText, getAllByText, getByPlaceholderText } = render(<WrapperNavegacion />);
    
    // Cargar la lista de vehículos
    await findByText('Tesla Model 3');
    
    // Navegar a editar el primer vehículo
    const botonesEditar = getAllByText('✏️');
    fireEvent.press(botonesEditar[0]);
    
    // Verificar que la pantalla de edición se cargó
    await waitFor(() => {
      expect(getByPlaceholderText('Ingresa marca').props.value).toBe('Tesla');
    });
    
    // Hacer cambios
    fireEvent.changeText(getByPlaceholderText('Ingresa marca'), 'BMW');
    
    // Cancelar edición
    fireEvent.press(await findByText('Cancelar'));
    
    // Verificar que volvimos a la lista sin guardar
    await findByText('Tesla Model 3');
    expect(userAPI.updateVehicle).not.toHaveBeenCalled();
  });
});