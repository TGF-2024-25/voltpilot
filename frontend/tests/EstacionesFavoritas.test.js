console.warn = jest.fn();
console.error = jest.fn();
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import VistaEstacionesFavoritas from "../src/views/EstacionesFavoritas";
const api = require("../src/services/api").estacionAPI;

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }), // Importante que este definido de esta manera
  useFocusEffect: (cb) => cb(), // Simula el efecto de enfoque
}));

// simula las funciones de la API
jest.mock("../src/services/api", () => ({
  estacionAPI: {
    getEstacionesFavoritas: jest.fn(),
    getInfoCargador: jest.fn(),
    deleteEstacionFavorita: jest.fn(),
  },
}));

// Simula el contexto de EstacionContext
jest.mock("../src/contexts/EstacionContext", () => ({
  useCargador: () => ({
    setEstacionFavorita: jest.fn(),
    setSelectedCargador: jest.fn(),
  }),
}));

const mockStation = {
  id: "fake-id-123",
  formattedAddress: "Calle Falsa 123, Ciudad Inventada",
  rating: 4.8,
  displayName: { text: "Electrolinera Ficticia" },
  currentOpeningHours: { openNow: false },
};

describe("VistaEstacionesFavoritas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require("../src/services/api").estacionAPI.getEstacionesFavoritas.mockResolvedValue([mockStation.id]);
    require("../src/services/api").estacionAPI.getInfoCargador.mockResolvedValue(mockStation);
    require("../src/services/api").estacionAPI.deleteEstacionFavorita.mockResolvedValue();
  });

  it("muestra las estaciones favoritas correctamente", async () => {
    const { getByText } = render(<VistaEstacionesFavoritas />);
    await waitFor(() => {
      expect(getByText("Electrolinera Ficticia")).toBeTruthy();
      expect(getByText("Calle Falsa 123, Ciudad Inventada")).toBeTruthy();
      expect(getByText("Rating: 4.8")).toBeTruthy();
      expect(getByText("Cerrado")).toBeTruthy();
    });
  });

  it("abre el modal al pulsar el icono de eliminar", async () => {
    const { getByText, getByTestId, queryByText } = render(<VistaEstacionesFavoritas />);

    // Esperar a que se cargue la estación favorita
    await waitFor(() => {
      expect(getByText("Electrolinera Ficticia")).toBeTruthy();
    });

    // Verificar que el icono de eliminar está presente
    expect(getByTestId("delete-icon-fake-id-123")).toBeTruthy();

    // Verificar que no existe el modal antes de pulsar
    expect(queryByText("¿Estás seguro de que deseas eliminar esta estación de tus favoritos?")).toBeNull();
    expect(queryByText("delete-modal")).toBeNull();

    // Pulsar el icono
    await act(async () => {
      fireEvent.press(getByTestId("delete-icon-fake-id-123"));
    });

    // Verificar que aparece el modal
    expect(getByTestId("delete-modal")).toBeTruthy();
    expect(getByText("¿Estás seguro de que deseas eliminar esta estación de tus favoritos?")).toBeTruthy();
  });

  it("elimina una estación favorita al pulsar Eliminar", async () => {
    const { getByText, getByTestId } = render(<VistaEstacionesFavoritas />);

    // Esperar a que se cargue la estación favorita
    await waitFor(() => getByText("Electrolinera Ficticia"));

    // Pulsar el icono de eliminar
    await act(async () => {
      fireEvent.press(getByTestId("delete-icon-fake-id-123"));
    });

    // Verificar que el modal se abre y los botones están presentes
    expect(getByTestId("delete-modal")).toBeTruthy();
    expect(getByTestId("delete-button")).toBeTruthy();
    expect(getByTestId("cancel-button")).toBeTruthy();

    // Pulsar el botón de eliminar
    await act(async () => {
      fireEvent.press(getByTestId("delete-button"));
    });

    await waitFor(() => {
      expect(api.deleteEstacionFavorita).toHaveBeenCalledWith({ placeId: mockStation.id });
    });
  });

  it("cierra el modal al pulsar Cancelar", async () => {
    const { getByText, getByTestId, queryByText } = render(<VistaEstacionesFavoritas />);
    await waitFor(() => getByText("Electrolinera Ficticia"));

    // Pulsar el icono de eliminar
    await act(async () => {
      fireEvent.press(getByTestId("delete-icon-fake-id-123"));
    });

    // Verificar que el modal se abre
    expect(getByTestId("delete-modal")).toBeTruthy();

    // Pulsar el botón de cancelar
    await act(async () => {
      fireEvent.press(getByTestId("cancel-button"));
    });

    // Verificar que el modal se cierra
    expect(queryByText("delete-modal")).toBeNull();
  });

  it("navega al pulsar una estación", async () => {
    const { getByText, getByTestId } = render(<VistaEstacionesFavoritas />);
    await waitFor(() => getByText("Electrolinera Ficticia"));

    expect(getByTestId("station-card-fake-id-123")).toBeTruthy();

    // Pulsar la tarjeta
    await act(async () => {
      fireEvent.press(getByTestId("station-card-fake-id-123"));
    });

    // Verificar que se navega a la pantalla Estaciones
    expect(mockNavigate).toHaveBeenCalledWith("Estaciones");
  });
});
