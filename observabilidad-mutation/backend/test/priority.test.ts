import { describe, it, expect } from 'vitest';
import { calcularPrioridad, puntajeRiesgo, Task } from '../src/priority';

// OJO: estas pruebas tienen cobertura de LÍNEAS del 100% pero están
// diseñadas a propósito para ser DÉBILES. El lab de mutation testing
// consiste en descubrir qué mutantes sobreviven y escribir las pruebas
// que faltan para matarlos. No las "arregles" antes del lab.

const base: Task = { title: 'x', dueInDays: 30, important: false, blocked: false };

describe('calcularPrioridad', () => {
  it('importante y urgente = alta', () => {
    expect(calcularPrioridad({ ...base, dueInDays: 1, important: true })).toBe('alta');
  });
  it('vence esta semana = media', () => {
    expect(calcularPrioridad({ ...base, dueInDays: 5 })).toBe('media');
  });
  it('lejana = baja', () => {
    expect(calcularPrioridad({ ...base, dueInDays: 30 })).toBe('baja');
  });
  it('bloqueada = baja', () => {
    expect(calcularPrioridad({ ...base, dueInDays: 1, important: true, blocked: true })).toBe('baja');
  });
});

describe('puntajeRiesgo', () => {
  it('importante y urgente suma 80', () => {
    expect(puntajeRiesgo({ ...base, dueInDays: 1, important: true })).toBe(80);
  });
  it('vence esta semana suma 10', () => {
    expect(puntajeRiesgo({ ...base, dueInDays: 5 })).toBe(10);
  });
});
