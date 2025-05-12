import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Autonomia from '../components/Autonomia';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { routingAPI } from '../services/api';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('../services/api', () => ({
  routingAPI: {
    getAutonomia: jest.fn(),
    setAutonomia: jest.fn(),
  },
}));

describe('Autonomia Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente y abre el modal', async () => {
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === 'uid') return Promise.resolve('123');
      if (key === 'autonomia') return Promise.resolve('150');
    });

    routingAPI.getAutonomia.mockResolvedValue({
      inicial: 40,
      minima: 20,
    });

    const { getByRole, getByText, queryByText } = render(<Autonomia />);

    const button = getByRole('button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(getByText('Configuración de autonomía')).toBeTruthy();
      expect(getByText('Autonomía Mínima: 20%')).toBeTruthy();
    });
  });

  it('getAutonomia devuelve los valores correctos', async () => {
    const ref = React.createRef();

    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === 'uid') return Promise.resolve('456');
      if (key === 'autonomia') return Promise.resolve('100');
    });

    routingAPI.getAutonomia.mockResolvedValue({
      inicial: 25,
      minima: 10,
    });

    const { findByText } = render(<Autonomia ref={ref} />);
    await findByText('Configuración de autonomía');

    const result = ref.current.getAutonomia();
    expect(result).toEqual({
      inicialKm: 25,
      minimaKm: 10,
      totalKm: 100,
    });
  });

  it('envía los datos al backend al pulsar Aceptar', async () => {
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === 'uid') return Promise.resolve('789');
      if (key === 'autonomia') return Promise.resolve('120');
    });

    routingAPI.getAutonomia.mockResolvedValue({
      inicial: 50,
      minima: 25,
    });

    const { getByText, getByRole } = render(<Autonomia />);

    const button = getByRole('button');
    fireEvent.press(button);

    const aceptar = await waitFor(() => getByText('Aceptar'));
    fireEvent.press(aceptar);

    await waitFor(() => {
      expect(routingAPI.setAutonomia).toHaveBeenCalledWith({
        uid: '789',
        inicial: 50,
        minima: 25,
        total: 120,
      });
    });
  });
});
