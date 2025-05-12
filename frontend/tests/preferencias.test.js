import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Preferencias from '../components/Preferencias';
import { routingAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencias
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('../services/api', () => ({
  routingAPI: {
    getPreferencias: jest.fn(),
    setPreferencias: jest.fn(),
  },
}));

jest.mock('react-native-vector-icons/Feather', () => 'Icon');

describe('Preferencias Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el botón de filtro y abre el modal al hacer click', async () => {
    AsyncStorage.getItem.mockResolvedValue('123');
    routingAPI.getPreferencias.mockResolvedValue({
      peajes: true,
      autopista: false,
      ferry: true,
      traffic: false,
    });

    const { getByRole, getByText } = render(<Preferencias />);

    // Botón de filtro visible
    const filterButton = getByRole('button');
    expect(filterButton).toBeTruthy();

    // Abre modal
    await act(async () => {
      fireEvent.press(filterButton);
    });

    await waitFor(() => {
      expect(getByText('Preferencias de Ruta')).toBeTruthy();
    });
  });

  it('permite cambiar switches y enviar preferencias', async () => {
    AsyncStorage.getItem.mockResolvedValue('123');
    routingAPI.getPreferencias.mockResolvedValue({
      peajes: false,
      autopista: false,
      ferry: false,
      traffic: false,
    });

    const { getByText, getAllByRole } = render(<Preferencias />);

    await act(async () => {
      fireEvent.press(getAllByRole('button')[0]); // Botón de abrir modal
    });

    await waitFor(() => {
      expect(getByText('Preferencias de Ruta')).toBeTruthy();
    });

    const aceptarButton = getByText('Aceptar');

    await act(async () => {
      fireEvent.press(aceptarButton);
    });

    await waitFor(() => {
      expect(routingAPI.setPreferencias).toHaveBeenCalledWith({
        uid: '123',
        peajes: false,
        autopista: false,
        ferry: false,
        traffic: false,
      });
    });
  });

  it('llama a getPreferencias al montarse con UID', async () => {
    AsyncStorage.getItem.mockResolvedValue('456');
    routingAPI.getPreferencias.mockResolvedValue({
      peajes: true,
      autopista: true,
      ferry: false,
      traffic: true,
    });

    render(<Preferencias />);

    await waitFor(() => {
      expect(routingAPI.getPreferencias).toHaveBeenCalledWith('456');
    });
  });

  it('no llama a la API si no hay UID en AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    render(<Preferencias />);

    await waitFor(() => {
      expect(routingAPI.getPreferencias).not.toHaveBeenCalled();
    });
  });
});
