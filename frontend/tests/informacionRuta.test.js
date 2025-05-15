import { render, fireEvent, waitFor } from '@testing-library/react-native';
import InformacionRuta from '../src/components/InformacionRuta';

describe('InformacionRuta Component', () => {
  const mockInfoRuta = [
    {
      tipo: 'normal',
      origen: 'Madrid',
      destino: 'Toledo',
      distancia: 72,
      duracion: '3600s'
    },
    {
      tipo: 'carga',
      estacion: 'Estación ABC',
      tiempoCarga: '20 min'
    },
    {
      tipo: 'normal',
      origen: 'Toledo',
      destino: 'Córdoba',
      distancia: 320,
      duracion: '14400s'
    }
  ];

  test('renderiza correctamente el botón de información', () => {
    const { getByTestId } = render(<InformacionRuta infoRuta={mockInfoRuta} />);
    const button = getByTestId('infoRutaButton');
    expect(button).toBeTruthy();
  });

  test('abre el modal y muestra información de los tramos', async () => {
    const { getByTestId, getByText, getAllByText } = render(<InformacionRuta infoRuta={mockInfoRuta} />);

    fireEvent.press(getByTestId('infoRutaButton'));

    await waitFor(() => {
      expect(getByText('Información de la Ruta')).toBeTruthy();
      expect(getByText('Madrid')).toBeTruthy();
      expect(getAllByText('Toledo').length).toBeGreaterThan(0);
      expect(getByText('Córdoba')).toBeTruthy();
      expect(getByText('Estación ABC')).toBeTruthy();
      expect(getByText('20 min de espera')).toBeTruthy();
    });
  });

  test('muestra correctamente el total de la ruta', async () => {
    const { getByTestId, getByText } = render(<InformacionRuta infoRuta={mockInfoRuta} />);
    fireEvent.press(getByTestId('infoRutaButton'));

    await waitFor(() => {
      expect(getByText('Total de la Ruta')).toBeTruthy();
      expect(getByText('392.0 km')).toBeTruthy(); // 72 + 320
      expect(getByText('5h 20m')).toBeTruthy();    // 1h + 4h + 30min
    });
  });

  test('cierra correctamente el modal al pulsar "Cerrar"', async () => {
    const { getByTestId, getByText, queryByText } = render(<InformacionRuta infoRuta={mockInfoRuta} />);
    fireEvent.press(getByTestId('infoRutaButton'));

    await waitFor(() => expect(getByText('Cerrar')).toBeTruthy());

    fireEvent.press(getByText('Cerrar'));

    await waitFor(() => {
      expect(queryByText('Información de la Ruta')).toBeNull();
    });
  });
});
