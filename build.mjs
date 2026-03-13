/**
 * build.mjs — Static asset versioning via content-hashed filenames
 *
 * What it does:
 *   1. Hashes assets/css/main.css and assets/js/main.js
 *   2. Copies them to dist/ with the hash baked into the filename
 *   3. Rewrites every .html file in the project root to reference the hashed paths
 *   4. Copies all other static directories (brand_assets/, Images/) as-is
 *
 * Usage:
 *   node build.mjs          → produces dist/
 *
 * Deploy:
 *   Upload the contents of dist/ to your hosting (Netlify, Vercel, S3, etc.)
 *   Serve CSS/JS with: Cache-Control: public, max-age=31536000, immutable
 *   Serve HTML with:   Cache-Control: no-cache
 */

import { createHash }                                              from 'crypto';
import { readFileSync, writeFileSync, cpSync,
         mkdirSync, rmSync, existsSync, readdirSync }              from 'fs';
import { join, dirname }                                           from 'path';
import { fileURLToPath }                                           from 'url';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');

// ── Helpers ──────────────────────────────────────────────────────────────────

function contentHash(buf) {
  return createHash('sha256').update(buf).digest('hex').slice(0, 8);
}

// ── 1. Clean dist ─────────────────────────────────────────────────────────────

if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// ── 2. Hash CSS + JS ──────────────────────────────────────────────────────────

const ASSETS_TO_HASH = [
  { src: 'assets/css/main.css', outDir: 'assets/css' },
  { src: 'assets/js/main.js',   outDir: 'assets/js'  },
];

const manifest = {}; // { 'assets/css/main.css' → 'assets/css/main.a1b2c3d4.css' }

for (const { src, outDir } of ASSETS_TO_HASH) {
  const buf  = readFileSync(join(root, src));
  const h    = contentHash(buf);
  const ext  = src.split('.').pop();
  const base = src.split('/').pop().replace(`.${ext}`, '');
  const hashedName = `${base}.${h}.${ext}`;

  mkdirSync(join(dist, outDir), { recursive: true });
  writeFileSync(join(dist, outDir, hashedName), buf);

  manifest[src] = `${outDir}/${hashedName}`;
}

// ── 3. Process all HTML files in project root ─────────────────────────────────

const htmlFiles = readdirSync(root).filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
  let html = readFileSync(join(root, file), 'utf8');
  for (const [original, hashed] of Object.entries(manifest)) {
    html = html.replaceAll(original, hashed);
  }
  writeFileSync(join(dist, file), html);
}

// ── 4. Copy static asset directories as-is ────────────────────────────────────

const STATIC_DIRS = ['brand_assets', 'Images'];

for (const dir of STATIC_DIRS) {
  const src = join(root, dir);
  if (existsSync(src)) cpSync(src, join(dist, dir), { recursive: true });
}

// ── Report ────────────────────────────────────────────────────────────────────

console.log('\n✓  dist/ built successfully\n');
for (const [orig, hashed] of Object.entries(manifest)) {
  console.log(`   ${orig}`);
  console.log(`   → ${hashed}\n`);
}
console.log(`   HTML files processed : ${htmlFiles.join(', ')}`);
console.log(`   Static dirs copied   : ${STATIC_DIRS.join(', ')}\n`);
