/**
 * @fileoverview Resolves adev content files to the URL path they are published at.
 *
 * The route table is the navigation entries source, where `path` (URL) and
 * `contentPath` (source file) are independent values. Deriving a URL from the file
 * path alone produces dead links whenever the two diverge.
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { adevJaDir } from './workspace';

const navigationEntriesFile = resolve(
  adevJaDir,
  'src/app/routing/navigation-entries/index.ts'
);

/**
 * Pages published without a navigable route. Reviewed and expected: they still reach
 * readers, so they stay subject to translation even without a preview link.
 */
export const ROUTELESS_TRANSLATABLE_CONTENT: readonly string[] = [
  // Body of the 404 page, rendered by the catch-all route.
  'src/content/error.md',
];

/**
 * Pages upstream keeps in the repository but no longer routes. They have no page of
 * their own, so they are dropped from translation tracking. Note that they are still
 * bundled into llms-full.txt, so the drop trades reader-facing value for focus.
 */
export const KNOWN_ORPHANED_CONTENT: readonly string[] = [
  // Superseded by guide/di/creating-and-using-services, kept only as a redirect source.
  'src/content/guide/di/creating-injectable-service.md',
  // Dropped from the navigation without a replacement or a redirect.
  'src/content/guide/http/security.md',
];

/**
 * Routes that Bazel generates at build time (`generate_nav_items` for the error and
 * diagnostic encyclopedias, `routes.json` for tutorials) and that therefore never
 * appear in the navigation entries source.
 */
const GENERATED_ROUTE_RULES: readonly [RegExp, (match: RegExpMatchArray) => string][] =
  [
    [/^reference\/(errors|extended-diagnostics)\/([^/]+)$/, (m) => `${m[1]}/${m[2]}`],
    [/^tutorials\/([^/]+)\/intro\/README$/, (m) => `tutorials/${m[1]}`],
    [
      /^tutorials\/([^/]+)\/steps\/([^/]+)\/README$/,
      (m) => `tutorials/${m[1]}/${m[2]}`,
    ],
  ];

export type ContentRouteMap = ReadonlyMap<string, string>;

/**
 * A page may be listed under several sections, giving one `contentPath` several URLs.
 * The URL that repeats the content path is the page's own address; the others are
 * cross-listings, so they must not displace it.
 */
function addRoute(routes: Map<string, string>, contentPath: string, path: string) {
  const known = routes.get(contentPath);
  if (known === undefined || (known !== contentPath && path === contentPath)) {
    routes.set(contentPath, path);
  }
}

/**
 * Braces, and the two keys we care about, in source order. Strings and comments are
 * matched only so that the scan steps over them without reading their contents.
 */
const NAV_TOKEN =
  /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|\/\/[^\n]*|\/\*[\s\S]*?\*\/|\b(path|contentPath)\s*:\s*'((?:[^'\\]|\\.)*)'|([{}])/g;

export function parseContentRouteMap(source: string): ContentRouteMap {
  const routes = new Map<string, string>();
  // Keys belong to the innermost open object, whatever order they are written in.
  const stack: { path?: string; contentPath?: string }[] = [];

  for (const [, key, value, brace] of source.matchAll(NAV_TOKEN)) {
    if (brace === '{') {
      stack.push({});
    } else if (brace === '}') {
      const closed = stack.pop();
      if (closed?.path !== undefined && closed.contentPath !== undefined) {
        addRoute(routes, closed.contentPath, closed.path);
      }
    } else if (key !== undefined) {
      const entry = stack.at(-1);
      if (entry) entry[key as 'path' | 'contentPath'] = value;
    }
  }
  return routes;
}

export async function loadContentRouteMap(): Promise<ContentRouteMap> {
  const routes = parseContentRouteMap(await readFile(navigationEntriesFile, 'utf-8'));
  if (routes.size === 0) {
    throw new Error(
      `No path/contentPath pairs found in ${navigationEntriesFile}. ` +
        `The navigation entries format changed; update parseContentRouteMap().`
    );
  }
  return routes;
}

export function toContentPath(filepath: string): string | null {
  if (!filepath.startsWith('src/content/') || !filepath.endsWith('.md')) {
    return null;
  }
  return filepath.slice('src/content/'.length).replace(/\.md$/, '');
}

export function resolveContentRoute(
  routes: ContentRouteMap,
  filepath: string
): string | null {
  const contentPath = toContentPath(filepath);
  if (contentPath === null) return null;

  const route = routes.get(contentPath);
  if (route !== undefined) return route;

  for (const [pattern, toRoute] of GENERATED_ROUTE_RULES) {
    const match = contentPath.match(pattern);
    if (match) return toRoute(match);
  }
  return null;
}

export interface TranslationTarget {
  /** URL path on angular.jp, or null when the file has no page of its own. */
  url: string | null;
  /** True when the file is dead upstream content and should not be tracked. */
  orphaned: boolean;
}

export function classifyTranslationTarget(
  routes: ContentRouteMap,
  filepath: string
): TranslationTarget {
  // Non-documentation files (app sources, tutorial configs) carry translatable
  // strings but have no page of their own.
  if (toContentPath(filepath) === null) {
    return { url: null, orphaned: false };
  }

  const url = resolveContentRoute(routes, filepath);
  if (url !== null) return { url, orphaned: false };

  // Dropping a page needs a deliberate entry. An unclassified page stays tracked,
  // so a gap in route resolution is noisy rather than silently destructive.
  return { url: null, orphaned: KNOWN_ORPHANED_CONTENT.includes(filepath) };
}
