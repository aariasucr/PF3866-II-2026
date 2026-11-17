// CLAVE DEL INSTRUCTOR — no entregar a los estudiantes.
// Estas pruebas matan los 8 mutantes sobrevivientes + cubren los no-cubiertos.
import { describe, it, expect } from "vitest";
import { calcularPrioridad, puntajeRiesgo, Task } from "../src/priority";

const base: Task = {
  title: "x",
  dueInDays: 30,
  important: false,
  blocked: false,
};

describe("calcularPrioridad (reforzado)", () => {
  it("importante pero lejana NO es alta (mata && -> ||)", () => {
    expect(calcularPrioridad({ ...base, dueInDays: 10, important: true })).toBe(
      "baja",
    );
  });
  it("límite urgencia: 2 días importante = alta", () => {
    expect(calcularPrioridad({ ...base, dueInDays: 2, important: true })).toBe(
      "alta",
    );
  });
  it("límite urgencia: 3 días importante = media (mata <= -> <)", () => {
    expect(calcularPrioridad({ ...base, dueInDays: 3, important: true })).toBe(
      "media",
    );
  });
  it("límite semana: 7 días = media", () => {
    expect(calcularPrioridad({ ...base, dueInDays: 7 })).toBe("media");
  });
  it("límite semana: 8 días = baja (mata <= 7 -> < 7)", () => {
    expect(calcularPrioridad({ ...base, dueInDays: 8 })).toBe("baja");
  });
  it("bloqueada urgente importante sigue siendo baja", () => {
    expect(
      calcularPrioridad({
        ...base,
        dueInDays: 1,
        important: true,
        blocked: true,
      }),
    ).toBe("baja");
  });
});

describe("puntajeRiesgo (reforzado)", () => {
  it("no importante, lejana = 0", () => {
    expect(puntajeRiesgo({ ...base, dueInDays: 30 })).toBe(0);
  });
  it("importante lejana = 50 (aísla el +50)", () => {
    expect(puntajeRiesgo({ ...base, dueInDays: 30, important: true })).toBe(50);
  });
  it("no importante, 2 días = 30 (aísla el +30)", () => {
    expect(puntajeRiesgo({ ...base, dueInDays: 2 })).toBe(30);
  });
  it("límite 3 días = 10 (rama else-if)", () => {
    expect(puntajeRiesgo({ ...base, dueInDays: 3 })).toBe(10);
  });
  it("límite 7 días exactos = 10 (mata <= 7 -> < 7 en puntaje)", () => {
    expect(puntajeRiesgo({ ...base, dueInDays: 7 })).toBe(10);
  });
  it("importante urgente bloqueada = 80-20 = 60 (aísla el -20)", () => {
    expect(
      puntajeRiesgo({ ...base, dueInDays: 1, important: true, blocked: true }),
    ).toBe(60);
  });
  it("nunca negativo (mata Math.max)", () => {
    expect(puntajeRiesgo({ ...base, dueInDays: 30, blocked: true })).toBe(0);
  });
});

// ARCHIVO ANTERIOR

// import { describe, it, expect } from 'vitest';
// import { calcularPrioridad, puntajeRiesgo, Task } from '../src/priority';

// // OJO: estas pruebas tienen cobertura de LÍNEAS del 100% pero están
// // diseñadas a propósito para ser DÉBILES. El lab de mutation testing
// // consiste en descubrir qué mutantes sobreviven y escribir las pruebas
// // que faltan para matarlos. No las "arregles" antes del lab.

// const base: Task = { title: 'x', dueInDays: 30, important: false, blocked: false };

// describe('calcularPrioridad', () => {
//   it('importante y urgente = alta', () => {
//     expect(calcularPrioridad({ ...base, dueInDays: 1, important: true })).toBe('alta');
//   });
//   it('vence esta semana = media', () => {
//     expect(calcularPrioridad({ ...base, dueInDays: 5 })).toBe('media');
//   });
//   it('lejana = baja', () => {
//     expect(calcularPrioridad({ ...base, dueInDays: 30 })).toBe('baja');
//   });
//   it('bloqueada = baja', () => {
//     expect(calcularPrioridad({ ...base, dueInDays: 1, important: true, blocked: true })).toBe('baja');
//   });
// });

// describe('puntajeRiesgo', () => {
//   it('importante y urgente suma 80', () => {
//     expect(puntajeRiesgo({ ...base, dueInDays: 1, important: true })).toBe(80);
//   });
//   it('vence esta semana suma 10', () => {
//     expect(puntajeRiesgo({ ...base, dueInDays: 5 })).toBe(10);
//   });
// });
