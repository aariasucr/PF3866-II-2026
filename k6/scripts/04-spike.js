// SPIKE: subida SUBITA (ej. campaña de marketing, Black Friday).
// Diferencia con stress: no hay rampa gradual; el sistema no tiene tiempo de adaptarse.
import { sleep } from "k6";
import { recommendPizza } from "./lib/quickpizza.js";

export const options = {
  stages: [
    { duration: "20s", target: 5 }, // linea base
    { duration: "10s", target: 100 }, // pico
    { duration: "1m", target: 100 },
    { duration: "10s", target: 5 }, // caida
    { duration: "40s", target: 5 }, // ¿se recupera la latencia?
  ],
  tags: { testid: "04-spike" },
  thresholds: {
    http_req_failed: ["rate<0.10"],
  },
};

export default function () {
  recommendPizza();
  sleep(0.5);
}
