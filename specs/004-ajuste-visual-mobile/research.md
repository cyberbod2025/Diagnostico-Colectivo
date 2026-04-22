# Research - 004 Ajuste Visual y Movil

## Hechos que gobiernan esta implementacion

- `styles.css` define el tema compartido, pero aun usa sombras y gradientes morados fuera de la paleta declarada en `:root`.
- `index.html` concentra los riesgos moviles mas visibles en stepper, filas `justify-between`, grids rigidos y CTAs largos.
- `dashboard.html` y `invitacion.html` combinan layout claro con colores hardcodeados o chips/cards con contraste debil.
- `app.js` renderiza tarjetas de alumnos y una pantalla de exito que hasta ahora se salian del lenguaje visual dominante.
- `index.html` e `invitacion.html` bloqueaban zoom con `user-scalable=no`, lo cual empeora usabilidad en telefono.

## Limites conocidos

- La verificacion automatica del repo no mide layout real en navegador; la confirmacion visual fina sigue siendo manual en `http://localhost:3001/`.
