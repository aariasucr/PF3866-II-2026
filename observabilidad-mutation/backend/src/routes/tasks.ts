import { Router } from 'express';
import { trace } from '@opentelemetry/api';
import { pool } from '../db';
import { calcularPrioridad, puntajeRiesgo, Task } from '../priority';
import { tasksCreated, priorityLatency } from '../metrics';

export const tasksRouter = Router();
const tracer = trace.getTracer('quality-lab');

// GET /tasks  -> lista de tareas con prioridad calculada
tasksRouter.get('/tasks', async (req, res, next) => {
  try {
    // LAB observabilidad paso 4: descomentar para simular una consulta lenta
    // y verla en la traza de Jaeger.
    if (process.env.SLOW_QUERY === '1') {
      await pool.query('SELECT pg_sleep(1.5)');
    }

    const { rows } = await pool.query(
      'SELECT id, title, due_in_days, important, blocked FROM tasks ORDER BY id DESC'
    );

    // Span personalizado alrededor de la lógica de negocio.
    const enriched = tracer.startActiveSpan('calcular_prioridades', (span) => {
      const start = performance.now();
      const out = rows.map((r) => {
        const t: Task = {
          title: r.title,
          dueInDays: r.due_in_days,
          important: r.important,
          blocked: r.blocked,
        };
        return { ...r, priority: calcularPrioridad(t), risk: puntajeRiesgo(t) };
      });
      priorityLatency.record(performance.now() - start);
      span.setAttribute('tasks.count', out.length);
      span.end();
      return out;
    });

    res.json(enriched);
  } catch (err) {
    next(err);
  }
});

// POST /tasks -> crea una tarea
tasksRouter.post('/tasks', async (req, res, next) => {
  try {
    const { title, dueInDays = 30, important = false, blocked = false } = req.body ?? {};
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'title es obligatorio' });
    }
    const { rows } = await pool.query(
      `INSERT INTO tasks (title, due_in_days, important, blocked)
       VALUES ($1, $2, $3, $4) RETURNING id, title, due_in_days, important, blocked`,
      [title, dueInDays, important, blocked]
    );
    tasksCreated.add(1);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /boom -> endpoint que falla a propósito (LAB observabilidad paso 7: ver errores/trazas).
// Express 4 no captura errores lanzados en handlers async: hay que pasarlos a next()
// para que lleguen al manejador de errores (500) en vez de tumbar el proceso.
tasksRouter.get('/boom', (_req, _res, next) => {
  next(new Error('Fallo simulado para ver el error en la traza'));
});
