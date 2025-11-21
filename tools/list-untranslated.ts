#!/usr/bin/env tsx

/**
 * @fileoverview Lists files in adev-ja that don't have corresponding .en.* backup files,
 * indicating they haven't been translated yet.
 */

import { consola } from 'consola';
import { extname, resolve } from 'node:path';
import { exists, getEnFilePath, glob } from './lib/fsutils';
import { adevJaDir } from './lib/workspace';

function categorizeFile(filepath: string): string {
  if (filepath.startsWith('src/content/guide/')) return 'guide';
  if (filepath.startsWith('src/content/tutorials/')) return 'tutorial';
  if (filepath.startsWith('src/content/reference/')) return 'reference';
  if (filepath.startsWith('src/content/best-practices/')) return 'best-practices';
  if (filepath.startsWith('src/content/cli/')) return 'cli';
  if (filepath.startsWith('src/app/') || filepath.startsWith('src/shared-docs/')) return 'app';
  return 'other';
}

async function main() {
  const jsonOutput = process.argv.includes('--json');

  const files = await glob(['**/*.{md,ts,html,json}', '!**/license.md'], {
    cwd: adevJaDir,
  });
  const untranslated = [];

  for (const file of files) {
    const ext = extname(file);
    if (file.includes(`.en${ext}`)) continue;
    if (!(await exists(resolve(adevJaDir, getEnFilePath(file))))) {
      untranslated.push(file);
    }
  }

  if (jsonOutput) {
    const output = {
      count: untranslated.length,
      files: untranslated.sort().map(file => ({
        path: file,
        category: categorizeFile(file),
        extension: extname(file).slice(1)
      }))
    };
    console.log(JSON.stringify(output, null, 2));
  } else {
    untranslated.length
      ? consola.info(
          `Found ${untranslated.length} untranslated files:\n${untranslated
            .sort()
            .map((f) => `  ${f}`)
            .join('\n')}`
        )
      : consola.success('All files translated! 🎉');
  }
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
