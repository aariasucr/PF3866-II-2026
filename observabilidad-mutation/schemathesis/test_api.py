"""Pruebas de propiedades (property-based) del Tasks API con Schemathesis.

Ejecutar (con el backend levantado en http://localhost:3000):
    pytest -v test_api.py
"""
import os

import schemathesis

BASE_URL = os.getenv("API_URL", "http://localhost:3000")

# Carga el contrato OpenAPI directamente desde el API en ejecución.
schema = schemathesis.openapi.from_url(f"{BASE_URL}/openapi.json")

# /boom responde 500 a propósito (Lab A), así que se excluye de las pruebas.
schema = schema.exclude(path="/boom")


@schema.parametrize()
def test_api_cumple_contrato(case):
    """Genera requests a partir del schema y valida cada respuesta.

    `call_and_validate` corre todos los checks por defecto: sin errores 5xx,
    status code documentado, content-type y cuerpo conforme al schema, etc.
    """
    case.call_and_validate(base_url=BASE_URL)
