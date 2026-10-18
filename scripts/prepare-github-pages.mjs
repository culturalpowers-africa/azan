import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const distRoot = 'dist';
const manifest = JSON.parse(await readFile(join(distRoot, 'manus-routes.json'), 'utf8'));
const basePath = (process.env.VITE_BASE_PATH || '/').replace(/\/$/, '') || '/';
const publicPrefix = basePath === '/' ? '/' : `${basePath}/`;
const baseSegment = basePath.replace(/^\//, '');
const shell = (await readFile(join(distRoot, 'index.html'), 'utf8')).replace(/(href|src)="\/([^"]*)"/g, (match, attribute, path) => {
  if (basePath !== '/' && (path === baseSegment || path.startsWith(`${baseSegment}/`))) return match;
  return `${attribute}="${publicPrefix}${path}"`;
});
const origin = (process.env.SITE_ORIGIN || 'https://culturalpowers-africa.github.io/azan').replace(/\/$/, '');

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const routeDocument = (route) => {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description || 'Reflective spiritual guidance, cultural learning, and practical care from Ancestral Path.');
  const canonical = `${origin}${route.path === '/' ? '/' : route.path}`;
  const image = `${origin}/images/heritage-hero.jpg`;
  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace('</head>', `
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
  </head>`);
};

for (const route of manifest.routes) {
  const routeDir = route.path === '/' ? distRoot : join(distRoot, route.path.replace(/^\//, ''));
  await mkdir(routeDir, { recursive: true });
  await writeFile(join(routeDir, 'index.html'), routeDocument(route));
}

const notFound = shell
  .replace(/<title>[^<]*<\/title>/, '<title>Ancestral Path — Page not found</title>')
  .replace(/<meta name="description" content="[^"]*" \/>/, '<meta name="description" content="The page you requested could not be found." />')
  .replace('<main id="main-content">', '<main id="main-content" tabindex="-1"><section class="route-page route-not-found"><p class="eyebrow">404 · PAGE NOT FOUND</p><h1>That path has<br /><em>gone quiet.</em></h1><p>Try returning to the home page or begin with guidance.</p><a class="gold-button inline-button" href="./">Return home <span aria-hidden="true">→</span></a></section>');
await writeFile(join(distRoot, '404.html'), notFound);

console.log(`Prepared ${manifest.routes.length} prerendered route documents and a distinct 404 page.`);
