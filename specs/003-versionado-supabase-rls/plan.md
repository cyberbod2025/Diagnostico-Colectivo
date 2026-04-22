# Plan - 003 Versionado Supabase y RLS

## Fase 1. Preparacion local

- Crear carpeta `supabase/` versionable.
- Agregar scripts para comprobar acceso y exportar schema/tipos.

## Fase 2. Extraccion remota

- Validar token y visibilidad del proyecto.
- Vincular el proyecto remoto con `supabase link`.
- Ejecutar `supabase db pull` sobre `public`.
- Generar tipos TypeScript desde el proyecto remoto.

## Fase 3. Cierre de deriva

- Revisar migraciones exportadas y policy SQL.
- Actualizar canon del repo con la nueva fuente de verdad de datos y permisos.
