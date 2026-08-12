#!/usr/bin/env tsx

/**
 * @fileoverview Verifies that every documentation page resolves to a URL on angular.jp.
 *
 * Guards the untranslated-files tracking issue against dead preview links: a page that
 * stops resolving means either the navigation entries moved, or the route table parser
 * broke. Both must be noticed here rather than shipped as 404s.
 */

import { consola } from 'consola';
import {
  KNOWN_ORPHANED_CONTENT,
  ROUTELESS_TRANSLATABLE_CONTENT,
  loadContentRouteMap,
  resolveContentRoute,
} from './lib/content-routes';
import { glob } from './lib/fsutils';
import { adevJaDir } from './lib/workspace';

async function main() {
  const routes = await loadContentRouteMap();
  const files = await glob(
    ['src/content/**/*.md', '!**/*.en.md', '!**/license.md'],
    { cwd: adevJaDir }
  );

  const declared = [...ROUTELESS_TRANSLATABLE_CONTENT, ...KNOWN_ORPHANED_CONTENT];
  const unrouted = files.filter((file) => resolveContentRoute(routes, file) === null);
  const undeclared = unrouted.filter((file) => !declared.includes(file));
  const stale = declared.filter(
    (file) => !files.includes(file) || resolveContentRoute(routes, file) !== null
  );

  if (undeclared.length) {
    consola.error(
      `${undeclared.length} pages resolve to no URL:\n${undeclared
        .map((f) => `  ${f}`)
        .join('\n')}\n` +
        `If a page moved, fix src/app/routing/navigation-entries/index.ts. Otherwise decide ` +
        `in tools/lib/content-routes.ts: ROUTELESS_TRANSLATABLE_CONTENT keeps it in the ` +
        `tracking issue without a preview link, KNOWN_ORPHANED_CONTENT removes it from ` +
        `translation tracking for good.`
    );
  }
  if (stale.length) {
    consola.error(
      `${stale.length} entries in tools/lib/content-routes.ts are obsolete ` +
        `(the file is gone, or it resolves again):\n${stale.map((f) => `  ${f}`).join('\n')}`
    );
  }
  if (undeclared.length || stale.length) {
    process.exit(1);
  }

  consola.success(
    `All ${files.length} pages accounted for (${declared.length} declared exceptions).`
  );
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
