import { consola } from 'consola';
import { $ } from 'execa';
import { existsSync } from 'node:fs';
import { buildDir, buildOutputDir } from './workspace';

const $$ = $({
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
  verbose: 'short',
});

export async function buildAdev() {
  const sh = $$({ cwd: buildDir });
  await sh`pnpm install --frozen-lockfile`;
  await sh`pnpm bazel build //adev:build.production --config=release`;

  // Verify build output exists - Bazel may exit with code 0 even when interrupted
  if (!existsSync(buildOutputDir)) {
    throw new Error(
      `Build output directory not found: ${buildOutputDir}\n` +
        'Bazel build may have been interrupted or failed silently.'
    );
  }
}

export async function serveAdev() {
  const sh = $$({ cwd: buildDir, reject: false });
  // Ensure dependencies are installed before running ibazel
  await $$({ cwd: buildDir })`pnpm install --frozen-lockfile`;
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
