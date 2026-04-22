# Quickstart - SDD Brownfield

## 1. Lectura minima antes de tocar codigo

Lee en este orden:

1. `AGENTS.md`
2. `memory/constitution.md`
3. `memory/diagnostico-colectivo-canon.md`
4. El expediente activo en `specs/<NNN-slug>/`

## 2. Comandos reales del repo

- Instalar: `npm install`
- Servir local: `npm start`
- URL local: `http://localhost:3001/`

## 3. Verificacion minima vigente

- Recorrer `index.html`:
- login por PIN
- carga de docente y alumnos
- avance por pasos
- submit del diagnostico
- Recorrer `dashboard.html`:
- filtro por periodo y grupo
- metricas y listas renderizadas
- Recorrer `invitacion.html`:
- carga de nomina
- revelado de PIN

## 4. Cuando abrir un expediente nuevo

Abre un expediente nuevo en `specs/` si el cambio toca:

- seguridad o auth
- permisos o RLS
- payloads de Supabase o contratos de datos
- workflows o automatizacion
- integraciones externas
- sistema visual compartido
- instrucciones de agente o reglas de gobierno

## 5. Regla de precedencia

1. `memory/constitution.md`
2. El expediente activo en `specs/`
3. `memory/diagnostico-colectivo-canon.md`
4. `AGENTS.md`
5. Codigo y configuracion ejecutable
6. Docs heredadas
