# Research - 002 Remediacion Inicial Brownfield

## Hechos que gobiernan esta implementacion

- `npm start` estaba roto porque `serve` no existe en dependencias ni binarios locales.
- El dashboard confiaba en `sessionStorage` para habilitar acceso despues de cargar la pagina.
- `invitacion.html` cargaba `acceso_pin` para toda la nomina en memoria cliente.
- `dashboard.html` tenia IDs duplicados y estilos inconsistentes con el tema compartido.
- El repo no tenia workflows GitHub ni verificaciones automatizadas.

## Limite conocido

- Las politicas reales de Supabase y RLS siguen fuera del repo; aqui solo se puede endurecer cliente, documentar el hueco y preparar verificaciones.
