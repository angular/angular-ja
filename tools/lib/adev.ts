import chalk from 'chalk';
import { $ } from 'execa';
import kill from 'tree-kill';
import { buildDir } from './workspace';

const $$ = $({
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
  verbose: 'short',
});

export async function buildAdev() {
  const sh = $$({ cwd: buildDir });
  // await $$({ cwd: buildDir })`yarn install --frozen-lockfile`;
  await sh`yarn bazel build //adev:build`;
}

export function serveAdev() {
  const sh = $$({ cwd: buildDir, reject: false });
  const p = sh`npx bazel run //adev:serve --fast_adev`;
  const pid = p.pid!;
  console.debug(chalk.gray('adev process started.', pid));
  const abort = () => kill(pid!);
  p.finally(() => {
    console.debug(chalk.gray('adev process exited.', pid));
  });
  return {
    cancel: async () => {
      abort();
      return await p;
    },
  };
}
