const { spawnSync } = require('child_process');

const PROJECT_REF = 'uvnetpnjinxzhggoqmwz';

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!process.env.SUPABASE_ACCESS_TOKEN) {
  fail('SUPABASE_ACCESS_TOKEN ausente. Ejecuta supabase login o exporta el token en tu entorno antes de continuar.');
}

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['supabase', 'projects', 'list', '--output', 'json'],
  {
    encoding: 'utf8',
    env: process.env,
  }
);

if (result.status !== 0) {
  fail((result.stderr || result.stdout || 'No fue posible consultar proyectos de Supabase.').trim());
}

let projects;

try {
  projects = JSON.parse(result.stdout);
} catch (error) {
  fail('No fue posible parsear la salida JSON de supabase projects list.');
}

const targetProject = projects.find((project) => project.id === PROJECT_REF || project.organization_id === PROJECT_REF || project.ref === PROJECT_REF);

if (!targetProject) {
  fail(`El proyecto ${PROJECT_REF} no es visible con el token actual.`);
}

const hasDbPassword = Boolean(process.env.SUPABASE_DB_PASSWORD || process.env.SUPABASE_PASSWORD || process.env.POSTGRES_PASSWORD);

console.log(`Acceso API Supabase OK para proyecto ${PROJECT_REF}.`);
console.log(`Password de base remota ${hasDbPassword ? 'presente' : 'ausente'}.`);
