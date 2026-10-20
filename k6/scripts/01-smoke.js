// SMOKE: ¿el sistema funciona con carga minima? ¿el script es correcto?
// Se corre primero, siempre. Si falla aqui, no tiene sentido seguir.
import { sleep } from 'k6';
import { visitHome, recommendPizza } from './lib/quickpizza.js';

export const options = {
  vus: 1,
  duration: '30s',
  tags: { testid: '01-smoke' },          // filtro "testid" en Grafana
  thresholds: {
    http_req_failed: ['rate==0'],        // cero errores
    // SLO por endpoint: la recomendacion tiene latencia aleatoria POR DISENO
    // (~100-600 ms con 1 usuario). Medir agregado mezclaria peras con manzanas.
    'http_req_duration{name:home}': ['p(95)<200'],
    'http_req_duration{name:recommend}': ['p(95)<1000'],
    checks: ['rate==1'],
  },
};

export default function () {
  visitHome();
  recommendPizza();
  sleep(1);                              // "think time" del usuario
}
