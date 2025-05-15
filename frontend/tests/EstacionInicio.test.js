console.warn = jest.fn();
console.error = jest.fn();
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { CargadorProvider } from "../src/contexts/EstacionContext";
import * as Location from "expo-location";

// Mock de la API de ubicación
jest.mock("expo-location", () => ({
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 40.416775, longitude: -3.70379 },
  }),
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({
    status: "granted",
  }),
}));

// Mock de la API de estaciones
jest.mock("../src/services/api", () => ({
  estacionAPI: {
    getEstaciones: jest.fn().mockResolvedValue(mockCargadores),
  },
}));

// Simula los datos de cargadores
const mockCargadores = [
  {
    id: "1",
    location: { latitude: 40.416775, longitude: -3.70379 },
    displayName: { text: "Estación 1" },
    evChargeOptions: {
      connectorCount: 12,
      connectorAggregation: [
        {
          type: "EV_CONNECTOR_TYPE_TYPE_2",
          maxChargeRateKw: 22,
          count: 12,
          availableCount: 11,
          outOfServiceCount: 0,
          availabilityLastUpdateTime: "2025-05-13T16:05:00Z",
        },
      ],
    },
  },
  {
    id: "2",
    location: { latitude: 40.417775, longitude: -3.70479 },
    displayName: { text: "Estación 2" },
    evChargeOptions: {
      connectorCount: 20,
      connectorAggregation: [
        {
          type: "EV_CONNECTOR_TYPE_CCS_COMBO_2",
          maxChargeRateKw: 30,
          count: 8,
        },
        {
          type: "EV_CONNECTOR_TYPE_CCS_COMBO_2",
          maxChargeRateKw: 80,
          count: 6,
        },
        {
          type: "EV_CONNECTOR_TYPE_TYPE_2",
          maxChargeRateKw: 22,
          count: 6,
        },
      ],
    },
  },
  {
    id: "3",
    nationalPhoneNumber: "324 349 322",
    internationalPhoneNumber: "+34 324 349 322",
    formattedAddress: "C. prueba, Madrid, Spain",
    location: {
      latitude: 40.344499,
      longitude: -3.7842429,
    },
    rating: 0,
    googleMapsUri: "",
    websiteUri: "https://miWeb.com/",
    businessStatus: "OPERATIONAL",
    userRatingCount: 0,
    displayName: {
      text: "Estación 3",
      languageCode: "en",
    },
    currentOpeningHours: {
      openNow: true,
      periods: [
        {
          open: {
            day: 2,
            hour: 0,
            minute: 0,
            truncated: true,
            date: {
              year: 2025,
              month: 5,
              day: 13,
            },
          },
          close: {
            day: 1,
            hour: 23,
            minute: 59,
            truncated: true,
            date: {
              year: 2025,
              month: 5,
              day: 19,
            },
          },
        },
      ],
      weekdayDescriptions: [
        "Monday: Open 24 hours",
        "Tuesday: Open 24 hours",
        "Wednesday: Open 24 hours",
        "Thursday: Open 24 hours",
        "Friday: Open 24 hours",
        "Saturday: Open 24 hours",
        "Sunday: Open 24 hours",
      ],
    },
    shortFormattedAddress: "C. prueba, 18, Centro, Madrid",
    reviews: [],
    photos: [],
    evChargeOptions: {
      connectorCount: 20,
      connectorAggregation: [
        {
          type: "EV_CONNECTOR_TYPE_CCS_COMBO_2",
          maxChargeRateKw: 60,
          count: 8,
        },
        {
          type: "EV_CONNECTOR_TYPE_CCS_COMBO_2",
          maxChargeRateKw: 150,
          count: 6,
        },
        {
          type: "EV_CONNECTOR_TYPE_TYPE_2",
          maxChargeRateKw: 22,
          count: 6,
        },
      ],
    },
  },
];

describe("VistaEstacionInicio", () => {
  it("renderiza los componentes de VistaEstacionInicio correctamente", () => {
    const VistaEstacionInicio = require("../src/views/EstacionInicio").default;

    const { getByTestId } = render(
      <NavigationContainer>
        <CargadorProvider>
          <VistaEstacionInicio />
        </CargadorProvider>
      </NavigationContainer>,
    );
    expect(getByTestId("map-view")).toBeTruthy();
    expect(getByTestId("location-button")).toBeTruthy();
    expect(getByTestId("filter-button")).toBeTruthy();
    expect(getByTestId("info-button")).toBeTruthy();
    expect(getByTestId("search-bar-container")).toBeTruthy();
  });

  it("muestra infoModal al pulsar el botón de información", async () => {
    const VistaEstacionInicio = require("../src/views/EstacionInicio").default;

    const { getByTestId, queryByTestId } = render(
      <NavigationContainer>
        <CargadorProvider>
          <VistaEstacionInicio />
        </CargadorProvider>
      </NavigationContainer>,
    );

    // Verifica que el modal no esté visible inicialmente
    expect(queryByTestId("info-modal")).toBeNull();

    // Simula el evento de pulsar el botón con act
    await act(async () => {
      fireEvent.press(getByTestId("info-button"));
    });

    // Verifica que el modal ahora esté visible
    expect(getByTestId("info-modal")).toBeTruthy();
  });

  it("muestra filterModal al pulsar el botón de filtro", async () => {
    const VistaEstacionInicio = require("../src/views/EstacionInicio").default;

    const { getByTestId, queryByTestId } = render(
      <NavigationContainer>
        <CargadorProvider>
          <VistaEstacionInicio />
        </CargadorProvider>
      </NavigationContainer>,
    );

    // Verifica que el modal no esté visible inicialmente
    expect(queryByTestId("filter-modal")).toBeNull();

    // Simula el evento de pulsar el botón con act
    await act(async () => {
      fireEvent.press(getByTestId("filter-button"));
    });

    // Verifica que el modal ahora esté visible
    expect(getByTestId("filter-modal")).toBeTruthy();
  });

  it("llama a Location.getCurrentPositionAsync al pulsar el botón de centrar ubicación", async () => {
    const VistaEstacionInicio = require("../src/views/EstacionInicio").default;

    // Mock de la respuesta de la ubicación
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 1, longitude: 2 },
    });

    const { getByTestId } = render(
      <NavigationContainer>
        <CargadorProvider>
          <VistaEstacionInicio />
        </CargadorProvider>
      </NavigationContainer>,
    );

    // Pulsa el botón de centrar ubicación con act
    await act(async () => {
      fireEvent.press(getByTestId("location-button"));
    });

    // Verificar que se ha llamado a la función de ubicación
    expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
  });

  it("renderiza el número de marcadores exactos en función de cargadoresFiltrados", () => {
    const VistaEstacionInicio = require("../src/views/EstacionInicio").default;

    const { queryAllByTestId } = render(
      <NavigationContainer>
        <CargadorProvider>
          <VistaEstacionInicio cargadoresInicialesFiltrados={mockCargadores} />
        </CargadorProvider>
      </NavigationContainer>,
    );

    // Verifica que el número de marcadores es igual al número de cargadoresFiltrados
    const markers = queryAllByTestId(/marker-/);
    expect(markers.length).toBe(mockCargadores.length);
  });

  it("no se renderiza las estaciones que no están en cargadoresFiltrados", () => {
    const VistaEstacionInicio = require("../src/views/EstacionInicio").default;

    const { queryByTestId, getByTestId } = render(
      <NavigationContainer>
        <CargadorProvider>
          <VistaEstacionInicio cargadoresInicialesFiltrados={mockCargadores} />
        </CargadorProvider>
      </NavigationContainer>,
    );

    // Verifica que los marcadores se han renderizado con los ids correctos
    expect(getByTestId("marker-1")).toBeTruthy();
    expect(getByTestId("marker-2")).toBeTruthy();
    expect(getByTestId("marker-3")).toBeTruthy();
    expect(queryByTestId("marker-0")).toBeNull();
  });

  it("aplica filtros y solo muestra los marcadores que cumplen los criterios", async () => {
    const VistaEstacionInicio = require("../src/views/EstacionInicio").default;

    const { getByTestId, queryByTestId, queryAllByTestId } = render(
      <NavigationContainer>
        <CargadorProvider>
          <VistaEstacionInicio initialRegion={false} cargadoresIniciales={mockCargadores} cargadoresInicialesFiltrados={mockCargadores} />
        </CargadorProvider>
      </NavigationContainer>,
    );
    // Verifica que inicialmente se muestran todos los marcadores
    expect(queryAllByTestId(/marker-/).length).toBe(3);

    // Pulsa el botón de filtro con act
    await act(async () => {
      fireEvent.press(getByTestId("filter-button"));
    });

    // Verifica que el modal de filtro se muestra
    expect(getByTestId("filter-modal")).toBeTruthy();

    // Verifica que el slider de kWh mínimo está presente
    expect(getByTestId("min-kwh-slider")).toBeTruthy();

    // Simula la selección de la potencia mínima con act
    await act(async () => {
      fireEvent(getByTestId("min-kwh-slider"), "onSlidingComplete", 80);
    });

    // Verifica que el valor del slider se ha actualizado
    expect(getByTestId("min-kwh-slider")).toHaveProp("value", 80);

    // Aplica el filtro con act
    await act(async () => {
      fireEvent.press(getByTestId("apply-filters-button"));
    });

    // Verifica que los marcadores se han actualizado correctamente
    expect(queryByTestId("marker-1")).toBeNull();
    expect(getByTestId("marker-2")).toBeTruthy();
    expect(getByTestId("marker-3")).toBeTruthy();

    // Verifica que el número de marcadores se ha reducido a 2
    expect(queryAllByTestId(/marker-/).length).toBe(2);
  });
});
