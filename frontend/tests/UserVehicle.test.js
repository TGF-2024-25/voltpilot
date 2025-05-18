import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserVehicleScreen from '../src/views/UserVehicle';
import { AuthContext } from '../src/contexts/AuthContext';
import { userAPI } from '../src/services/api';

// Mock de las dependencias
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockSetParams = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    setParams: mockSetParams,
  }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock('../src/services/api', () => ({
  userAPI: {
    updateVehicle: jest.fn(),
    deletevehicle: jest.fn(),
  },
}));

// Mock de Alert.alert
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  // Simular clic en el botón "Eliminar" cuando se llama a Alert.confirm
  if (title === 'Confirmar eliminación' && buttons && buttons.length > 1) {
    buttons[1].onPress && buttons[1].onPress();
  }
});

describe('UserVehicleScreen', () => {
  const mockVehicles = [
    {
      vid: '1',
      marca: 'Tesla',
      modelo: 'Model 3',
      autonomia: '400',
      tipo: 'Eléctrico',
      seleccionado: false,
    },
    {
      vid: '2',
      marca: 'Nissan',
      modelo: 'Leaf',
      autonomia: '250',
      tipo: 'Eléctrico',
      seleccionado: true,
    },
  ];

  const mockCheckToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockImplementation(async (key) => {
      if (key === 'vehicles') return JSON.stringify(mockVehicles);
      if (key === 'uid') return 'user123';
      return null;
    });
    AsyncStorage.setItem.mockResolvedValue();
    userAPI.updateVehicle.mockResolvedValue({
      data: { userDetail: { vehicles: mockVehicles } },
    });
    userAPI.deletevehicle.mockResolvedValue({
      data: { userDetail: { vehicles: [mockVehicles[0]] } },
    });
  });

  const renderWithContext = () =>
    render(
      <AuthContext.Provider value={{ checkToken: mockCheckToken }}>
        <UserVehicleScreen />
      </AuthContext.Provider>
    );

  it('muestra indicador de carga inicialmente', async () => {
    const { getByTestId } = renderWithContext();
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('carga y muestra la lista de vehículos correctamente', async () => {
    const { findByText } = renderWithContext();
    
    expect(await findByText('Tesla Model 3')).toBeTruthy();
    expect(await findByText('Autonomía: 400 km')).toBeTruthy();
    expect(await findByText('Nissan Leaf')).toBeTruthy();
    expect(await findByText('Autonomía: 250 km')).toBeTruthy();
    expect(await findByText('Seleccionado')).toBeTruthy();
  });

  it('selecciona un vehículo correctamente', async () => {
    const { findByText, getAllByText } = renderWithContext();
    
    await findByText('Tesla Model 3');
    const selectButtons = getAllByText('✅');
    fireEvent.press(selectButtons[0]);
    
    await waitFor(() => {
      expect(userAPI.updateVehicle).toHaveBeenCalledWith(expect.objectContaining({
        vid: '1',
        seleccionado: true,
        uid: 'user123'
      }));
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('vehicles', expect.any(String));
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('autonomia', '400');
      expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Vehículo seleccionado correctamente');
      expect(mockCheckToken).toHaveBeenCalled();
    });
  });

  it('elimina un vehículo correctamente', async () => {
    const { findByText, getAllByText } = renderWithContext();
    
    await findByText('Tesla Model 3');
    const deleteButtons = getAllByText('🗑️');
    fireEvent.press(deleteButtons[0]);
    
    await waitFor(() => {
      expect(userAPI.deletevehicle).toHaveBeenCalledWith({ 
        uid: 'user123', 
        vid: '1' 
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('vehicles', expect.any(String));
      expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Vehículo eliminado correctamente');
      expect(mockCheckToken).toHaveBeenCalled();
    });
  });

  it('navega a la pantalla de edición cuando se presiona el botón de editar', async () => {
    const { findByText, getAllByText } = renderWithContext();
    
    await findByText('Tesla Model 3');
    const editButtons = getAllByText('✏️');
    fireEvent.press(editButtons[0]);
    
    expect(mockNavigate).toHaveBeenCalledWith('Vehiculo', { 
      vehicleData: mockVehicles[0] 
    });
  });

  it('navega a la pantalla de añadir vehículo cuando se presiona el botón de añadir', async () => {
    const { findByText } = renderWithContext();
    
    const addButton = await findByText('Añadir Vehículo');
    fireEvent.press(addButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('Vehiculo', { 
      vehicleData: expect.objectContaining({
        marca: '',
        modelo: '',
        autonomia: '',
        tipo: '',
        seleccionado: false,
      }) 
    });
  });

  it('muestra mensaje cuando no hay vehículos', async () => {
    AsyncStorage.getItem.mockImplementation(async (key) => {
      if (key === 'vehicles') return JSON.stringify([]);
      if (key === 'uid') return 'user123';
      return null;
    });
    
    const { findByText } = renderWithContext();
    
    expect(await findByText('No tienes vehículos registrados')).toBeTruthy();
  });
});