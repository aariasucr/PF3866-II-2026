// STRESS: carga POR ENCIMA de lo esperado. ¿Como se degrada? ¿se recupera?
// Escalones: permite ver en Grafana en que nivel empieza a subir la latencia.
import { sleep } from 'k6';
import { visitHome, recommendPizza } from './lib/quickpizza.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 30 },
    { duration: '1m', target: 30 },
    { duration: '30s', target: 60 },
    { duration: '1m', target: 60 },
    { duration: '1m', target: 0 },       // recuperacion: ¿vuelve a la normalidad?
  ],
  tags: { testid: '03-stress' },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    'http_req_duration{name:recommend}': ['p(95)<1500'],
  },
};

export default function () {
  visitHome();
  recommendPizza();
  sleep(1);
}
