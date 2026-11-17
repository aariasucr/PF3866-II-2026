import { createApp } from './app';
import { initDb } from './db';

const PORT = Number(process.env.PORT ?? 3000);

async function main() {
  // Reintenta la conexión a Postgres (en Docker puede tardar en levantar).
  for (let i = 0; i < 10; i++) {
    try {
      await initDb();
      break;
    } catch (e) {
      console.log(`[db] esperando a Postgres... (${i + 1}/10)`);
      await new Promise((r) => setTimeout(r, 1500));
      if (i === 9) throw e;
    }
  }

  createApp().listen(PORT, () => {
    console.log(`[http] backend escuchando en :${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
