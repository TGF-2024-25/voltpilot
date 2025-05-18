import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import ProfileScreen from '../src/views/ProfileScreen';
import UserDetails from '../src/views/UserDetails';
import { AuthContext } from "../src/contexts/AuthContext";
import { userAPI } from '../src/services/api';

// Simular las dependencias necesarias pero mantener la navegación real
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../src/services/api', () => ({
  userAPI: { updateProfile: jest.fn() },
}));

// Simular Alert para seguir las llamadas pero ejecutar los manejadores
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (buttons && buttons.length > 0 && buttons[0].text === 'OK') {
    buttons[0].onPress && buttons[0].onPress();
  }
});

// Simular componente de iconos
jest.mock('@expo/vector-icons', () => {
  const { View, Text } = require('react-native');
  return {
    MaterialIcons: ({ name, size, color }) => (
      <View testID={`icon-${name}`}>
        <Text>{name}</Text>
      </View>
    ),
  };
});

// Crear estructura de navegación real
const Stack = createStackNavigator();

describe('Flujo de Integración de Perfil', () => {
  const mockUser = {
    name: 'Usuario Prueba',
    email: 'prueba@ejemplo.com',
    phoneNumber: '123456789',
    address: 'Dirección de Prueba',
  };
  const uid = 'uid123';
  const mockCheckToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar implementación simulada de AsyncStorage
    AsyncStorage.getItem.mockImplementation(async (key) => {
      if (key === 'user') return JSON.stringify(mockUser);
      if (key === 'uid') return uid;
      return null;
    });
    AsyncStorage.setItem.mockResolvedValue();
    AsyncStorage.clear.mockResolvedValue();
    
    // Configurar respuesta simulada de la API
    userAPI.updateProfile.mockResolvedValue({
      data: { userDetail: { ...mockUser, name: 'Usuario Actualizado' } },
    });
  });

  const NavigationWrapper = () => (
    <AuthContext.Provider value={{ checkToken: mockCheckToken }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="UserDetails" component={UserDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );

  test('navega desde el perfil a los detalles del usuario y actualiza el perfil', async () => {
    const { getByText, findByText, findByPlaceholderText } = render(<NavigationWrapper />);
    
    // Verificar que la pantalla de perfil carga correctamente
    expect(await findByText('Usuario Prueba')).toBeTruthy();
    expect(getByText('Mi Cuenta')).toBeTruthy();
    
    // Navegar a Detalles de Usuario
    fireEvent.press(getByText('Detalles de Usuario'));
    
    // Verificar que la pantalla de detalles de usuario cargó y muestra los datos del usuario
    const nameInput = await findByPlaceholderText('Ingresa tu nombre');
    expect(nameInput.props.value).toBe('Usuario Prueba');
    
    // Actualizar perfil de usuario
    fireEvent.changeText(nameInput, 'Usuario Actualizado');
    fireEvent.press(getByText('Guardar'));
    
    // Verificar que la API de actualización de perfil fue llamada con los datos correctos
    await waitFor(() => {
      expect(userAPI.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Usuario Actualizado',
          uid,
        })
      );
      expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Perfil actualizado correctamente');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', expect.any(String));
      expect(mockCheckToken).toHaveBeenCalled();
    });
  });

  test('completa el flujo de cierre de sesión', async () => {
    const { getByText, findByText } = render(<NavigationWrapper />);
    
    // Verificar que la pantalla de perfil carga correctamente
    expect(await findByText('Usuario Prueba')).toBeTruthy();
    
    // Cerrar sesión
    fireEvent.press(getByText('Cerrar Sesión'));
    
    // Verificar que se borró AsyncStorage y se llamó a checkToken
    expect(AsyncStorage.clear).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockCheckToken).toHaveBeenCalled();
    });
  });
});