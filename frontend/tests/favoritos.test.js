import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Favoritos from '../src/components/Favoritos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { routingAPI } from '../src/services/api';

// Mock de las funciones
jest.mock('../src/services/api', () => ({
  routingAPI: {
    getFavoritos: jest.fn(() => Promise.resolve([])),
    setFavorito: jest.fn(() => Promise.resolve(true)),
    deleteFavorito: jest.fn(() => Promise.resolve(true)),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('test-uid')),
}));

jest.mock('../src/components/SearchBar', () => { // Simula una selección automática cuando el componente se monta
  const React = require('react');

  return ({ onSelect }) => {
    React.useEffect(() => {
      onSelect({ latitude: 12.34, longitude: 56.78 });
    }, []);

    return null;
  };
});

beforeEach(async () => {
  await act(async () => {
    AsyncStorage.getItem.mockResolvedValue('test-uid');
});
});

describe('Favoritos Component', () => {
  
  test('Renderiza correctamente los elementos básicos', () => {
    const { getByTestId } = render(<Favoritos />);
    
    // botón favoritos presente
    expect(getByTestId('favButton')).toBeTruthy();
  });

  test('Abre y cierra el modal correctamente', () => {
    const { getByTestId, getByText } = render(<Favoritos />);
    
    const favButton = getByTestId('favButton');
    fireEvent.press(favButton);                     // Abrimos el modal

    expect(getByText('Destinos de Ruta Favoritos')).toBeTruthy(); // Verificar modal Visible

    const backButton = getByText('Cancelar');
    fireEvent.press(backButton); // Cerrar modal
    
    // Verificamos que el modal se cierra
    expect(() => getByText('Destinos de Ruta Favoritos')).toThrow();
  })

  test('Agrega un nuevo favorito correctamente', async () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(<Favoritos />);

    fireEvent.press(getByTestId('favButton')); // Abrimos el modal

    const inputField = getByPlaceholderText('Nombre personalizado');

    // Envolviendo la actualización del texto en act()
    await act(async () => {
      fireEvent.changeText(inputField, 'Nuevo Favorito');
    });

    // Verificamos que el botón "Guardar como Favorito" esté habilitado
    const saveButton = getByText('Guardar como Favorito');
    expect(saveButton).not.toBeDisabled();

    // Envolviendo el envío del nuevo favorito en act()
    await act(async () => {
      fireEvent.press(saveButton);
    });
    
    // Verificamos que el método setFavorito fue llamado
    await waitFor(() => {
      expect(routingAPI.setFavorito).toHaveBeenCalledWith({
        description: 'Nuevo Favorito',
        location: { latitude: 12.34, longitude: 56.78 },
        uid: 'test-uid',
      });
    });
  });

  test('Elimina favorito correctamente y refresca lista', async () => {
    const mockFavorito = { description: 'Favorito a eliminar', location: { latitude: 1, longitude: 2 } };

    routingAPI.getFavoritos.mockResolvedValueOnce([mockFavorito]);
    const { getByTestId, getByText } = render(<Favoritos />);

    fireEvent.press(getByTestId('favButton'));
    await waitFor(() => expect(getByText(mockFavorito.description)).toBeTruthy());

    const deleteButton = getByTestId(`delItemButton-${mockFavorito.description}`);
    await act(async () => {
      fireEvent.press(deleteButton);
    });

    expect(routingAPI.deleteFavorito).toHaveBeenCalledWith({
      uid: 'test-uid',
      description: mockFavorito.description,
      location: mockFavorito.location,
    });
  });

  test('Selecciona favorito llama callback y cierra modal', async () => {
    const mockFavorito = { description: 'Favorito', location: { latitude: 1, longitude: 2 } };
    routingAPI.getFavoritos.mockResolvedValueOnce([mockFavorito]);

    const onSelectMock = jest.fn();

    const { getByTestId, getByText, queryByText } = render(<Favoritos on_selected_destino={onSelectMock} />);

    fireEvent.press(getByTestId('favButton'));
    await waitFor(() => expect(getByText(mockFavorito.description)).toBeTruthy());

    const itemButton = getByTestId(`favItemButton-${mockFavorito.description}`);
    await act(async () => {
      fireEvent.press(itemButton);

    });

    expect(onSelectMock).toHaveBeenCalledWith(mockFavorito);

    await waitFor(() => {
      expect(queryByText('Destinos de Ruta Favoritos')).toBeNull(); // modal cerrado
    });
  });

});
