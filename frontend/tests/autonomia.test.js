import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Autonomia from '../src/components/Autonomia';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { routingAPI } from '../src/services/api';

// Mock de las funciones
jest.mock('../src/services/api', () => ({
  routingAPI: {
    getAutonomia: jest.fn(() => Promise.resolve({ inicial: 40, minima: 20 })),
    setAutonomia: jest.fn(() => Promise.resolve(true)),
  }
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

describe('Autonomia Component', () => {
  beforeEach(async () => {
    AsyncStorage.getItem.mockImplementation(async (key) => {
      if (key === 'uid') return 'test-uid';
      if (key === 'autonomia') return '120';
      return null;
    });
  });

  test('renderiza correctamente y abre el modal', async () => {
    const { getByText, getByTestId } = render(<Autonomia />);

    const button = getByTestId('autonomiaButton');
    expect(button).toBeTruthy();

    fireEvent.press(button);
    await waitFor(() => expect(getByText('Configuración de autonomía')).toBeTruthy());
  });

  test('Carga y muestra datos de la autonomía desde API', async () => {
    const { getByTestId, getByText, queryByText } = render(<Autonomia />);

    fireEvent.press(getByTestId('autonomiaButton'));

    expect(queryByText('Configuración de autonomía')).toBeTruthy();

    await waitFor(() => {
      expect(getByText('Auntonomía Inicial: 40%')).toBeTruthy();
      expect(getByText('Autonomía Mínima: 20%')).toBeTruthy();
      expect(getByText('Autonomía total del vehículo (km):')).toBeTruthy();
    });
  });

  test('Guarda correctamente los datos al pulsar "Aceptar"', async () => {
    const { getByText, getByTestId } = render(<Autonomia />);

    fireEvent.press(getByTestId('autonomiaButton'));

    await waitFor(() => expect(getByText('Aceptar')).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByText('Aceptar'));
    });

    await waitFor(() => {
      expect(routingAPI.setAutonomia).toHaveBeenCalledWith({
        uid: 'test-uid',
        inicial: 40,
        minima: 20,
        total: 120,
      });
    });
  });

  test('Método getPreferencias devuelve valores correctos', async () => {
    const ref = React.createRef();
    const { getByTestId } = render(<Autonomia ref={ref} />);

    fireEvent.press(getByTestId('autonomiaButton'));

    await waitFor(() => {
      const result = ref.current.getAutonomia();
      expect(result).toEqual({
        inicialKm: (40 / 100) * 120, 
        minimaKm: (20 / 100) * 120, 
        totalKm: 120,
      });
    });
  });

  test('resetAutonomia establece ini a 100', async () => {
    const ref = React.createRef();
    const { getByTestId, getByText } = render(<Autonomia ref={ref} />);

    fireEvent.press(getByTestId('autonomiaButton'));

    await waitFor(() => expect(getByText('Auntonomía Inicial: 40%')).toBeTruthy());

    act(() => {
      ref.current.resetAutonomia();
    });

    await waitFor(() => {
      expect(getByText('Auntonomía Inicial: 100%')).toBeTruthy();
    });
  });

  test('Modifica sliders y se llama a la API con los valores correctos', async () => {
    const { getByTestId, getByText } = render(<Autonomia />);
    fireEvent.press(getByTestId('autonomiaButton'));

    const sliderInicial = await waitFor(() => getByTestId('sliderInicial'));

    act(() => {
      fireEvent(sliderInicial, 'onSlidingComplete', 60);
    });

    //routingAPI.setAutonomia.mockClear();
    await act(async () => {
      fireEvent.press(getByText('Aceptar'));
    });

    await waitFor(() => {
      expect(routingAPI.setAutonomia).toHaveBeenCalledWith({
        uid: 'test-uid',
        inicial: 60,
        minima: 20,
        total: 120,
      });
    });
  });

  test('Puede cancelar correctamente y cerrar el modal', async () => {
    const { getByTestId, getByText, queryByText } = render(<Autonomia />);

    fireEvent.press(getByTestId('autonomiaButton'));
    await waitFor(() => expect(getByText('Cancelar')).toBeTruthy());

    fireEvent.press(getByText('Cancelar'));
    await waitFor(() => {
      expect(queryByText('Configuración de autonomía')).toBeNull();
    });
  });

  test('No llama a getAutonomia si no hay UID', async () => {
    jest.clearAllMocks();

    AsyncStorage.getItem.mockResolvedValueOnce(null);
    render(<Autonomia />);

    await waitFor(() => {
      expect(routingAPI.getAutonomia).not.toHaveBeenCalled();
    });
  });
});
