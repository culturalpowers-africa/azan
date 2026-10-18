import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const files = [];
async function collect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await collect(path);
    if (entry.isFile() && entry.name.endsWith('.json')) files.push(path);
  }
}
await collect('content/pages');
const pages = await Promise.all(files.map(async (file) => ({ file, data: JSON.parse(await readFile(file, 'utf8')) })));
const paths = new Set();
for (const { file, data } of pages) {
  if (!/^\/[a-z0-9][a-z0-9/_-]*$/.test(data.path)) throw new Error(`${file}: invalid path`);
  if (paths.has(data.path)) throw new Error(`${file}: duplicate path ${data.path}`);
  paths.add(data.path);
  for (const field of ['title', 'intro', 'eyebrow']) {
    if (typeof data[field] !== 'string' || data[field].trim().length < 3) throw new Error(`${file}: missing ${field}`);
  }
  if (!Array.isArray(data.sections) || data.sections.length < 1) throw new Error(`${file}: sections must be a non-empty array`);
  for (const section of data.sections) {
    if (!section || typeof section.heading !== 'string' || typeof section.body !== 'string') throw new Error(`${file}: invalid section`);
  }
}
console.log(`Validated ${pages.length} content files and ${paths.size} unique content routes.`);
