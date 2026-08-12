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
 * Content files published without a navigable route. They still reach readers, so
 * they remain subject to translation.
 */
export const ROUTELESS_TRANSLATABLE_CONTENT: readonly string[] = [
  // Body of the 404 page, rendered by the catch-all route.
  'src/content/error.md',
];

/**
 * Content files upstream keeps in the repository but no longer routes. They are
 * unreachable on the site, so translating them is wasted effort.
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

/** Builds the `contentPath` -> URL path table from the navigation entries source. */
export async function loadContentRouteMap(): Promise<ContentRouteMap> {
  const lines = (await readFile(navigationEntriesFile, 'utf-8')).split('\n');
  const routes = new Map<string, string>();

  for (let i = 0; i < lines.length; i++) {
    const contentPath = lines[i].match(/^\s*contentPath:\s*'([^']+)'/)?.[1];
    if (!contentPath) continue;

    const path = lines[i - 1]?.match(/^\s*path:\s*'([^']+)'/)?.[1];
    if (path === undefined) {
      throw new Error(
        `${navigationEntriesFile}:${i + 1}: contentPath is not preceded by a path line. ` +
          `The navigation entries format changed; update loadContentRouteMap().`
      );
    }
    routes.set(contentPath, path);
  }

  if (routes.size === 0) {
    throw new Error(
      `No path/contentPath pairs found in ${navigationEntriesFile}. ` +
        `The navigation entries format changed; update loadContentRouteMap().`
    );
  }
  return routes;
}

/** Returns the `contentPath` of a documentation page, or null for any other file. */
export function toContentPath(filepath: string): string | null {
  if (!filepath.startsWith('src/content/') || !filepath.endsWith('.md')) {
    return null;
  }
  return filepath.slice('src/content/'.length).replace(/\.md$/, '');
}

/** Returns the URL path a documentation page is published at, or null if it has none. */
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
  /** True when the file is unreachable on the site and should not be tracked. */
  orphaned: boolean;
}

/** Decides whether a file is worth translating, and where readers can preview it. */
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

  return {
    url: null,
    orphaned: !ROUTELESS_TRANSLATABLE_CONTENT.includes(filepath),
  };
}
