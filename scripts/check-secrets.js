const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const skipDirs = new Set(['.git', 'node_modules']);
const skipExts = new Set(['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.lock']);

const forbiddenPatterns = [
  { name: 'Supabase service role', regex: /sb_(?:secret|service_role)_[A-Za-z0-9_\-]+/g },
  { name: 'Google API key', regex: /AIza[0-9A-Za-z\-_]{35}/g },
  { name: 'GitHub token', regex: /gh[pousr]_[0-9A-Za-z]{20,}/g },
  { name: 'Bearer token literal', regex: /Bearer\s+[A-Za-z0-9._\-]{20,}/g },
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }
    if (skipExts.has(path.extname(entry.name).toLowerCase())) continue;
    files.push(fullPath);
  }

  return files;
}

const findings = [];

for (const filePath of walk(rootDir)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');

  for (const pattern of forbiddenPatterns) {
    const matches = content.match(pattern.regex);
    if (!matches) continue;
    findings.push(`${relativePath}: detected ${pattern.name}`);
  }
}

if (findings.length > 0) {
  console.error('Secret audit failed:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log('Secret audit passed.');
