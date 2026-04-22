# Spec 003 - Versionado Supabase y RLS

Estado: Bloqueada por credenciales remotas

## Contexto

El repo ya endurecio cliente y verificaciones locales, pero la seguridad real de datos sigue fuera del repositorio porque no existe una base `supabase/` versionada con schema, migraciones, tipos ni evidencia de RLS.

## Objetivo

Preparar y, cuando haya acceso suficiente, extraer al repo la base versionada de Supabase para reducir deriva entre frontend, tablas y permisos.

## Alcance

- Crear la base `supabase/` para migraciones y tipos.
- Dejar comandos reproducibles para validar acceso y exportar el proyecto remoto.
- Documentar el bloqueo real si faltan credenciales remotas.

## No objetivos

- No inventar policies ni schema sin evidencia remota.
- No introducir secretos reales al repo.
