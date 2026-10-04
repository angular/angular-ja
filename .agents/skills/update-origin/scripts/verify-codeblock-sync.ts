#!/usr/bin/env -S pnpm exec tsx
/**
 * verify-codeblock-sync.ts
 *
 * Catches a recurring class-a migration bug: an upstream code change inside a
 * fenced code block (```...```) was applied to the *.en.md but not mirrored to
 * the corresponding *.md, even though wc -l parity holds.
 *
 * For every *.en.md that has changed since the merge-base with `main` (or a
 * given base ref), we walk the diff and inspect each `+` line that lands
 * inside a fenced code block on the new side. The same line index in *.md
 * MUST contain the identical text — code blocks are shared verbatim.
 *
 * Exits with code 1 on any mismatch so that the orchestrator treats it as a
 * hard gate.
 *
 * Usage:
 *   pnpm exec tsx .agents/skills/update-origin/scripts/verify-codeblock-sync.ts [<base-ref>]
 *   # default base-ref: main
 */
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';

interface Issue {
  file: string;
  line: number;
  en: string;
  ja: string;
}

function changedEnMd(base: string): string[] {
  const out = execSync(`git diff --name-only ${base} -- "adev-ja/**/*.en.md"`, {
    encoding: 'utf-8',
  });
  return out.split('\n').filter(Boolean);
}

function diffOf(base: string, file: string): string {
  return execSync(`git diff ${base} -- ${file}`, { encoding: 'utf-8' });
}

function fenceRanges(lines: string[]): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  let inCode = false;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^```/.test(lines[i])) {
      if (!inCode) {
        inCode = true;
        start = i;
      } else {
        inCode = false;
        ranges.push([start, i]);
      }
    }
  }
  return ranges;
}

function inAnyRange(i: number, ranges: Array<[number, number]>): boolean {
  return ranges.some(([s, e]) => i > s && i < e);
}

function main(): void {
  const base = process.argv[2] ?? 'main';
  const enFiles = changedEnMd(base);
  const issues: Issue[] = [];

  for (const enFile of enFiles) {
    const jaFile = enFile.replace(/\.en\.md$/, '.md');
    if (!fs.existsSync(enFile) || !fs.existsSync(jaFile)) continue;
    const en = fs.readFileSync(enFile, 'utf-8').split('\n');
    const ja = fs.readFileSync(jaFile, 'utf-8').split('\n');
    if (en.length !== ja.length) continue; // line_mismatch is reported elsewhere

    const ranges = fenceRanges(en);
    const diff = diffOf(base, enFile).split('\n');
    let newLineNum = 0;
    for (const l of diff) {
      const m = l.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (m) {
        newLineNum = parseInt(m[1], 10) - 1;
        continue;
      }
      if (l.startsWith('+++') || l.startsWith('---')) continue;
      if (l.startsWith('+')) {
        newLineNum++;
        const i = newLineNum - 1;
        if (!inAnyRange(i, ranges)) continue;
        const enLine = en[i] ?? '';
        const jaLine = ja[i] ?? '';
        if (enLine !== jaLine) {
          issues.push({
            file: jaFile,
            line: newLineNum,
            en: enLine.slice(0, 160),
            ja: jaLine.slice(0, 160),
          });
        }
      } else if (l.startsWith(' ')) {
        newLineNum++;
      }
    }
  }

  if (issues.length === 0) {
    console.log(`OK: code-block sync verified for ${enFiles.length} changed file(s) since ${base}`);
    process.exit(0);
  }

  for (const x of issues) {
    console.error(`CODEBLOCK_DRIFT: ${x.file}:${x.line}`);
    console.error(`  EN: ${x.en}`);
    console.error(`  JA: ${x.ja}`);
  }
  console.error(`FAILED: ${issues.length} code-block sync issue(s)`);
  process.exit(1);
}

main();
