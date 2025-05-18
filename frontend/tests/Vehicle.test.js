import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VehicleScreen from '../src/views/Vehicle';
import { userAPI } from '../src/services/api';

// Mock de las dependencias
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: {
      vehicleData: {
        vid: 'vehicle123',
        marca: 'Tesla',
        modelo: 'Model 3',
        autonomia: '400',
        tipo: 'Tipo 2',
        seleccionado: false,
      }
    }
  }),
}));

jest.mock('../src/services/api', () => ({
  userAPI: {
    updateVehicle: jest.fn(),
  },
}));

// Mock para @react-native-picker/picker
jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  
  const Picker = (props) => {
    return (
      <View testID="picker-view">
        <Text testID="picker-value">{props.selectedValue}</Text>
        {props.children}
      </View>
    );
  };
  
  Picker.Item = ({ label, value }) => <Text testID={`picker-item-${value}`}>{label}</Text>;
  
  return { Picker };
});

// Mock de Alert.alert
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  // Si hay botones y se presiona "OK", ejecutar onPress
  if (buttons && buttons.length > 0 && buttons[0].text === 'OK') {
    buttons[0].onPress && buttons[0].onPress();
  }
});

describe('VehicleScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockImplementation(async (key) => {
      if (key === 'uid') return 'user123';
      return null;
    });
    userAPI.updateVehicle.mockResolvedValue({
      data: {
        userDetail: {
          vehicles: [
            {
              vid: 'vehicle123',
              marca: 'Tesla',
              modelo: 'Model 3 Updated',
              autonomia: '450',
              tipo: 'Tipo 2',
              seleccionado: false,
            }
          ]
        }
      }
    });
  });

  it('muestra el indicador de carga inicialmente', () => {
    const { getByTestId } = render(<VehicleScreen />);
    
    // Modificar el componente para agregar testID="loading-indicator" al ActivityIndicator
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('carga y muestra los datos del vehículo correctamente en modo edición', async () => {
    const { findByDisplayValue, getByTestId } = render(<VehicleScreen />);
    
    // Esperar a que los datos se carguen y muestren
    expect(await findByDisplayValue('Tesla')).toBeTruthy();
    expect(await findByDisplayValue('Model 3')).toBeTruthy();
    expect(await findByDisplayValue('400')).toBeTruthy();
    expect(getByTestId('picker-value').props.children).toBe('Tipo 2');
  });

  it('maneja la edición de campos correctamente', async () => {
    const { findByDisplayValue, getByPlaceholderText } = render(<VehicleScreen />);
    
    // Esperar a que los campos se carguen
    await findByDisplayValue('Tesla');
    
    // Editar los campos
    fireEvent.changeText(getByPlaceholderText('Ingresa marca'), 'Nissan');
    fireEvent.changeText(getByPlaceholderText('Ingresa modelo'), 'Leaf');
    fireEvent.changeText(getByPlaceholderText('Ingresa Autonomia'), '250');
    
    // Verificar que los campos se actualizaron
    expect(getByPlaceholderText('Ingresa marca').props.value).toBe('Nissan');
    expect(getByPlaceholderText('Ingresa modelo').props.value).toBe('Leaf');
    expect(getByPlaceholderText('Ingresa Autonomia').props.value).toBe('250');
  });

  it('valida que todos los campos sean obligatorios', async () => {
    const { findByDisplayValue, getByPlaceholderText, getByText } = render(<VehicleScreen />);
    
    // Esperar a que los campos se carguen
    await findByDisplayValue('Tesla');
    
    // Borrar un campo obligatorio
    fireEvent.changeText(getByPlaceholderText('Ingresa marca'), '');
    
    // Intentar guardar
    fireEvent.press(getByText('Guardar'));
    
    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error', 
        'Todos los campos son obligatorios. Por favor complete todos los datos del vehículo.',
        expect.anything()
      );
    });
    
    // Verificar que no se llamó a la API
    expect(userAPI.updateVehicle).not.toHaveBeenCalled();
  });

  it('valida que la autonomía sea un número positivo', async () => {
    const { findByDisplayValue, getByPlaceholderText, getByText } = render(<VehicleScreen />);
    
    // Esperar a que los campos se carguen
    await findByDisplayValue('Tesla');
    
    // Ingresar un valor no válido para autonomía
    fireEvent.changeText(getByPlaceholderText('Ingresa Autonomia'), '-50');
    
    // Intentar guardar
    fireEvent.press(getByText('Guardar'));
    
    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error', 
        'La autonomía debe ser un número válido mayor que cero.',
        expect.anything()
      );
    });
    
    // Verificar que no se llamó a la API
    expect(userAPI.updateVehicle).not.toHaveBeenCalled();
  });

  it('guarda los cambios correctamente', async () => {
    const { findByDisplayValue, getByPlaceholderText, getByText } = render(<VehicleScreen />);
    
    // Esperar a que los campos se carguen
    await findByDisplayValue('Tesla');
    
    // Editar los campos
    fireEvent.changeText(getByPlaceholderText('Ingresa marca'), 'Nissan');
    fireEvent.changeText(getByPlaceholderText('Ingresa modelo'), 'Leaf');
    fireEvent.changeText(getByPlaceholderText('Ingresa Autonomia'), '250');
    
    // Guardar cambios
    fireEvent.press(getByText('Guardar'));
    
    // Verificar que se llamó a la API con los datos correctos
    await waitFor(() => {
      expect(userAPI.updateVehicle).toHaveBeenCalledWith({
        marca: 'Nissan',
        modelo: 'Leaf',
        autonomia: '250',
        tipo: 'Tipo 2', // Este valor viene del mock de useRoute
        seleccionado: false,
        vid: 'vehicle123',
        uid: 'user123'
      });
    });
    
    // Verificar que se mostró el mensaje de éxito
    expect(Alert.alert).toHaveBeenCalledWith(
      'Éxito', 
      'Vehículo actualizado correctamente',
      expect.arrayContaining([
        expect.objectContaining({
          text: 'OK',
          onPress: expect.any(Function)
        })
      ])
    );
    
    // Verificar que se navegó de vuelta a la lista de vehículos
    expect(mockNavigate).toHaveBeenCalledWith('VehiclesList', { 
      refreshVehicles: true,
      timestamp: expect.any(Number)
    });
  });

  it('cancela los cambios y regresa a la pantalla anterior', async () => {
    const { findByDisplayValue, getByPlaceholderText, getByText } = render(<VehicleScreen />);
    
    // Esperar a que los campos se carguen
    await findByDisplayValue('Tesla');
    
    // Editar los campos
    fireEvent.changeText(getByPlaceholderText('Ingresa marca'), 'Nissan');
    
    // Cancelar cambios
    fireEvent.press(getByText('Cancelar'));
    
    // Verificar que se regresó a la pantalla anterior
    expect(mockGoBack).toHaveBeenCalled();
    
    // Verificar que no se llamó a la API
    expect(userAPI.updateVehicle).not.toHaveBeenCalled();
  });
});