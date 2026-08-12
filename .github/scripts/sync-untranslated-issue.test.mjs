import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildCheckoutIssuesMap, toDeclarationKey } from './sync-untranslated-issue.mjs';

const files = [
  { path: 'src/content/guide/signals/effect.md' },
  { path: 'src/content/guide/signals-rfc.md' },
  { path: 'src/content/tools/libraries/overview.md' },
  { path: 'src/app/routing/navigation-entries/index.ts' },
];
const claimed = (title) => [...buildCheckoutIssuesMap([{ number: 1, title }], files).keys()];

describe('toDeclarationKey', () => {
  it('strips the content prefix, the extension and a trailing slash', () => {
    assert.equal(toDeclarationKey('src/content/guide/i18n/overview.md'), 'guide/i18n/overview');
    assert.equal(toDeclarationKey('guide/di/'), 'guide/di');
    assert.equal(toDeclarationKey('src/app/routing/routes.ts'), 'src/app/routing/routes');
  });
});

describe('buildCheckoutIssuesMap', () => {
  it('claims the declared file', () => {
    assert.deepEqual(claimed('translate: guide/signals/effect'), [
      'src/content/guide/signals/effect.md',
    ]);
  });

  it('claims every file under a declared directory, with or without a trailing slash', () => {
    assert.deepEqual(claimed('translate: tools/libraries'), [
      'src/content/tools/libraries/overview.md',
    ]);
    assert.deepEqual(claimed('translate: tools/libraries/'), [
      'src/content/tools/libraries/overview.md',
    ]);
  });

  it('stops at the path boundary', () => {
    assert.deepEqual(claimed('translate: guide/signals'), [
      'src/content/guide/signals/effect.md',
    ]);
  });

  it('claims files outside src/content', () => {
    assert.deepEqual(claimed('translate: src/app/routing/navigation-entries/index'), [
      'src/app/routing/navigation-entries/index.ts',
    ]);
  });

  it('tolerates a legacy title that keeps the prefix and the extension', () => {
    assert.deepEqual(claimed('translate: src/content/guide/signals/effect.md'), [
      'src/content/guide/signals/effect.md',
    ]);
  });

  it('claims nothing for a title with no path', () => {
    assert.deepEqual(claimed('translate:'), []);
    assert.deepEqual(claimed('translate:   '), []);
    assert.deepEqual(claimed('Tracking: 未翻訳ドキュメント一覧'), []);
  });
});
