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
  // Test 1: Verifica que el componente se renderiza con la información correcta
  it("renderiza correctamente las descripciones", () => {
    const { getByText } = render(<VistaEstacionInfo />);
    expect(getByText("Calle Falsa 123")).toBeTruthy();
    expect(getByText("Abierto 24 horas")).toBeTruthy();
    expect(getByText("123456789")).toBeTruthy();
    expect(getByText("https://web.com")).toBeTruthy();
  });
});
