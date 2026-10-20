## Arranque

```bash
docker compose up -d          # levanta QuickPizza, Prometheus y Grafana
```

| Servicio   | URL                   |
| ---------- | --------------------- |
| QuickPizza | http://localhost:3333 |
| Grafana    | http://localhost:3000 |
| Prometheus | http://localhost:9090 |

## Ejecutar una prueba

```bash
docker compose run --rm k6 run /scripts/01-smoke.js
docker compose run --rm k6 run /scripts/02-load.js
docker compose run --rm k6 run /scripts/03-stress.js
docker compose run --rm k6 run /scripts/04-spike.js
docker compose run --rm k6 run /scripts/05-breakpoint.js
```
