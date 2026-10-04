#!/usr/bin/env -S pnpm exec tsx
/**
 * verify-migration.ts
 *
 * Deterministic post-migration verification. Exits with code 1 on any failure
 * so that the calling skill / agent treats verification as a hard gate.
 *
 * Checks per target (file or directory):
 *   - For every *.en.md, the corresponding *.md exists and has identical line count.
 *   - For every *.en.{ts,html,json}, the corresponding translated file exists.
 *     (Line count is NOT enforced for source code.)
 *
 * Usage:
 *   pnpm exec tsx .agents/skills/update-origin/scripts/verify-migration.ts <path> [<path> ...]
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

interface Failure {
  kind: 'missing_translation' | 'line_mismatch' | 'structure_drift';
  enFile: string;
  jaFile: string;
  detail?: string;
}

function collectEnFiles(target: string): string[] {
  const stat = fs.statSync(target);
  if (stat.isFile()) return /\.en\.(md|ts|html|json)$/.test(target) ? [target] : [];

  const out: string[] = [];
  const entries = fs.readdirSync(target, { withFileTypes: true, recursive: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!/\.en\.(md|ts|html|json)$/.test(entry.name)) continue;
    // Node 22: parentPath is set; fall back to name resolution otherwise.
    const dir = (entry as fs.Dirent & { parentPath?: string }).parentPath ?? target;
    out.push(path.join(dir, entry.name));
  }
  return out;
}

function lineCount(file: string): number {
  return fs.readFileSync(file, 'utf8').split('\n').length;
}

function jaPath(enFile: string): string {
  return enFile.replace(/\.en\.(md|ts|html|json)$/, '.$1');
}

function changedSince(base: string): Set<string> {
  try {
    const out = execSync(`git diff --name-only ${base}`, { encoding: 'utf-8' });
    return new Set(out.split('\n').filter(Boolean));
  } catch {
    return new Set();
  }
}

function verifyOne(enFile: string, structuralScope: Set<string> | null): Failure[] {
  const failures: Failure[] = [];
  const ja = jaPath(enFile);

  if (!fs.existsSync(ja)) {
    failures.push({ kind: 'missing_translation', enFile, jaFile: ja });
    return failures;
  }

  if (enFile.endsWith('.en.md')) {
    // Strip leading BOM so structural-marker regex anchors at column 0.
    const stripBom = (s: string) => (s.charCodeAt(0) === 0xfeff ? s.slice(1) : s);
    const enLines = stripBom(fs.readFileSync(enFile, 'utf8')).split('\n');
    const jaLines = stripBom(fs.readFileSync(ja, 'utf8')).split('\n');
    if (enLines.length !== jaLines.length) {
      failures.push({
        kind: 'line_mismatch',
        enFile,
        jaFile: ja,
        detail: `en=${enLines.length} ja=${jaLines.length}`,
      });
      return failures;
    }
    // Structural-marker alignment is only enforced for files within the
    // migration scope (changed vs the configured base ref). Pre-existing drift
    // in untouched files is out of scope for /update-origin.
    if (structuralScope !== null && !structuralScope.has(enFile) && !structuralScope.has(ja)) {
      return failures;
    }
    // Structural-marker alignment: fenced code fences (```), heading lines, and
    // line-prefix docs annotations must sit at the SAME line index on both sides.
    // wc -l parity is preserved by the agents but content-level drift (a missing
    // blank line compensated by an extra one elsewhere) hides translation bugs.
    const ANNOTATION = /^(>\s*)*(IMPORTANT|NOTE|HELPFUL|TIP|CRITICAL|WARNING|TLDR):/;
    const FENCE = /^```/;
    const HEADING = /^#{1,6}\s/;
    const drifts: string[] = [];
    for (let i = 0; i < enLines.length; i++) {
      const e = enLines[i];
      const j = jaLines[i];
      if (FENCE.test(e) !== FENCE.test(j)) {
        drifts.push(`L${i + 1}: code-fence drift`);
      } else if (HEADING.test(e) !== HEADING.test(j)) {
        drifts.push(`L${i + 1}: heading drift`);
      } else if (ANNOTATION.test(e) !== ANNOTATION.test(j)) {
        drifts.push(`L${i + 1}: annotation-prefix drift`);
      }
      if (drifts.length >= 5) break;
    }
    if (drifts.length > 0) {
      failures.push({
        kind: 'structure_drift',
        enFile,
        jaFile: ja,
        detail: drifts.join('; '),
      });
    }
  }
  return failures;
}

function main(): void {
  const args = process.argv.slice(2);
  // Optional --base <ref> scopes structural-drift checks to files changed since
  // that ref. Defaults to "main"; pass --base "" to check ALL files.
  let base = 'main';
  const targets: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--base') {
      base = args[++i] ?? 'main';
    } else {
      targets.push(args[i]);
    }
  }
  if (targets.length === 0) {
    console.error('Usage: verify-migration.ts [--base <ref>] <path> [<path> ...]');
    process.exit(2);
  }

  const structuralScope = base === '' ? null : changedSince(base);

  const allEn: string[] = [];
  for (const t of targets) {
    if (!fs.existsSync(t)) {
      console.error(`NOT_FOUND: ${t}`);
      process.exit(2);
    }
    allEn.push(...collectEnFiles(t));
  }

  const failures: Failure[] = [];
  for (const en of allEn) failures.push(...verifyOne(en, structuralScope));

  if (failures.length === 0) {
    console.log(`OK: verified ${allEn.length} file(s) under ${targets.join(', ')}`);
    process.exit(0);
  }

  for (const f of failures) {
    if (f.kind === 'missing_translation') {
      console.error(`MISSING_TRANSLATION: ${f.jaFile} (for ${f.enFile})`);
    } else if (f.kind === 'line_mismatch') {
      console.error(`LINE_MISMATCH: ${f.enFile} vs ${f.jaFile} (${f.detail})`);
    } else {
      console.error(`STRUCTURE_DRIFT: ${f.enFile} vs ${f.jaFile} (${f.detail})`);
    }
  }
  console.error(`FAILED: ${failures.length} issue(s) in ${allEn.length} file(s)`);
  process.exit(1);
}

main();
