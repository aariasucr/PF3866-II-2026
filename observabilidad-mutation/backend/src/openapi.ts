// Especificación OpenAPI 3 de la API, escrita a mano.
// Se sirve en /docs (Swagger UI) y /openapi.json.
// Si cambias una ruta en routes/tasks.ts o app.ts, actualiza también este archivo.

const errorSchema = {
  type: 'object',
  properties: { error: { type: 'string' } },
  required: ['error'],
} as const;

export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Quality Lab — Tasks API',
    version: '1.0.0',
    description: 'API de tareas usada en los labs de Observabilidad y Mutation Testing.',
  },
  servers: [{ url: '/' }],
  components: {
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Preparar la clase' },
          due_in_days: { type: 'integer', example: 3 },
          important: { type: 'boolean', example: true },
          blocked: { type: 'boolean', example: false },
        },
        required: ['id', 'title', 'due_in_days', 'important', 'blocked'],
      },
      TaskWithPriority: {
        allOf: [
          { $ref: '#/components/schemas/Task' },
          {
            type: 'object',
            properties: {
              priority: { type: 'string', enum: ['alta', 'media', 'baja'] },
              risk: { type: 'integer', minimum: 0, maximum: 100, example: 10 },
            },
            required: ['priority', 'risk'],
          },
        ],
      },
      NewTask: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Preparar la clase' },
          dueInDays: { type: 'integer', default: 30, example: 3 },
          important: { type: 'boolean', default: false },
          blocked: { type: 'boolean', default: false },
        },
        required: ['title'],
      },
      Error: errorSchema,
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'El backend está vivo',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } },
              },
            },
          },
        },
      },
    },
    '/tasks': {
      get: {
        summary: 'Lista las tareas con prioridad y puntaje de riesgo calculados',
        description: 'Con `SLOW_QUERY=1` ejecuta antes un `pg_sleep(1.5)` (Lab A, paso 4).',
        responses: {
          '200': {
            description: 'Tareas, de la más reciente a la más antigua',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/TaskWithPriority' } },
              },
            },
          },
          '500': {
            description: 'Error interno',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
      post: {
        summary: 'Crea una tarea',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/NewTask' } } },
        },
        responses: {
          '201': {
            description: 'Tarea creada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } },
          },
          '400': {
            description: '`title` falta o no es texto',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
          '500': {
            description: 'Error interno',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    },
    '/boom': {
      get: {
        summary: 'Falla a propósito (Lab A, paso 7)',
        responses: {
          '500': {
            description: 'Siempre responde 500; la traza en Jaeger queda marcada como error',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    },
  },
};
