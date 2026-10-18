import { mkdir, open } from 'node:fs/promises';
import { join } from 'node:path';

const requested = Number(process.argv.find((argument) => argument.startsWith('--lines='))?.split('=')[1] || 1_000_000);
if (!Number.isSafeInteger(requested) || requested < 1 || requested > 10_000_000) {
  throw new Error('Use --lines=<integer> between 1 and 10000000.');
}

const outputDir = '.tmp';
const outputPath = join(outputDir, 'production-load-fixture.ndjson');
await mkdir(outputDir, { recursive: true });
const handle = await open(outputPath, 'w');
const topics = ['dream interpretation', 'relationship clarity', 'ancestral connection', 'grounding', 'purpose'];
const statuses = ['inquiry', 'consent_pending', 'scheduled', 'completed'];
try {
  for (let index = 1; index <= requested; index += 1) {
    const record = {
      id: `fixture_${String(index).padStart(8, '0')}`,
      topic: topics[index % topics.length],
      status: statuses[index % statuses.length],
      createdAt: new Date(Date.UTC(2026, 0, 1 + (index % 365))).toISOString(),
      synthetic: true
    };
    await handle.write(`${JSON.stringify(record)}\n`);
    if (index % 100_000 === 0) console.log(`Generated ${index.toLocaleString()} records`);
  }
} finally {
  await handle.close();
}
console.log(`Wrote ${requested.toLocaleString()} synthetic records to ${outputPath}`);
