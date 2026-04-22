# Supabase Local Base

Estado actual: base local preparada para versionar schema y tipos del proyecto remoto `uvnetpnjinxzhggoqmwz`.

## Lo que ya se verifico

- El CLI `supabase` esta disponible via `npx`.
- No hay `SUPABASE_ACCESS_TOKEN` ni password de base remota en este entorno por defecto.
- `npx supabase projects list` falla sin token.
- Las sondas anonimas a `rest/v1/colectivo_personal` y `rest/v1/colectivo_respuestas_docentes` devolvieron `200 []`, por lo que desde el repo no se puede afirmar visibilidad real de datos ni policies efectivas.

## Comandos preparados en el repo

- `npm run supabase:check`
- `npm run supabase:pull`

## Requisitos para exportar el proyecto remoto

1. `SUPABASE_ACCESS_TOKEN` con acceso al proyecto.
2. `SUPABASE_DB_PASSWORD` del Postgres remoto.

## Flujo esperado

1. Exporta credenciales en tu sesion local.
2. Ejecuta `npm run supabase:check`.
3. Ejecuta `npm run supabase:pull`.
4. Revisa y versiona:
- `supabase/config.toml`
- `supabase/migrations/*`
- `supabase/types/database.generated.ts`

## Limite actual

Mientras no haya token y password remotos, este repo solo puede dejar lista la estructura y documentar el bloqueo; no puede extraer ni auditar policies RLS alojadas fuera del repositorio.
