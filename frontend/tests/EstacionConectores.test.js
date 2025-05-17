import { render, fireEvent, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

// Mock de react-native-gesture-handler, necesario para evitar errores al usar FlatList
jest.mock("react-native-gesture-handler", () => {
  const RN = require("react-native");
  return {
    FlatList: RN.FlatList,
  };
});

import VistaEstacionConectores from "../src/views/EstacionConectores";

// Mock del contexto de Estacion
jest.mock("../src/contexts/EstacionContext", () => ({
  useCargador: jest.fn(),
}));

// Mock de Clipboard
jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(),
}));

// Mock de Alert
jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("VistaEstacionConectores", () => {
  // Mock de datos para un cargador con conectores
  const mockCargadorConConectores = {
    googleMapsUri: "https://fake-url-1/?cid=123456789",
    evChargeOptions: {
      connectorCount: 6,
      connectorAggregation: [
        {
          type: "EV_CONNECTOR_TYPE_TYPE_2",
          maxChargeRateKw: 22.0,
          count: 4,
          availableCount: 2,
          outOfServiceCount: 1,
          availabilityLastUpdateTime: "2025-05-15T14:30:00Z",
        },
        {
          type: "EV_CONNECTOR_TYPE_CCS_COMBO_1",
          maxChargeRateKw: 50.0,
          count: 2,
          availableCount: 0,
          outOfServiceCount: 0,
          availabilityLastUpdateTime: "2025-05-15T14:30:00Z",
        },
      ],
    },
  };

  // Mock de datos para un cargador sin conectores
  const mockCargadorSinConectores = {
    googleMapsUri: "https://fake-url-2/?cid=123456789",
    evChargeOptions: {
      connectorCount: 0,
      connectorAggregation: [],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Verificar que se renderizan los conectores disponibles correctamente
  it("renderiza los conectores disponibles correctamente", () => {
    require("../src/contexts/EstacionContext").useCargador.mockReturnValue({
      selectedCargador: mockCargadorConConectores,
    });

    const { getByText, getAllByText, getByTestId } = render(<VistaEstacionConectores />);

    // Verificar que se muestran los tipos de conectores formateados
    expect(getByText("Type 2 - 22.0 kW")).toBeTruthy();
    expect(getByText("Ccs Combo 1 - 50.0 kW")).toBeTruthy();

    // Verificar que se muestran las actualizaciones de tiempo, 16:30 es correcto por el formato UTC +2 en españa
    expect(getAllByText("Actualizado 16:30")).toBeTruthy();

    // Verificar que se muestra la disponibilidad correctamente
    expect(getByText("2 / 4")).toBeTruthy();
    expect(getByText("0 / 2")).toBeTruthy();

    // Verificar que se muestra el botón de compartir
    expect(getByText("Compartir ubicación")).toBeTruthy();
    expect(getByTestId("share-button")).toBeTruthy();
  });

  // Test 2: Verificar que se renderiza el mensaje de no disponibilidad
  it("muestra mensaje cuando no hay conectores", () => {
    // Configurar el mock del contexto
    require("../src/contexts/EstacionContext").useCargador.mockReturnValue({
      selectedCargador: mockCargadorSinConectores,
    });

    const { getByText } = render(<VistaEstacionConectores />);

    // Verificar que se muestra el mensaje de no disponibilidad
    expect(getByText("No se pudo encontrar información sobre conectores.")).toBeTruthy();
  });

  // Test 3: Verificar que se copia la URL al pulsar el botón de compartir
  it("copia la URL al pulsar el botón de compartir ubicación", async () => {
    require("../src/contexts/EstacionContext").useCargador.mockReturnValue({
      selectedCargador: mockCargadorConConectores,
    });

    const { getByTestId } = render(<VistaEstacionConectores />);

    const shareButton = getByTestId("share-button");

    // Pulsar el botón de compartir
    await act(async () => {
      fireEvent.press(shareButton);
    });

    // Verificar que se llamó a Clipboard.setStringAsync con el URI correcto
    expect(Clipboard.setStringAsync).toHaveBeenCalledWith(mockCargadorConConectores.googleMapsUri);

    // Verificar que se muestra la alerta correspondiente
    expect(Alert.alert).toHaveBeenCalledWith("Enlace copiado", "El enlace de la ubicación se ha copiado.");
  });

  // Test 4: Verificar que se muestra un mensaje de error si no hay URI al compartir
  it("muestra un mensaje de error si no hay URI al compartir", async () => {
    require("../src/contexts/EstacionContext").useCargador.mockReturnValue({
      selectedCargador: {
        evChargeOptions: {
          connectorCount: 1,
          connectorAggregation: [
            {
              type: "EV_CONNECTOR_TYPE_TYPE_2",
              maxChargeRateKw: 22.0,
              count: 4,
              availableCount: 2,
            },
          ],
        },
      },
    });

    const { getByTestId } = render(<VistaEstacionConectores />);
    const shareButton = getByTestId("share-button");

    // Pulsar el botón de compartir
    await act(async () => {
      fireEvent.press(shareButton);
    });

    // Verificar que se muestra la alerta de error
    expect(Alert.alert).toHaveBeenCalledWith("Error", "No se pudo obtener información.");

    // Verificar que no se llamó a Clipboard.setStringAsync
    expect(Clipboard.setStringAsync).not.toHaveBeenCalled();
  });

  // Test 5: Verificar que se renderizan los conectores sin información de disponibilidad
  it("renderiza conectores sin información de disponibilidad", () => {
    require("../src/contexts/EstacionContext").useCargador.mockReturnValue({
      selectedCargador: {
        googleMapsUri: "https://fake-url/?cid=123456789",
        evChargeOptions: {
          connectorAggregation: [
            {
              type: "EV_CONNECTOR_TYPE_TYPE_2",
              maxChargeRateKw: 22.0,
              count: 4,
            },
          ],
        },
      },
    });

    const { getByText } = render(<VistaEstacionConectores />);

    // Verificar que se muestra el tipo de conector formateado
    expect(getByText("Type 2 - 22.0 kW")).toBeTruthy();

    // Verificar que se muestra "Sin información" para la disponibilidad
    expect(getByText("Sin información")).toBeTruthy();
  });

  // Test 6: Verificar que se renderizan los conectores de diferentes tipos
  it("formatea correctamente los diferentes tipos de conectores", () => {
    // Configurar el mock del contexto con diferentes tipos de conectores
    require("../src/contexts/EstacionContext").useCargador.mockReturnValue({
      selectedCargador: {
        evChargeOptions: {
          connectorAggregation: [
            { type: "EV_CONNECTOR_TYPE_TYPE_2", maxChargeRateKw: 22.0, count: 1, availableCount: 1 },
            { type: "EV_CONNECTOR_TYPE_CCS_COMBO_1", maxChargeRateKw: 50.0, count: 1, availableCount: 1 },
            { type: "EV_CONNECTOR_TYPE_CHADEMO", maxChargeRateKw: 50.0, count: 1, availableCount: 1 },
            { type: "EV_CONNECTOR_TYPE_TESLA", maxChargeRateKw: 7.4, count: 1, availableCount: 1 },
          ],
        },
      },
    });

    const { getByText } = render(<VistaEstacionConectores />);

    // Verificar el formateo de los diferentes tipos
    expect(getByText("Type 2 - 22.0 kW")).toBeTruthy();
    expect(getByText("Ccs Combo 1 - 50.0 kW")).toBeTruthy();
    expect(getByText("Chademo - 50.0 kW")).toBeTruthy();
    expect(getByText("Tesla - 7.4 kW")).toBeTruthy();
  });
});
