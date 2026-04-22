# Spec 001 - Gobernanza SDD Brownfield

Estado: Aprobada

## Contexto

Este repositorio es una app estatica en raiz que depende de Supabase hospedado y de CDNs en navegador. Antes de corregir riesgos o deuda, necesita una base SDD que deje clara la precedencia documental y los huecos de control existentes.

## Problema

Hoy no existe una autoridad unica y verificable para responder:

- que documento manda cuando hay conflicto
- como se valida un cambio en un repo sin CI ni tests
- donde termina el cliente y donde deberian empezar los controles de seguridad y datos
- que riesgos brownfield deben abordarse antes de cambios mayores

## Objetivos

- Crear la base SDD local: constitucion y canon.
- Dejar un expediente `001-gobernanza-brownfield` reutilizable.
- Ejecutar una auditoria inicial de workflows, secretos, scripts sensibles, Supabase/RLS y deriva visual frontend.
- Priorizar hallazgos y proponer un plan de remediacion por fases sin aplicar fixes aun.

## No objetivos

- No corregir riesgos de seguridad o visuales en esta fase.
- No migrar la app a bundler, framework o backend nuevo.
- No inventar politicas RLS no verificables desde el repo.

## Alcance auditado

- Raiz del repo y manifiestos ejecutables.
- Instrucciones locales heredadas.
- Entry points reales: `index.html`, `dashboard.html`, `invitacion.html`, `app.js`, `styles.css`.
- Presencia o ausencia de GitHub workflows.
- Presencia o ausencia de carpeta/config local de Supabase.

## Entregables

- `memory/constitution.md`
- `memory/diagnostico-colectivo-canon.md`
- `specs/001-gobernanza-brownfield/spec.md`
- `specs/001-gobernanza-brownfield/research.md`
- `specs/001-gobernanza-brownfield/plan.md`
- `specs/001-gobernanza-brownfield/tasks.md`
- `specs/001-gobernanza-brownfield/quickstart.md`

## Criterios de exito

- Existe una precedencia documental explicita.
- El repo queda descrito segun codigo y config ejecutable, no segun prosa heredada.
- Los riesgos brownfield principales quedan priorizados con evidencia concreta.
- Futuros cambios materiales tienen un punto claro de entrada en `specs/`.
