// Lógica de negocio pura — el objetivo del lab de MUTATION TESTING.
// Sin dependencias, fácil de probar... y fácil de probar MAL.

export interface Task {
  title: string;
  dueInDays: number; // días para el vencimiento
  important: boolean;
  blocked: boolean;
}

/**
 * Prioridad de una tarea.
 * Reglas:
 *  - Si está bloqueada -> baja (no se puede avanzar).
 *  - Si es importante Y vence en 2 días o menos -> alta.
 *  - Si vence en 7 días o menos -> media.
 *  - En otro caso -> baja.
 */
export function calcularPrioridad(t: Task): "alta" | "media" | "baja" {
  if (t.blocked) return "baja";
  if (t.important && t.dueInDays <= 2) return "alta";
  if (t.dueInDays <= 7) return "media";
  return "baja";
}

/**
 * Puntaje de riesgo 0..100 para ordenar un backlog.
 */
export function puntajeRiesgo(t: Task): number {
  let score = 0;
  if (t.important) score += 50;
  if (t.dueInDays <= 2) score += 30;
  else if (t.dueInDays <= 7) score += 10;
  if (t.blocked) score -= 20;
  return Math.max(0, score);
}
