# Schemathesis — Tasks API

Pruebas basadas en propiedades generadas desde el contrato OpenAPI (`http://localhost:3000/openapi.json`).

## Instalación

```bash
source .venv/bin/activate
pip install -r requirements.txt
```

## Opción 1: CLI

```bash
schemathesis run http://localhost:3000/openapi.json --exclude-path /boom
```

## Opción 2: pytest

```bash
pytest -v test_api.py
# otra URL:
API_URL=http://otro-host:3000 pytest -v test_api.py
```

## Reporte HTML

```bash
schemathesis run http://localhost:3000/openapi.json --exclude-path /boom --report html
open schemathesis-report/html-*/index.html
```

Directorio fijo: `--report-html-path reporte-html`. Varios formatos a la vez: `--report html,junit`.

Cada fallo trae un `curl` para reproducirlo.
