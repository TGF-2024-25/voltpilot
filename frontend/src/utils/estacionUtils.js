// Tipos de conectores soportados
export const tipoConectores = [
  { id: "1", name: "EV_CONNECTOR_TYPE_TYPE_2" },
  { id: "2", name: "EV_CONNECTOR_TYPE_CHADEMO" },
  { id: "3", name: "EV_CONNECTOR_TYPE_TESLA" },
  { id: "4", name: "EV_CONNECTOR_TYPE_CCS_COMBO_2" },
];

// Formato de conectores para mostrar en la interfaz de usuario
export const conectoresFormateados = [
  { id: "1", name: "Tipo 2" },
  { id: "2", name: "CHAdeMO" },
  { id: "3", name: "Tesla" },
  { id: "4", name: "CCS Combo 2" },
];

// Filtro de cargadores según los criterios seleccionados
export const filtrarCargadores = (cargadores, filtros) => {
  // Función para obtener el id del conector por su nombre
  const obtenerIdPorNombre = (name) => {
    const conector = tipoConectores.find((conector) => conector.name === name);
    return conector ? conector.id : null;
  };

  const cargadoresFiltrados = cargadores.filter((cargador) => {
    // Verificar las propiedades evChargeOptions y connectorAggregation
    if (!cargador.evChargeOptions || !cargador.evChargeOptions.connectorAggregation) {
      return false;
    }

    // Filtrar por conectores que cumplan ambos criterios: tipo y kWh mínimo
    const tieneConectorValido = cargador.evChargeOptions.connectorAggregation.some((conector) => {
      const idConector = obtenerIdPorNombre(conector.type); // Obtener el ID del conector

      // Verificar que el conector esté seleccionado y cumpla con el kWh mínimo
      const cumpleConectorSeleccionado =
        filtros.selectedConnectors.length === 0 || // Si no hay conectores seleccionados, no se filtra por este criterio
        (idConector && filtros.selectedConnectors.includes(idConector));

      const cumpleKwhMinimo =
        conector.maxChargeRateKw !== undefined && conector.maxChargeRateKw !== null && conector.maxChargeRateKw >= filtros.minKwh;

      // El conector debe cumplir ambos criterios
      return cumpleConectorSeleccionado && cumpleKwhMinimo;
    });

    // Devuelve true si al menos un conector cumple ambos filtros
    return tieneConectorValido;
  });

  return cargadoresFiltrados;
};

// Obtiene el icono del cargador según su disponibilidad
export const getIconCargador = (cargador) => {
  if (!cargador.evChargeOptions) {
    return require("../assets/Marcador_4.png");
  }

  let availableCount = 0;

  // Obtiene el availableCount del primer cargador si tiene
  if (cargador.evChargeOptions.connectorAggregation[0]?.availableCount !== undefined) {
    availableCount += cargador.evChargeOptions.connectorAggregation[0].availableCount;
  }

  // Recorre el resto de los conectores
  for (let i = 1; i < cargador.evChargeOptions.connectorAggregation.length; i++) {
    const currentConnector = cargador.evChargeOptions.connectorAggregation[i];
    if (currentConnector?.availableCount !== undefined) {
      availableCount += currentConnector.availableCount;
    }
  }

  // Si no se encontró ningún count disponible, retonar el marcador gris
  if (availableCount === 0) {
    return require("../assets/Marcador_3.png");
  }

  // Calcular la ratio de disponibilidad de los cargadores
  const availabilityRatio = availableCount / cargador.evChargeOptions.connectorCount;

  // Selecciona el icono basado en la disponibilidad
  if (availabilityRatio >= 0.5) {
    return require("../assets/Marcador_1.png");
  }
  if (availabilityRatio > 0) {
    return require("../assets/Marcador_2.png");
  }

  return require("../assets/Marcador_3.png");
};

// Formatea la información de horarios de apertura
export const formatOpeningHours = (currentOpeningHours) => {
  if (!currentOpeningHours || !currentOpeningHours.periods || currentOpeningHours.periods.length === 0) {
    return "Sin información";
  }

  // Tomar el primer período
  const period = currentOpeningHours.periods[0];
  const { open, close } = period;

  // Verificar si es 24 horas
  if (open.hour === 0 && open.minute === 0 && close.hour === 23 && close.minute === 59) {
    return "Abierto 24 horas";
  }

  // Formatear las horas y minutos
  const formatTime = (hour, minute) => {
    const formattedHour = hour.toString().padStart(2, "0");
    const formattedMinute = minute.toString().padStart(2, "0");
    return `${formattedHour}:${formattedMinute}`;
  };

  const openTime = formatTime(open.hour, open.minute);
  const closeTime = formatTime(close.hour, close.minute);

  return `Abierto ${openTime} - ${closeTime}`;
};

// Formatea el tipo de conector para mostrarlo en la interfaz de usuario
export const formatConnectorType = (type) => {
  return type
    .replace("EV_CONNECTOR_TYPE_", "") // Eliminar el prefijo
    .replace(/_/g, " ") // Reemplazar guiones bajos por espacios
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalizar cada palabra
};

// Formatea la hora de actualización desde el formato "2025-05-16T17:15:00Z" a "HH:MM"
export const formatUpdateTime = (time) => {
  const date = new Date(time);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
