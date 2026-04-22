# Spec 005 - Revision Integral de App

Estado: Implementada

## Contexto

El producto opera como app estatica conectada a Supabase desde cliente y reparte logica entre `index.html`, `dashboard.html`, `invitacion.html`, `app.js` y `styles.css`. El usuario solicita una revision integral de pantallas, botones, login de maestros, contrasenas, usuarios, base de datos y consistencia visual.

## Objetivo

Dejar el runtime actual mas coherente y confiable sin cambiar stack ni dependencias, corrigiendo wiring roto o inseguro dentro del repo y alineando toda la experiencia visual.

## Alcance

- Revisar y corregir flujos de acceso y sesion entre las pantallas activas.
- Verificar wiring de botones, acciones y pantallas principales.
- Reducir contradicciones entre UI, `app.js` y lecturas/escrituras hacia Supabase.
- Mantener un mismo lenguaje visual y layout movil en toda la experiencia.

## No objetivos

- No inventar schema, RLS o credenciales remotas que no existan en el repo.
- No migrar la app a framework ni reescribir la arquitectura brownfield actual.
