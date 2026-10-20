// LOAD: comportamiento bajo la carga ESPERADA (dia normal).
// Rampa -> meseta sostenida -> bajada. La meseta es lo que se analiza.
import { sleep } from 'k6';
import { visitHome, recommendPizza } from './lib/quickpizza.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 },     // calentamiento
    { duration: '2m', target: 10 },      // carga sostenida
    { duration: '30s', target: 0 },      // enfriamiento
  ],
  tags: { testid: '02-load' },
  thresholds: {
    http_req_failed: ['rate<0.01'],                    // <1% errores
    'http_req_duration{name:recommend}': ['p(95)<1000'], // mismo SLO que el smoke
    checks: ['rate>0.99'],
  },
};

export default function () {
  visitHome();
  recommendPizza();
  sleep(1);
}
