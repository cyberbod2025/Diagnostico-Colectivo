# Canon Brownfield del Repositorio

Estado: Canonico
Objetivo: concentrar reglas verificadas del repo para futuras sesiones.

## Fuentes de verdad usadas

- `AGENTS.md`
- `RULES.md`
- `package.json`
- `.gitignore`
- `.env`
- `index.html`
- `dashboard.html`
- `invitacion.html`
- `app.js`
- `styles.css`
- `.agents/agents.md`
- `repo-governance-kit/*`

## 1. Limites reales del repo

- La app activa no usa `src/`, bundler, monorepo ni packages multiples; el runtime real son archivos estaticos en la raiz.
- `repo-governance-kit/` no participa en runtime.
- `.agents/agents.md` existe, pero es una instruccion heredada generica y no describe la arquitectura real de este repo.
- No existe `README*`, `opencode.json` ni `.github/copilot-instructions.md`.
- `supabase/` existe como base local de versionado, pero `supabase/config.toml` aun no se ha podido extraer del proyecto remoto por falta de credenciales en este entorno.

## 2. Arquitectura verificada

- `index.html` es el formulario principal y delega su logica en globals de `app.js` mediante handlers inline como `handleFormSubmit(event)` y `validateNext(...)`.
- `dashboard.html` carga `app.js` y luego ejecuta analitica inline sobre `supabaseClient`, `initData()` y el contrato JSON persistido en Supabase.
- `invitacion.html` no carga `app.js`; crea su propio cliente Supabase y maneja la activacion de PIN inline.
- `styles.css` define el lenguaje visual dominante: dark glassmorphism, tokens globales, estilos de cards, inputs y botones.
- `scripts/static-server.js` sirve la raiz en `3001`; `scripts/check-secrets.js`, `scripts/check-static-integrity.js` y `scripts/smoke-test.js` forman la verificacion local versionada.
- `scripts/check-supabase-access.js` y `scripts/export-supabase-remote.js` preparan el flujo de export remoto para `supabase/`.

## 3. Build, test y verificacion

- Instalacion: `npm install`
- Servidor local: `npm start`
- `npm start` ejecuta `node scripts/static-server.js`.
- `npm run verify` ejecuta auditoria de secretos e integridad HTML sin dependencias externas.
- `npm run verify:smoke` valida por HTTP `index.html`, `dashboard.html` e `invitacion.html`.
- `npm run supabase:check` valida si existe acceso operativo al proyecto remoto de Supabase.
- `npm run supabase:pull` intenta inicializar/vincular `supabase/`, ejecutar `db pull` y generar tipos remotos.
- No hay `lint`, `test`, `build`, `typecheck` ni snapshots.
- La verificacion util real es manual en `http://localhost:3001/` recorriendo `index.html`, `dashboard.html` e `invitacion.html`.

## 4. Entorno local y gotchas

- `.env` existe pero hoy solo contiene `PORT=3001`; el script `start` ya fija `3001`, asi que ese valor no gobierna el runtime documentado.
- La UI depende de CDNs en runtime: Supabase JS, Tailwind via navegador y `html2pdf`.
- Las tres paginas activas usan `@tailwindcss/browser@4` en navegador.
- `RULES.md` menciona una arquitectura `src/`/`supabase/` que no existe aqui; no debe tomarse como fuente factual sobre estructura.

## 5. Seguridad y limites sensibles

- `app.js` y `invitacion.html` contienen `SUPABASE_URL` y una publishable anon key hardcodeadas. Son credenciales publicas del cliente, no service role.
- `app.js` autentica el acceso consultando `colectivo_personal` desde el cliente y guarda estado en `sessionStorage`.
- `dashboard.html` revalida la sesion con `sirde_session_pin` al cargar, pero sigue consultando `colectivo_respuestas_docentes` directo desde navegador; la proteccion real depende de politicas Supabase fuera del repo.
- `invitacion.html` ya no precarga `acceso_pin` para toda la nomina; lo consulta solo al revelar el PIN de la persona seleccionada. La superficie sigue siendo sensible y no tiene respaldo de RLS versionado en este repo.
- `npm run supabase:check` falla en este entorno si falta `SUPABASE_ACCESS_TOKEN`; `npm run supabase:pull` requiere ademas `SUPABASE_DB_PASSWORD`.
- `tmp_replace.js` es un script auxiliar que reescribe `dashboard.html` con `fs.readFileSync`/`fs.writeFileSync`; no esta enlazado a `package.json`, pero es una herramienta de edicion sensible.

## 6. Datos, permisos y contratos

- Tablas Supabase observadas desde codigo:
- `colectivo_personal`
- `colectivo_alumnos`
- `colectivo_respuestas_docentes`
- `handleFormSubmit()` en `app.js` construye el payload persistido en `colectivo_respuestas_docentes`.
- `runAnalysis()` y `renderAnalysis()` en `dashboard.html` leen ese payload sin capa intermedia ni tipos compartidos.
- `dashboard.html` conserva compatibilidad con datos viejos y nuevos para seguimiento de padres (`al.citado` / `al.acudio` y `seguimiento_padres.*`).
- Existen `supabase/README.md`, `supabase/migrations/` y `supabase/types/` como base local, pero aun no hay `supabase/config.toml`, migraciones SQL reales ni tipos generados exportados desde remoto.

## 7. Workflows y automatizacion

- Existe `.github/workflows/verify.yml` con `npm ci`, `npm run verify` y `npm run verify:smoke`.
- No hay code scanning adicional, hooks locales versionados (`husky`, `lint-staged`, `pre-commit`) ni task runner adicional.

## 8. Auditoria visual frontend

- El sistema visual dominante es la combinacion de `styles.css` con utilidades Tailwind inline.
- `index.html`, `dashboard.html` e `invitacion.html` comparten fondo, tokens y el mismo runtime Tailwind; `invitacion.html` mantiene un bloque `style` inline propio para panel movil y modal.
- `dashboard.html` mezcla utilidades con colores rigidos (`text-green-600`, `bg-red-500`, `bg-orange-500`, `bg-slate-100`) sobre un tema glass oscuro; cualquier ajuste visual ahi requiere revision en navegador porque el contraste efectivo no es obvio desde el codigo.
- `dashboard.html` sincroniza sus dos bloques de metricas con `data-stat="*"` en lugar de IDs duplicados.

## 9. Regla de cambio futuro

- Si el cambio toca auth, acceso al dashboard, payloads Supabase, scripts auxiliares, workflows o sistema visual, abre primero un expediente en `specs/`.
