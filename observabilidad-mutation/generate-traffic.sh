#!/usr/bin/env bash
# Genera tráfico contra el backend para poblar trazas y métricas.
# Uso: ./generate-traffic.sh [segundos]
BASE="${BASE:-http://localhost:3000}"
END=$(( $(date +%s) + ${1:-60} ))
echo "Generando tráfico a $BASE durante ${1:-60}s..."
while [ "$(date +%s)" -lt "$END" ]; do
  curl -s "$BASE/tasks" > /dev/null
  curl -s -X POST "$BASE/tasks" -H 'Content-Type: application/json' \
    -d "{\"title\":\"t$RANDOM\",\"dueInDays\":$((RANDOM%40)),\"important\":$([ $((RANDOM%2)) -eq 0 ] && echo true || echo false)}" > /dev/null
  # 1 de cada 5 golpea el endpoint que falla (para ver errores)
  [ $((RANDOM%5)) -eq 0 ] && curl -s "$BASE/boom" > /dev/null
  sleep 0.3
done
echo "Listo."
