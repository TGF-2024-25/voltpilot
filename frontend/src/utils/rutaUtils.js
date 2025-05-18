// Archivo para almacenar todas las funciones y metodos PUROS que se pueden desacoplar de archivos (facilita tests y mejorar código)

// Para formatear el tipo de conexión
export const formatConnectorType = (type) => {
  return type
    .replace("EV_CONNECTOR_TYPE_", "") // Eliminar el prefijo
    .replace(/_/g, " ") // Reemplazar guiones bajos por espacios
    .toLowerCase() // Convertir a minúsculas
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalizar cada palabra
};

// Función para centrar el mapa en la ubicación del usuario
export const centrarEnUbicacion = (mapRef, origen) => {
  if (mapRef.current && origen) {
    mapRef.current.animateToRegion(
      {
        latitude: origen.latitude,
        longitude: origen.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      1000,
    );
  }
};

// Funcion para centrar el mapa en destino seleccionado.
export const centrarEnDestino = (mapRef, { latitude, longitude }) => {
  if (mapRef.current) {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }
};

// Añadir un nuevo destino vacío (cuando se presiona "Agregar nuevo destino")
export function addDestino(setDestinos, destinos) {
  setDestinos([...destinos, null]);
};

// Borrar Destino de la SearchBar
export function eliminarDestino(setDestinos, destinos, index, setModRuta, yaParadoRef) {
  const nuevosDestinos = destinos.filter((_, idx) => idx !== index);
  setDestinos(nuevosDestinos);

  // Si no hay destinos, quitamos polilinea y modo ruta
  if (nuevosDestinos.length === 0) {
    setModRuta(false);
    yaParadoRef.current = false;
  }
};

// Filtrar estaciones para devolver solo las 3 más cercanas a la ruta
export const filtrar_estaciones = (est) => {
  if (!Array.isArray(est)) return [];

  if (est.length <= 3) return est;

  const ordenadas = est.sort((a, b) => a.distanceToRuta - b.distanceToRuta);
  return ordenadas.slice(0, 3);
};

// Formar el tramo según sea estación de carga o destino
export const make_tramos = (origenActual, destinoActual, data, estSeleccionadas, index) => {
  const esEstacion = estSeleccionadas.some(
    (est) => Math.abs(est.latitude - destinoActual.latitude) < 0.0001 && Math.abs(est.longitude - destinoActual.longitude) < 0.0001,
  );

  const tramos = [];

  // Siempre añadimos el tramo de desplazamiento
  tramos.push({
    tipo: "normal",
    origen: origenActual.name || `Parada ${index}`,
    destino: destinoActual.name || `Parada ${index + 1}`,
    distancia: data.distanciaKm,
    duracion: data.duration,
  });

  // Si además es estación, añadimos el tramo de carga
  if (esEstacion) {
    tramos.push({
      tipo: "carga",
      estacion: destinoActual.name || `Estación ${index + 1}`,
      tiempoCarga: "20 min",
    });
  }

  return tramos;
};

// Formar las instrucciones según el tramo también es necesario
export const make_instrucciones = (steps) => {
  if (!Array.isArray(steps)) return [];
  
  // Mapeamos los steps para obtener las instrucciones necesarias (si recibimos steps valido solo)
  return steps.map((step) => ({
    instruction: step.instruction, // Instrucción de la ruta
    distanceMeters: step.distanceMeters,
    duration: step.duration,
    startLocation: step.startLocation,
    endLocation: step.endLocation,
  }));
};

// Reducir la ruta para peticiones tan largas
export function reducirRuta(ruta, salto = 10) {
  if (!Array.isArray(ruta) || ruta.length === 0 || salto <= 0) return [];
  return ruta.filter((_, i) => i % salto === 0);
}

// Añadir una estacion como destino
export function addEstacionAsDestino(destinos, indiceTramoConEstacion, estacion) {
  const coords = {
    latitude: estacion.latitude,
    longitude: estacion.longitude,
    name: estacion.name || "Estación sin nombre",
  };

  if (destinos.length < 1 || indiceTramoConEstacion === null) {
    return [coords];
  }

  const nuevosDestinos = [...destinos];
  nuevosDestinos.splice(indiceTramoConEstacion, 0, coords);
  return nuevosDestinos;
}

