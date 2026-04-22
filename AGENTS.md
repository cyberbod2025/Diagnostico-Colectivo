# AGENTS.md

## Base SDD

- Antes de cambios materiales, lee en este orden: `AGENTS.md`, `memory/constitution.md`, `memory/diagnostico-colectivo-canon.md` y el expediente activo en `specs/`.
- Si docs y config/codigo se contradicen, manda config/codigo ejecutable.

## Reglas activas

- Responde en espanol salvo que el usuario pida otro idioma (`RULES.md`).
- No subas secretos reales. Este repo ya usa `SUPABASE_URL` y una anon key publicas hardcodeadas en `app.js` e `invitacion.html`; no las sustituyas por keys de servicio ni agregues credenciales nuevas al repo.
- No cambies puerto ni dependencias sin aprobacion. Los scripts soportados del repo son `npm start`, `npm run verify`, `npm run verify:smoke`, `npm run supabase:check` y `npm run supabase:pull`; el servidor local sigue fijo en `3001`.

## Runtime real

- No hay `src/`, bundler ni typecheck. La app real son archivos estaticos en la raiz con un servidor Node minimo en `scripts/static-server.js`.
- Entradas de producto:
- `index.html`: formulario principal de diagnostico.
- `dashboard.html`: analitica y reportes.
- `invitacion.html`: entrega/activacion de PIN.
- `app.js`: logica compartida, cliente Supabase, auth, carga de catalogos, submit del formulario.
- `styles.css`: tema global compartido.
- `scripts/`: verificacion local sin dependencias (`check-secrets.js`, `check-static-integrity.js`, `smoke-test.js`, `static-server.js`).
- `dashboard.html` depende de globals de `app.js` y de handlers inline en HTML; evita convertir funciones globales a modulos o renombrarlas sin revisar todas las paginas.

## Datos y acoplamientos

- Tablas Supabase usadas en runtime:
- `colectivo_personal`: autenticacion por PIN y nomina en `invitacion.html`.
- `colectivo_alumnos`: catalogo para el paso 3.
- `colectivo_respuestas_docentes`: destino del submit y fuente del dashboard.
- Si cambias el payload de `handleFormSubmit()` en `app.js`, revisa tambien `runAnalysis()` y `renderAnalysis()` en `dashboard.html`; el dashboard lee directamente la estructura JSON guardada.
- `dashboard.html` mantiene compatibilidad con campos viejos y nuevos en seguimiento de padres (`citado`/`acudio` vs `seguimiento_padres.*`). No elimines esa tolerancia sin migracion de datos.

## Comandos y verificacion

- Instalar: `npm install`
- Servir local: `npm start`
- Verificacion estatica: `npm run verify`
- Smoke HTTP local: `npm run verify:smoke`
- Check remoto Supabase: `npm run supabase:check` (`SUPABASE_ACCESS_TOKEN` requerido)
- Export remoto Supabase: `npm run supabase:pull` (`SUPABASE_ACCESS_TOKEN` y `SUPABASE_DB_PASSWORD` requeridos)
- Existe workflow minimo en `.github/workflows/verify.yml`. Despues de cambios de UI o auth, sigue validando manualmente en `http://localhost:3001/`.
- Verificaciones de mayor valor:
- `index.html`: login con PIN, carga de docente/alumnos, avance por pasos, submit.
- `dashboard.html`: filtro por periodo/grupo, metricas y listas renderizadas.
- `invitacion.html`: carga de nomina y revelado de PIN.

## Limites utiles

- `repo-governance-kit/` no participa en runtime.
- `supabase/` ya existe como base local para versionar schema/tipos, pero la extraccion remota sigue bloqueada sin credenciales del proyecto.
- `LISTA_ALUMNOS.csv` y `LISTA_PERSONAL.csv` estan en la raiz pero la app productiva lee Supabase, no esos CSV.
