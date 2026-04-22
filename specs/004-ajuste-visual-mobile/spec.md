# Spec 004 - Ajuste Visual y Movil

Estado: Implementada

## Contexto

La app activa comparte `styles.css`, pero aun mezcla superficies claras con bloques oscuros, acentos hardcodeados fuera de la paleta institucional y layouts que se comprimen en movil, sobre todo en `index.html`, `dashboard.html`, `invitacion.html` y el markup dinamico de `app.js`.

## Objetivo

Dejar la experiencia lista para telefono sin redisenar el producto ni cambiar su identidad actual, unificando la paleta y mejorando la distribucion responsiva de principio a fin.

## Alcance

- Normalizar tokens y estados visuales compartidos en `styles.css`.
- Corregir layouts moviles y densidad de componentes en las tres paginas activas.
- Alinear el markup generado por `app.js` con el sistema visual compartido.

## No objetivos

- No migrar la app a otro stack ni introducir dependencias nuevas.
- No rehacer flujos funcionales fuera de lo necesario para sostener la consistencia visual y responsiva.
