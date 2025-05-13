import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import Instrucciones from '../src/components/InstruccionesRuta'; // Ajusta la ruta si es necesario

const mockInstruccionesRuta = [
  { instruction: 'Gira a la derecha', distanceMeters: 500 },
  { instruction: 'Sigue recto', distanceMeters: 1500 },
  { instruction: 'Gira a la izquierda', distanceMeters: 200 },
];

describe('Instrucciones', () => {

  it('debe renderizar correctamente el botón de "Cómo llegar"', () => {
    render(<Instrucciones instruccionesRuta={mockInstruccionesRuta} />);
    const button = screen.getByText('Cómo llegar');
    expect(button).toBeTruthy();
  });

  it('debe abrir el modal y mostrar las instrucciones al hacer click en "Cómo llegar"', async () => {
    render(<Instrucciones instruccionesRuta={mockInstruccionesRuta} />);
    fireEvent.press(screen.getByText('Cómo llegar'));

    await waitFor(() => {
      const modal = screen.getByTestId('modal');
      expect(modal).toBeTruthy();
      
      // Verifica que las instrucciones correctas se están mostrando
      expect(screen.getByText('Gira a la derecha: 500 metros')).toBeTruthy();
      expect(screen.getByText('Sigue recto: 1500 metros')).toBeTruthy();
      expect(screen.getByText('Gira a la izquierda: 200 metros')).toBeTruthy();
    });
  });

  it('debe cerrar el modal al hacer click en "Cerrar"', async () => {
    render(<Instrucciones instruccionesRuta={mockInstruccionesRuta} />);
    fireEvent.press(screen.getByText('Cómo llegar'));

    await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Cerrar'));

    await waitFor(() => {
        expect(screen.queryByTestId('modal')).toBeNull();
    });
   });

});
