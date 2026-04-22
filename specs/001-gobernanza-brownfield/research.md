# Research - 001 Gobernanza SDD Brownfield

## Fuentes revisadas

- `package.json`
- `package-lock.json`
- `.gitignore`
- `.env`
- `AGENTS.md`
- `RULES.md`
- `.agents/agents.md`
- `index.html`
- `dashboard.html`
- `invitacion.html`
- `app.js`
- `styles.css`
- `repo-governance-kit/README.md`
- `repo-governance-kit/templates/*`
- `repo-governance-kit/checklists/*`

## Hallazgos verificados

### Documentacion y estructura

- No existe `README*` en la raiz.
- No existe `.github/`, por lo que no hay workflows auditables ni gates CI versionados.
- `RULES.md` contradice la estructura real al mencionar `src/` y `supabase/`; el runtime real vive en la raiz.
- `.agents/agents.md` es generico y no sirve como fuente factual de arquitectura o flujo real.

### Runtime y arquitectura

- `package.json` solo expone `npm start` con `serve -l 3001 .`; no hay mas scripts.
- `index.html` usa handlers inline que dependen de globals definidos en `app.js`.
- `dashboard.html` carga `app.js` y despues ejecuta logica inline sobre `supabaseClient` y el payload persistido.
- `invitacion.html` no comparte `app.js`; implementa su propia integracion Supabase inline.

### GitHub y automatizacion

- No hay `.github/workflows/*`.
- No hay `husky`, `lint-staged`, `pre-commit` ni runner alternativo.
- No hay `lint`, `test`, `build` ni `typecheck` verificables desde manifests.

### Secretos y scripts peligrosos

- `app.js:2-4` define `SUPABASE_URL`, `SUPABASE_ANON_KEY` y crea el cliente Supabase en frontend.
- `invitacion.html:221-223` duplica esas credenciales publicas en otro entrypoint.
- `.env` existe pero solo contiene `PORT=3001`; no concentra secretos ni gobierna el `start` actual.
- `tmp_replace.js:1-25` reescribe `dashboard.html` con acceso directo a filesystem; es un script manual de alto impacto aunque no este enlazado a `package.json`.

### Supabase, auth y RLS

- `app.js:16` autentica por PIN consultando `colectivo_personal` desde cliente con `.select('*')`.
- `app.js:61-65` lee `colectivo_personal` y `colectivo_alumnos` desde cliente para poblar formularios.
- `app.js:468` inserta en `colectivo_respuestas_docentes` desde cliente.
- `dashboard.html:282-286` consulta `colectivo_respuestas_docentes` directamente desde navegador.
- `invitacion.html:230-233` lee `id, nombre, rol, pin_entregado, acceso_pin` desde `colectivo_personal`.
- `invitacion.html:322-325` actualiza `pin_entregado` en `colectivo_personal` desde cliente.
- No existe `supabase/config.toml`, `supabase/migrations/*`, SQL de policies, tipos generados ni evidencia local de RLS; la postura real de permisos no es verificable desde este repo.

### Frontend y deriva visual

- `styles.css` define el lenguaje visual dominante: dark glassmorphism, tokens globales y componentes base.
- `index.html:11` y `dashboard.html:10` usan `@tailwindcss/browser@4`.
- `invitacion.html:9` usa `https://cdn.tailwindcss.com`; hay deriva de runtime CSS entre paginas.
- `dashboard.html` mezcla el tema global con utilidades de color duras sobre fondos claros y oscuros; esto eleva el riesgo de contraste inconsistente.
- `dashboard.html:107-119` y `dashboard.html:179-190` repiten IDs `stat-total`, `stat-teachers` y `stat-students`, lo que invalida una fuente unica por ID en DOM.

## Hallazgos priorizados

1. Critico. La app expone y muta datos sensibles de `colectivo_personal` desde cliente anon sin evidencia de RLS versionada en repo.
Referencia: `app.js:16`, `invitacion.html:230-233`, `invitacion.html:322-325`.

2. Alto. El acceso al dashboard se resuelve en cliente y el query real sale directo desde navegador; la proteccion efectiva depende de politicas externas no auditables aqui.
Referencia: `app.js:28-40`, `dashboard.html:282-286`, `dashboard.html:601-604`.

3. Alto. No hay workflows GitHub, CI ni secret scanning; cualquier cambio entra sin gate automatica.
Referencia: ausencia de `.github/` y de scripts de verificacion en `package.json`.

4. Alto. No existe esquema Supabase versionado ni policies locales; el repo no permite auditar deriva entre frontend y permisos reales.
Referencia: ausencia de `supabase/` y de SQL/migraciones.

5. Medio. Existe un script auxiliar de reescritura directa de HTML fuera de cualquier flujo controlado.
Referencia: `tmp_replace.js:1-25`.

6. Medio. Hay deriva visual y de runtime CSS entre paginas, ademas de IDs duplicados en dashboard.
Referencia: `index.html:11`, `dashboard.html:10`, `invitacion.html:9`, `dashboard.html:107-119`, `dashboard.html:179-190`.

## Decision de adopcion

- Adopcion brownfield e incremental.
- No reescribir el repo en esta fase.
- Usar la base SDD para abrir un siguiente expediente antes de cualquier remediacion material de seguridad, datos o UI.
