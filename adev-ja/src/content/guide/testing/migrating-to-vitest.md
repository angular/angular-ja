# KarmaからVitestへの移行

Angular CLIは、新しいプロジェクトのデフォルトのユニットテストランナーとして[Vitest](https://vitest.dev/)を使用します。このガイドでは、既存のプロジェクトをKarmaとJasmineからVitestに移行する手順を説明します。

IMPORTANT: 既存のプロジェクトをVitestに移行することは実験的なものとみなされます。このプロセスでは、`application`ビルドシステムの使用も必要です。これは、すべての新規作成されたプロジェクトのデフォルトです。

## 手動での移行手順

自動リファクタリングschematicを使用する前に、プロジェクトを手動で更新してVitestテストランナーを使用するようにする必要があります。

### 1. 依存関係のインストール {#1-install-dependencies}

`vitest`とDOMエミュレーションライブラリをインストールします。ブラウザテストも可能ですが（[ステップ5](#5-configure-browser-mode-optional)を参照）、VitestはデフォルトでDOMエミュレーションライブラリを使用してNode.js内でブラウザ環境をシミュレートし、テスト実行を高速化します。CLIは`happy-dom`がインストールされていれば自動的に検出して使用し、そうでなければ`jsdom`にフォールバックします。これらのパッケージのいずれかがインストールされている必要があります。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev vitest jsdom
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev vitest jsdom
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D vitest jsdom
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev vitest jsdom
  </docs-code>
</docs-code-multifile>

### 2. `angular.json`の更新 {#2-update-angularjson}

`angular.json`ファイルで、プロジェクトの`test`ターゲットを見つけ、`builder`を`@angular/build:unit-test`に変更します。

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test"
        }
      }
    }
  }
}
```

`unit-test`ビルダーは、デフォルトで`"tsConfig": "tsconfig.spec.json"`と`"buildTarget": "::development"`になります。プロジェクトで異なる値が必要な場合は、これらのオプションを明示的に設定できます。たとえば、`development`ビルド設定がない場合や、テスト用に異なるオプションが必要な場合は、`testing`などの名前を付けたビルド設定を作成して`buildTarget`に使用できます。

以前の`@angular/build:karma`ビルダーでは、ビルドオプション（`polyfills`、`assets`、`styles`など）を`test`ターゲット内で直接設定できました。新しい`@angular/build:unit-test`ビルダーはこれをサポートしていません。テスト固有のビルドオプションが既存の`development`ビルド設定と異なる場合は、それらを専用のビルドターゲット設定に移動する必要があります。テストのビルドオプションがすでに`development`ビルド設定と一致している場合は、何もする必要はありません。

### 3. カスタム`karma.conf.js`設定の処理 {#3-handle-custom-karmaconfjs-configurations}

`karma.conf.js`内のカスタム設定は自動的に移行されません。`karma.conf.js`ファイルを削除する前に、移行が必要なカスタム設定がないか確認してください。

多くのKarmaオプションにはVitestでの同等の機能があり、カスタムのVitest設定ファイル（例: `vitest.config.ts`）で設定し、`runnerConfig`オプションを介して`angular.json`にリンクできます。

一般的な移行パスは次のとおりです:

- **レポーター**: Karmaレポーターは、Vitest互換のレポーターに置き換える必要があります。これらは多くの場合、`angular.json`の`test.options.reporters`プロパティで直接設定できます。より高度な設定には、カスタムの`vitest.config.ts`ファイルを使用します。
- **プラグイン**: Karmaプラグインには、Vitestでの同等のものがあるかもしれません。それらを見つけてインストールする必要があります。コードカバレッジはAngular CLIの主要な機能であり、`ng test --coverage`で有効にできることに注意してください。
- **カスタムブラウザランチャー**: これらは`angular.json`の`browsers`オプションと、`@vitest/browser-playwright`のようなブラウザプロバイダーのインストールに置き換えられます。

その他の設定については、公式の[Vitestドキュメント](https://vitest.dev/config/)を参照してください。

### 4. Karmaと`test.ts`ファイルの削除 {#4-remove-karma-and-testts-files}

これで、プロジェクトから`karma.conf.js`と`src/test.ts`を削除し、Karma関連のパッケージをアンインストールできます。次のコマンドは、新しいAngular CLIプロジェクトにインストールされるパッケージに基づいています。あなたのプロジェクトには、他にも削除すべきKarma関連のパッケージがあるかもしれません。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
  <docs-code header="bun" language="shell">
    bun remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
</docs-code-multifile>

### 5. ブラウザモードの設定（任意） {#5-configure-browser-mode-optional}

実際のブラウザでテストを実行する必要がある場合は、ブラウザプロバイダーをインストールし、`angular.json`を設定する必要があります。

**ブラウザプロバイダーのインストール:**

ニーズに応じて、次のブラウザプロバイダーのいずれかを選択してください:

- **Playwright**: Chromium、Firefox、WebKit用の`@vitest/browser-playwright`。
- **WebdriverIO**: Chrome、Firefox、Safari、Edge用の`@vitest/browser-webdriverio`。
- **Preview**: Webcontainer環境（StackBlitzなど）用の`@vitest/browser-preview`。

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-playwright
  </docs-code>
</docs-code-multifile>

**ブラウザモード用に`angular.json`を更新:**

`test`ターゲットのオプションに`browsers`オプションを追加します。ブラウザ名は、インストールしたプロバイダーによって異なります（例: Playwrightの場合は`chromium`、WebdriverIOの場合は`chrome`）。

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "browsers": ["chromium"]
          }
        }
      }
    }
  }
}
```

ヘッドレスモードは、`CI`環境変数が設定されている場合や、ブラウザ名に"Headless"が含まれている場合（例: `ChromeHeadless`）に自動的に有効になります。それ以外の場合、テストはヘッド付きブラウザで実行されます。

NOTE: `ng test --debug`を使用したデバッグは、ブラウザモードではサポートされていません。

## schematicsによる自動テストリファクタリング {#automated-test-refactoring-with-schematics}

IMPORTANT: `refactor-jasmine-vitest` schematicは実験的なものであり、すべての可能なテストパターンをカバーしているとは限りません。schematicによって行われた変更は必ずレビューしてください。

Angular CLIは、JasmineテストをVitestを使用するように自動的にリファクタリングするための`refactor-jasmine-vitest` schematicを提供します。

### 概要 {#overview}

このschematicは、テストファイル（`.spec.ts`）で以下の変換を自動化します:

- `fit`と`fdescribe`を`it.only`と`describe.only`に変換します。
- `xit`と`xdescribe`を`it.skip`と`describe.skip`に変換します。
- `spyOn`の呼び出しを同等の`vi.spyOn`に変換します。
- `jasmine.objectContaining`を`expect.objectContaining`に置き換えます。
- `jasmine.any`を`expect.any`に置き換えます。
- `jasmine.createSpy`を`vi.fn`に置き換えます。
- `beforeAll`、`beforeEach`、`afterAll`、`afterEach`をVitestの同等のものに更新します。
- `fail()`をVitestの`vi.fail()`に変換します。
- Vitest APIに一致するようにexpectationsを調整します
- 自動的に変換できないコードにTODOコメントを追加します

このschematicは、以下の操作を**しません**:

- `vitest`やその他の関連する依存関係をインストールしません。
- Vitestビルダーを使用するように`angular.json`を変更したり、`test`ターゲットからビルドオプション（`polyfills`や`styles`など）を移行したりしません。
- `karma.conf.js`や`test.ts`ファイルを削除しません。
- 複雑な、またはネストされたスパイシナリオは処理しません。これらは手動でのリファクタリングが必要になる場合があります。

### schematicsの実行 {#running-the-schematic}

プロジェクトがVitest用に設定されたら、schematicを実行してテストファイルをリファクタリングできます。

デフォルトプロジェクトの**すべて**のテストファイルをリファクタリングするには、次を実行します:

```bash
ng g @schematics/angular:refactor-jasmine-vitest
```

### オプション {#options}

以下のオプションを使用して、schematicの動作をカスタマイズできます:

| オプション               | 説明                                                                                                |
| :----------------------- | :-------------------------------------------------------------------------------------------------- |
| `--project <name>`       | マルチプロジェクトワークスペースでリファクタリングするプロジェクトを指定します。<br> 例: `--project=my-lib`      |
| `--include <path>`       | 特定のファイルまたはディレクトリのみをリファクタリングします。<br> 例: `--include=src/app/app.component.spec.ts` |
| `--file-suffix <suffix>` | テストファイルに異なるファイルサフィックスを指定します。<br> 例: `--file-suffix=.test.ts`              |
| `--add-imports`          | Vitestの設定でグローバルを無効にしている場合に、明示的な`vitest`のインポートを追加します。            |
| `--verbose`              | 適用されたすべての変換の詳細なロギングを表示します。                                                |
| `--browser-mode`         | ブラウザモードでテストを実行する予定がある場合に使用します。                                                     |

### 移行後 {#after-migrating}

schematicが完了したら、次のことを行うことをお勧めします:

1.  **テストの実行**: `ng test`を実行して、リファクタリング後もすべてのテストがパスすることを確認します。
2.  **変更のレビュー**: schematicによって行われた変更を確認し、特に複雑なスパイやモックを持つテストに注意を払います。これらはさらなる手動での調整が必要になる場合があります。

`ng test`コマンドは、アプリケーションを_ウォッチモード_でビルドし、設定されたランナーを起動します。ウォッチモードは、インタラクティブターミナルを使用しており、CIで実行されていない場合にデフォルトで有効になります。

## 設定 {#configuration}

Angular CLIがVitest設定を管理し、`angular.json`のオプションに基づいてメモリ上で完全な設定を構築します。

### カスタムVitest設定 {#custom-vitest-configuration}

IMPORTANT: カスタム設定を使用すると高度なオプションが有効になりますが、Angularチームは設定ファイル固有の内容や、その中で使用されるサードパーティ製プラグインに対する直接的なサポートは提供しません。また、CLIは適切な動作を保証するために、特定のプロパティ（`test.projects`、`test.include`）を上書きします。

デフォルト設定を上書きするために、カスタムのVitest設定ファイルを提供できます。利用可能なオプションの完全なリストについては、公式の[Vitestドキュメント](https://vitest.dev/config/)を参照してください。

**1. 直接パス:**
`angular.json`で、Vitest設定ファイルへの直接パスを指定します:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {"runnerConfig": "vitest.config.ts"}
        }
      }
    }
  }
}
```

**2. ベース設定の自動検索:**
`runnerConfig`を`true`に設定すると、ビルダーはプロジェクトとワークスペースのルートで共有の`vitest-base.config.*`ファイルを自動的に検索します。

## `zone.js`ベースのヘルパーはサポートされていません {#zonejs-based-helpers-are-not-supported}

Vitestでテストを実行する場合、zone.jsのパッチは適用されないため、`fakeAsync`、`flush`、`waitForAsync`のような関数は使用できません。
Vitestに移行するには、テストもネイティブasyncとVitestのフェイクタイマーに移行する必要があります。Vitestでのフェイクタイマーの使用例については、[こちらの例](/components-scenarios#async-test-with-a-vitest-fake-timers)を参照してください。

## バグレポート {#bug-reports}

問題や機能のリクエストは[GitHub](https://github.com/angular/angular-cli/issues)で報告してください。

チームが問題に対処するのを助けるため、可能な限り最小限の再現手順を提供してください。
