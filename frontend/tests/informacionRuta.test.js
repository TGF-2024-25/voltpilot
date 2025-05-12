import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import InformacionRuta from '../components/InformacionRuta';
import Feather from 'react-native-vector-icons/Feather';

describe('InformacionRuta Component', () => {
  const infoRutaMock = [
    {
      tipo: 'normal',
      origen: 'Madrid',
      destino: 'Barcelona',
      distancia: 500,
      duracion: '5h 30m',
    },
    {
      tipo: 'carga',
      estacion: 'Estacion 1',
      tiempoCarga: '20',
    },
    {
      tipo: 'normal',
      origen: 'Barcelona',
      destino: 'Valencia',
      distancia: 350,
      duracion: '3h 45m',
    },
  ];

  it('debería renderizar correctamente el componente', () => {
    const { getByTestId } = render(<InformacionRuta infoRuta={infoRutaMock} />);
    const infoButton = getByTestId('infoRutaButton');
    expect(infoButton).toBeTruthy();
  });

  it('debería abrir y cerrar el modal correctamente', async () => {
    const { getByTestId, getByText } = render(<InformacionRuta infoRuta={infoRutaMock} />);

    const infoButton = getByTestId('infoRutaButton');
    fireEvent.press(infoButton);

    const modalText = getByText('Información de la Ruta');
    expect(modalText).toBeTruthy();

    const closeButton = getByText('Cerrar');
    fireEvent.press(closeButton);

    await waitFor(() => {
      expect(modalText).not.toBeVisible();
    });
  });

  it('debería calcular correctamente la duración y distancia total de la ruta', () => {
    const { getByText } = render(<InformacionRuta infoRuta={infoRutaMock} />);

    const totalDistanciaText = getByText('850.0 km');
    const totalTiempoText = getByText('9h 15m');
    
    expect(totalDistanciaText).toBeTruthy();
    expect(totalTiempoText).toBeTruthy();
  });

  it('debería mostrar la información de los tramos correctamente', () => {
    const { getByText, getByTestId } = render(<InformacionRuta infoRuta={infoRutaMock} />);
    
    // Abrir el modal
    const infoButton = getByTestId('infoRutaButton');
    fireEvent.press(infoButton);

    // Verificamos que los tramos se muestren correctamente
    const tramo1 = getByText('Madrid');
    const tramo2 = getByText('Barcelona');
    const tramo3 = getByText('500 km');
    const tramo4 = getByText('5h 30m');
    
    expect(tramo1).toBeTruthy();
    expect(tramo2).toBeTruthy();
    expect(tramo3).toBeTruthy();
    expect(tramo4).toBeTruthy();
  });

  it('debería mostrar la información de carga correctamente', () => {
    const { getByText } = render(<InformacionRuta infoRuta={infoRutaMock} />);

    // Abrimos el modal
    const infoButton = getByTestId('infoRutaButton');
    fireEvent.press(infoButton);

    // Verificamos que el tramo de carga esté visible
    const estacionText = getByText('Estacion 1');
    const tiempoCargaText = getByText('20 de espera');

    expect(estacionText).toBeTruthy();
    expect(tiempoCargaText).toBeTruthy();
  });

  it('debería calcular correctamente el formato de tiempo', () => {
    const { getByText } = render(<InformacionRuta infoRuta={infoRutaMock} />);
    
    const tiempoFormateado = '5h 31m'; // 5 horas y 31 minutos
    const tramoText = getByText(tiempoFormateado);
    expect(tramoText).toBeTruthy();
  });

  it('debería cambiar el estado de modalVisible al presionar el botón', () => {
    const { getByTestId } = render(<InformacionRuta infoRuta={infoRutaMock} />);
    
    const infoButton = getByTestId('infoRutaButton');
    fireEvent.press(infoButton);

    // Verificamos que el modal esté visible
    expect(getByTestId('modalContent')).toBeTruthy();
  });
});
