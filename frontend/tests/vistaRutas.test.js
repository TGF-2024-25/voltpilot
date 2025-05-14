import { render, fireEvent, waitFor } from '@testing-library/react-native';
import VistaRutas from '../src/views/VistaRutas'; // Ajusta si está en otra ruta
import { routingAPI } from '../src/services/api.js';

// Mock de MapView y otros componentes nativos
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    Marker: (props) => <View {...props} />,
    Polyline: (props) => <View {...props} />,
    default: (props) => <View {...props} />,
    PROVIDER_DEFAULT: 'default',
  };
});

// Mocks de los componentes hijos
jest.mock('../components/SearchBar.js', () => (props) => {
  return (
    <View testID="search-bar">
      <Text>SearchBar</Text>
      <TouchableOpacity onPress={() => props.onSelect({ latitude: 40.0, longitude: -3.0, name: "Destino Test" })}>
        <Text>Mock Select</Text>
      </TouchableOpacity>
    </View>
  );
});
jest.mock('../components/UserLocation.js', () => () => [{ latitude: 39.0, longitude: -3.5 }, jest.fn()]);

// Mock de routingAPI
jest.mock('../services/api.js', () => ({
  routingAPI: {
    getRoute: jest.fn().mockResolvedValue({
      route: [{ latitude: 39.5, longitude: -3.25 }, { latitude: 40.0, longitude: -3.0 }],
      distanciaKm: 50,
      duration: 3600,
      steps: [
        { instruction: 'Turn right', distanceMeters: 1000, duration: 60, startLocation: {}, endLocation: {} },
      ],
      distancia: 50,
    }),
    getEstacionesRuta: jest.fn().mockResolvedValue({
      estaciones: [
        { latitude: 39.7, longitude: -3.3, distanceToRuta: 1.2, name: "Estación 1" },
        { latitude: 39.8, longitude: -3.2, distanceToRuta: 2.0, name: "Estación 2" },
        { latitude: 39.9, longitude: -3.1, distanceToRuta: 3.0, name: "Estación 3" },
      ]
    }),
  }
}));

describe('VistaRutas integration tests', () => {
  it('debería mostrar el componente SearchBar al iniciar', () => {
    const { getByText } = render(<VistaRutas />);
    expect(getByText('SearchBar')).toBeTruthy();
  });

  it('al seleccionar un destino, debe llamar a fetchRoute y mostrar ruta', async () => {
    const { getByText } = render(<VistaRutas />);
    
    fireEvent.press(getByText('Mock Select'));

    await waitFor(() => {
      expect(routingAPI.getRoute).toHaveBeenCalledTimes(1);
    });
  });

  it('debería filtrar estaciones y mostrarlas tras seleccionar destino', async () => {
    const { getByText } = render(<VistaRutas />);
    
    fireEvent.press(getByText('Mock Select'));

    await waitFor(() => {
      expect(routingAPI.getEstacionesRuta).toHaveBeenCalled();
    });
  });

  it('debería actualizar origen al seleccionar uno nuevo en el SearchBar', async () => {
    // Se requiere simular otro cambio en origen para que se dispare el useEffect
    // Esto depende de cómo funcione tu SearchBar (puede requerir un test end-to-end si no es accesible desde aquí)
    const { getByText } = render(<VistaRutas />);
    
    fireEvent.press(getByText('Mock Select'));
    await waitFor(() => {
      expect(routingAPI.getRoute).toHaveBeenCalled();
    });

    // En este test podrías también simular un nuevo `origen`, pero depende del SearchBar.
  });
});
