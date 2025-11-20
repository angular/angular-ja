# ユニットテスト

Angularアプリケーションをテストすると、期待どおりに動作していることを確認できます。ユニットテストは、バグを早期に発見し、コード品質を確保し、安全なリファクタリングを促進するために不可欠です。

NOTE: このガイドでは、新しいAngular CLIプロジェクトのデフォルトテスト設定に焦点を当てています。既存のプロジェクトをKarmaからVitestに移行する場合は、[KarmaからVitestへの移行ガイド](guide/testing/migrating-to-vitest)を参照してください。Vitestはデフォルトのテストランナーですが、Karmaは引き続き完全にサポートされています。Karmaを使用したテストについては、[Karmaテストガイド](guide/testing/karma)を参照してください。

## テストの設定 {#set-up-for-testing}

Angular CLIは、[Vitestテストフレームワーク](https://vitest.dev)を使用してAngularアプリケーションをテストするために必要なものをすべてダウンロードしてインストールします。デフォルトでは、新しいプロジェクトには`vitest`と`jsdom`が含まれています。

Vitestは、`jsdom`を使用してDOMをエミュレートするNode.js環境でユニットテストを実行します。これにより、ブラウザを起動するオーバーヘッドを回避して、テストの実行を高速化できます。`happy-dom`をインストールして`jsdom`を削除することで、代替として`happy-dom`を使用できます。CLIは`happy-dom`が存在する場合、自動的に検出して使用します。

CLIで作成したプロジェクトは、すぐにテストできます。[`ng test`](cli/test) CLIコマンドを実行するだけです:

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

`ng test`コマンドは変更も監視します。これが実際にどのように機能するかを確認するには、`app.ts`を少し変更して保存します。テストが再び実行され、新しい結果がコンソールに表示されます。

## 設定 {#configuration}

Angular CLIは、Vitestの設定のほとんどを処理します。多くの一般的なユースケースでは、`angular.json`ファイルのオプションを直接変更することで、テストの動作を調整できます。

### 組み込み設定オプション {#built-in-configuration-options}

`angular.json`ファイルの`test`ターゲットで次のオプションを変更できます:

- `include`: テストに含めるファイルのGlobパターン。デフォルトは`['**/*.spec.ts', '**/*.test.ts']`です。
- `exclude`: テストから除外するファイルのGlobパターン。
- `setupFiles`: テストの前に実行されるグローバルセットアップファイル（ポリフィルやグローバルモックなど）へのパスのリスト。
- `providersFile`: テスト環境用のAngularプロバイダーのデフォルト配列をエクスポートするファイルへのパス。これは、テストに注入されるグローバルテストプロバイダーをセットアップするのに役立ちます。
- `coverage`: コードカバレッジレポートを有効または無効にするブール値。デフォルトは`false`です。
- `browsers`: テストを実行するブラウザ名の配列（例: `["chromium"]`）。ブラウザプロバイダーのインストールが必要です。

たとえば、`src/test-providers.ts`ファイルを作成して、すべてのテストに`provideHttpClientTesting`を提供できます:

```typescript
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
            "include": ["src/**/*.spec.ts"],
            "setupFiles": ["src/test-setup.ts"],
            "providersFile": "src/test-providers.ts",
            "coverage": true,
            "browsers": ["chromium"]
          }
        }
      }
    }
  }
}
```

### 高度: カスタムVitest設定 {#advanced-custom-vitest-configuration}

高度なユースケースでは、カスタムVitest設定ファイルを提供できます。

IMPORTANT: カスタム設定を使用すると高度なオプションが有効になりますが、Angularチームは設定ファイルの特定の内容やその中で使用されるサードパーティプラグインについて直接サポートを提供していません。CLIは、適切な動作を保証するために特定のプロパティ（`test.projects`、`test.include`）を上書きします。

Vitest設定ファイル（例: `vitest-base.config.ts`）を作成し、`runnerConfig`オプションを使用して`angular.json`で参照できます。

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

HELPFUL: Vitestの設定について詳しくは、[Vitest設定ガイド](https://vitest.dev/config/)を参照してください。

## コードカバレッジ {#code-coverage}

`ng test`コマンドに`--coverage`フラグを追加することで、コードカバレッジレポートを生成できます。レポートは`coverage/`ディレクトリに生成されます。

前提条件、カバレッジしきい値の適用、高度な設定の詳細については、[コードカバレッジガイド](guide/testing/code-coverage)を参照してください。

## ブラウザでのテストの実行 {#running-tests-in-a-browser}

デフォルトのNode.js環境はほとんどのユニットテストで高速ですが、実際のブラウザでテストを実行できます。これは、ブラウザ固有のAPI（レンダリングなど）に依存するテストやデバッグに役立ちます。

ブラウザでテストを実行するには、最初にブラウザプロバイダーをインストールする必要があります。
ニーズに基づいて、次のブラウザプロバイダーのいずれかを選択してください:

- **Playwright**: `@vitest/browser-playwright` (Chromium、Firefox、WebKit用)
- **WebdriverIO**: `@vitest/browser-webdriverio` (Chrome、Firefox、Safari、Edge用)
- **Preview**: `@vitest/browser-preview` (StackBlitzなどのWebcontainer環境用)

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

プロバイダーがインストールされたら、`--browsers`フラグを使用してブラウザでテストを実行できます:

```bash
# Playwrightの例
ng test --browsers=chromium

# WebdriverIOの例
ng test --browsers=chrome
```

`CI`環境変数が設定されている場合、ヘッドレスモードが自動的に有効になります。それ以外の場合、テストはヘッド付きブラウザで実行されます。

## その他のテストフレームワーク {#other-test-frameworks}

Angularアプリケーションは、他のテストライブラリとテストランナーでもユニットテストできます。各ライブラリとランナーには、それぞれ独自のインストール手順、設定、構文があります。

## 継続的インテグレーションでのテスト {#testing-in-continuous-integration}

堅牢なテストスイートは、継続的インテグレーション（CI）パイプラインの重要な部分です。CIサーバーを使用すると、プロジェクトリポジトリを設定して、すべてのコミットとプルリクエストでテストを実行できます。

継続的インテグレーション（CI）サーバーでAngularアプリケーションをテストするには、通常、標準のテストコマンドを実行します:

```shell
ng test
```

ほとんどのCIサーバーは`CI=true`環境変数を設定しており、`ng test`はこれを検出します。これにより、適切な非対話型のシングルランモードでテストが自動的に実行されます。

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
