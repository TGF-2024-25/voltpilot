const { render, waitFor } = require("@testing-library/react-native");

describe("VistaEstacionFotos", () => {
  // Test 1: Verifica que el componente se renderiza correctamente
  it("muestra el mensaje si no hay fotos", async () => {
    jest.doMock("../src/contexts/EstacionContext", () => ({
      useCargador: () => ({
        selectedCargador: {
          photos: [],
        },
      }),
    }));

    const VistaEstacionFotos = require("../src/views/EstacionFotos").default;

    const { getByText } = render(<VistaEstacionFotos />);
    await waitFor(() => {
      expect(getByText("No hay fotos disponibles.")).toBeTruthy();
    });
  });
});
