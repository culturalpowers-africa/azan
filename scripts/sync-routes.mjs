import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../content/pages/', import.meta.url);
const publicDir = new URL('../public/', import.meta.url);
const special = [
  ['/', 'Ancestral Path — Home'],
  ['/guidance', 'Ancestral Path — Guidance'],
  ['/dreams', 'Ancestral Path — Dream Interpretation'],
  ['/approach', 'Ancestral Path — Our Approach'],
  ['/contact', 'Ancestral Path — Contact'],
  ['/services/dreams', 'Ancestral Path — Dream Interpretation Service'],
  ['/services/love', 'Ancestral Path — Love & Relationship Guidance'],
  ['/services/protection', 'Ancestral Path — Protection & Clearing'],
  ['/services/prosperity', 'Ancestral Path — Prosperity & Purpose'],
  ['/services/ancestors', 'Ancestral Path — Ancestral Connection']
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
const routes = [...special.map(([path, title]) => ({ path, title })), ...pages.map((page) => ({ path: page.path, title: `Ancestral Path — ${page.title}` }))];
if (routes.length !== 40) throw new Error(`Expected 40 routes, found ${routes.length}`);
await writeFile(new URL('manus-routes.json', publicDir), `${JSON.stringify({ routes }, null, 2)}\n`);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(({ path }) => `  <url><loc>https://culturalpowers-africa.github.io/azan${path === '/' ? '/' : path}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(new URL('sitemap.xml', publicDir), sitemap);
console.log(`Synchronized ${routes.length} routes from ${files.length} content files.`);
