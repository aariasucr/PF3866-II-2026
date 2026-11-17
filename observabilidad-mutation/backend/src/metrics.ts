import { metrics } from '@opentelemetry/api';

// Métricas de negocio personalizadas (además de las que auto-instrumenta OTel).
const meter = metrics.getMeter('quality-lab');

// Contador: cuántas tareas se han creado (señal de TRÁFICO de negocio).
export const tasksCreated = meter.createCounter('tasks_created_total', {
  description: 'Número de tareas creadas',
});

// Histograma: duración del cálculo de prioridad (señal de LATENCIA de negocio).
// Sin `unit`: el exporter Prometheus del Collector añadiría el sufijo `_milliseconds`
// (priority_calc_duration_ms_milliseconds_bucket). El "_ms" del nombre ya indica la unidad.
// Buckets finos: el cálculo tarda microsegundos; con los buckets por defecto (0,5,10…ms)
// todo cae en le=5 y el p95 sale siempre ≈4.75ms.
export const priorityLatency = meter.createHistogram('priority_calc_duration_ms', {
  description: 'Duración del cálculo de prioridad en ms',
  advice: {
    explicitBucketBoundaries: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 25, 50],
  },
});
