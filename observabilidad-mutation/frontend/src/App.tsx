import { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  due_in_days: number;
  important: boolean;
  blocked: boolean;
  priority?: string;
  risk?: number;
}

const API = '/api'; // el proxy de vite lo manda al backend :3000

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [dueInDays, setDueInDays] = useState(5);
  const [important, setImportant] = useState(false);

  async function load() {
    const r = await fetch(`${API}/tasks`);
    setTasks(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function create() {
    if (!title) return;
    await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, dueInDays, important }),
    });
    setTitle('');
    load();
  }

  const color = (p?: string) => (p === 'alta' ? '#d33' : p === 'media' ? '#e90' : '#888');

  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Quality Lab — Tareas</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="number" value={dueInDays} onChange={(e) => setDueInDays(Number(e.target.value))} style={{ width: 70 }} />
        <label><input type="checkbox" checked={important} onChange={(e) => setImportant(e.target.checked)} /> importante</label>
        <button onClick={create}>Crear</button>
        <button onClick={load}>Refrescar</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((t) => (
          <li key={t.id} style={{ borderLeft: `4px solid ${color(t.priority)}`, padding: '6px 10px', marginBottom: 6, background: '#f6f6f6' }}>
            <b>{t.title}</b> — vence en {t.due_in_days}d — <span style={{ color: color(t.priority) }}>{t.priority}</span> (riesgo {t.risk})
          </li>
        ))}
      </ul>
      <p style={{ color: '#999', fontSize: 13 }}>Abre Jaeger (:16686) y Grafana (:3001) tras generar tráfico.</p>
    </main>
  );
}
