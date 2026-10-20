// BREAKPOINT: subir la TASA de llegada sin limite hasta que algo falle.
// Modelo "abierto" (arrival-rate): k6 inicia N iteraciones/seg sin importar
// cuanto tarde el servidor. Con modelo cerrado (VUs) el servidor lento
// "frena" al generador y oculta el problema.
import { recommendPizza } from './lib/quickpizza.js';

export const options = {
  scenarios: {
    breakpoint: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 500,
      stages: [{ duration: '5m', target: 400 }], // 10 -> 400 req/s
    },
  },
  tags: { testid: '05-breakpoint' },
  thresholds: {
    // Abortar en cuanto se rompe el SLO: el valor de req/s en ese momento
    // es el "punto de quiebre" aproximado.
    'http_req_duration{name:recommend}': [
      { threshold: 'p(95)<1500', abortOnFail: true, delayAbortEval: '20s' },
    ],
    http_req_failed: [{ threshold: 'rate<0.05', abortOnFail: true, delayAbortEval: '20s' }],
  },
};

export default function () {
  recommendPizza();
}
