# 🐞 Reporte de Bug

## ID

BUG-[número o código único]
_Ejemplo: BUG-003_

## Título

[Título breve y claro del problema]
_Ejemplo: El botón "Guardar" no responde al hacer clic en el formulario de perfil_

## Estado

- [ ] Nuevo
- [ ] En revisión
- [ ] En desarrollo
- [ ] Resuelto
- [ ] Cerrado

## Reportado por

[Nombre del tester o estudiante]
_Ejemplo: Ana García_

## Fecha de detección

[AAAA-MM-DD]
_Ejemplo: 2025-08-02_

## Prioridad

- 🔴 Crítica (rompe flujo principal / seguridad)
- 🟠 Alta (afecta al usuario de forma notoria)
- 🟡 Media (molesta, pero tiene solución temporal)
- ⚪ Baja (estética o detalle menor)

## Descripción

Describir el comportamiento incorrecto observado.
_Ejemplo: Al hacer clic en el botón "Guardar", no ocurre ninguna acción visible, y los cambios del perfil no se almacenan._

## Pasos para reproducir

1. Iniciar sesión con usuario válido.
2. Ir a "Mi perfil".
3. Cambiar el campo "Nombre".
4. Hacer clic en "Guardar".

## Resultado esperado

- El sistema guarda los cambios y muestra un mensaje de éxito.

## Resultado obtenido

- El botón parece no hacer nada. No hay mensaje de error ni éxito. Al recargar, los cambios se pierden.

## Evidencia

- Captura de pantalla: `anexos en Markdown: ![screenshot](ruta/a/la/imagen.png)`
- Video (opcional): [enlace]

## Entorno de pruebas

- Navegador: [Chrome 126 / Firefox 120 / Safari 17, etc.]
- Dispositivo: [Escritorio / Móvil / Tablet]
- Sistema operativo: [Windows 11 / macOS / Android / iOS]
- URL o versión del sistema: [https://ejemplo.com/perfil] o `v1.4.3`

## Notas adicionales

- No ocurre en Firefox, solo en Chrome.
- La consola muestra un error JavaScript: `Uncaught TypeError: Cannot read properties of undefined (reading 'submit')`.
