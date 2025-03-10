/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {NavigationItem} from '@angular/docs';

// These 2 imports are expected to be red because they are generated a build time
import FIRST_APP_TUTORIAL_NAV_DATA from '../../src/assets/tutorials/first-app/routes.json';
import LEARN_ANGULAR_TUTORIAL_NAV_DATA from '../../src/assets/tutorials/learn-angular/routes.json';
import DEFERRABLE_VIEWS_TUTORIAL_NAV_DATA from '../../src/assets/tutorials/deferrable-views/routes.json';
import ERRORS_NAV_DATA from '../../src/assets/content/reference/errors/routes.json';
import EXT_DIAGNOSTICS_NAV_DATA from '../../src/assets/content/reference/extended-diagnostics/routes.json';

import {DefaultPage} from './core/enums/pages';
import {getApiNavigationItems} from './features/references/helpers/manifest.helper';

interface SubNavigationData {
  docs: NavigationItem[];
  reference: NavigationItem[];
  tutorials: NavigationItem[];
  footer: NavigationItem[];
}

const DOCS_SUB_NAVIGATION_DATA: NavigationItem[] = [
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
        children: [
          {
            label: '概要',
            path: 'guide/di',
            contentPath: 'guide/di/overview',
          },
          {
            label: '依存性の注入を理解する',
            path: 'guide/di/dependency-injection',
            contentPath: 'guide/di/dependency-injection',
          },
          {
            label: '注入可能なサービスの作成',
            path: 'guide/di/creating-injectable-service',
            contentPath: 'guide/di/creating-injectable-service',
          },
          {
            label: '依存性プロバイダーの定義',
            path: 'guide/di/dependency-injection-providers',
            contentPath: 'guide/di/dependency-injection-providers',
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
        ],
      },
      {
        label: 'ルーティング',
        children: [
          {
            label: '概要',
            path: 'guide/routing',
            contentPath: 'guide/routing/overview',
          },
          {
            label: '一般的なルーティングタスク',
            path: 'guide/routing/common-router-tasks',
            contentPath: 'guide/routing/common-router-tasks',
          },
          {
            label: 'シングルページアプリケーションでのルーティング',
            path: 'guide/routing/router-tutorial',
            contentPath: 'guide/routing/router-tutorial',
          },
          {
            label: 'カスタムルートマッチの作成',
            path: 'guide/routing/routing-with-urlmatcher',
            contentPath: 'guide/routing/routing-with-urlmatcher',
          },
          {
            label: 'ルーターリファレンス',
            path: 'guide/routing/router-reference',
            contentPath: 'guide/routing/router-reference',
          },
        ],
      },
      {
        label: 'フォーム',
        children: [
          {
            label: '概要',
            path: 'guide/forms',
            contentPath: 'guide/forms/overview',
          },
          {
            label: 'リアクティブフォーム',
            path: 'guide/forms/reactive-forms',
            contentPath: 'guide/forms/reactive-forms',
          },
          {
            label: '厳密に型付けされたリアクティブフォーム',
            path: 'guide/forms/typed-forms',
            contentPath: 'guide/forms/typed-forms',
          },
          {
            label: 'テンプレート駆動型フォーム',
            path: 'guide/forms/template-driven-forms',
            contentPath: 'guide/forms/template-driven-forms',
          },
          {
            label: 'フォーム入力の検証',
            path: 'guide/forms/form-validation',
            contentPath: 'guide/forms/form-validation',
          },
          {
            label: '動的フォームの構築',
            path: 'guide/forms/dynamic-forms',
            contentPath: 'guide/forms/dynamic-forms',
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
            label: 'サーバーサイドレンダリング',
            path: 'guide/ssr',
            contentPath: 'guide/ssr',
          },
          {
            label: 'ビルド時のプリレンダリング',
            path: 'guide/prerendering',
            contentPath: 'guide/prerendering',
          },
          {
            label: 'サーバールーティングによるハイブリッドレンダリング',
            path: 'guide/hybrid-rendering',
            contentPath: 'guide/hybrid-rendering',
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
            label: 'コードカバレッジ',
            path: 'guide/testing/code-coverage',
            contentPath: 'guide/testing/code-coverage',
          },
          {
            label: 'サービスのテスト',
            path: 'guide/testing/services',
            contentPath: 'guide/testing/services',
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
            label: 'テストのデバッグ',
            path: 'guide/testing/debugging',
            contentPath: 'guide/testing/debugging',
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
        label: '実験的機能',
        children: [
          {label: 'Zoneless', path: 'guide/experimental/zoneless', contentPath: 'guide/zoneless'},
        ],
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
        path: 'tools/devtools',
        contentPath: 'tools/devtools',
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
        label: 'パフォーマンス',
        children: [
          {
            label: '概要',
            path: 'best-practices/runtime-performance',
            contentPath: 'best-practices/runtime-performance/overview',
          },
          {
            label: 'ゾーンの汚染',
            path: 'best-practices/zone-pollution',
            contentPath: 'best-practices/runtime-performance/zone-pollution',
          },
          {
            label: '遅い計算',
            path: 'best-practices/slow-computations',
            contentPath: 'best-practices/runtime-performance/slow-computations',
          },
          {
            label: 'コンポーネントサブツリーのスキップ',
            path: 'best-practices/skipping-subtrees',
            contentPath: 'best-practices/runtime-performance/skipping-subtrees',
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
    label: '拡張エコシステム',
    children: [
      {
        label: 'NgModule',
        path: 'guide/ngmodules/overview',
        contentPath: 'guide/ngmodules/overview',
      },
      {
        label: 'アニメーション',
        children: [
          {
            label: '概要',
            path: 'guide/animations',
            contentPath: 'guide/animations/overview',
          },
          {
            label: 'トランジションとトリガー',
            path: 'guide/animations/transition-and-triggers',
            contentPath: 'guide/animations/transition-and-triggers',
          },
          {
            label: '複雑なシーケンス',
            path: 'guide/animations/complex-sequences',
            contentPath: 'guide/animations/complex-sequences',
          },
          {
            label: '再利用可能なアニメーション',
            path: 'guide/animations/reusable-animations',
            contentPath: 'guide/animations/reusable-animations',
          },
          {
            label: 'ルート遷移アニメーション',
            path: 'guide/animations/route-animations',
            contentPath: 'guide/animations/route-animations',
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
        path: 'https://material.angular.io/cdk/categories',
      },
      {
        label: 'Angular Material',
        path: 'https://material.angular.io/',
      },
    ],
  },
];

export const TUTORIALS_SUB_NAVIGATION_DATA: NavigationItem[] = [
  FIRST_APP_TUTORIAL_NAV_DATA,
  LEARN_ANGULAR_TUTORIAL_NAV_DATA,
  DEFERRABLE_VIEWS_TUTORIAL_NAV_DATA,
  {
    path: DefaultPage.TUTORIALS,
    contentPath: 'tutorials/home',
    label: 'チュートリアル',
  },
];

const REFERENCE_SUB_NAVIGATION_DATA: NavigationItem[] = [
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
    label: 'コミュニティに参加する',
    path: 'https://community.angular.jp/',
  },
  {
    label: '日本語化プロジェクト',
    path: 'https://github.com/angular/angular-ja',
  },
  {
    label: 'APIリファレンス',
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
            label: 'clear',
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
    label: 'Extended Diagnostics',
    children: [
      {
        label: 'Overview',
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
        label: 'Lazy-loaded routes',
        path: 'reference/migrations/route-lazy-loading',
        contentPath: 'reference/migrations/route-lazy-loading',
      },
      {
        label: 'Signal inputs',
        path: 'reference/migrations/signal-inputs',
        contentPath: 'reference/migrations/signal-inputs',
      },
      {
        label: 'Outputs',
        path: 'reference/migrations/outputs',
        contentPath: 'reference/migrations/outputs',
      },
      {
        label: 'Signal queries',
        path: 'reference/migrations/signal-queries',
        contentPath: 'reference/migrations/signal-queries',
      },
      {
        label: 'Clean up unused imports',
        path: 'reference/migrations/cleanup-unused-imports',
        contentPath: 'reference/migrations/cleanup-unused-imports',
      },
      {
        label: 'Self-closing tags',
        path: 'reference/migrations/self-closing-tags',
        contentPath: 'reference/migrations/self-closing-tags',
      },
    ],
  },
];

const FOOTER_NAVIGATION_DATA: NavigationItem[] = [
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

// Docs navigation data structure, it's used to display structure in
// navigation-list component And build the routing table for content pages.
export const SUB_NAVIGATION_DATA: SubNavigationData = {
  docs: DOCS_SUB_NAVIGATION_DATA,
  reference: REFERENCE_SUB_NAVIGATION_DATA,
  tutorials: TUTORIALS_SUB_NAVIGATION_DATA,
  footer: FOOTER_NAVIGATION_DATA,
};
