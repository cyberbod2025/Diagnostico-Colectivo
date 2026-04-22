# Spec 002 - Remediacion Inicial Brownfield

Estado: Implementada

## Contexto

El expediente `001-gobernanza-brownfield` confirmo riesgos inmediatos en seguridad cliente, verificacion automatizada, contrato de datos y consistencia visual.

## Objetivo

Aplicar remediaciones factibles dentro del repo sin introducir dependencias nuevas ni asumir acceso al dashboard de Supabase.

## Alcance

- Restituir una cadena minima de verificacion local ejecutable.
- Agregar gates minimos en GitHub.
- Reducir exposicion innecesaria de datos en cliente.
- Corregir wiring roto o ambiguo en dashboard y visual compartido.

## No objetivos

- No cerrar desde este repo las politicas RLS remotas si no existe el proyecto Supabase versionado.
- No rediseñar el producto ni migrarlo de stack.
