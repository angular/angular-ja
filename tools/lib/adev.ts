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
  await sh`yarn install --frozen-lockfile`;
  await sh`yarn bazel build //adev:build --full_build_adev --config=release`;
}

export function serveAdev() {
  const sh = $$({ cwd: buildDir, reject: false });
  const p = sh`yarn ibazel run //adev:serve`;
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
