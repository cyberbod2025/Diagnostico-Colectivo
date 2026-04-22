# Plan - 002 Remediacion Inicial Brownfield

## Fase 1. Verificacion minima ejecutable

- Reemplazar el `start` roto por un servidor Node local del repo.
- Agregar chequeos sin dependencias para secretos y estructura HTML.
- Agregar smoke test HTTP para las tres paginas activas.

## Fase 2. Endurecimiento cliente

- Revalidar sesion del dashboard con PIN persistido en lugar de confiar solo en `auth_sirde`.
- Reducir campos seleccionados desde `colectivo_personal`.
- Evitar cargar todos los PIN en `invitacion.html`.

## Fase 3. Wiring y consistencia visual

- Eliminar IDs duplicados en dashboard.
- Sincronizar los dos bloques de metricas del dashboard.
- Alinear clases y superficies del dashboard con `styles.css`.
- Unificar runtime Tailwind de `invitacion.html` con el resto del producto.

## Fase 4. GitHub gates

- Agregar workflow de verificacion.
