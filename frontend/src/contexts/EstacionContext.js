import React, { createContext, useContext, useState } from "react";
// Crear un contexto para que las pantallas dentro del contexto pueda acceder los datos de una estacion de cargas
const CargadorContext = createContext();

// Crear un proveedor para el contexto
export const CargadorProvider = ({ children }) => {
  const [selectedCargador, setSelectedCargador] = useState(null);

  return (
    <CargadorContext.Provider value={{ selectedCargador, setSelectedCargador }}>{children}</CargadorContext.Provider>
  );
};

export const useCargador = () => useContext(CargadorContext);
