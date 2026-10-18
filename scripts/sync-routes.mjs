import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../content/pages/', import.meta.url);
const publicDir = new URL('../public/', import.meta.url);
const siteOrigin = (process.env.SITE_ORIGIN || 'https://culturalpowers-africa.github.io/azan').replace(/\/$/, '');
const special = [
  ['/', 'Ancestral Path — Home', 'Reflective spiritual guidance, cultural learning, and practical care from Ancestral Path.'],
  ['/guidance', 'Ancestral Path — Guidance', 'Explore grounded, reflective guidance for dreams, relationships, protection, prosperity, and ancestral connection.'],
  ['/dreams', 'Ancestral Path — Dream Interpretation', 'Explore dreams through memory, emotion, symbols, and practical reflection.'],
  ['/approach', 'Ancestral Path — Our Approach', 'Learn how Ancestral Path keeps spiritual reflection respectful, grounded, and centered on your agency.'],
  ['/contact', 'Ancestral Path — Contact', 'Begin a private conversation with Ancestral Path and choose the contact path that works for you.'],
  ['/services/dreams', 'Ancestral Path — Dream Interpretation Service', 'A grounded dream interpretation conversation for recurring dreams, symbols, feelings, and reflection.'],
  ['/services/love', 'Ancestral Path — Love & Relationship Guidance', 'Reflective support for relationship uncertainty, communication, boundaries, and your next honest step.'],
  ['/services/protection', 'Ancestral Path — Protection & Clearing', 'Grounded spiritual support for heavy feelings, home-care, daily rhythm, and practical wellbeing.'],
  ['/services/prosperity', 'Ancestral Path — Prosperity & Purpose', 'Reflective support for business decisions, career transitions, purpose, and practical momentum.'],
  ['/services/ancestors', 'Ancestral Path — Ancestral Connection', 'A respectful conversation about family memory, lineage, belonging, grief, and present-day choices.']
];

const files = [];
async function collect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir.pathname, entry.name);
    if (entry.isDirectory()) await collect(new URL(`file://${full}/`));
    if (entry.isFile() && entry.name.endsWith('.json')) files.push(full);
  }
}
await collect(root);
const pages = await Promise.all(files.map(async (file) => JSON.parse(await readFile(file, 'utf8'))));
pages.sort((a, b) => a.path.localeCompare(b.path));
const routes = [
  ...special.map(([path, title, description]) => ({ path, title, description })),
  ...pages.map((page) => ({ path: page.path, title: `Ancestral Path — ${page.title}`, description: page.intro }))
];
if (routes.length !== 40) throw new Error(`Expected 40 routes, found ${routes.length}`);
await writeFile(new URL('manus-routes.json', publicDir), `${JSON.stringify({ routes }, null, 2)}\n`);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(({ path }) => `  <url><loc>${siteOrigin}${path === '/' ? '/' : path}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(new URL('sitemap.xml', publicDir), sitemap);
await writeFile(new URL('robots.txt', publicDir), `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`);
console.log(`Synchronized ${routes.length} routes from ${files.length} content files at ${siteOrigin}.`);
