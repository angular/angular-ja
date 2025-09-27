#!/usr/bin/env tsx

/**
 * @fileoverview Lists files in adev-ja that don't have corresponding .en.* backup files,
 * indicating they haven't been translated yet.
 */

import { consola } from 'consola';
import { extname, resolve } from 'node:path';
import { exists, getEnFilePath, glob } from './lib/fsutils';
import { adevJaDir } from './lib/workspace';

async function main() {
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

  untranslated.length
    ? consola.info(
        `Found ${untranslated.length} untranslated files:\n${untranslated
          .sort()
          .map((f) => `  ${f}`)
          .join('\n')}`
      )
    : consola.success('All files translated! 🎉');
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
