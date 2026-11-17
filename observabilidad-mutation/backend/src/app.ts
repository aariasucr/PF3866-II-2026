import express from 'express';
import cors from 'cors';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import swaggerUi from 'swagger-ui-express';
import { tasksRouter } from './routes/tasks';
import { openapiSpec } from './openapi';

// Fábrica de la app Express (separada del server para poder probarla).
export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Documentación de la API: Swagger UI en /docs y la spec cruda en /openapi.json.
  // (tracing.ts excluye estas rutas para que no ensucien trazas ni métricas.)
  app.get('/openapi.json', (_req, res) => res.json(openapiSpec));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
  app.use('/', tasksRouter);

  // Manejador de errores: responde 500 y deja que OTel marque el span como error.
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // Adjunta la excepción (mensaje + stack) al span activo para verla en Jaeger.
    const span = trace.getActiveSpan();
    span?.recordException(err);
    span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    res.status(500).json({ error: err.message });
  });

  return app;
}
