const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = ['index.html', 'dashboard.html', 'invitacion.html'];
const problems = [];

for (const fileName of htmlFiles) {
  const filePath = path.join(rootDir, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  const ids = new Map();
  const matches = content.matchAll(/\sid="([^"]+)"/g);

  for (const match of matches) {
    const id = match[1];
    ids.set(id, (ids.get(id) || 0) + 1);
  }

  for (const [id, count] of ids.entries()) {
    if (count > 1) problems.push(`${fileName}: duplicate id "${id}" (${count} occurrences)`);
  }
}

if (problems.length > 0) {
  console.error('Static integrity check failed:');
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log('Static integrity check passed.');
