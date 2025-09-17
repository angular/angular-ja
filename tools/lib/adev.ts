import { consola } from 'consola';
import { $ } from 'execa';
import { buildDir } from './workspace';

const $$ = $({
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
  verbose: 'short',
});

export async function buildAdev() {
  const sh = $$({ cwd: buildDir });
  await sh`pnpm install --frozen-lockfile`;
  await sh`pnpm bazel build //adev:build.production`;
}

export function serveAdev() {
  const sh = $$({ cwd: buildDir, reject: false });
  const p = sh`pnpm ibazel run //adev:build.serve`;
  const pid = p.pid!;
  consola.log(`adev process started: ${pid}`);
  const abort = () => process.kill(pid!);
  p.finally(() => {
    consola.log(`adev process exited: ${pid}`);
  });
  return {
    cancel: async () => {
      abort();
      return await p;
    },
  };
}
