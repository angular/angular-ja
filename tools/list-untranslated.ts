#!/usr/bin/env tsx

/**
 * @fileoverview Lists files in adev-ja that don't have corresponding .en.* backup files,
 * indicating they haven't been translated yet.
 */

import { consola } from 'consola';
import { extname, resolve } from 'node:path';
import { classifyTranslationTarget, loadContentRouteMap } from './lib/content-routes';
import { exists, getEnFilePath, glob } from './lib/fsutils';
import { adevJaDir } from './lib/workspace';

function categorizeFile(filepath: string): string {
  if (filepath.startsWith('src/content/guide/')) return 'guide';
  if (filepath.startsWith('src/content/tutorials/')) return 'tutorial';
  if (filepath.startsWith('src/content/reference/')) return 'reference';
  if (filepath.startsWith('src/content/best-practices/')) return 'best-practices';
  if (filepath.startsWith('src/content/introduction/')) return 'introduction';
  if (filepath.startsWith('src/content/ai/')) return 'ai';
  if (filepath.startsWith('src/content/events/')) return 'events';
  if (filepath.startsWith('src/content/cli/')) return 'cli';
  if (filepath.startsWith('src/content/tools/')) return 'tools';
  if (filepath.startsWith('src/content/ecosystem/')) return 'ecosystem';
  if (filepath.startsWith('src/app/') || filepath.startsWith('src/shared-docs/')) return 'app';
  return 'other';
}

async function main() {
  const jsonOutput = process.argv.includes('--json');

  const routes = await loadContentRouteMap();
  const files = await glob(['**/*.{md,ts,html,json}', '!**/license.md'], {
    cwd: adevJaDir,
  });
  const untranslated = [];
  const orphaned = [];

  for (const file of files) {
    const ext = extname(file);
    if (file.includes(`.en${ext}`)) continue;
    // tutorialのconfig.jsonは除外
    if (file.startsWith('src/content/tutorials/') && file.endsWith('config.json')) continue;
    if (await exists(resolve(adevJaDir, getEnFilePath(file)))) continue;

    const target = classifyTranslationTarget(routes, file);
    // サイト上に到達できないページは翻訳しても読まれないため追跡対象から外す
    if (target.orphaned) {
      orphaned.push(file);
      continue;
    }
    untranslated.push({
      path: file,
      category: categorizeFile(file),
      extension: ext.slice(1),
      url: target.url,
    });
  }

  // ロケール非依存に並べ、環境をまたいでも出力を同一に保つ
  untranslated.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  orphaned.sort();

  if (jsonOutput) {
    console.log(
      JSON.stringify(
        { count: untranslated.length, files: untranslated, orphaned },
        null,
        2
      )
    );
  } else {
    untranslated.length
      ? consola.info(
          `Found ${untranslated.length} untranslated files:\n${untranslated
            .map((f) => `  ${f.path}`)
            .join('\n')}`
        )
      : consola.success('All files translated! 🎉');
    if (orphaned.length) {
      consola.warn(
        `Skipped ${orphaned.length} files with no route on the site:\n${orphaned
          .map((f) => `  ${f}`)
          .join('\n')}`
      );
    }
  }
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
