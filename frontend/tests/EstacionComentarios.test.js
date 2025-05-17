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
  {
    userData: {
      id: "user124",
      name: "Usuario DB 2",
    },
    commentId: "comment2",
    comentarioData: {
      text: "Comentario de la BD 2",
      rating: 5,
      timestamp: "2025-05-15T10:30:00Z",
    },
  },
];

const mockUser = {
  id: "user123",
  name: "Usuario DB",
};

describe("VistaEstacionComentarios", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar mocks por defecto
    require("../src/services/api").estacionAPI.getEstacionComentarios.mockResolvedValue(mockDBComments);

    require("../src/contexts/EstacionContext").useCargador.mockReturnValue({
      selectedCargador: {
        id: "place123",
        reviews: mockGoogleComments,
      },
    });
  });

  // Test 1: Verifica que se renderiza correctamente los comentarios de Google y BD
  it("renderiza correctamente comentarios de Google y BD", async () => {
    const { getByText, getAllByText } = render(<VistaEstacionComentarios />);

    await waitFor(() => {
      // Verificar comentario de Google
      expect(getByText("Usuario Google")).toBeTruthy();
      expect(getByText("Comentario de Google")).toBeTruthy();
      expect(getByText("2 días atrás")).toBeTruthy();
      expect(getByText("Fuente: Google")).toBeTruthy();

      // Verificar comentario de BD
      expect(getByText("Usuario DB")).toBeTruthy();
      expect(getByText("Comentario de la BD")).toBeTruthy();

      expect(getByText("Usuario DB 2")).toBeTruthy();
      expect(getByText("Comentario de la BD 2")).toBeTruthy();

      // Verifica que hay exactamente 2 comentarios de la BD
      expect(getAllByText("Fuente: VoltiPilot")).toHaveLength(2);
    });
  });

  // Test 2: Verifica que se muestra el mensaje correcto al no haber comentarios
  it("muestra mensaje cuando no hay comentarios", async () => {
    // Configuraciones para simular que no hay comentarios
    require("../src/contexts/EstacionContext").useCargador.mockReturnValue({
      selectedCargador: {
        id: "place123",
        reviews: [],
      },
    });
    require("../src/services/api").estacionAPI.getEstacionComentarios.mockResolvedValue([]);

    const { getByText, getByTestId, queryByTestId } = render(<VistaEstacionComentarios />);

    await waitFor(() => {
      expect(getByTestId("no-comments-message")).toBeTruthy();
      expect(getByText("No hay comentarios disponibles.")).toBeTruthy();
      expect(queryByTestId("comments-list")).toBeNull();
    });
  });

  // Test 3: Verifica que se muestra el modal al pulsar el botón de comentar
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

  // Test 4: Verifica que que el flujo de comentar funciona correctamente
  it("escribe y envía un nuevo comentario correctamente", async () => {
    const api = require("../src/services/api").estacionAPI;
    api.createEstacionComentario.mockResolvedValue({});

    const { getByPlaceholderText, getByTestId } = render(<VistaEstacionComentarios />);

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

  // Test 5: Verifica que muestra error al intentar enviar comentario sin texto o calificación
  it("muestra error al intentar enviar comentario sin texto o calificación", async () => {
    // Hacer que AsyncStorage.getItem devuelva 'comment1' para cualquier clave
    AsyncStorage.getItem.mockResolvedValue("user123");

    const { getByTestId } = render(<VistaEstacionComentarios />);

    // Abrir modal
    await act(async () => {
      fireEvent.press(getByTestId("comment-button"));
    });

    // verificar que el modal está visible
    expect(getByTestId("comment-modal")).toBeTruthy();

    // Intentar enviar sin completar campos
    await act(async () => {
      fireEvent.press(getByTestId("send-button"));
    });

    // Verificar que se muestra alerta de error
    expect(Alert.alert).toHaveBeenCalledWith("Error", "Por favor, escriba un comentario y seleccione una calificación.");
  });

  // Test 6: verifica que se puede eliminar un comentario propio user123
  it("permite eliminar un comentario propio", async () => {
    // Hacer que AsyncStorage.getItem devuelva 'user123' para simular que el mensaje lo ha escrito el usuario actual
    AsyncStorage.getItem.mockResolvedValue(mockUser.id);
    const api = require("../src/services/api").estacionAPI;
    api.deleteEstacionComentario.mockResolvedValue({});

    const { getByTestId, getByText } = render(<VistaEstacionComentarios />);

    // Esperar a que se carguen los comentarios
    await waitFor(() => {
      expect(getByText("Usuario DB")).toBeTruthy();
    });

    // Verificar que el icono de eliminar está visible porque es un comentario propio
    await waitFor(() => {
      expect(getByTestId("delete-icon-comment1")).toBeTruthy();
    });

    await waitFor(() => {
      expect(getByTestId("comments-list")).toBeTruthy();
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

  // Test 7: Verifica que se puede cancelar la eliminación de un comentario propio
  it("permite cancelar la eliminación de un comentario", async () => {
    // Hacer que AsyncStorage.getItem devuelva 'user123' para simular que el mensaje lo ha escrito el usuario actual
    AsyncStorage.getItem.mockResolvedValue(mockUser.id);

    const api = require("../src/services/api").estacionAPI;
    const { getByText, getByTestId, queryByTestId } = render(<VistaEstacionComentarios />);

    // Verificar que se cargan los comentarios
    await waitFor(() => {
      expect(getByText("Usuario DB")).toBeTruthy();
    });

    // Verificar que el icono de eliminar está visible porque es un comentario propio
    await waitFor(() => {
      expect(getByTestId("delete-icon-comment1")).toBeTruthy();
    });

    await waitFor(() => {
      expect(getByTestId("comments-list")).toBeTruthy();
    });

    // Buscar y pulsar icono de eliminar
    await act(async () => {
      fireEvent.press(getByTestId("delete-icon-comment1"));
    });

    expect(getByTestId("delete-modal")).toBeTruthy();

    // Pulsar botón Cancelar
    await act(async () => {
      fireEvent.press(getByTestId("cancel-delete-button"));
    });

    expect(queryByTestId("delete-modal")).toBeNull();

    // Verificar que no se llama al método de la eliminación
    expect(api.deleteEstacionComentario).not.toHaveBeenCalled();
  });

  // Test 8: verifica que no se puede eliminar un comentario ajeno
  it("no permite eliminar un comentario propio", async () => {
    // Hacer que AsyncStorage.getItem devuelva 'user123' para simular que el mensaje lo ha escrito el usuario actual
    AsyncStorage.getItem.mockResolvedValue(mockUser.id);
    const api = require("../src/services/api").estacionAPI;
    api.deleteEstacionComentario.mockResolvedValue({});

    const { getByTestId, getByText, queryByTestId } = render(<VistaEstacionComentarios />);

    // Esperar a que se carguen los comentarios
    await waitFor(() => {
      expect(getByText("Usuario DB")).toBeTruthy();
    });

    // Verifica que el icono de eliminar está visible porque es un comentario propio
    await waitFor(() => {
      expect(getByTestId("delete-icon-comment1")).toBeTruthy();
    });

    // Verificar que el icono de eliminar no está visible porque no es un comentario propio
    await waitFor(() => {
      expect(queryByTestId("delete-icon-comment2")).toBeNull();
    });

    await waitFor(() => {
      expect(getByTestId("comments-list")).toBeTruthy();
    });
  });
});
