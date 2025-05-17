import { render, fireEvent } from "@testing-library/react-native";
import EstacionFiltro from "../src/views/EstacionFiltro";

describe("EstacionFiltro", () => {
  const mockOnClose = jest.fn();
  const mockOnApplyFilters = jest.fn();

  const initialFilters = {
    selectedConnectors: ["1"],
    minKwh: 10,
    searchRadius: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Verifica que el componente se renderiza correctamente
  it("renderiza correctamente los elementos principales", () => {
    const { getByText, getByTestId } = render(
      <EstacionFiltro onClose={mockOnClose} onApplyFilters={mockOnApplyFilters} initialFilters={initialFilters} />,
    );

    expect(getByText("Filtros")).toBeTruthy();
    expect(getByText("Conectores")).toBeTruthy();
    expect(getByText("kWh mínimo")).toBeTruthy();
    expect(getByText("Radio de búsqueda")).toBeTruthy();
    expect(getByTestId("min-kwh-slider")).toBeTruthy();
    expect(getByTestId("search-radius-slider")).toBeTruthy();
    expect(getByText("Aplicar filtros")).toBeTruthy();
    expect(getByText("Borrar filtros")).toBeTruthy();
    expect(getByText("Cerrar")).toBeTruthy();
  });

  // Test 2: Verifica que permite seleccionar y deseleccionar conectores
  it("permite seleccionar y deseleccionar conectores", () => {
    const { getByText } = render(
      <EstacionFiltro
        onClose={mockOnClose}
        onApplyFilters={mockOnApplyFilters}
        initialFilters={{ ...initialFilters, selectedConnectors: [] }}
      />,
    );

    // Seleccionar un tipo de conector
    const tipo2 = getByText("Tipo 2");
    fireEvent.press(tipo2);
    // El estilo del boton debería cambiar al estado seleccionado
    expect(tipo2.props.style).toContainEqual(expect.objectContaining({ color: "white" }));

    // Deseleccionar el tipo de conector
    fireEvent.press(tipo2);
    expect(tipo2.props.style).toContainEqual(expect.objectContaining({ color: "#333" }));
  });

  // Test 3: Verifica que el slider de kWh mínimo se actualiza correctamente
  it("actualiza el valor del slider de kWh mínimo", () => {
    const { getByTestId, getByText } = render(
      <EstacionFiltro onClose={mockOnClose} onApplyFilters={mockOnApplyFilters} initialFilters={initialFilters} />,
    );

    // actualiza el valor del slider de kWh mínimo
    const slider = getByTestId("min-kwh-slider");
    fireEvent(slider, "onSlidingComplete", 50);

    // Verifica que el texto y el valor del slider se actualizan correctamente
    expect(getByText("50 kWh")).toBeTruthy();
    expect(slider.props.value).toBe(50);
  });

  // Test 4: Verifica que el slider de radio de búsqueda se actualiza correctamente
  it("actualiza el valor del slider de radio de búsqueda", () => {
    const { getByTestId, getByText } = render(
      <EstacionFiltro onClose={mockOnClose} onApplyFilters={mockOnApplyFilters} initialFilters={initialFilters} />,
    );

    // actualiza el valor del slider de radio de búsqueda
    const slider = getByTestId("search-radius-slider");
    fireEvent(slider, "onSlidingComplete", 12);

    // Verifica que el texto y el valor del slider se actualizan correctamente
    expect(getByText("12 km")).toBeTruthy();
    expect(slider.props.value).toBe(12);
  });

  // Test 5: Verifica que el botón de "Aplicar filtros" llama a las funciones correctas
  it("llama a onApplyFilters y onClose al pulsar 'Aplicar filtros'", () => {
    const { getByText } = render(
      <EstacionFiltro onClose={mockOnClose} onApplyFilters={mockOnApplyFilters} initialFilters={initialFilters} />,
    );

    fireEvent.press(getByText("Aplicar filtros"));
    expect(mockOnApplyFilters).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  // Test 6: Verifica que el botón de "Borrar filtros" restablece los filtros
  it("restablece los filtros al pulsar 'Borrar filtros'", () => {
    const { getByText, getByTestId } = render(
      <EstacionFiltro
        onClose={mockOnClose}
        onApplyFilters={mockOnApplyFilters}
        initialFilters={{
          selectedConnectors: ["1", "2"],
          minKwh: 50,
          searchRadius: 10,
        }}
      />,
    );

    // Verifica que los filtros iniciales se aplican correctamente
    expect(getByTestId("min-kwh-slider").props.value).toBe(50);
    expect(getByTestId("search-radius-slider").props.value).toBe(10);

    // Restablece los filtros
    fireEvent.press(getByText("Borrar filtros"));
    expect(getByTestId("min-kwh-slider").props.value).toBe(1);
    expect(getByTestId("search-radius-slider").props.value).toBe(1);
    expect(getByText("1 kWh")).toBeTruthy();
    expect(getByText("1 km")).toBeTruthy();
  });

  // Test 7: Verifica que el botón de "Cerrar" llama a la función onClose
  it("llama a onClose al pulsar 'Cerrar'", () => {
    const { getByText } = render(
      <EstacionFiltro onClose={mockOnClose} onApplyFilters={mockOnApplyFilters} initialFilters={initialFilters} />,
    );

    fireEvent.press(getByText("Cerrar"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
