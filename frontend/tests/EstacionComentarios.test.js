import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VistaEstacionComentarios from "../src/views/EstacionComentarios";

// Mocks para que no de error al importar
jest.mock("react-native-gesture-handler", () => {
  const RN = require("react-native");
  return {
    FlatList: RN.FlatList,
  };
});

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

jest.mock("../src/contexts/EstacionContext", () => ({
  useCargador: jest.fn(),
}));

jest.mock("../src/services/api", () => ({
  estacionAPI: {
    getEstacionComentarios: jest.fn(),
    createEstacionComentario: jest.fn(),
    deleteEstacionComentario: jest.fn(),
  },
}));

// importante para que jest sea capaz de detectar cuando hay un alert
jest.spyOn(Alert, "alert").mockImplementation(() => {});

// Datos mock
const mockGoogleComments = [
  {
    authorAttribution: {
      displayName: "Usuario Google",
      photoUri: "https://example.com/photo1.jpg",
    },
    text: { text: "Comentario de Google" },
    rating: 4,
    relativePublishTimeDescription: "2 días atrás",
  },
];

const mockDBComments = [
  {
    userData: {
      id: "user123",
      name: "Usuario DB",
    },
    commentId: "comment1",
    comentarioData: {
      text: "Comentario de la BD",
      rating: 5,
      timestamp: "2025-05-15T10:30:00Z",
    },
  },
];

const mockUser = {
  id: "user123",
  name: "Test User",
};

describe("VistaEstacionComentarios", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar mocks por defecto
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockUser));
    require("../src/services/api").estacionAPI.getEstacionComentarios.mockResolvedValue(mockDBComments);

    require("../src/contexts/EstacionContext").useCargador.mockReturnValue({
      selectedCargador: {
        id: "place123",
        reviews: mockGoogleComments,
      },
    });
  });

  it("renderiza correctamente comentarios de Google y BD", async () => {
    const { getByText } = render(<VistaEstacionComentarios />);

    await waitFor(() => {
      // Verificar comentario de Google
      expect(getByText("Usuario Google")).toBeTruthy();
      expect(getByText("Comentario de Google")).toBeTruthy();
      expect(getByText("2 días atrás")).toBeTruthy();
      expect(getByText("Fuente: Google")).toBeTruthy();

      // Verificar comentario de BD
      expect(getByText("Usuario DB")).toBeTruthy();
      expect(getByText("Comentario de la BD")).toBeTruthy();
      expect(getByText("Fuente: VoltiPilot")).toBeTruthy();
    });
  });

  it("muestra mensaje cuando no hay comentarios", async () => {
    // Configuraciones para simular que no hay comentarios
    require("../src/contexts/EstacionContext").useCargador.mockReturnValue({
      selectedCargador: {
        id: "place123",
        reviews: [],
      },
    });
    require("../src/services/api").estacionAPI.getEstacionComentarios.mockResolvedValue([]);

    const { getByText } = render(<VistaEstacionComentarios />);

    await waitFor(() => {
      expect(getByText("No hay comentarios disponibles.")).toBeTruthy();
    });
  });

  it("abre el modal al pulsar el botón de comentar", async () => {
    const { getByText, queryByPlaceholderText, getByTestId, queryByTestId } = render(<VistaEstacionComentarios />);

    // Verificar que el modal no está visible al inicio
    expect(queryByTestId("comment-modal")).toBeNull();

    // Pulsar botón para abrir modal
    await act(async () => {
      fireEvent.press(getByTestId("comment-button"));
    });

    // Verificar que el modal está visible
    expect(getByTestId("comment-modal")).toBeTruthy();
    expect(getByText("Escribir un comentario")).toBeTruthy();
    expect(queryByPlaceholderText("Escribe tu comentario aquí...")).toBeTruthy();
  });

  it("escribe y envía un nuevo comentario correctamente", async () => {
    const api = require("../src/services/api").estacionAPI;
    api.createEstacionComentario.mockResolvedValue({});

    const { getByText, getByPlaceholderText, getByTestId } = render(<VistaEstacionComentarios />);

    // Abrir modal
    await act(async () => {
      fireEvent.press(getByTestId("comment-button"));
    });

    // Escribir comentario
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Escribe tu comentario aquí..."), "Nuevo comentario de prueba");
    });

    // Seleccionar calificación
    await act(async () => {
      fireEvent.press(getByTestId("star-3")); // Seleccionar 3 estrellas
    });

    // Enviar comentario
    await act(async () => {
      fireEvent.press(getByTestId("send-button"));
    });

    // Verificar que se llamó a la API con los datos correctos
    expect(api.createEstacionComentario).toHaveBeenCalledWith({
      placeId: "place123",
      comentario: { text: "Nuevo comentario de prueba", rating: 3 },
    });

    // Verificar que se volvió a cargar los comentarios
    expect(api.getEstacionComentarios).toHaveBeenCalledTimes(2);
  });

  it("muestra error al intentar enviar comentario sin texto o calificación", async () => {
    const { getByText, getByTestId } = render(<VistaEstacionComentarios />);

    // Abrir modal
    await act(async () => {
      fireEvent.press(getByTestId("comment-button"));
    });

    // Intentar enviar sin completar campos
    await act(async () => {
      fireEvent.press(getByTestId("send-button"));
    });

    // Verificar que se muestra alerta de error
    expect(Alert.alert).toHaveBeenCalledWith("Error", "Por favor, escriba un comentario y seleccione una calificación.");
  });

  // Test 6: Eliminar comentario
  it("permite eliminar un comentario propio", async () => {
    const api = require("../src/services/api").estacionAPI;
    api.deleteEstacionComentario.mockResolvedValue({});

    const { getByTestId, getByText } = render(<VistaEstacionComentarios />);

    // Esperar a que se carguen los comentarios
    await waitFor(() => {
      expect(getByText("Usuario DB")).toBeTruthy();
    });

    // Buscar y pulsar icono de eliminar (solo visible en comentarios propios)
    await act(async () => {
      fireEvent.press(getByTestId("delete-icon-comment1"));
    });

    // Verificar que se abre modal de confirmación
    expect(getByTestId("delete-modal")).toBeTruthy();
    expect(getByText("¿Eliminar comentario?")).toBeTruthy();

    // Pulsar botón Eliminar
    await act(async () => {
      fireEvent.press(getByTestId("delete-comment-button"));
    });

    // Verificar que se llamó a la API con los datos correctos
    expect(api.deleteEstacionComentario).toHaveBeenCalledWith({
      placeId: "place123",
      commentId: "comment1",
    });

    // Verificar que se volvió a cargar los comentarios
    expect(api.getEstacionComentarios).toHaveBeenCalledTimes(2);
  });

  it("permite cancelar la eliminación de un comentario", async () => {
    const api = require("../src/services/api").estacionAPI;
    const { getByText, getByTestId } = render(<VistaEstacionComentarios />);

    await waitFor(() => {
      expect(getByText("Usuario DB")).toBeTruthy();
    });

    // Buscar y pulsar icono de eliminar
    await act(async () => {
      fireEvent.press(getByTestId("delete-icon-comment1"));
    });

    // Pulsar botón Cancelar
    await act(async () => {
      fireEvent.press(getByTestId("cancel-delete-button"));
    });

    // Verificar que no se llama al método de la eliminación
    expect(api.deleteEstacionComentario).not.toHaveBeenCalled();
  });
});
