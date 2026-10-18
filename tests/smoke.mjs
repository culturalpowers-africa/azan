import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

const routes = JSON.parse(readFileSync('public/manus-routes.json', 'utf8')).routes;
const expectedRoutes = routes.map((route) => route.path);
assert.equal(expectedRoutes.length, 40, 'route manifest should contain forty production pages');
assert.ok(routes.every((route) => route.title && route.description), 'every route should include SEO metadata');
assert.ok(expectedRoutes.includes('/resources') && expectedRoutes.includes('/services/ancestors/lineage'), 'expanded content routes should be present');
assert.ok(existsSync('dist/index.html'), 'production build should emit dist/index.html');
assert.ok(existsSync('dist/404.html'), 'production build should emit a distinct 404.html');
const notFound = readFileSync('dist/404.html', 'utf8');
assert.match(notFound, /Page not found/, '404 page should identify the missing page');
const home = readFileSync('dist/index.html', 'utf8');
assert.match(home, /id="main-content"/, 'page should expose a main landmark');
assert.match(home, /https:\/\/wa\.me\/27732552543/, 'home page should expose the WhatsApp conversion path');
assert.match(home, /id="primary-navigation"/, 'page should expose the mobile navigation target');
const js = readFileSync('main.js', 'utf8');
assert.match(js, /service-detail-page/, 'service detail pages should be wired into the client router');
for (const imageName of ['heritage-hero.jpg', 'heritage-community.jpg', 'heritage-family.jpg', 'heritage-portrait.jpg', 'heritage-ritual.jpg']) {
  assert.ok(existsSync(`images/${imageName}`), `${imageName} should be bundled in the repository`);
  assert.match(js, new RegExp(imageName.replace('.', '\\.'), 'i'), `${imageName} should be wired into the app`);
}
assert.equal(new Set(routes.map((route) => route.path)).size, routes.length, 'route paths should be unique');
for (const route of routes) {
  const routeDir = route.path === '/' ? 'dist' : `dist${route.path}`;
  assert.ok(existsSync(`${routeDir}/index.html`), `${route.path} should have a prerendered document`);
  const html = readFileSync(`${routeDir}/index.html`, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]?.replaceAll('&amp;', '&');
  assert.equal(title, route.title, `${route.path} should have a unique title`);
  assert.match(html, /rel="canonical"/, `${route.path} should have a canonical URL`);
}

const server = spawn('python3', ['-m', 'http.server', '4174', '--bind', '127.0.0.1'], { cwd: 'dist', stdio: 'ignore' });
const stop = () => server.kill('SIGTERM');
process.on('exit', stop);

let ready = false;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    const response = await fetch('http://127.0.0.1:4174/');
    if (response.ok) { ready = true; break; }
  } catch {}
  await new Promise((resolve) => setTimeout(resolve, 250));
}
assert.ok(ready, 'preview server should become ready');
for (const path of expectedRoutes) {
  const response = await fetch(`http://127.0.0.1:4174${path}`);
  assert.equal(response.status, 200, `${path} should resolve as a real production document`);
}
assert.ok(!existsSync('dist/does-not-exist/index.html'), 'unknown routes should not have generated documents');
const routeResponse = await fetch('http://127.0.0.1:4174/manus-routes.json');
assert.equal(routeResponse.status, 200, 'route manifest should be publicly served');
console.log(`Smoke tests passed: ${expectedRoutes.length} prerendered routes, distinct 404, SEO metadata, assets, and preview behavior.`);
stop();
