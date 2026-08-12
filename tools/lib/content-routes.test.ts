import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  classifyTranslationTarget,
  parseContentRouteMap,
  resolveContentRoute,
} from './content-routes';

const nav = (body: string) => parseContentRouteMap(body);

describe('parseContentRouteMap', () => {
  it('pairs path and contentPath within the same object', () => {
    const routes = nav(`[
      {
        label: 'Overview',
        path: 'best-practices/performance',
        contentPath: 'best-practices/performance/overview',
      },
    ]`);
    assert.equal(
      routes.get('best-practices/performance/overview'),
      'best-practices/performance'
    );
  });

  it('pairs the keys whatever order they are written in', () => {
    const routes = nav(`[
      {
        contentPath: 'guide/i18n/overview',
        label: 'Overview',
        path: 'guide/i18n',
      },
    ]`);
    assert.equal(routes.get('guide/i18n/overview'), 'guide/i18n');
  });

  it('keeps a nested child from stealing its parent path', () => {
    const routes = nav(`[
      {
        label: 'Forms',
        path: 'guide/forms',
        children: [{label: 'Signals', path: 'guide/forms/signals', contentPath: 'guide/forms/signals/overview'}],
        contentPath: 'guide/forms/overview',
      },
    ]`);
    assert.equal(routes.get('guide/forms/signals/overview'), 'guide/forms/signals');
    assert.equal(routes.get('guide/forms/overview'), 'guide/forms');
  });

  it('prefers the page own address over a cross-listing, in either order', () => {
    const own = `{path: 'guide/ssr', contentPath: 'guide/ssr'}`;
    const alias = `{path: 'best-practices/performance/ssr', contentPath: 'guide/ssr'}`;
    assert.equal(nav(`[${own}, ${alias}]`).get('guide/ssr'), 'guide/ssr');
    assert.equal(nav(`[${alias}, ${own}]`).get('guide/ssr'), 'guide/ssr');
  });

  it('ignores an entry that declares no path', () => {
    const routes = nav(`[{label: 'Update guide', path: 'update-guide'}, {label: 'Broken', contentPath: 'guide/broken'}]`);
    assert.equal(routes.get('guide/broken'), undefined);
  });

  it('is not derailed by braces inside labels', () => {
    const routes = nav(`[
      {
        label: '{#anchor} の書き方',
        path: 'guide/anchors',
        contentPath: 'guide/anchors',
      },
    ]`);
    assert.equal(routes.get('guide/anchors'), 'guide/anchors');
  });
});

describe('resolveContentRoute', () => {
  const routes = nav(`[{path: 'errors', contentPath: 'reference/errors/overview'}]`);

  it('resolves Bazel generated routes', () => {
    assert.equal(
      resolveContentRoute(routes, 'src/content/reference/errors/NG0100.md'),
      'errors/NG0100'
    );
    assert.equal(
      resolveContentRoute(
        routes,
        'src/content/reference/extended-diagnostics/NG8101.md'
      ),
      'extended-diagnostics/NG8101'
    );
    assert.equal(
      resolveContentRoute(routes, 'src/content/tutorials/first-app/intro/README.md'),
      'tutorials/first-app'
    );
    assert.equal(
      resolveContentRoute(
        routes,
        'src/content/tutorials/first-app/steps/06-property-binding/README.md'
      ),
      'tutorials/first-app/06-property-binding'
    );
  });

  it('lets the navigation entries win over the generated rules', () => {
    assert.equal(
      resolveContentRoute(routes, 'src/content/reference/errors/overview.md'),
      'errors'
    );
  });

  it('returns null for files that are not documentation pages', () => {
    assert.equal(resolveContentRoute(routes, 'src/app/routing/routes.ts'), null);
    assert.equal(
      resolveContentRoute(routes, 'src/content/tutorials/signals/intro/config.json'),
      null
    );
  });
});

describe('classifyTranslationTarget', () => {
  const routes = nav(`[{path: 'guide/i18n', contentPath: 'guide/i18n/overview'}]`);

  it('reports the URL of a routed page', () => {
    assert.deepEqual(
      classifyTranslationTarget(routes, 'src/content/guide/i18n/overview.md'),
      { url: 'guide/i18n', orphaned: false }
    );
  });

  it('drops only pages listed as orphaned', () => {
    assert.equal(
      classifyTranslationTarget(
        routes,
        'src/content/guide/di/creating-injectable-service.md'
      ).orphaned,
      true
    );
  });

  it('keeps tracking a page it cannot classify', () => {
    assert.deepEqual(classifyTranslationTarget(routes, 'src/content/guide/new.md'), {
      url: null,
      orphaned: false,
    });
  });

  it('keeps tracking non-documentation files', () => {
    assert.deepEqual(classifyTranslationTarget(routes, 'src/app/routing/routes.ts'), {
      url: null,
      orphaned: false,
    });
  });
});
