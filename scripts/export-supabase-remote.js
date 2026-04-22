const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'uvnetpnjinxzhggoqmwz';
const rootDir = path.resolve(__dirname, '..');
const supabaseDir = path.join(rootDir, 'supabase');
const migrationsDir = path.join(supabaseDir, 'migrations');
const typesDir = path.join(supabaseDir, 'types');
const configPath = path.join(supabaseDir, 'config.toml');
const typesPath = path.join(typesDir, 'database.generated.ts');

const dbPassword = process.env.SUPABASE_DB_PASSWORD || process.env.SUPABASE_PASSWORD || process.env.POSTGRES_PASSWORD;

function runSupabase(args, options = {}) {
  const result = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['supabase', ...args], {
    cwd: rootDir,
    encoding: 'utf8',
    env: process.env,
    ...options,
  });

  if (result.status !== 0) {
    const output = (result.stderr || result.stdout || `Fallo ejecutando supabase ${args.join(' ')}`).trim();
    throw new Error(output);
  }

  return result.stdout;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

if (!process.env.SUPABASE_ACCESS_TOKEN) {
  console.error('SUPABASE_ACCESS_TOKEN ausente. Ejecuta npm run supabase:check primero.');
  process.exit(1);
}

if (!dbPassword) {
  console.error('SUPABASE_DB_PASSWORD ausente. Se requiere para link y db pull contra la base remota.');
  process.exit(1);
}

ensureDir(supabaseDir);
ensureDir(migrationsDir);
ensureDir(typesDir);

if (!fs.existsSync(configPath)) {
  runSupabase(['init', '--yes']);
}

runSupabase(['link', '--project-ref', PROJECT_REF, '--password', dbPassword]);
runSupabase(['db', 'pull', 'remote_baseline', '--schema', 'public', '--password', dbPassword]);

const generatedTypes = runSupabase(['gen', 'types', '--project-id', PROJECT_REF, '--schema', 'public']);
fs.writeFileSync(typesPath, generatedTypes, 'utf8');

console.log(`Schema remoto y tipos exportados en ${path.relative(rootDir, supabaseDir)}.`);
