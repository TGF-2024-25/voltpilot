import { formatConnectorType, filtrar_estaciones, make_tramos, make_instrucciones, 
  reducirRuta, addEstacionAsDestino, centrarEnUbicacion, centrarEnDestino, addDestino,
   eliminarDestino
  } from '../src/utils/rutaUtils';

describe('formatConnectorType', () => {
  test('formatea distintos tipos conocidos', () => {
    expect(formatConnectorType('EV_CONNECTOR_TYPE_CHADEMO')).toBe('Chademo');
    expect(formatConnectorType('EV_CONNECTOR_TYPE_TYPE_2')).toBe('Type 2');
    expect(formatConnectorType('EV_CONNECTOR_TYPE_COMBO')).toBe('Combo');
  });

  test('devuelve capitalización genérica si no tiene prefijo esperado', () => {
    expect(formatConnectorType('CHADEMO')).toBe('Chademo');
    expect(formatConnectorType('type_2')).toBe('Type 2');
  });

});

describe('filtrar_estaciones', () => {
  const estaciones = [
    { id: 1, distanceToRuta: 5 },
    { id: 2, distanceToRuta: 2 },
    { id: 3, distanceToRuta: 3 },
    { id: 4, distanceToRuta: 1 },
  ];

  test('devuelve las 3 estaciones más cercanas ordenadas por distancia', () => {
    const resultado = filtrar_estaciones(estaciones);
    expect(resultado.map(e => e.id)).toEqual([4, 2, 3]);
  });

  test('devuelve todas si hay menos de 3', () => {
    const resultado = filtrar_estaciones([{ id: 5, distanceToRuta: 10 }]);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe(5);
  });

  test('devuelve vacío si el input no es un array válido', () => {
    expect(filtrar_estaciones(null)).toEqual([]);
    expect(filtrar_estaciones(undefined)).toEqual([]);
    expect(filtrar_estaciones({})).toEqual([]);
  });
});

describe('make_tramos', () => {
  const origen = { name: 'Inicio', latitude: 1, longitude: 1 };
  const destino = { name: 'Parada A', latitude: 2, longitude: 2 };
  const data = { distanciaKm: 10, duration: '15min' };

  test('crea tramo tipo "normal" sin estaciones', () => {
    const tramos = make_tramos(origen, destino, data, [], 0);
    expect(tramos).toHaveLength(1);
    expect(tramos[0].tipo).toBe('normal');
  });

  test('añade tramo tipo "carga" si el destino está en lista de estaciones', () => {
    const estaciones = [{ latitude: 2, longitude: 2 }];
    const tramos = make_tramos(origen, destino, data, estaciones, 1);
    expect(tramos).toHaveLength(2);
    expect(tramos[1].tipo).toBe('carga');
  });

  test('no añade tramo de carga si no coincide coordenada', () => {
    const estaciones = [{ latitude: 99, longitude: 99 }];
    const tramos = make_tramos(origen, destino, data, estaciones, 0);
    expect(tramos).toHaveLength(1);
  });

  test('tolera estaciones mal formateadas', () => {
    const estaciones = [{}];
    const tramos = make_tramos(origen, destino, data, estaciones, 0);
    expect(tramos).toHaveLength(1);
  });
});

describe('make_instrucciones', () => {
  test('transforma correctamente pasos con datos completos', () => {
    const steps = [
      {
        instruction: 'Gira a la derecha',
        distanceMeters: 150,
        duration: '2min',
        startLocation: { lat: 1, lng: 1 },
        endLocation: { lat: 1.1, lng: 1.1 },
      },
    ];
    const resultado = make_instrucciones(steps);
    expect(resultado).toEqual(steps);
  });

  test('devuelve vacío si input es nulo o no array', () => {
    expect(make_instrucciones(null)).toEqual([]);
    expect(make_instrucciones(undefined)).toEqual([]);
    expect(make_instrucciones({})).toEqual([]);
  });

  test('devuelve pasos con campos vacíos si faltan propiedades', () => {
    const steps = [{}];
    const resultado = make_instrucciones(steps);
    expect(resultado[0]).toHaveProperty('instruction');
  });
});

describe('reducirRuta', () => {
  const ruta = Array.from({ length: 20 }, (_, i) => ({ lat: i }));

  test('devuelve puntos salteados correctamente', () => {
    const resultado = reducirRuta(ruta, 5);
    expect(resultado.length).toBe(Math.floor(20 / 5));
    expect(resultado[0].lat).toBe(0);
    expect(resultado[1].lat).toBe(5);
  });

  test('devuelve vacío con inputs inválidos', () => {
    expect(reducirRuta(null)).toEqual([]);
    expect(reducirRuta([], 5)).toEqual([]);
    expect(reducirRuta([{ lat: 1 }], 0)).toEqual([]);
  });

  test('devuelve ruta original si saltos mayor que longitud', () => {
    const resultado = reducirRuta(ruta, 30);
    expect(resultado).toEqual([ruta[0]]);
  });
});

describe('addEstacionAsDestino', () => {
  const estacion = { latitude: 3, longitude: 3, name: 'Estación A' };

  test('añade al principio si lista vacía', () => {
    const nueva = addEstacionAsDestino([], null, estacion);
    expect(nueva).toEqual([estacion]);
  });

  test('inserta en el índice correcto', () => {
    const destinos = [{ name: 'A' }, { name: 'B' }];
    const actualizados = addEstacionAsDestino(destinos, 1, estacion);
    expect(actualizados[1]).toEqual(estacion);
    expect(actualizados[2].name).toBe('B');
  });

  test('no modifica el array original (inmutabilidad)', () => {
    const destinos = [{ name: 'A' }];
    const copia = [...destinos];
    addEstacionAsDestino(destinos, 0, estacion);
    expect(destinos).toEqual(copia);
  });
});

describe('addDestino', () => {
  test('añade un nuevo destino (null) al final del array', () => {
    const destinosIniciales = [{ lat: 1 }, { lat: 2 }];
    const mockSetDestinos = jest.fn();
    addDestino(mockSetDestinos, destinosIniciales);
    expect(mockSetDestinos).toHaveBeenCalledWith([...destinosIniciales, null]);
  });
});

describe('eliminarDestino', () => {
  test('elimina el destino en el índice correcto', () => {
    const destinos = ['A', 'B', 'C'];
    const setDestinos = jest.fn();
    const setModRuta = jest.fn();
    const yaParadoRef = { current: true };

    eliminarDestino(setDestinos, destinos, 1, setModRuta, yaParadoRef);

    expect(setDestinos).toHaveBeenCalledWith(['A', 'C']);
    expect(setModRuta).not.toHaveBeenCalled();
    expect(yaParadoRef.current).toBe(true);
  });

  test('resetea modRuta y yaParado si no quedan destinos', () => {
    const destinos = ['Único'];
    const setDestinos = jest.fn();
    const setModRuta = jest.fn();
    const yaParadoRef = { current: true };

    eliminarDestino(setDestinos, destinos, 0, setModRuta, yaParadoRef);

    expect(setDestinos).toHaveBeenCalledWith([]);
    expect(setModRuta).toHaveBeenCalledWith(false);
    expect(yaParadoRef.current).toBe(false);
  });
});

describe('centrarEnUbicacion', () => {
  test('llama a animateToRegion con la ubicación y deltas', () => {
    const mapRef = {
      current: {
        animateToRegion: jest.fn(),
      },
    };
    const origen = { latitude: 1, longitude: 2 };

    centrarEnUbicacion(mapRef, origen);

    expect(mapRef.current.animateToRegion).toHaveBeenCalledWith(
      {
        latitude: 1,
        longitude: 2,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      1000
    );
  });

  test('no llama si faltan mapRef o origen', () => {
    const mapRef = { current: null };
    const origen = { latitude: 1, longitude: 2 };
    expect(() => centrarEnUbicacion(mapRef, origen)).not.toThrow();
  });
});

describe('centrarEnDestino', () => {
  test('llama a animateToRegion con destino y deltas', () => {
    const mapRef = {
      current: {
        animateToRegion: jest.fn(),
      },
    };
    const destino = { latitude: 3, longitude: 4 };

    centrarEnDestino(mapRef, destino);

    expect(mapRef.current.animateToRegion).toHaveBeenCalledWith({
      latitude: 3,
      longitude: 4,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  });

  test('no hace nada si mapRef.current no existe', () => {
    const mapRef = { current: null };
    const destino = { latitude: 3, longitude: 4 };
    expect(() => centrarEnDestino(mapRef, destino)).not.toThrow();
  });
});