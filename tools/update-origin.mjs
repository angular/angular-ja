import { access, copyFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { $, argv, chalk, glob } from 'zx';

const copyTargets = [
  // Text contents
  'content/cli/**/*.md',
  'content/guide/**/*.md',
  'content/errors/**/*.md',
  'content/marketing/**/*',
  'content/start/**/*.md',
  'content/tutorial/**/*.md',
  'content/navigation.json',
  // example code files
  'content/examples/toh-pt6/src/app/hero-search/hero-search.component.ts',
  'content/examples/toh-pt6/src/app/heroes/heroes.component.html',
  'content/examples/toh-pt6/src/app/hero.service.ts',
];

try {
  console.log(chalk.cyan('Checking aio changes in origin...'));

  const [aioHash] = argv._;
  if (aioHash == null) {
    console.log('No aio origin SHA is provided.');
    process.exit(1);
  }
  console.log(chalk.green('aio origin SHA: ' + aioHash));

  await resetOriginHead(aioHash);
  await copyOriginFiles();

  console.log(chalk.cyan('Done.'));
} catch (err) {
  console.error(chalk.red(err));
  process.exit(1);
}

async function resetOriginHead(hash) {
  await $`git -C origin fetch --all`;
  await $`git -C origin reset ${hash} --hard`;
}

async function copyOriginFiles() {
  const aioOriginDir = 'origin/aio';
  const aioJaDir = 'aio-ja';

  const files = await glob(copyTargets, { cwd: aioOriginDir });

  for (const file of files) {
    const src = resolve(aioOriginDir, file);
    const ext = extname(file);
    const enFilePath = file.replace(`${ext}`, `.en${ext}`);

    let isTranslated = false;
    try {
      await access(resolve(aioJaDir, enFilePath));
      isTranslated = true;
    } catch {}
    const dest = resolve(aioJaDir, isTranslated ? enFilePath : file);

    await copyFile(src, dest);
  }
}
