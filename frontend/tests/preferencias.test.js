import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import React from 'react';
import Preferencias from '../src/components/Preferencias';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { routingAPI } from '../src/services/api';

// Mock de las funciones
jest.mock('../src/services/api', () => ({
  routingAPI: {
    getPreferencias: jest.fn(() => Promise.resolve({
      peajes: true,
      autopista: false,
      ferry: true,
      traffic: false,
    })),
    setPreferencias: jest.fn(() => Promise.resolve(true)),
  }
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

describe('Preferencias Component', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockImplementation(async (key) => {
      if (key === 'uid') return 'test-uid';
      return null;
    });
  });

  test('renderiza correctamente y abre el modal', async () => {
    const ref = React.createRef();
    const { getByTestId, getByText } = render(<Preferencias ref={ref} />);

    const button = getByTestId('filterButton');
    expect(button).toBeTruthy();

    fireEvent.press(button);

    await waitFor(() => {
      expect(getByText('Preferencias de Ruta')).toBeTruthy();
    });
  });

  test('Carga y muestra las preferencias correctamente', async () => {
    const ref = React.createRef();
    const { getByTestId, getByText } = render(<Preferencias ref={ref} />);

    fireEvent.press(getByTestId('filterButton'));

    await waitFor(() => {
      expect(getByText('Evitar ferris')).toBeTruthy();
      expect(getByText('Evitar autopistas')).toBeTruthy();
      expect(getByText('Evitar peajes')).toBeTruthy();
      expect(getByText('Tráfico en tiempo real')).toBeTruthy();
    });
  });

  test('Guarda correctamente las preferencias al pulsar "Aceptar"', async () => {
    const ref = React.createRef();
    const { getByTestId, getByText } = render(<Preferencias ref={ref} />);

    fireEvent.press(getByTestId('filterButton'));

    await waitFor(() => expect(getByText('Aceptar')).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByText('Aceptar'));
    });

    await waitFor(() => {
      expect(routingAPI.setPreferencias).toHaveBeenCalledWith({
        uid: 'test-uid',
        peajes: true,
        autopista: false,
        ferry: true,
        traffic: false,
      });
    });
  });

  test('Modifica correctamente una preferencia (switch)', async () => {
    const ref = React.createRef();
    const { getByTestId, getByText } = render(<Preferencias ref={ref} />);

    fireEvent.press(getByTestId('filterButton'));

    await waitFor(() => expect(getByText('Aceptar')).toBeTruthy());

    // Simulamos el cambio del switch "Evitar peajes"
    const switchPeajes = getByTestId('switch-peajes'); // asegúrate de tener testID en el switch
    fireEvent(switchPeajes, 'valueChange', false); // cambiamos a false

    await act(async () => {
      fireEvent.press(getByText('Aceptar'));
    });

    await waitFor(() => {
      expect(routingAPI.setPreferencias).toHaveBeenCalledWith({
        uid: 'test-uid',
        peajes: false,  // aquí se espera que haya cambiado
        autopista: false,
        ferry: true,
        traffic: false,
      });
    });
  });

  test('Puede cancelar correctamente y cerrar el modal', async () => {
    const ref = React.createRef();
    const { getByTestId, getByText, queryByText } = render(<Preferencias ref={ref} />);

    fireEvent.press(getByTestId('filterButton'));
    await waitFor(() => expect(getByText('Cancelar')).toBeTruthy());

    fireEvent.press(getByText('Cancelar'));

    await waitFor(() => {
      expect(queryByText('Preferencias de Ruta')).toBeNull();
    });
  });

  test('Método getPreferencias devuelve valores correctos', async () => {
    const ref = React.createRef();
    const { getByTestId } = render(<Preferencias ref={ref} />);

    fireEvent.press(getByTestId('filterButton'));

    await waitFor(() => {
      const result = ref.current.getPreferencias();
      expect(result).toEqual({
        peajes: true,
        autopista: false,
        ferry: true,
        traffic: false,
      });
    });
  });

  test('No llama a getPreferencias si no hay UID', async () => {
    jest.clearAllMocks();

    AsyncStorage.getItem.mockResolvedValueOnce(null);
    render(<Preferencias />);

    await waitFor(() => {
      expect(routingAPI.getPreferencias).not.toHaveBeenCalled();
    });
  });

});
