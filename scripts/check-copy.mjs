#!/usr/bin/env node
// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// `npm run check:copy`: fails when public copy uses banned or retired wording.
// Runs before every `npm run build` (prebuild), so Vercel and CI both stop on a hit.
// Rules and their sources: scripts/copy-rules.mjs.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { findViolations } from './copy-rules.mjs';

const root = process.cwd();
const roots = ['src', 'public'];
const exts = /\.(tsx?|json|txt|md)$/;

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (exts.test(name)) out.push(full);
  }
  return out;
}

const files = roots.flatMap((r) => {
  try {
    return walk(join(root, r), []);
  } catch {
    return [];
  }
});

const hits = files.flatMap((f) => findViolations(relative(root, f).split(sep).join('/'), readFileSync(f, 'utf8')));

if (hits.length) {
  for (const h of hits) console.error(`${h.path}:${h.line}  [${h.rule}] "${h.match}"  ${h.why}`);
  console.error(`\ncheck:copy: ${hits.length} banned phrase(s) in public copy. Fix them, or mark a deliberate line with a copy-check-ignore comment and the reason.`);
  process.exit(1);
}
console.log(`check:copy: ${files.length} files clean.`);
