# Research - 003 Versionado Supabase y RLS

## Evidencia verificada

- `npx supabase --version` responde `2.91.1`.
- `npx supabase projects list` falla con: `Access token not provided.`
- En este entorno no existen `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `SUPABASE_PASSWORD` ni `POSTGRES_PASSWORD`.
- No existe sesion local de Supabase versionada ni archivos de auth detectables para reutilizar desde este repo.
- Las sondas anonimas a:
- `https://uvnetpnjinxzhggoqmwz.supabase.co/rest/v1/colectivo_personal?select=id,nombre,rol,pin_entregado&limit=1`
- `https://uvnetpnjinxzhggoqmwz.supabase.co/rest/v1/colectivo_respuestas_docentes?select=docente,grupo,periodo&limit=1`
- devolvieron `200 []`.

## Conclusion operativa

- La exportacion remota de schema/RLS no es ejecutable hoy desde esta maquina sin credenciales adicionales.
- Si se proveen `SUPABASE_ACCESS_TOKEN` y `SUPABASE_DB_PASSWORD`, el repo ya queda listo para correr `npm run supabase:check` y `npm run supabase:pull`.
