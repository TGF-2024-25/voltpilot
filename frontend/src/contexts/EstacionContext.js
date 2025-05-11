import { createContext, useContext, useState } from "react";

// Crear un contexto para que las pantallas dentro del contexto puedan acceder a los datos
const CargadorContext = createContext();

// Crear un proveedor para el contexto
export const CargadorProvider = ({ children }) => {
  const [selectedCargador, setSelectedCargador] = useState(null); // Estado para el cargador seleccionado
  const [estacionFavorita, setEstacionFavorita] = useState(null); // Estado para la estación favorita

  return (
    <CargadorContext.Provider
      value={{
        selectedCargador,
        setSelectedCargador,
        estacionFavorita,
        setEstacionFavorita,
      }}
    >
      {children}
    </CargadorContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCargador = () => useContext(CargadorContext);
