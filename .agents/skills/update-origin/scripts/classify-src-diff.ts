#!/usr/bin/env -S pnpm exec tsx
/**
 * classify-src-diff.ts
 *
 * Classify each modified .en.{ts,html,json} file into one of four classes
 * based on the volume of translatable-token change:
 *   a — No translatable tokens affected (logic/structure only)
 *   b — ≤ 5 translatable token lines changed
 *   c — > 5 translatable token lines or significant structural change
 *   d — Full rewrite (escalation; do NOT auto-defer like markdown class d)
 *
 * Usage:
 *   pnpm exec tsx .agents/skills/update-origin/scripts/classify-src-diff.ts [base-ref]
 *
 * Output (JSON to stdout):
 *   [{ file, class, directory, kind, metrics }, ...]
 */

import { execSync } from 'node:child_process';
import * as path from 'node:path';

type Class = 'a' | 'b' | 'c' | 'd';
type Kind = 'ts' | 'html' | 'json';

interface Metrics {
  added: number;
  removed: number;
  translatableTokens: number;
}

interface Classification {
  file: string;
  class: Class;
  directory: string;
  kind: Kind;
  metrics: Metrics;
}

const baseRef = process.argv[2] ?? 'HEAD';

function getChangedFiles(): string[] {
  const out = execSync(
    `git diff --name-only ${baseRef} -- '*.en.ts' '*.en.html' '*.en.json'`,
    { encoding: 'utf8' },
  );
  return out.trim().split('\n').filter(Boolean);
}

function getDiff(file: string): string {
  return execSync(`git diff ${baseRef} -- "${file}"`, { encoding: 'utf8' });
}

function detectKind(file: string): Kind {
  if (file.endsWith('.en.ts')) return 'ts';
  if (file.endsWith('.en.html')) return 'html';
  if (file.endsWith('.en.json')) return 'json';
  throw new Error(`Unknown file kind: ${file}`);
}

function isTranslatableLine(content: string, kind: Kind): boolean {
  if (kind === 'ts') {
    // Heuristics: known user-facing keys with string literals.
    return /\b(label|title|description|message|summary|placeholder|tooltip|action)\s*:\s*['"`]/.test(
      content,
    );
  }
  if (kind === 'html') {
    // Strip tags; if remaining text has prose-length content, treat as translatable.
    const stripped = content.replace(/<[^>]+>/g, '').trim();
    return stripped.length > 3 && /[A-Za-z぀-ヿ一-鿿]/.test(stripped);
  }
  if (kind === 'json') {
    // Heuristic: long quoted string values likely user-facing.
    return /:\s*"[^"]{4,}"/.test(content);
  }
  return false;
}

function analyzeDiff(diff: string, kind: Kind): Metrics {
  const lines = diff.split('\n');
  let added = 0;
  let removed = 0;
  let translatableTokens = 0;
  let inHunk = false;

  for (const line of lines) {
    if (line.startsWith('@@')) {
      inHunk = true;
      continue;
    }
    if (!inHunk) continue;
    if (line.startsWith('---') || line.startsWith('+++')) continue;

    const sigil = line[0];
    if (sigil !== '+' && sigil !== '-') continue;
    const content = line.slice(1);

    if (sigil === '+') added++;
    else removed++;

    if (isTranslatableLine(content, kind)) translatableTokens++;
  }
  return { added, removed, translatableTokens };
}

function classify(metrics: Metrics): Class {
  const total = metrics.added + metrics.removed;
  if (metrics.translatableTokens === 0) return 'a';
  if (metrics.translatableTokens <= 5) return 'b';
  if (total < 100) return 'c';
  return 'd';
}

function main(): void {
  const files = getChangedFiles();
  const results: Classification[] = files.map((file) => {
    const kind = detectKind(file);
    const diff = getDiff(file);
    const metrics = analyzeDiff(diff, kind);
    return {
      file,
      class: classify(metrics),
      directory: path.dirname(file),
      kind,
      metrics,
    };
  });
  process.stdout.write(JSON.stringify(results, null, 2) + '\n');
}

main();
