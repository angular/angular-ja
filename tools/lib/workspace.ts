import { resolve } from 'node:path';

export const rootDir = new URL('../../', import.meta.url).pathname;
export const adevJaDir = resolve(rootDir, 'adev-ja');
export const buildDir = resolve(rootDir, 'build');
export const buildOutputDir = resolve(buildDir, 'dist/bin/adev/build/browser');
