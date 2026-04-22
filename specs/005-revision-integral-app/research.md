# Research - 005 Revision Integral de App

## Hechos que gobiernan esta implementacion

- `dashboard.html` aun mezcla logica inline con globals de `app.js`; cualquier override local puede romper auth o analitica.
- `index.html` e `invitacion.html` comparten cliente Supabase y el mismo sistema visual, pero el wiring de botones y clases seguia desigual.
- `handleFormSubmit()` persiste payloads que luego consume `dashboard.html` sin capa intermedia.
- La proteccion real de datos sigue dependiendo de Supabase remoto; desde este repo solo puede endurecerse el cliente y documentarse el limite.

## Limites conocidos

- Sin navegador interactivo en esta sesion, la validacion final de UX sigue siendo manual en `http://localhost:3001/`.
- La seguridad total de PIN y datos no puede garantizarse aqui sin versionar policies/RLS del proyecto remoto.
