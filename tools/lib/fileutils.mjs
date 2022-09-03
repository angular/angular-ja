import { access, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

export async function rmrf(path) {
  try {
    await rm(path, { recursive: true });
  } catch {}
}

export async function exists(path) {
  return await access(path)
    .then(() => true)
    .catch(() => false);
}

export async function initDir(path) {
  await rmrf(path);
  await mkdir(path, { recursive: true });
}

export async function cpRf(src, dest) {
  await cp(src, dest, { recursive: true, force: true });
}

export async function sed(path, pattern, replacement) {
  const content = await readFile(path, 'utf-8');
  const newContent = content.replaceAll(pattern, replacement);
  await writeFile(path, newContent, 'utf-8');
}
