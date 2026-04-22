# Plan - 001 Gobernanza SDD Brownfield

## Resumen

Establecer una capa de gobierno compatible con el kit y dejar una auditoria inicial que sirva de base para remediaciones posteriores, sin alterar el runtime actual.

## Artefactos de esta fase

- `memory/constitution.md`
- `memory/diagnostico-colectivo-canon.md`
- `specs/001-gobernanza-brownfield/*`
- Actualizacion de enlace en `AGENTS.md`

## Fases de este trabajo

### Fase 1. Adopcion de gobierno

- Crear constitucion local.
- Crear canon local.
- Enlazar la base SDD desde `AGENTS.md`.

### Fase 2. Auditoria brownfield inicial

- Auditar estructura, scripts y fuentes ejecutables.
- Auditar ausencia/presencia de workflows GitHub.
- Auditar secretos hardcodeados y scripts sensibles.
- Auditar integracion Supabase y huecos de RLS versionada.
- Auditar deriva visual frontend.

### Fase 3. Priorizacion

- Consolidar hallazgos con severidad y evidencia.
- Traducirlos a un plan de remediacion por fases sin implementar fixes aun.

## Plan de remediacion por fases

### Fase A. Controles minimos de seguridad y datos

- Abrir `002-seguridad-supabase-y-accesos`.
- Mover operaciones sensibles fuera de cliente si aplica.
- Versionar schema/policies de Supabase o documentar una fuente de verdad verificable para RLS.
- Redisenar el acceso al dashboard para no depender solo de `sessionStorage` o checks de nombre en cliente.

### Fase B. Automatizacion y gates

- Abrir `003-ci-y-verificacion-minima`.
- Agregar `.github/workflows/` con gates minimos verificables para el tipo de repo.
- Incorporar al menos chequeos de secretos y una verificacion estatica o smoke test util.

### Fase C. Contratos y trazabilidad

- Abrir `004-contrato-de-datos-docente-dashboard`.
- Formalizar el payload de `colectivo_respuestas_docentes` y su compatibilidad historica.
- Eliminar dependencia de IDs duplicados y hacer verificable el wiring del dashboard.

### Fase D. Consistencia visual y deuda operativa

- Abrir `005-consistencia-visual-y-scripts-auxiliares`.
- Unificar runtime de Tailwind entre paginas.
- Sustituir o retirar scripts manuales de reescritura directa como `tmp_replace.js`.
- Validar contraste, modales, dashboard y estados vacios con recorrido visual real.
