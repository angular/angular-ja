# ユニットテスト

Angularアプリケーションをテストすると、期待どおりに動作していることを確認できます。ユニットテストは、バグを早期に発見し、コード品質を確保し、安全なリファクタリングを促進するために不可欠です。

NOTE: このガイドでは、Vitestを使用した新しいAngular CLIプロジェクトのデフォルトテスト設定について説明します。既存のプロジェクトをKarmaから移行する場合は、[KarmaからVitestへの移行ガイド](guide/testing/migrating-to-vitest)を参照してください。Karmaは引き続きサポートされています。詳細については、[Karmaテストガイド](guide/testing/karma)を参照してください。

## テストの設定 {#set-up-for-testing}

Angular CLIは、[Vitestテストフレームワーク](https://vitest.dev)を使用してAngularアプリケーションをテストするために必要なものをすべてダウンロードしてインストールします。新しいプロジェクトには、デフォルトで`vitest`と`jsdom`が含まれています。

Vitestは、Node.js環境でユニットテストを実行します。ブラウザのDOMをシミュレートするために、Vitestは`jsdom`というライブラリを使用します。これにより、ブラウザを起動するオーバーヘッドを回避して、テストの実行を高速化できます。`happy-dom`のような代替手段に`jsdom`を置き換えることもできます。`happy-dom`をインストールして`jsdom`をアンインストールすれば、置き換えられます。現在、`jsdom`と`happy-dom`がサポートされているDOMエミュレーションライブラリです。

CLIで作成したプロジェクトは、すぐにテストできます。[`ng test`](cli/test)コマンドを実行します:

```shell
ng test
```

`ng test`コマンドはアプリケーションを_監視モード_でビルドし、[Vitestテストランナー](https://vitest.dev)を起動します。

コンソールの出力は次のようになります:

```shell
 ✓ src/app/app.spec.ts (3)
   ✓ AppComponent should create the app
   ✓ AppComponent should have as title 'my-app'
   ✓ AppComponent should render title
 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  18:18:01
   Duration  2.46s (transform 615ms, setup 2ms, collect 2.21s, tests 5ms)
```

`ng test`コマンドは、ファイルの変更も監視します。ファイルを変更して保存すると、テストが再び実行されます。

## 設定 {#configuration}

Angular CLIは、Vitestの設定のほとんどを処理します。`angular.json`ファイルの`test`ターゲットオプションを変更することで、テストの動作をカスタマイズできます。

### Angular.jsonオプション {#angularjson-options}

- `include`: テストに含めるファイルのGlobパターン。デフォルトは`['**/*.spec.ts', '**/*.test.ts']`です。
- `exclude`: テストから除外するファイルのGlobパターン。
- `setupFiles`: テストの前に実行されるグローバルセットアップファイル（ポリフィルやグローバルモックなど）へのパスのリスト。
- `providersFile`: テスト環境用のAngularプロバイダーのデフォルト配列をエクスポートするファイルへのパス。これは、テストに注入されるグローバルテストプロバイダーをセットアップするのに役立ちます。
- `coverage`: コードカバレッジレポートを有効または無効にするブール値。デフォルトは`false`です。
- `browsers`: 実際のブラウザでテストを実行するブラウザ名の配列（例: `["chromium"]`）。ブラウザプロバイダーのインストールが必要です。詳細については、[ブラウザでのテストの実行](#running-tests-in-a-browser)セクションを参照してください。

### グローバルテスト設定とプロバイダー {#global-test-setup-and-providers}

`setupFiles`と`providersFile`オプションは、グローバルテスト設定を管理するのに特に役立ちます。

たとえば、`src/test-providers.ts`ファイルを作成して、すべてのテストに`provideHttpClientTesting`を提供できます:

```typescript {header: "src/test-providers.ts"}
import { Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const testProviders: Provider[] = [
  provideHttpClient(),
  provideHttpClientTesting(),
];

export default testProviders;
```

次に、このファイルを`angular.json`で参照します:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "providersFile": "src/test-providers.ts"
          }
        }
      }
    }
  }
}
```

HELPFUL: テスト設定やプロバイダー用に`src/test-providers.ts`のような新しいTypeScriptファイルを作成する場合は、プロジェクトのテスト用TypeScript設定ファイル（通常は`tsconfig.spec.json`）にそれらを含めるようにしてください。これにより、TypeScriptコンパイラがテスト中にこれらのファイルを適切に処理できるようになります。

### 高度なVitest設定 {#advanced-vitest-configuration}

高度なユースケースでは、`angular.json`の`configFile`オプションを使用してカスタムVitest設定ファイルを提供できます。

IMPORTANT: カスタム設定を使用すると高度なオプションが有効になりますが、Angularチームは設定ファイルの内容やサードパーティプラグインについてサポートを提供していません。また、CLIは適切な統合を保証するために特定のプロパティ（`test.projects`、`test.include`）を上書きします。

Vitest設定ファイル（例: `vitest-base.config.ts`）を作成し、`angular.json`で参照できます:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "runnerConfig": "vitest-base.config.ts"
          }
        }
      }
    }
  }
}
```

CLIを使用して基本設定ファイルを生成できます:

```shell
ng generate config vitest
```

これにより、カスタマイズ可能な`vitest-base.config.ts`ファイルが作成されます。

HELPFUL: Vitestの設定について詳しくは、[Vitestの公式ドキュメント](https://vitest.dev/config/)を参照してください。

## コードカバレッジ {#code-coverage}

`ng test`コマンドに`--coverage`フラグを追加することで、コードカバレッジレポートを生成できます。レポートは`coverage/`ディレクトリに生成されます。

詳細については、[コードカバレッジガイド](guide/testing/code-coverage)を参照してください。

## ブラウザでのテストの実行 {#running-tests-in-a-browser}

デフォルトのNode.js環境はほとんどのユニットテストで高速ですが、実際のブラウザでテストを実行できます。これは、ブラウザ固有のAPI（レンダリングなど）に依存するテストやデバッグに役立ちます。

ブラウザでテストを実行するには、最初にブラウザプロバイダーをインストールする必要があります。Vitestのブラウザモードの詳細については、[公式ドキュメント](https://vitest.dev/guide/browser)を参照してください。

プロバイダーがインストールされたら、`angular.json`で`browsers`オプションを設定するか、`--browsers` CLIフラグを使用して、ブラウザでテストを実行できます。テストは、デフォルトでヘッド付きブラウザで実行されます。`CI`環境変数が設定されている場合は、代わりにヘッドレスモードが使用されます。ヘッドレスモードを明示的に制御するには、ブラウザ名に`Headless`をサフィックスとして追加できます（例: `chromiumHeadless`）。

```bash
# Playwrightの例（ヘッド付き）
ng test --browsers=chromium

# Playwrightの例（ヘッドレス）
ng test --browsers=chromiumHeadless

# WebdriverIOの例（ヘッド付き）
ng test --browsers=chrome

# WebdriverIOの例（ヘッドレス）
ng test --browsers=chromeHeadless
```

ニーズに基づいて、次のブラウザプロバイダーのいずれかを選択してください:

### Playwright

[Playwright](https://playwright.dev/)は、Chromium、Firefox、WebKitをサポートするブラウザ自動化ライブラリです。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-playwright playwright
  </docs-code>
</docs-code-multifile>

### WebdriverIO

[WebdriverIO](https://webdriver.io/)は、Chrome、Firefox、Safari、Edgeをサポートするブラウザとモバイル自動化テストフレームワークです。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-webdriverio webdriverio
  </docs-code>
</docs-code-multifile>

### Preview

`@vitest/browser-preview`プロバイダーは、StackBlitzなどのWebcontainer環境向けに設計されており、CI/CDでの使用を目的としていません。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-preview
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-preview
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-preview
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-preview
  </docs-code>
</docs-code-multifile>

HELPFUL: より高度なブラウザ固有の設定については、[高度なVitest設定](#advanced-vitest-configuration)セクションを参照してください。

## その他のテストフレームワーク {#other-test-frameworks}

Angularアプリケーションは、他のテストライブラリとテストランナーでもユニットテストできます。各ライブラリとランナーには、それぞれ独自のインストール手順、設定、構文があります。

## 継続的インテグレーションでのテスト {#testing-in-continuous-integration}

堅牢なテストスイートは、継続的インテグレーション（CI）パイプラインの重要な部分です。CIサーバーを使用すると、すべてのコミットとプルリクエストでテストを自動的に実行できます。

CIサーバーでAngularアプリケーションをテストするには、標準のテストコマンドを実行します:

```shell
ng test
```

ほとんどのCIサーバーは`CI=true`環境変数を設定しており、`ng test`はこれを検出します。これにより、非対話型のシングルランモードでテストが自動的に設定されます。

CIサーバーがこの変数を設定しない場合、または手動でシングルランモードを強制する必要がある場合は、`--no-watch`および`--no-progress`フラグを使用できます:

```shell
ng test --no-watch --no-progress
```

## テストに関する追加情報 {#more-information-on-testing}

アプリケーションのテストを設定したら、次のテストガイドが役立つ場合があります。

|                                                                    | 詳細                                                                           |
| :----------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [コードカバレッジ](guide/testing/code-coverage)                       | テストがアプリケーションのどの部分をカバーしているか、および必要な量の指定方法。 |
| [サービスのテスト](guide/testing/services)                         | アプリケーションで使用しているサービスのテスト方法。                                   |
| [コンポーネントのテストの基本](guide/testing/components-basics)    | Angularコンポーネントのテストの基本。                                             |
| [コンポーネントテストシナリオ](guide/testing/components-scenarios)  | さまざまな種類のコンポーネントテストシナリオとユースケース。                       |
| [属性ディレクティブのテスト](guide/testing/attribute-directives) | 属性ディレクティブのテスト方法。                                            |
| [パイプのテスト](guide/testing/pipes)                               | パイプのテスト方法。                                                                |
| [テストのデバッグ](guide/testing/debugging)                         | 一般的なテストのバグ。                                                              |
| [ユーティリティAPIのテスト](guide/testing/utility-apis)                 | Angularのテスト機能。                                                         |
