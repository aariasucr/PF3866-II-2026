// Codigo compartido por todos los scripts: URL, autenticacion y la
// "transaccion de negocio" que medimos (pedir una recomendacion de pizza).
import http from 'k6/http';
import { check } from 'k6';

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3333';

// Cualquier token de 16 caracteres autentica como el usuario global "default".
const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'token abcdef0123456789',
};

const RESTRICTIONS = {
  maxCaloriesPerSlice: 500,
  mustBeVegetarian: false,
  excludedIngredients: ['pepperoni'],
  excludedTools: ['knife'],
  maxNumberOfToppings: 6,
  minNumberOfToppings: 2,
};

// Paso 1: cargar la pagina principal
export function visitHome() {
  const res = http.get(`${BASE_URL}/`, { tags: { name: 'home' } });
  check(res, { 'home: status 200': (r) => r.status === 200 });
  return res;
}

// Paso 2: pedir una recomendacion (endpoint "caro": consulta catalogo y arma la pizza)
export function recommendPizza() {
  const res = http.post(`${BASE_URL}/api/pizza`, JSON.stringify(RESTRICTIONS), {
    headers: HEADERS,
    tags: { name: 'recommend' },
  });
  check(res, {
    'pizza: status 200': (r) => r.status === 200,
    'pizza: trae nombre': (r) => r.status === 200 && !!r.json('pizza.name'),
  });
  return res;
}
