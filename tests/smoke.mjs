import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

const routes = JSON.parse(readFileSync('public/manus-routes.json', 'utf8')).routes;
const expectedRoutes = ['/', '/guidance', '/dreams', '/approach', '/contact', '/services/dreams', '/services/love', '/services/protection', '/services/prosperity', '/services/ancestors'];
assert.deepEqual(routes.map((route) => route.path), expectedRoutes, 'route manifest should contain every production page');
assert.ok(existsSync('dist/index.html'), 'production build should emit dist/index.html');
const html = readFileSync('index.html', 'utf8');
const js = readFileSync('main.js', 'utf8');
assert.match(html, /id="main-content"/, 'page should expose a main landmark');
assert.match(html, /https:\/\/wa\.me\/27732552543/, 'home page should expose the WhatsApp conversion path');
assert.match(js, /service-detail-page/, 'service detail pages should be wired into the client router');
for (let imageIndex = 1; imageIndex <= 5; imageIndex += 1) {
  assert.match(js, new RegExp(`Ni9X3hloFGU2ijF5iJXv1X/image-${imageIndex}\\.webp`), `service image ${imageIndex} should be wired`);
}
assert.equal(new Set(routes.map((route) => route.path)).size, routes.length, 'route paths should be unique');

const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], { stdio: 'ignore' });
const stop = () => server.kill('SIGTERM');
process.on('exit', stop);

let ready = false;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    const response = await fetch('http://127.0.0.1:4173/');
    if (response.ok) { ready = true; break; }
  } catch {}
  await new Promise((resolve) => setTimeout(resolve, 250));
}
assert.ok(ready, 'preview server should become ready');
for (const path of expectedRoutes) {
  const response = await fetch(`http://127.0.0.1:4173${path}`);
  assert.equal(response.status, 200, `${path} should resolve through the production server`);
}
const routeResponse = await fetch('http://127.0.0.1:4173/manus-routes.json');
assert.equal(routeResponse.status, 200, 'route manifest should be publicly served');
console.log(`Smoke tests passed: ${expectedRoutes.length} routes, build output, WhatsApp CTA, and preview server.`);
stop();
