// Bootstrap de OpenTelemetry. DEBE cargarse ANTES que cualquier otra cosa:
//   node --import ./dist/tracing.js ./dist/index.js   (o via tsx, ver package.json)
//
// Auto-instrumenta Express y pg: cada petición HTTP y cada query a Postgres
// genera un span sin que escribas código.

import { register } from 'node:module';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

// El backend es ESM ("type": "module"): los `import` no pasan por require(),
// así que hace falta el hook ESM de OTel para instrumentar express y pg.
register('@opentelemetry/instrumentation/hook.mjs', import.meta.url);

const collector = process.env.OTEL_COLLECTOR_URL ?? 'http://localhost:4318';

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? 'tasks-backend',
  }),
  traceExporter: new OTLPTraceExporter({ url: `${collector}/v1/traces` }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({ url: `${collector}/v1/metrics` }),
    exportIntervalMillis: 5000,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // No trazar ni medir la documentación (/docs carga varios JS/CSS): ensuciaría
      // Jaeger y los paneles de tráfico/latencia de las señales doradas.
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: (req) =>
          req.url?.startsWith('/docs') === true || req.url === '/openapi.json',
      },
    }),
    // Métricas del runtime de Node (event-loop lag/utilización, heap, GC) -> señal de SATURACIÓN.
    new RuntimeNodeInstrumentation(),
  ],
});

sdk.start();
// CPU y memoria del proceso (process_cpu_*, process_memory_*) -> también SATURACIÓN.
new HostMetrics({ name: 'host-metrics' }).start();
// eslint-disable-next-line no-console
console.log('[otel] tracing iniciado ->', collector);

process.on('SIGTERM', () => {
  sdk.shutdown().finally(() => process.exit(0));
});
