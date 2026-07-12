// ── S2 registry check: "no cross-link is a lie" ─────────────────────────────
// MANIFESTO S2: each tool slug maps to exactly one Compute Core module
// (src/lib/<slug>.ts) exporting the canonical functions, and every LIVE model
// must import from the module of every tool it is tagged with. A model tagged
// `correlation` that doesn't import the canonical correlation module fails.
//
// Implemented as a static import-closure walk (no bundler needed): starting
// from the model's entry component, follow relative imports and assert that
// the closure touches src/lib/<toolModule>.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODELS } from '../models/registry';
import type { ToolId } from '../models/types';

const SRC = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');

// Tool slug → canonical Compute Core module (relative to src/). Only core
// tools that have shipped a module appear here; a live model tagged with a
// tool that has no entry fails loudly below, which is the desired signal to
// create the canonical module rather than reimplement.
const TOOL_MODULE: Partial<Record<ToolId, string>> = {
  correlation: 'lib/correlation.ts',
};

// Live model id → entry source file (relative to src/). Every live model MUST
// have an entry here — the first test enforces that so a new model can't ship
// unchecked.
const MODEL_ENTRY: Record<string, string> = {
  'qv-correlation-lab': 'pages/QuantVizPage.tsx',
  'nl-cross-correlogram': 'models/nl-cross-correlogram/NlCrossCorrelogramPage.tsx',
  'ph-coherogram': 'models/ph-coherogram/PhCoherogramPage.tsx',
};

/** Resolve a relative import specifier to a file under src/, if it exists. */
function resolveImport(fromFile: string, spec: string): string | null {
  if (!spec.startsWith('.')) return null; // package import — not ours
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

/** All files reachable from `entry` via relative static imports. */
function importClosure(entry: string): Set<string> {
  const seen = new Set<string>();
  const queue = [entry];
  const importRe = /from\s+['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while (queue.length > 0) {
    const file = queue.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(importRe)) {
      const resolved = resolveImport(file, m[1] ?? m[2]);
      if (resolved && !seen.has(resolved)) queue.push(resolved);
    }
  }
  return seen;
}

const liveModels = MODELS.filter((m) => m.status === 'live');

describe('S2 registry check', () => {
  it('every live model has a registered entry file', () => {
    for (const m of liveModels) {
      expect(MODEL_ENTRY[m.id], `live model "${m.id}" missing from MODEL_ENTRY`).toBeDefined();
      const entryPath = path.join(SRC, MODEL_ENTRY[m.id]);
      expect(fs.existsSync(entryPath), `entry file for "${m.id}" not found: ${entryPath}`).toBe(true);
    }
  });

  it('every tool tagged on a live model has a canonical Compute Core module', () => {
    for (const m of liveModels) {
      for (const tool of m.tools) {
        const mod = TOOL_MODULE[tool];
        expect(
          mod,
          `live model "${m.id}" is tagged "${tool}" but no canonical module is registered — ` +
            `create src/lib/${tool}.ts (never reimplement inside a studio)`,
        ).toBeDefined();
        expect(fs.existsSync(path.join(SRC, mod!)), `canonical module missing: src/${mod}`).toBe(true);
      }
    }
  });

  it('every live model imports the canonical module of every tool it is tagged with', () => {
    for (const m of liveModels) {
      const closure = importClosure(path.join(SRC, MODEL_ENTRY[m.id]));
      for (const tool of m.tools) {
        const modPath = path.join(SRC, TOOL_MODULE[tool]!);
        expect(
          closure.has(modPath),
          `"${m.id}" is tagged "${tool}" but its import closure never touches src/${TOOL_MODULE[tool]} — the cross-link is a lie (S2)`,
        ).toBe(true);
      }
    }
  });
});
