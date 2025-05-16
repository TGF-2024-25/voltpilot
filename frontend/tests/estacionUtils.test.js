import { filtrarCargadores, getIconCargador, formatOpeningHours, formatConnectorType, formatUpdateTime } from "../src/utils/estacionUtils";

// Test unitario 1: filtrarCargadores
describe("filtrarCargadores", () => {
  // Mock data para las pruebas
  const mockCargadores = [
    {
      id: "1",
      evChargeOptions: {
        connectorAggregation: [{ type: "EV_CONNECTOR_TYPE_TYPE_2", maxChargeRateKw: 22 }],
      },
    },
    {
      id: "2",
      evChargeOptions: {
        connectorAggregation: [{ type: "EV_CONNECTOR_TYPE_CHADEMO", maxChargeRateKw: 50 }],
      },
    },
    {
      id: "3",
      evChargeOptions: {
        connectorAggregation: [{ type: "EV_CONNECTOR_TYPE_CCS_COMBO_2", maxChargeRateKw: 150 }],
      },
    },
    {
      id: "4",
      // Sin evChargeOptions
    },
  ];

  it("filtra cargadores sin criterios", () => {
    const filtros = { selectedConnectors: [], minKwh: 0 };
    const resultado = filtrarCargadores(mockCargadores, filtros);
    expect(resultado.length).toBe(3);
    expect(resultado.map((c) => c.id)).toEqual(["1", "2", "3"]);
  });

  it("filtra por tipo de conector", () => {
    const filtros = { selectedConnectors: ["2"], minKwh: 0 }; // CHADEMO
    const resultado = filtrarCargadores(mockCargadores, filtros);
    expect(resultado.length).toBe(1);
    expect(resultado[0].id).toBe("2");
  });

  it("filtra por potencia mínima", () => {
    const filtros = { selectedConnectors: [], minKwh: 100 };
    const resultado = filtrarCargadores(mockCargadores, filtros);
    expect(resultado.length).toBe(1);
    expect(resultado[0].id).toBe("3");
  });

  it("combina filtros de conector y potencia", () => {
    const filtros = { selectedConnectors: ["2", "4"], minKwh: 40 }; // CHADEMO y CCS_COMBO_2 con >40kWh
    const resultado = filtrarCargadores(mockCargadores, filtros);
    expect(resultado.length).toBe(2);
    expect(resultado.map((c) => c.id)).toEqual(["2", "3"]);
  });

  it("maneja correctamente cargadores sin evChargeOptions", () => {
    const filtros = { selectedConnectors: [], minKwh: 0 };
    const resultado = filtrarCargadores([mockCargadores[3]], filtros);
    expect(resultado.length).toBe(0);
  });
});

// Test unitario 2: getIconCargador
describe("getIconCargador", () => {
  it("devuelve marcador gris cuando no hay evChargeOptions", () => {
    const cargador = { id: "1" };
    // En lugar de esperar un string, espera el objeto que realmente devuelve
    expect(getIconCargador(cargador)).toEqual({ testUri: "../../../src/assets/Marcador_4.png" });
  });

  it("devuelve marcador rojo cuando availableCount es 0", () => {
    const cargador = {
      evChargeOptions: {
        connectorCount: 4,
        connectorAggregation: [{ availableCount: 0 }, { availableCount: 0 }],
      },
    };
    expect(getIconCargador(cargador)).toEqual({ testUri: "../../../src/assets/Marcador_3.png" });
  });

  it("devuelve marcador verde cuando >= 50% de conectores disponibles", () => {
    const cargador = {
      evChargeOptions: {
        connectorCount: 4,
        connectorAggregation: [{ availableCount: 2 }, { availableCount: 1 }],
      },
    };
    expect(getIconCargador(cargador)).toEqual({ testUri: "../../../src/assets/Marcador_1.png" });
  });

  it("devuelve marcador amarillo cuando < 50% de conectores disponibles", () => {
    const cargador = {
      evChargeOptions: {
        connectorCount: 10,
        connectorAggregation: [{ availableCount: 2 }, { availableCount: 1 }],
      },
    };
    expect(getIconCargador(cargador)).toEqual({ testUri: "../../../src/assets/Marcador_2.png" });
  });

  it("maneja undefined en availableCount", () => {
    const cargador = {
      evChargeOptions: {
        connectorCount: 4,
        connectorAggregation: [
          {
            /* sin availableCount */
          },
          {
            /* sin availableCount */
          },
        ],
      },
    };
    expect(getIconCargador(cargador)).toEqual({ testUri: "../../../src/assets/Marcador_3.png" });
  });
});

// Test unitario 3: formatOpeningHours
describe("formatOpeningHours", () => {
  it('devuelve "Sin información" cuando no hay datos', () => {
    expect(formatOpeningHours(null)).toBe("Sin información");
    expect(formatOpeningHours({})).toBe("Sin información");
    expect(formatOpeningHours({ periods: [] })).toBe("Sin información");
  });

  it('devuelve "Abierto 24 horas" para horario 24h', () => {
    const openingHours = {
      periods: [
        {
          open: { hour: 0, minute: 0 },
          close: { hour: 23, minute: 59 },
        },
      ],
    };
    expect(formatOpeningHours(openingHours)).toBe("Abierto 24 horas");
  });

  it("formatea correctamente horas específicas", () => {
    const openingHours = {
      periods: [
        {
          open: { hour: 9, minute: 30 },
          close: { hour: 18, minute: 0 },
        },
      ],
    };
    expect(formatOpeningHours(openingHours)).toBe("Abierto 09:30 - 18:00");
  });

  it("maneja correctamente horas con un solo dígito", () => {
    const openingHours = {
      periods: [
        {
          open: { hour: 8, minute: 5 },
          close: { hour: 21, minute: 45 },
        },
      ],
    };
    expect(formatOpeningHours(openingHours)).toBe("Abierto 08:05 - 21:45");
  });
});

// Test unitario 4: formatConnectorType
describe("formatConnectorType", () => {
  it("formatea correctamente los tipos de conectores", () => {
    expect(formatConnectorType("EV_CONNECTOR_TYPE_TYPE_2")).toBe("Type 2");
    expect(formatConnectorType("EV_CONNECTOR_TYPE_CHADEMO")).toBe("Chademo");
    expect(formatConnectorType("EV_CONNECTOR_TYPE_CCS_COMBO_2")).toBe("Ccs Combo 2");
  });

  it("maneja correctamente tipos sin prefijo", () => {
    expect(formatConnectorType("TYPE_2")).toBe("Type 2");
  });
});

// Test unitario 5: formatUpdateTime
// Estas pruebas funcionan cuando se ejecutan en un entorno local de UTC+2
describe("formatUpdateTime", () => {
  it("formatea correctamente la hora de actualización", () => {
    // Se agregan 2 horas por UTC+2 en españa
    expect(formatUpdateTime("2025-05-16T17:15:00Z")).toBe("19:15");
  });

  it("añade ceros iniciales cuando es necesario", () => {
    // Se agregan 2 horas por UTC+2 en españa
    expect(formatUpdateTime("2025-05-16T07:05:00Z")).toBe("09:05");
  });
});
