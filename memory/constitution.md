# Constitucion SDD del Repositorio

Estado: Activa
Alcance: todo cambio material en producto, seguridad, datos, integraciones, automatizacion y artefactos de agente.

## Proposito

Establecer una base SDD brownfield para este repo sin reescribir la app actual. La meta es reducir deriva entre HTML/JS estatico, Supabase hospedado, documentacion e instrucciones operativas.

## Precedencia de fuentes

Cuando haya conflicto, usa este orden:

1. `memory/constitution.md`
2. El expediente activo en `specs/<NNN-slug>/`
3. `memory/diagnostico-colectivo-canon.md`
4. `AGENTS.md`
5. Configuracion ejecutable y codigo
6. Documentacion heredada

Si la prosa contradice al codigo o la configuracion ejecutable, manda lo ejecutable.

## Articulo I. Verificable antes que aspiracional

- Solo se consolidan reglas verificadas en codigo, config, scripts, workflows o evidencia operativa concreta.
- Toda regla no obvia debe citar rutas reales del repo.
- Los huecos de evidencia deben declararse como huecos, no como hechos.

## Articulo II. Seguridad fail-closed

- Ante duda sobre rol, acceso o politica de datos, la postura correcta es negar o degradar acceso.
- Cambios de auth, permisos, RLS y datos sensibles requieren expediente en `specs/` antes de implementarse.
- Ningun cambio futuro puede confiar solo en ocultamiento visual o estado de navegador para proteger datos sensibles.

## Articulo III. Limites de cliente y servidor

- Credenciales privilegiadas, mutaciones administrativas y secretos no deben vivir en cliente ni en scripts ad hoc del repo.
- Las keys publicas pueden existir solo cuando el proveedor las define como publicas; cualquier privilegio adicional debe quedar fuera del cliente.

## Articulo IV. Cambios distribuidos deben quedar sincronizados

- Si cambia el contrato de datos enviado desde `app.js`, deben revisarse las lecturas y calculos de `dashboard.html` en la misma iniciativa.
- Si cambia una integracion de Supabase, deben revisarse sus puntos de uso en `index.html`, `dashboard.html` e `invitacion.html`.

## Articulo V. Puerta minima de verificacion

- La verificacion minima vigente es `npm install` seguido de `npm start`.
- Mientras no exista automatizacion, todo cambio material debe registrar verificacion manual de `index.html`, `dashboard.html` e `invitacion.html` en `http://localhost:3001/`.
- Si una zona no entra en una puerta automatica, la verificacion focalizada debe quedar escrita en el expediente activo.

## Articulo VI. Higiene operativa

- Perfiles de navegador, caches, respaldos y artefactos temporales no pertenecen al repo.
- Scripts auxiliares que reescriben archivos o apunten a entornos hospedados se consideran operacion sensible y no deben promocionarse a flujo normal sin expediente.
- Ningun secreto real puede persistir en repo, docs, wrappers o archivos temporales.

## Articulo VII. Gobernanza SDD

- Todo cambio material en seguridad, permisos, datos, workflows, integraciones, runtime o instrucciones de agente debe abrir o actualizar un expediente en `specs/`.
- Cada expediente material debe incluir al menos `spec.md`, `research.md`, `plan.md`, `tasks.md` y `quickstart.md`.

## Articulo VIII. Regla de deriva documental

- `AGENTS.md` debe permanecer corto y operativo.
- `memory/diagnostico-colectivo-canon.md` concentra reglas verificadas del repo.
- Las instrucciones heredadas que contradigan la realidad del repo no mandan sobre esta base SDD.

## Enmiendas

- Toda enmienda a esta constitucion requiere justificacion explicita en un expediente bajo `specs/`.
