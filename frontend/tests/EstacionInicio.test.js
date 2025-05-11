import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native"; // Importa NavigationContainer
import VistaEstacionInicio from "../src/views/EstacionInicio";
import { CargadorProvider } from "../src/contexts/EstacionContext";

describe("VistaEstacionInicio", () => {
  // Valores simulados para el contexto
  const mockContextValue = {
    estacionFavorita: null,
    setEstacionFavorita: jest.fn(),
    setSelectedCargador: jest.fn(),
  };

  it("debería renderizar correctamente", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        {" "}
        {/* Envuelve el componente con NavigationContainer */}
        <CargadorProvider value={mockContextValue}>
          <VistaEstacionInicio />
        </CargadorProvider>
      </NavigationContainer>,
    );
    expect(getByTestId("map-view")).toBeTruthy();
  });
});
