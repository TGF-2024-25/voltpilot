import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from '../src/views/ProfileScreen';
import { AuthContext } from "../src/contexts/AuthContext";
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  clear: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

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

describe('ProfileScreen', () => {
  // reset los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // test1: Verifica que el componente se renderiza correctamente
  test('renders correctly', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ name: 'Test User' }));
    
    const mockCheckToken = jest.fn();
    const { getByText, findByText } = render(
      <AuthContext.Provider value={{ checkToken: mockCheckToken }}>
        <ProfileScreen />
      </AuthContext.Provider>
    );
    
    expect(getByText('Mi Cuenta')).toBeTruthy();
    
    await findByText('Test User');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user');
  });

  // test2: Verifica que los botones funcionan correctamente
  test('navigates to correct screens when options are pressed', () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ name: 'Test User' }));
    
    const mockCheckToken = jest.fn();
    const { getByText } = render(
      <AuthContext.Provider value={{ checkToken: mockCheckToken }}>
        <ProfileScreen />
      </AuthContext.Provider>
    );
    
    // userdetails
    fireEvent.press(getByText('Detalles de Usuario'));
    expect(mockNavigate).toHaveBeenCalledWith('UserDetails');
    
    // mis vehiculos
    fireEvent.press(getByText('Mis Vehículos'));
    expect(mockNavigate).toHaveBeenCalledWith('MisVehiculos');
  });
  
  // test3: logout
  test('logout clears AsyncStorage and checks token', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ name: 'Test User' }));
    
    const mockCheckToken = jest.fn();
    const { getByText } = render(
      <AuthContext.Provider value={{ checkToken: mockCheckToken }}>
        <ProfileScreen />
      </AuthContext.Provider>
    );
    
    fireEvent.press(getByText('Cerrar Sesión'));
    
    expect(AsyncStorage.clear).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(mockCheckToken).toHaveBeenCalled();
    });
  });
  
});