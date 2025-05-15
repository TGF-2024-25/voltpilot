import { render } from "@testing-library/react-native";
import { formatOpeningHours } from "../src/views/EstacionInfo";
import VistaEstacionInfo from "../src/views/EstacionInfo";

// Mock del contexto
jest.mock("../src/contexts/EstacionContext", () => ({
  useCargador: () => ({
    selectedCargador: {
      formattedAddress: "Calle Falsa 123",
      currentOpeningHours: {
        periods: [
          {
            open: { hour: 0, minute: 0 },
            close: { hour: 23, minute: 59 },
          },
        ],
      },
      regularOpeningHours: null,
      nationalPhoneNumber: "123456789",
      internationalPhoneNumber: "+34123456789",
      websiteUri: "https://web.com",
    },
  }),
}));

describe("VistaEstacionInfo", () => {
  it("renderiza correctamente las descripciones", () => {
    const { getByText } = render(<VistaEstacionInfo />);
    expect(getByText("Calle Falsa 123")).toBeTruthy();
    expect(getByText("Abierto 24 horas")).toBeTruthy();
    expect(getByText("123456789")).toBeTruthy();
    expect(getByText("https://web.com")).toBeTruthy();
  });
});

describe("formatOpeningHours", () => {
  it("devuelve 'Sin información' si no hay datos", () => {
    expect(formatOpeningHours(null)).toBe("Sin información");
    expect(formatOpeningHours({})).toBe("Sin información");
    expect(formatOpeningHours({ periods: [] })).toBe("Sin información");
  });

  it("devuelve 'Abierto 24 horas' si el horario es completo", () => {
    const opening = {
      periods: [{ open: { hour: 0, minute: 0 }, close: { hour: 23, minute: 59 } }],
    };
    expect(formatOpeningHours(opening)).toBe("Abierto 24 horas");
  });

  it("formatea correctamente otros horarios", () => {
    const opening = {
      periods: [{ open: { hour: 8, minute: 30 }, close: { hour: 18, minute: 0 } }],
    };
    expect(formatOpeningHours(opening)).toBe("Abierto 08:30 - 18:00");
  });
});
