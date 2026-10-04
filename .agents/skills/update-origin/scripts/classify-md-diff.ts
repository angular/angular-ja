#!/usr/bin/env -S pnpm exec tsx
/**
 * classify-md-diff.ts
 *
 * Classify each modified .en.md file into one of four classes by diff scale:
 *   a — English-only change (no prose impact / code-block / URL / whitespace only)
 *   b — Small diff (≤ 5 prose lines changed, no paragraph restructure)
 *   c — Paragraph-level retranslation (≤ 30 prose lines changed)
 *   d — Page-level restructure (out of scope for /update-origin)
 *
 * Usage:
 *   pnpm exec tsx .agents/skills/update-origin/scripts/classify-md-diff.ts [base-ref]
 *
 * Output (JSON to stdout):
 *   [{ file, class, directory, metrics: { added, removed, codeOnly, totalLines } }, ...]
 */

import { execSync } from 'node:child_process';
import * as path from 'node:path';

type Class = 'a' | 'b' | 'c' | 'd';

interface Metrics {
  added: number;
  removed: number;
  codeOnly: boolean;
  totalLines: number;
}

interface Classification {
  file: string;
  class: Class;
  directory: string;
  metrics: Metrics;
}

const baseRef = process.argv[2] ?? 'HEAD';

function getChangedEnMdFiles(): string[] {
  const out = execSync(`git diff --name-only ${baseRef} -- '*.en.md'`, {
    encoding: 'utf8',
  });
  return out.trim().split('\n').filter(Boolean);
}

function getDiff(file: string): string {
  return execSync(`git diff ${baseRef} -- "${file}"`, { encoding: 'utf8' });
}

function fileLineCount(file: string): number {
  try {
    const out = execSync(`wc -l < "${file}"`, { encoding: 'utf8' });
    return parseInt(out.trim(), 10);
  } catch {
    return 0;
  }
}

function analyzeDiff(diff: string): Omit<Metrics, 'totalLines'> {
  const lines = diff.split('\n');
  let added = 0;
  let removed = 0;
  let inCodeBlock = false;
  let codeOnly = true;
  let inHunk = false;

  for (const line of lines) {
    if (line.startsWith('@@')) {
      inHunk = true;
      // Reset code block tracking at hunk boundaries (heuristic).
      inCodeBlock = false;
      continue;
    }
    if (!inHunk) continue;
    if (line.startsWith('---') || line.startsWith('+++')) continue;

    const sigil = line[0];
    const content = line.slice(1);
    const isFence = /^```/.test(content.trimStart());

    if (sigil === '+' || sigil === '-') {
      if (sigil === '+') added++;
      else removed++;

      if (!inCodeBlock && !isFence && content.trim() !== '') {
        codeOnly = false;
      }
    }

    // Toggle code-block state for context lines and changed lines alike.
    if (isFence) {
      inCodeBlock = !inCodeBlock;
    }
  }

  return { added, removed, codeOnly };
}

function classify(metrics: Metrics): Class {
  const total = metrics.added + metrics.removed;
  if (total === 0) return 'a';
  if (metrics.codeOnly) return 'a';
  if (total <= 5) return 'b';
  if (total <= 30) return 'c';
  return 'd';
}

function main(): void {
  const files = getChangedEnMdFiles();
  const results: Classification[] = files.map((file) => {
    const diff = getDiff(file);
    const partial = analyzeDiff(diff);
    const totalLines = fileLineCount(file);
    const metrics: Metrics = { ...partial, totalLines };
    return {
      file,
      class: classify(metrics),
      directory: path.dirname(file),
      metrics,
    };
  });
  process.stdout.write(JSON.stringify(results, null, 2) + '\n');
}

main();
