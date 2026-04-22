const requiredPages = [
  ['index.html', 'CONTROL INSTITUCIONAL'],
  ['dashboard.html', 'ANÁLISIS SIRDE-310'],
  ['invitacion.html', 'ACTIVA TU ACCESO SIRDE'],
];

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3001';

async function checkPage([pathname, marker]) {
  const response = await fetch(`${baseUrl}/${pathname}`);
  if (!response.ok) throw new Error(`${pathname} responded with ${response.status}`);

  const html = await response.text();
  if (!html.includes(marker)) throw new Error(`${pathname} is missing marker: ${marker}`);
}

async function main() {
  for (const page of requiredPages) {
    await checkPage(page);
  }
  console.log(`Smoke test passed against ${baseUrl}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
