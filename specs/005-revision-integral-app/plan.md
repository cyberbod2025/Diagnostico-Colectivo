# Plan - 005 Revision Integral de App

## Fase 1. Base visual y controles

- Separar botones CTA de botones de texto/outline.
- Terminar de alinear layout movil y paleta compartida.

## Fase 2. Auth y wiring entre pantallas

- Revisar `checkAccess`, `logoutSIRDE`, sesion y pantallas con auth wall.
- Eliminar overrides locales que contradigan la logica compartida.

## Fase 3. Contrato de datos y flujos

- Revisar lecturas/escrituras visibles entre formulario, dashboard e invitacion.
- Corregir fallos evidentes en render de datos y estados vacios.

## Fase 4. Verificacion minima

- Ejecutar `npm run verify` y `npm run verify:smoke`.
- Dejar nota de riesgos residuales y recorrido manual recomendado.
