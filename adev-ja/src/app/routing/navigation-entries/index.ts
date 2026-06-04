/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {isDevMode} from '@angular/core';
import type {NavigationItem} from '@angular/docs';
// These imports are expected to be red because they are generated a build time
// @ts-ignore
import ERRORS_NAV_DATA from '../../../content/reference/errors/routes.json' with {type: 'json'};
// @ts-ignore
import EXT_DIAGNOSTICS_NAV_DATA from '../../../content/reference/extended-diagnostics/routes.json' with {type: 'json'};
// @ts-ignore
import FIRST_APP_TUTORIAL_NAV_DATA from '../../../content/tutorials/first-app/first-app/routes.json' with {type: 'json'};
// @ts-ignore
import LEARN_ANGULAR_TUTORIAL_NAV_DATA from '../../../content/tutorials/learn-angular/learn-angular/routes.json' with {type: 'json'};
// @ts-ignore
import DEFERRABLE_VIEWS_TUTORIAL_NAV_DATA from '../../../content/tutorials/deferrable-views/deferrable-views/routes.json' with {type: 'json'};
// @ts-ignore
import SIGNALS_TUTORIAL_NAV_DATA from '../../../content/tutorials/signals/signals/routes.json' with {type: 'json'};
// @ts-ignore
import SIGNAL_FORMS_TUTORIAL_NAV_DATA from '../../../content/tutorials/signal-forms/signal-forms/routes.json' with {type: 'json'};
// @ts-ignore
import API_MANIFEST_JSON from '../../../assets/manifest.json' with {type: 'json'};

interface SubNavigationData {
  docs: NavigationItem[];
  reference: NavigationItem[];
  tutorials: NavigationItem[];
  footer: NavigationItem[];
}

export const DOCS_SUB_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: '入門',
    children: [
      {
        label: 'Angularとは？',
        path: 'overview',
        contentPath: 'introduction/what-is-angular',
      },
      {
        label: 'インストール',
        path: 'installation',
        contentPath: 'introduction/installation',
      },
      {
        label: '基本概念',
        children: [
          {
            label: '概要',
            path: 'essentials',
            contentPath: 'introduction/essentials/overview',
          },
          {
            label: 'コンポーネントによる構築',
            path: 'essentials/components',
            contentPath: 'introduction/essentials/components',
          },
          {
            label: 'リアクティビティとシグナル',
            path: 'essentials/signals',
            contentPath: 'introduction/essentials/signals',
          },
          {
            label: 'テンプレートによる動的なインターフェース',
            path: 'essentials/templates',
            contentPath: 'introduction/essentials/templates',
          },
          {
            label: 'シグナルを使ったフォーム',
            path: 'essentials/signal-forms',
            contentPath: 'introduction/essentials/signal-forms',
            status: 'new',
          },
          {
            label: '依存性の注入によるモジュール設計',
            path: 'essentials/dependency-injection',
            contentPath: 'introduction/essentials/dependency-injection',
          },
          {
            label: '次のステップ',
            path: 'essentials/next-steps',
            contentPath: 'introduction/essentials/next-steps',
          },
        ],
      },
      {
        label: '作ってみよう！ 🚀',
        path: 'tutorials/learn-angular',
      },
    ],
  },
  {
    label: '詳細ガイド',
    children: [
      {
        label: 'シグナル',
        status: 'updated',
        children: [
          {
            label: '概要',
            path: 'guide/signals',
            contentPath: 'guide/signals/overview',
          },
          {
            label: 'linkedSignalによる派生状態',
            path: 'guide/signals/linked-signal',
            contentPath: 'guide/signals/linked-signal',
          },
          {
            label: 'resourceによる非同期リアクティビティ',
            path: 'guide/signals/resource',
            contentPath: 'guide/signals/resource',
          },
          {
            label: 'デバウンスされたシグナル',
            path: 'guide/signals/debounced',
            contentPath: 'guide/signals/debounced',
            status: 'new',
          },
          {
            label: '非リアクティブAPIのための副作用',
            path: 'guide/signals/effect',
            contentPath: 'guide/signals/effect',
            status: 'new',
          },
        ],
      },
      {
        label: 'コンポーネント',
        children: [
          {
            label: 'コンポーネントの構造',
            path: 'guide/components',
            contentPath: 'guide/components/anatomy-of-components',
          },
          {
            label: 'セレクター',
            path: 'guide/components/selectors',
            contentPath: 'guide/components/selectors',
          },
          {
            label: 'スタイリング',
            path: 'guide/components/styling',
            contentPath: 'guide/components/styling',
          },
          {
            label: '入力プロパティによるデータ受け入れ',
            path: 'guide/components/inputs',
            contentPath: 'guide/components/inputs',
          },
          {
            label: '出力によるカスタムイベント',
            path: 'guide/components/outputs',
            contentPath: 'guide/components/outputs',
          },
          {
            label: 'ng-contentによるコンテンツ投影',
            path: 'guide/components/content-projection',
            contentPath: 'guide/components/content-projection',
          },
          {
            label: 'ホスト要素',
            path: 'guide/components/host-elements',
            contentPath: 'guide/components/host-elements',
          },
          {
            label: 'ライフサイクル',
            path: 'guide/components/lifecycle',
            contentPath: 'guide/components/lifecycle',
          },
          {
            label: 'クエリによるコンポーネントの子への参照',
            path: 'guide/components/queries',
            contentPath: 'guide/components/queries',
          },
          {
            label: 'DOM APIの使用',
            path: 'guide/components/dom-apis',
            contentPath: 'guide/components/dom-apis',
          },
          {
            label: '継承',
            path: 'guide/components/inheritance',
            contentPath: 'guide/components/inheritance',
          },
          {
            label: 'プログラムによるコンポーネントレンダリング',
            path: 'guide/components/programmatic-rendering',
            contentPath: 'guide/components/programmatic-rendering',
          },
          {
            label: '高度な設定',
            path: 'guide/components/advanced-configuration',
            contentPath: 'guide/components/advanced-configuration',
          },
          {
            label: 'カスタム要素',
            path: 'guide/elements',
            contentPath: 'guide/elements',
          },
        ],
      },
      {
        label: 'テンプレート',
        children: [
          {
            label: '概要',
            path: 'guide/templates',
            contentPath: 'guide/templates/overview',
          },
          {
            label: '動的テキスト、プロパティ、属性のバインディング',
            path: 'guide/templates/binding',
            contentPath: 'guide/templates/binding',
          },
          {
            label: 'イベントリスナーの追加',
            path: 'guide/templates/event-listeners',
            contentPath: 'guide/templates/event-listeners',
          },
          {
            label: '双方向バインディング',
            path: 'guide/templates/two-way-binding',
            contentPath: 'guide/templates/two-way-binding',
          },
          {
            label: '制御フロー',
            path: 'guide/templates/control-flow',
            contentPath: 'guide/templates/control-flow',
          },
          {
            label: 'パイプ',
            path: 'guide/templates/pipes',
            contentPath: 'guide/templates/pipes',
          },
          {
            label: 'ng-contentによる子コンテンツのスロット化',
            path: 'guide/templates/ng-content',
            contentPath: 'guide/templates/ng-content',
          },
          {
            label: 'ng-templateによるテンプレートフラグメントの作成',
            path: 'guide/templates/ng-template',
            contentPath: 'guide/templates/ng-template',
          },
          {
            label: 'ng-containerによる要素のグループ化',
            path: 'guide/templates/ng-container',
            contentPath: 'guide/templates/ng-container',
          },
          {
            label: 'テンプレート内の変数',
            path: 'guide/templates/variables',
            contentPath: 'guide/templates/variables',
          },
          {
            label: '@deferによる遅延読み込み',
            path: 'guide/templates/defer',
            contentPath: 'guide/templates/defer',
          },
          {
            label: '式の構文',
            path: 'guide/templates/expression-syntax',
            contentPath: 'guide/templates/expression-syntax',
          },
          {
            label: 'テンプレート内の空白',
            path: 'guide/templates/whitespace',
            contentPath: 'guide/templates/whitespace',
          },
        ],
      },
      {
        label: 'ディレクティブ',
        children: [
          {
            label: '概要',
            path: 'guide/directives',
            contentPath: 'guide/directives/overview',
          },
          {
            label: '属性ディレクティブ',
            path: 'guide/directives/attribute-directives',
            contentPath: 'guide/directives/attribute-directives',
          },
          {
            label: '構造ディレクティブ',
            path: 'guide/directives/structural-directives',
            contentPath: 'guide/directives/structural-directives',
          },
          {
            label: 'ディレクティブコンポジションAPI',
            path: 'guide/directives/directive-composition-api',
            contentPath: 'guide/directives/directive-composition-api',
          },
          {
            label: 'NgOptimizedImageによる画像の最適化',
            path: 'guide/image-optimization',
            contentPath: 'guide/image-optimization',
          },
        ],
      },
      {
        label: '依存性の注入',
        status: 'updated',
        children: [
          {
            label: '概要',
            path: 'guide/di',
            contentPath: 'guide/di/overview',
            status: 'updated',
          },
          {
            label: 'サービスの作成と使用',
            path: 'guide/di/creating-and-using-services',
            contentPath: 'guide/di/creating-and-using-services',
            status: 'updated',
          },
          {
            label: 'サービスの遅延読み込み',
            path: 'guide/di/lazy-loading-services',
            contentPath: 'guide/di/lazy-loading-services',
            status: 'new',
          },
          {
            label: '依存性プロバイダーの定義',
            path: 'guide/di/defining-dependency-providers',
            contentPath: 'guide/di/defining-dependency-providers',
            status: 'updated',
          },
          {
            label: '注入コンテキスト',
            path: 'guide/di/dependency-injection-context',
            contentPath: 'guide/di/dependency-injection-context',
          },
          {
            label: '階層的なインジェクター',
            path: 'guide/di/hierarchical-dependency-injection',
            contentPath: 'guide/di/hierarchical-dependency-injection',
          },
          {
            label: 'インジェクショントークンの最適化',
            path: 'guide/di/lightweight-injection-tokens',
            contentPath: 'guide/di/lightweight-injection-tokens',
          },
          {
            label: 'DIの実践',
            path: 'guide/di/di-in-action',
            contentPath: 'guide/di/di-in-action',
          },
          {
            label: 'Debugging and troubleshooting DI',
            path: 'guide/di/debugging-and-troubleshooting-di',
            contentPath: 'guide/di/debugging-and-troubleshooting-di',
            status: 'new',
          },
        ],
      },
      {
        label: 'ルーティング',
        status: 'updated',
        children: [
          {
            label: '概要',
            path: 'guide/routing',
            contentPath: 'guide/routing/overview',
          },
          {
            label: 'ルートを定義する',
            path: 'guide/routing/define-routes',
            contentPath: 'guide/routing/define-routes',
          },
          {
            label: 'ルートの読み込み戦略',
            path: 'guide/routing/loading-strategies',
            contentPath: 'guide/routing/loading-strategies',
          },
          {
            label: 'アウトレットにルートを表示する',
            path: 'guide/routing/show-routes-with-outlets',
            contentPath: 'guide/routing/show-routes-with-outlets',
          },
          {
            label: 'ルートへのナビゲーション',
            path: 'guide/routing/navigate-to-routes',
            contentPath: 'guide/routing/navigate-to-routes',
          },
          {
            label: 'ルートの状態を読み取る',
            path: 'guide/routing/read-route-state',
            contentPath: 'guide/routing/read-route-state',
          },
          {
            label: 'ルートのリダイレクト',
            path: 'guide/routing/redirecting-routes',
            contentPath: 'guide/routing/redirecting-routes',
          },
          {
            label: 'ガードによるルートアクセスの制御',
            path: 'guide/routing/route-guards',
            contentPath: 'guide/routing/route-guards',
          },
          {
            label: 'ルートデータリゾルバー',
            path: 'guide/routing/data-resolvers',
            contentPath: 'guide/routing/data-resolvers',
          },
          {
            label: 'ライフサイクルとイベント',
            path: 'guide/routing/lifecycle-and-events',
            contentPath: 'guide/routing/lifecycle-and-events',
          },
          {
            label: 'ルーティングとナビゲーションのテスト',
            path: 'guide/routing/testing',
            contentPath: 'guide/routing/testing',
            status: 'new',
          },
          {
            label: 'その他のルーティングタスク',
            path: 'guide/routing/common-router-tasks',
            contentPath: 'guide/routing/common-router-tasks',
          },
          {
            label: 'カスタムルートマッチの作成',
            path: 'guide/routing/routing-with-urlmatcher',
            contentPath: 'guide/routing/routing-with-urlmatcher',
          },
          {
            label: 'レンダリング戦略',
            path: 'guide/routing/rendering-strategies',
            contentPath: 'guide/routing/rendering-strategies',
            status: 'new',
          },
          {
            label: 'ルートの動作のカスタマイズ',
            path: 'guide/routing/customizing-route-behavior',
            contentPath: 'guide/routing/customizing-route-behavior',
            status: 'new',
          },
          {
            label: 'ルーターリファレンス',
            path: 'guide/routing/router-reference',
            contentPath: 'guide/routing/router-reference',
          },
          {
            label: 'ルート遷移アニメーション',
            path: 'guide/routing/route-transition-animations',
            contentPath: 'guide/routing/route-transition-animations',
          },
        ],
      },
      {
        label: 'フォーム',
        status: 'updated',
        preserveOtherCategoryOrder: true,
        children: [
          {
            label: '概要',
            path: 'guide/forms',
            contentPath: 'guide/forms/overview',
          },

          {
            label: '概要',
            path: 'guide/forms/signals/overview',
            contentPath: 'guide/forms/signals/overview',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'フォームモデル',
            path: 'guide/forms/signals/models',
            contentPath: 'guide/forms/signals/models',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'フォームモデルの設計',
            path: 'guide/forms/signals/model-design',
            contentPath: 'guide/forms/signals/designing-your-form-model',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'フィールド状態管理',
            path: 'guide/forms/signals/field-state-management',
            contentPath: 'guide/forms/signals/field-state-management',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'バリデーション',
            path: 'guide/forms/signals/validation',
            contentPath: 'guide/forms/signals/validation',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'フォームロジック',
            path: 'guide/forms/signals/form-logic',
            contentPath: 'guide/forms/signals/form-logic',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'フィールド間ロジック',
            path: 'guide/forms/signals/cross-field-logic',
            contentPath: 'guide/forms/signals/cross-field-logic',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'フォームの送信',
            path: 'guide/forms/signals/form-submission',
            contentPath: 'guide/forms/signals/form-submission',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'スキーマ',
            path: 'guide/forms/signals/schemas',
            contentPath: 'guide/forms/signals/schemas',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'フィールドメタデータ',
            path: 'guide/forms/signals/field-metadata',
            contentPath: 'guide/forms/signals/field-metadata',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '非同期処理',
            path: 'guide/forms/signals/async-operations',
            contentPath: 'guide/forms/signals/async-operations',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'カスタムコントロール',
            path: 'guide/forms/signals/custom-controls',
            contentPath: 'guide/forms/signals/custom-controls',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '他のフォームシステムとの比較',
            path: 'guide/forms/signals/comparison',
            contentPath: 'guide/forms/signals/comparison',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'Migrating from Reactive Forms',
            path: 'guide/forms/signals/migration',
            contentPath: 'guide/forms/signals/migration',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'リアクティブフォーム',
            path: 'guide/forms/reactive-forms',
            contentPath: 'guide/forms/reactive-forms',
            category: 'Reactive Forms',
          },
          {
            label: '厳密に型付けされたリアクティブフォーム',
            path: 'guide/forms/typed-forms',
            contentPath: 'guide/forms/typed-forms',
            category: 'Reactive Forms',
          },
          {
            label: 'テンプレート駆動型フォーム',
            path: 'guide/forms/template-driven-forms',
            contentPath: 'guide/forms/template-driven-forms',
            category: 'Template driven Forms',
          },
          {
            label: 'フォーム入力の検証',
            path: 'guide/forms/form-validation',
            contentPath: 'guide/forms/form-validation',
            category: 'Reactive Forms',
          },
          {
            label: 'フォーム入力の検証',
            path: 'guide/forms/form-validation',
            contentPath: 'guide/forms/form-validation',
            category: 'Template driven Forms',
          },
          {
            label: '動的フォームの構築',
            path: 'guide/forms/dynamic-forms',
            contentPath: 'guide/forms/dynamic-forms',
            category: 'Reactive Forms',
          },
        ],
      },
      {
        label: 'HTTPクライアント',
        children: [
          {
            label: '概要',
            path: 'guide/http',
            contentPath: 'guide/http/overview',
          },
          {
            label: 'HttpClientの設定',
            path: 'guide/http/setup',
            contentPath: 'guide/http/setup',
          },
          {
            label: 'リクエストの実行',
            path: 'guide/http/making-requests',
            contentPath: 'guide/http/making-requests',
          },
          {
            label: 'httpResourceを使ったリアクティブなデータ取得',
            path: 'guide/http/http-resource',
            contentPath: 'guide/http/http-resource',
          },
          {
            label: 'リクエストとレスポンスへの介入',
            path: 'guide/http/interceptors',
            contentPath: 'guide/http/interceptors',
          },
          {
            label: 'テスト',
            path: 'guide/http/testing',
            contentPath: 'guide/http/testing',
          },
        ],
      },
      {
        label: 'サーバーサイド・ハイブリッドレンダリング',
        children: [
          {
            label: '概要',
            path: 'guide/performance',
            contentPath: 'guide/performance/overview',
          },
          {
            label: 'サーバーサイド・ハイブリッドレンダリング',
            path: 'guide/ssr',
            contentPath: 'guide/ssr',
          },
          {
            label: 'ハイドレーション',
            path: 'guide/hydration',
            contentPath: 'guide/hydration',
          },
          {
            label: 'インクリメンタルハイドレーション',
            path: 'guide/incremental-hydration',
            contentPath: 'guide/incremental-hydration',
          },
        ],
      },
      {
        label: 'テスト',
        children: [
          {
            label: '概要',
            path: 'guide/testing',
            contentPath: 'guide/testing/overview',
          },
          {
            label: 'コンポーネントのテストの基本',
            path: 'guide/testing/components-basics',
            contentPath: 'guide/testing/components-basics',
          },
          {
            label: 'コンポーネントのテストシナリオ',
            path: 'guide/testing/components-scenarios',
            contentPath: 'guide/testing/components-scenarios',
          },
          {
            label: 'サービスのテスト',
            path: 'guide/testing/services',
            contentPath: 'guide/testing/services',
          },
          {
            label: '属性ディレクティブのテスト',
            path: 'guide/testing/attribute-directives',
            contentPath: 'guide/testing/attribute-directives',
          },
          {
            label: 'パイプのテスト',
            path: 'guide/testing/pipes',
            contentPath: 'guide/testing/pipes',
          },
          {
            label: 'ルーティングとナビゲーションのテスト',
            path: 'guide/routing/testing',
            contentPath: 'guide/routing/testing',
            status: 'new',
            isCrossReferenced: true,
          },
          {
            label: 'テストのデバッグ',
            path: 'guide/testing/debugging',
            contentPath: 'guide/testing/debugging',
          },
          {
            label: 'コードカバレッジ',
            path: 'guide/testing/code-coverage',
            contentPath: 'guide/testing/code-coverage',
          },
          {
            label: 'テストユーティリティAPI',
            path: 'guide/testing/utility-apis',
            contentPath: 'guide/testing/utility-apis',
          },
          {
            label: 'コンポーネントハーネスの概要',
            path: 'guide/testing/component-harnesses-overview',
            contentPath: 'guide/testing/component-harnesses-overview',
          },
          {
            label: 'テストでコンポーネントハーネスを使う',
            path: 'guide/testing/using-component-harnesses',
            contentPath: 'guide/testing/using-component-harnesses',
          },
          {
            label: 'コンポーネントハーネスを作成する',
            path: 'guide/testing/creating-component-harnesses',
            contentPath: 'guide/testing/creating-component-harnesses',
          },
          {
            label: 'テスト環境にハーネスサポートを追加する',
            path: 'guide/testing/component-harnesses-testing-environments',
            contentPath: 'guide/testing/component-harnesses-testing-environments',
          },
          {
            label: 'KarmaからVitestへの移行',
            path: 'guide/testing/migrating-to-vitest',
            contentPath: 'guide/testing/migrating-to-vitest',
          },
          {
            label: 'KarmaとJasmineによるテスト',
            path: 'guide/testing/karma',
            contentPath: 'guide/testing/karma',
          },
          {
            label: 'Zone.jsテストユーティリティ',
            path: 'guide/testing/zone-js-testing-utilities',
            contentPath: 'guide/testing/zone-js-testing-utilities',
          },
        ],
      },
      {
        label: 'Angular Aria',
        status: 'new',
        children: [
          {
            label: '概要',
            path: 'guide/aria/overview',
            contentPath: 'guide/aria/overview',
          },
          {
            label: 'アコーディオン',
            path: 'guide/aria/accordion',
            contentPath: 'guide/aria/accordion',
          },
          {
            label: 'オートコンプリート',
            path: 'guide/aria/autocomplete',
            contentPath: 'guide/aria/autocomplete',
          },
          {
            label: 'コンボボックス',
            path: 'guide/aria/combobox',
            contentPath: 'guide/aria/combobox',
          },
          {
            label: 'グリッド',
            path: 'guide/aria/grid',
            contentPath: 'guide/aria/grid',
          },
          {
            label: 'リストボックス',
            path: 'guide/aria/listbox',
            contentPath: 'guide/aria/listbox',
          },
          {
            label: 'メニュー',
            path: 'guide/aria/menu',
            contentPath: 'guide/aria/menu',
          },
          {
            label: 'メニューバー',
            path: 'guide/aria/menubar',
            contentPath: 'guide/aria/menubar',
          },
          {
            label: 'マルチセレクト',
            path: 'guide/aria/multiselect',
            contentPath: 'guide/aria/multiselect',
          },
          {
            label: 'セレクト',
            path: 'guide/aria/select',
            contentPath: 'guide/aria/select',
          },
          {
            label: 'タブ',
            path: 'guide/aria/tabs',
            contentPath: 'guide/aria/tabs',
          },
          {
            label: 'ツールバー',
            path: 'guide/aria/toolbar',
            contentPath: 'guide/aria/toolbar',
          },
          {
            label: 'ツリー',
            path: 'guide/aria/tree',
            contentPath: 'guide/aria/tree',
          },
        ],
      },
      {
        label: '国際化',
        children: [
          {
            label: '概要',
            path: 'guide/i18n',
            contentPath: 'guide/i18n/overview',
          },
          {
            label: 'localizeパッケージの追加',
            path: 'guide/i18n/add-package',
            contentPath: 'guide/i18n/add-package',
          },
          {
            label: 'IDによるロケールの参照',
            path: 'guide/i18n/locale-id',
            contentPath: 'guide/i18n/locale-id',
          },
          {
            label: 'ロケールに基づいたデータのフォーマット',
            path: 'guide/i18n/format-data-locale',
            contentPath: 'guide/i18n/format-data-locale',
          },
          {
            label: '翻訳のためのコンポーネントの準備',
            path: 'guide/i18n/prepare',
            contentPath: 'guide/i18n/prepare',
          },
          {
            label: '翻訳ファイルの操作',
            path: 'guide/i18n/translation-files',
            contentPath: 'guide/i18n/translation-files',
          },
          {
            label: 'アプリへの翻訳の統合',
            path: 'guide/i18n/merge',
            contentPath: 'guide/i18n/merge',
          },
          {
            label: '複数のロケールのデプロイ',
            path: 'guide/i18n/deploy',
            contentPath: 'guide/i18n/deploy',
          },
          {
            label: 'ロケールデータのグローバルバリアントのインポート',
            path: 'guide/i18n/import-global-variants',
            contentPath: 'guide/i18n/import-global-variants',
          },
          {
            label: 'カスタムIDによるマークされたテキストの管理',
            path: 'guide/i18n/manage-marked-text',
            contentPath: 'guide/i18n/manage-marked-text',
          },
          {
            label: 'Angularアプリケーションの例',
            path: 'guide/i18n/example',
            contentPath: 'guide/i18n/example',
          },
        ],
      },
      {
        label: 'アニメーション',
        status: 'updated',
        children: [
          {
            label: 'Enter and Leave アニメーション',
            path: 'guide/animations',
            contentPath: 'guide/animations/enter-and-leave',
            status: 'new',
          },
          {
            label: '複雑なCSSアニメーション',
            path: 'guide/animations/css',
            contentPath: 'guide/animations/css',
          },
          {
            label: 'ルート遷移アニメーション',
            path: 'guide/routing/route-transition-animations',
            contentPath: 'guide/routing/route-transition-animations',
            isCrossReferenced: true,
          },
        ],
      },
      {
        label: 'Drag and drop',
        path: 'guide/drag-drop',
        contentPath: 'guide/drag-drop',
      },
    ],
  },
  {
    label: 'Build with AI',
    children: [
      {
        label: 'はじめよう',
        path: 'ai',
        contentPath: 'ai/overview',
      },
      {
        label: 'LLMプロンプトとAI IDEセットアップ',
        path: 'ai/develop-with-ai',
        contentPath: 'ai/develop-with-ai',
      },
      {
        label: 'エージェントスキル',
        path: 'ai/agent-skills',
        contentPath: 'ai/agent-skills',
        status: 'new',
      },
      {
        label: 'Angular CLI MCPサーバーセットアップ',
        path: 'ai/mcp',
        contentPath: 'ai/mcp-server-setup',
      },
      {
        label: 'Angular AI Tutor',
        path: 'ai/ai-tutor',
        contentPath: 'ai/ai-tutor',
      },
      {
        label: '設計パターン',
        path: 'ai/design-patterns',
        contentPath: 'ai/design-patterns',
      },
      {
        label: 'WebMCP',
        path: 'ai/webmcp',
        contentPath: 'ai/webmcp',
        status: 'new',
      },
    ],
  },
  {
    label: '開発者ツール',
    children: [
      {
        label: 'Angular CLI',
        children: [
          {
            label: '概要',
            path: 'tools/cli',
            contentPath: 'tools/cli/overview',
          },
          {
            label: 'ローカル設定',
            path: 'tools/cli/setup-local',
            contentPath: 'tools/cli/setup-local',
          },
          {
            label: 'Angularアプリのビルド',
            path: 'tools/cli/build',
            contentPath: 'tools/cli/build',
          },
          {
            label: '開発用ローカルサーバー',
            path: 'tools/cli/serve',
            contentPath: 'tools/cli/serve',
          },
          {
            label: 'デプロイメント',
            path: 'tools/cli/deployment',
            contentPath: 'tools/cli/deployment',
          },
          {
            label: 'エンドツーエンドテスト',
            path: 'tools/cli/end-to-end',
            contentPath: 'tools/cli/end-to-end',
          },
          {
            label: '新しいビルドシステムへの移行',
            path: 'tools/cli/build-system-migration',
            contentPath: 'tools/cli/build-system-migration',
          },
          {
            label: 'ビルド環境',
            path: 'tools/cli/environments',
            contentPath: 'tools/cli/environments',
          },
          {
            label: 'Angular CLIビルダー',
            path: 'tools/cli/cli-builder',
            contentPath: 'tools/cli/cli-builder',
          },
          {
            label: 'Schematicsによるコードの生成',
            path: 'tools/cli/schematics',
            contentPath: 'tools/cli/schematics',
          },
          {
            label: 'Schematicsの作成',
            path: 'tools/cli/schematics-authoring',
            contentPath: 'tools/cli/schematics-authoring',
          },
          {
            label: 'ライブラリのSchematics',
            path: 'tools/cli/schematics-for-libraries',
            contentPath: 'tools/cli/schematics-for-libraries',
          },
          {
            label: 'テンプレート型チェック',
            path: 'tools/cli/template-typecheck',
            contentPath: 'tools/cli/template-typecheck',
          },
          {
            label: '事前コンパイル (AOT) コンパイル',
            path: 'tools/cli/aot-compiler',
            contentPath: 'tools/cli/aot-compiler',
          },
          {
            label: 'AOTメタデータエラー',
            path: 'tools/cli/aot-metadata-errors',
            contentPath: 'tools/cli/aot-metadata-errors',
          },
        ],
      },
      {
        label: 'ライブラリ',
        children: [
          {
            label: '概要',
            path: 'tools/libraries',
            contentPath: 'tools/libraries/overview',
          },
          {
            label: 'ライブラリの作成',
            path: 'tools/libraries/creating-libraries',
            contentPath: 'tools/libraries/creating-libraries',
          },
          {
            label: 'ライブラリの使用',
            path: 'tools/libraries/using-libraries',
            contentPath: 'tools/libraries/using-libraries',
          },
          {
            label: 'Angularパッケージフォーマット',
            path: 'tools/libraries/angular-package-format',
            contentPath: 'tools/libraries/angular-package-format',
          },
        ],
      },
      {
        label: 'DevTools',
        children: [
          {
            label: '概要',
            path: 'tools/devtools',
            contentPath: 'tools/devtools/overview',
          },
          {
            label: 'コンポーネント',
            path: 'tools/devtools/component',
            contentPath: 'tools/devtools/component',
          },
          {
            label: 'プロファイラー',
            path: 'tools/devtools/profiler',
            contentPath: 'tools/devtools/profiler',
          },
          {
            label: 'インジェクター',
            path: 'tools/devtools/injectors',
            contentPath: 'tools/devtools/injectors',
          },
          // TODO: create those guides
          // The signal debugging docs should also be added to the signal section
          //   label: 'Signals',
          //   path: 'tools/devtools/signals',
          //   contentPath: 'tools/devtools/signals',
          // },
          {
            label: 'ルーターツリー',
            path: 'tools/devtools/router',
            contentPath: 'tools/devtools/router',
          },
        ],
      },
      {
        label: '言語サービス',
        path: 'tools/language-service',
        contentPath: 'tools/language-service',
      },
    ],
  },
  {
    label: 'ベストプラクティス',
    children: [
      {
        label: 'スタイルガイド',
        path: 'style-guide',
        contentPath: 'best-practices/style-guide',
        status: 'updated',
      },
      {
        label: 'セキュリティ',
        path: 'best-practices/security',
        contentPath: 'guide/security', // Have not refactored due to build issues
      },
      {
        label: 'アクセシビリティ',
        path: 'best-practices/a11y',
        contentPath: 'best-practices/a11y',
      },
      {
        label: 'Angularにおける未処理エラー',
        path: 'best-practices/error-handling',
        contentPath: 'best-practices/error-handling',
      },
      {
        label: 'パフォーマンス',
        preserveOtherCategoryOrder: true,
        children: [
          {
            label: '概要',
            path: 'best-practices/performance',
            contentPath: 'best-practices/performance/overview',
          },

          // Loading Performance
          {
            label: '遅延読み込みルート',
            path: 'best-practices/performance/lazy-loaded-routes',
            contentPath: 'guide/routing/loading-strategies',
            category: 'Loading Performance',
          },
          {
            label: '@deferによる遅延読み込み',
            path: 'best-practices/performance/defer',
            contentPath: 'guide/templates/defer',
            category: 'Loading Performance',
          },
          {
            label: 'サービスの遅延読み込み',
            path: 'best-practices/performance/lazy-loading-services',
            contentPath: 'guide/di/lazy-loading-services',
            category: 'Loading Performance',
          },
          {
            label: '画像の最適化',
            path: 'best-practices/performance/image-optimization',
            contentPath: 'guide/image-optimization',
            category: 'Loading Performance',
          },
          {
            label: 'サーバーサイドレンダリング',
            path: 'best-practices/performance/ssr',
            contentPath: 'guide/ssr',
            category: 'Loading Performance',
          },

          // Runtime Performance
          {
            label: '概要',
            path: 'best-practices/runtime-performance',
            contentPath: 'best-practices/runtime-performance/overview',
            category: 'Runtime Performance',
          },
          {
            label: 'Zoneless',
            path: 'guide/zoneless',
            contentPath: 'guide/zoneless',
            category: 'Runtime Performance',
          },
          {
            label: '遅い計算',
            path: 'best-practices/slow-computations',
            contentPath: 'best-practices/runtime-performance/slow-computations',
            category: 'Runtime Performance',
          },
          {
            label: 'コンポーネントサブツリーのスキップ',
            path: 'best-practices/skipping-subtrees',
            contentPath: 'best-practices/runtime-performance/skipping-subtrees',
            category: 'Runtime Performance',
          },
          {
            label: 'ゾーンの汚染',
            path: 'best-practices/zone-pollution',
            contentPath: 'best-practices/runtime-performance/zone-pollution',
            category: 'Runtime Performance',
          },

          {
            label: 'Chrome DevToolsでのプロファイリング',
            path: 'best-practices/profiling-with-chrome-devtools',
            contentPath: 'best-practices/runtime-performance/profiling-with-chrome-devtools',
            category: 'Runtime Performance',
          },
        ],
      },
      {
        label: 'アップデートに追従する',
        path: 'update',
        contentPath: 'best-practices/update',
      },
    ],
  },
  {
    label: '開発者向けイベント',
    children: [
      {
        label: 'Angular v22 Release',
        path: 'events/v22',
        contentPath: 'events/v22',
        status: 'new',
      },
      {
        label: 'Angular v21 Release',
        path: 'events/v21',
        contentPath: 'events/v21',
      },
    ],
  },
  {
    label: '拡張エコシステム',
    children: [
      {
        label: 'NgModule',
        path: 'guide/ngmodules/overview',
        contentPath: 'guide/ngmodules/overview',
      },
      {
        label: 'レガシーアニメーション',
        children: [
          {
            label: '概要',
            path: 'guide/legacy-animations',
            contentPath: 'guide/animations/overview',
          },
          {
            label: 'トランジションとトリガー',
            path: 'guide/legacy-animations/transition-and-triggers',
            contentPath: 'guide/animations/transition-and-triggers',
          },
          {
            label: '複雑なシーケンス',
            path: 'guide/legacy-animations/complex-sequences',
            contentPath: 'guide/animations/complex-sequences',
          },
          {
            label: '再利用可能なアニメーション',
            path: 'guide/legacy-animations/reusable-animations',
            contentPath: 'guide/animations/reusable-animations',
          },
          {
            label: 'ネイティブCSSアニメーションへの移行',
            path: 'guide/animations/migration',
            contentPath: 'guide/animations/migration',
          },
        ],
      },
      {
        label: 'RxJSとの併用',
        children: [
          {
            label: 'Signalとの相互運用',
            path: 'ecosystem/rxjs-interop',
            contentPath: 'ecosystem/rxjs-interop/signals-interop',
          },
          {
            label: 'コンポーネント出力との相互接続',
            path: 'ecosystem/rxjs-interop/output-interop',
            contentPath: 'ecosystem/rxjs-interop/output-interop',
          },
          {
            label: 'takeUntilDestroyedでの購読解除',
            path: 'ecosystem/rxjs-interop/take-until-destroyed',
            contentPath: 'ecosystem/rxjs-interop/take-until-destroyed',
          },
        ],
      },
      {
        label: 'Service WorkerとPWA',
        children: [
          {
            label: '概要',
            path: 'ecosystem/service-workers',
            contentPath: 'ecosystem/service-workers/overview',
          },
          {
            label: 'はじめに',
            path: 'ecosystem/service-workers/getting-started',
            contentPath: 'ecosystem/service-workers/getting-started',
          },
          {
            label: '独自のService Workerスクリプト',
            path: 'ecosystem/service-workers/custom-service-worker-scripts',
            contentPath: 'ecosystem/service-workers/custom-service-worker-scripts',
          },
          {
            label: '設定ファイル',
            path: 'ecosystem/service-workers/config',
            contentPath: 'ecosystem/service-workers/config',
          },
          {
            label: 'Service Workerとの通信',
            path: 'ecosystem/service-workers/communications',
            contentPath: 'ecosystem/service-workers/communications',
          },
          {
            label: 'プッシュ通知',
            path: 'ecosystem/service-workers/push-notifications',
            contentPath: 'ecosystem/service-workers/push-notifications',
          },
          {
            label: 'Service WorkerのDevOps',
            path: 'ecosystem/service-workers/devops',
            contentPath: 'ecosystem/service-workers/devops',
          },
          {
            label: 'App Shellパターン',
            path: 'ecosystem/service-workers/app-shell',
            contentPath: 'ecosystem/service-workers/app-shell',
          },
        ],
      },
      {
        label: 'Web Worker',
        path: 'ecosystem/web-workers',
        contentPath: 'ecosystem/web-workers',
      },
      {
        label: 'カスタムビルドパイプライン',
        path: 'ecosystem/custom-build-pipeline',
        contentPath: 'ecosystem/custom-build-pipeline',
      },
      {
        label: 'Tailwind',
        path: 'guide/tailwind',
        contentPath: 'guide/tailwind',
        status: 'new',
      },
      {
        label: 'Angular Fire',
        path: 'https://github.com/angular/angularfire#readme',
      },
      {
        label: 'Google Maps',
        path: 'https://github.com/angular/components/tree/main/src/google-maps#readme',
      },
      {
        label: 'Google Pay',
        path: 'https://github.com/google-pay/google-pay-button#angular',
      },
      {
        label: 'YouTubeプレーヤー',
        path: 'https://github.com/angular/components/blob/main/src/youtube-player/README.md',
      },
      {
        label: 'Angular CDK',
        path: 'https://material.angular.dev/cdk/categories',
      },
      {
        label: 'Angular Material',
        path: 'https://material.angular.dev/',
      },
    ],
  },
  ...(isDevMode()
    ? [
        {
          label: 'Adev Dev Guide',
          children: [
            {
              label: 'Kitchen Sink',
              path: 'kitchen-sink',
              contentPath: 'kitchen-sink',
            },
          ],
        },
      ]
    : []),
];

export const TUTORIALS_SUB_NAVIGATION_DATA: NavigationItem[] = [
  FIRST_APP_TUTORIAL_NAV_DATA,
  LEARN_ANGULAR_TUTORIAL_NAV_DATA,
  DEFERRABLE_VIEWS_TUTORIAL_NAV_DATA,
  SIGNALS_TUTORIAL_NAV_DATA,
  SIGNAL_FORMS_TUTORIAL_NAV_DATA,
  {
    path: 'tutorials',
    contentPath: 'tutorials/home',
    label: 'チュートリアル',
  },
];

export const REFERENCE_SUB_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'ロードマップ',
    path: 'roadmap',
    contentPath: 'reference/roadmap',
  },
  {
    label: '開発に参加する',
    path: 'https://github.com/angular/angular/blob/main/CONTRIBUTING.md',
  },
  {
    label: 'APIリファレンス',
    preserveOtherCategoryOrder: true,
    children: [
      {
        label: '概要',
        path: 'api',
      },
      ...getApiNavigationItems(),
    ],
  },
  {
    label: 'CLIリファレンス',
    children: [
      {
        label: '概要',
        path: 'cli',
        contentPath: 'reference/cli',
      },
      {
        label: 'ng add',
        path: 'cli/add',
      },
      {
        label: 'ng analytics',
        children: [
          {
            label: '概要',
            path: 'cli/analytics',
          },
          {
            label: 'disable',
            path: 'cli/analytics/disable',
          },
          {
            label: 'enable',
            path: 'cli/analytics/enable',
          },
          {
            label: 'info',
            path: 'cli/analytics/info',
          },
          {
            label: 'prompt',
            path: 'cli/analytics/prompt',
          },
        ],
      },
      {
        label: 'ng build',
        path: 'cli/build',
      },
      {
        label: 'ng cache',
        children: [
          {
            label: '概要',
            path: 'cli/cache',
          },
          {
            label: 'clean',
            path: 'cli/cache/clean',
          },
          {
            label: 'disable',
            path: 'cli/cache/disable',
          },
          {
            label: 'enable',
            path: 'cli/cache/enable',
          },
          {
            label: 'info',
            path: 'cli/cache/info',
          },
        ],
      },
      {
        label: 'ng completion',
        children: [
          {
            label: '概要',
            path: 'cli/completion',
          },
          {
            label: 'script',
            path: 'cli/completion/script',
          },
        ],
      },
      {
        label: 'ng config',
        path: 'cli/config',
      },
      {
        label: 'ng deploy',
        path: 'cli/deploy',
      },
      {
        label: 'ng e2e',
        path: 'cli/e2e',
      },
      {
        label: 'ng extract-i18n',
        path: 'cli/extract-i18n',
      },
      {
        label: 'ng generate',
        children: [
          {
            label: '概要',
            path: 'cli/generate',
          },
          {
            label: 'ai-config',
            path: 'cli/generate/ai-config',
          },
          {
            label: 'app-shell',
            path: 'cli/generate/app-shell',
          },
          {
            label: 'application',
            path: 'cli/generate/application',
          },
          {
            label: 'class',
            path: 'cli/generate/class',
          },
          {
            label: 'component',
            path: 'cli/generate/component',
          },
          {
            label: 'config',
            path: 'cli/generate/config',
          },
          {
            label: 'directive',
            path: 'cli/generate/directive',
          },
          {
            label: 'enum',
            path: 'cli/generate/enum',
          },
          {
            label: 'environments',
            path: 'cli/generate/environments',
          },
          {
            label: 'guard',
            path: 'cli/generate/guard',
          },
          {
            label: 'interceptor',
            path: 'cli/generate/interceptor',
          },
          {
            label: 'interface',
            path: 'cli/generate/interface',
          },
          {
            label: 'library',
            path: 'cli/generate/library',
          },
          {
            label: 'module',
            path: 'cli/generate/module',
          },
          {
            label: 'pipe',
            path: 'cli/generate/pipe',
          },
          {
            label: 'resolver',
            path: 'cli/generate/resolver',
          },
          {
            label: 'service-worker',
            path: 'cli/generate/service-worker',
          },
          {
            label: 'service',
            path: 'cli/generate/service',
          },
          {
            label: 'web-worker',
            path: 'cli/generate/web-worker',
          },
        ],
      },
      {
        label: 'ng lint',
        path: 'cli/lint',
      },
      {
        label: 'ng new',
        path: 'cli/new',
      },
      {
        label: 'ng run',
        path: 'cli/run',
      },
      {
        label: 'ng serve',
        path: 'cli/serve',
      },
      {
        label: 'ng test',
        path: 'cli/test',
      },
      {
        label: 'ng update',
        path: 'cli/update',
      },
      {
        label: 'ng version',
        path: 'cli/version',
      },
    ],
  },
  {
    label: 'エラー百科辞典',
    children: [
      {
        label: '概要',
        path: 'errors',
        contentPath: 'reference/errors/overview',
      },
      ...ERRORS_NAV_DATA,
    ],
  },
  {
    label: '拡張診断',
    children: [
      {
        label: '概要',
        path: 'extended-diagnostics',
        contentPath: 'reference/extended-diagnostics/overview',
      },
      ...EXT_DIAGNOSTICS_NAV_DATA,
    ],
  },
  {
    label: 'バージョニングとリリース',
    path: 'reference/releases',
    contentPath: 'reference/releases',
  },
  {
    label: 'バージョン互換性',
    path: 'reference/versions',
    contentPath: 'reference/versions',
  },
  {
    label: 'アップデートガイド',
    path: 'update-guide',
  },
  {
    label: '設定',
    children: [
      {
        label: 'ファイル構造',
        path: 'reference/configs/file-structure',
        contentPath: 'reference/configs/file-structure',
      },
      {
        label: 'ワークスペース設定',
        path: 'reference/configs/workspace-config',
        contentPath: 'reference/configs/workspace-config',
      },
      {
        label: 'Angularコンパイラオプション',
        path: 'reference/configs/angular-compiler-options',
        contentPath: 'reference/configs/angular-compiler-options',
      },
      {
        label: 'npmの依存関係',
        path: 'reference/configs/npm-packages',
        contentPath: 'reference/configs/npm-packages',
      },
    ],
  },
  {
    label: 'マイグレーション',
    children: [
      {
        label: '概要',
        path: 'reference/migrations',
        contentPath: 'reference/migrations/overview',
      },
      {
        label: 'スタンドアロン',
        path: 'reference/migrations/standalone',
        contentPath: 'reference/migrations/standalone',
      },
      {
        label: '制御フロー構文',
        path: 'reference/migrations/control-flow',
        contentPath: 'reference/migrations/control-flow',
      },
      {
        label: 'inject() 関数',
        path: 'reference/migrations/inject-function',
        contentPath: 'reference/migrations/inject-function',
      },
      {
        label: '遅延読み込みルート',
        path: 'reference/migrations/route-lazy-loading',
        contentPath: 'reference/migrations/route-lazy-loading',
      },
      {
        label: 'Signal入力',
        path: 'reference/migrations/signal-inputs',
        contentPath: 'reference/migrations/signal-inputs',
      },
      {
        label: '出力',
        path: 'reference/migrations/outputs',
        contentPath: 'reference/migrations/outputs',
      },
      {
        label: 'Signalクエリ',
        path: 'reference/migrations/signal-queries',
        contentPath: 'reference/migrations/signal-queries',
      },
      {
        label: '未使用のインポートのクリーンアップ',
        path: 'reference/migrations/cleanup-unused-imports',
        contentPath: 'reference/migrations/cleanup-unused-imports',
      },
      {
        label: '自己閉鎖タグ',
        path: 'reference/migrations/self-closing-tags',
        contentPath: 'reference/migrations/self-closing-tags',
      },
      {
        label: 'NgClassからClassへ',
        path: 'reference/migrations/ngclass-to-class',
        contentPath: 'reference/migrations/ngclass-to-class',
        status: 'new',
      },
      {
        label: 'NgStyleからStyleへ',
        path: 'reference/migrations/ngstyle-to-style',
        contentPath: 'reference/migrations/ngstyle-to-style',
        status: 'new',
      },
      {
        label: 'Routerテストモジュールのマイグレーション',
        path: 'reference/migrations/router-testing-module-migration',
        contentPath: 'reference/migrations/router-testing-module-migration',
        status: 'new',
      },
      {
        label: 'CommonModuleからスタンドアロンへ',
        path: 'reference/migrations/common-to-standalone',
        contentPath: 'reference/migrations/common-to-standalone',
        status: 'new',
      },
    ],
  },
];

export const FOOTER_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'プレスキット',
    path: 'press-kit',
    contentPath: 'reference/press-kit',
  },
  {
    label: 'ライセンス',
    path: 'license',
    contentPath: 'reference/license',
  },
];

export const ALL_ITEMS = [
  ...DOCS_SUB_NAVIGATION_DATA,
  ...REFERENCE_SUB_NAVIGATION_DATA,
  ...FOOTER_NAVIGATION_DATA,
  ...TUTORIALS_SUB_NAVIGATION_DATA,
];

function getApiNavigationItems(): NavigationItem[] {
  const manifest = API_MANIFEST_JSON as any; // TODO(mri): Use proper type when the refactoring of #66252 gets in.

  const apiNavigationItems: NavigationItem[] = [];

  for (const packageEntry of manifest) {
    const packageNavigationItem: NavigationItem = {
      label: packageEntry.moduleLabel,
      children: packageEntry.entries.map((api: any) => ({
        path: getApiUrl(packageEntry, api.name),
        label: api.name,
        category: api.category,
      })),
    };

    apiNavigationItems.push(packageNavigationItem);
  }

  return apiNavigationItems;
}

function getApiUrl(packageEntry: any, apiName: string): string {
  const packageName = packageEntry.normalizedModuleName
    // packages like `angular_core` should be `core`
    // packages like `angular_animation_browser` should be `animation/browser`
    .replace('angular_', '')
    .replaceAll('_', '/');
  return `api/${packageName}/${apiName}`;
}
