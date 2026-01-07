# KarmaとJasmineを使用したテスト

新しいAngularプロジェクトでは[Vitest](https://vitest.dev)がデフォルトのテストランナーですが、[Karma](https://karma-runner.github.io)も引き続きサポートされており、広く使われているテストランナーです。このガイドでは、Karmaテストランナーと[Jasmine](https://jasmine.github.io)テストフレームワークを使用して、Angularアプリケーションをテストする手順を説明します。

## KarmaとJasmineのセットアップ {#setting-up-karma-and-jasmine}

KarmaとJasmineは、新規プロジェクトでセットアップすることも、既存のプロジェクトに追加できます。

### 新規プロジェクトの場合 {#for-new-projects}

KarmaとJasmineが事前設定された新規プロジェクトを作成するには、`ng new`コマンドを`--test-runner=karma`オプション付きで実行します:

```shell
ng new my-karma-app --test-runner=karma
```

### 既存のプロジェクトの場合 {#for-existing-projects}

既存のプロジェクトにKarmaとJasmineを追加するには、次の手順に従います:

1.  **必要なパッケージをインストールします:**

    <docs-code-multifile>
      <docs-code header="npm" language="shell">
        npm install --save-dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="yarn" language="shell">
        yarn add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="pnpm" language="shell">
        pnpm add -D karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="bun" language="shell">
        bun add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
    </docs-code-multifile>

2.  **`angular.json`でテストランナーを設定します:**

    `angular.json`ファイルで`test`ターゲットを見つけ、`runner`オプションを`karma`に設定します:

    ```json
    {
      // ...
      "projects": {
        "your-project-name": {
          // ...
          "architect": {
            "test": {
              "builder": "@angular/build:unit-test",
              "options": {
                "runner": "karma"
                // ... other options
              }
            }
          }
        }
      }
    }
    ```

3.  **Jasmineの型定義のために`tsconfig.spec.json`を更新します:**

    TypeScriptが`describe`や`it`のようなグローバルなテスト関数を認識できるように、`tsconfig.spec.json`の`types`配列に`"jasmine"`を追加します:

    ```json
    {
      // ...
      "compilerOptions": {
        // ...
        "types": ["jasmine"]
      }
      // ...
    }
    ```

## テストの実行 {#running-tests}

プロジェクトの設定が完了したら、[`ng test`](cli/test)コマンドを使用してテストを実行します:

```shell
ng test
```

`ng test`コマンドは、アプリケーションを_ウォッチモード_でビルドし、[Karmaテストランナー](https://karma-runner.github.io)を起動します。

コンソールの出力は以下のようになります:

```shell

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

```

テスト出力は[Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter)を使用してブラウザに表示されます。

<img alt="ブラウザに表示されたJasmine HTML Reporter" src="assets/images/guide/testing/initial-jasmine-html-reporter.png">

テスト行をクリックしてそのテストだけを再実行するか、説明をクリックして選択したテストグループ（「テストスイート」）のテストを再実行します。

その間、`ng test`コマンドは変更を監視しています。これを実際に確認するには、ソースファイルに小さな変更を加えて保存します。テストが再実行されてブラウザが更新され、新しいテスト結果が表示されます。

## 設定 {#configuration}

Angular CLIがJasmineとKarmaの設定を代行します。`angular.json`ファイルで指定されたオプションに基づいて、完全な設定をメモリ内に構築します。

### Karma設定のカスタマイズ {#customizing-karma-configuration}

Karmaをカスタマイズしたい場合は、次のコマンドを実行して`karma.conf.js`を作成できます:

```shell
ng generate config karma
```

HELPFUL: Karmaの設定については、[Karma設定ガイド](http://karma-runner.github.io/6.4/config/configuration-file.html)で詳しく説明されています。

### `angular.json`でのテストランナーの設定 {#setting-the-test-runner-in-angularjson}

プロジェクトのテストランナーとしてKarmaを明示的に設定するには、`angular.json`ファイル内の`test`ターゲットを見つけ、`runner`オプションを`karma`に設定します:

```json
{
  // ...
  "projects": {
    "your-project-name": {
      // ...
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "runner": "karma"
            // ... other options
          }
        }
      }
    }
  }
}
```

## コードカバレッジの強制 {#code-coverage-enforcement}

最小コードカバレッジレベルを強制するには、`karma.conf.js`ファイルの`coverageReporter`セクションにある`check`プロパティを使用できます。

たとえば、最小80%のカバレッジを要求するには:

```javascript
coverageReporter: {
  dir: require('path').join(__dirname, './coverage/<project-name>'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' }
  ],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

指定されたカバレッジのしきい値が満たされない場合、これによりテスト実行は失敗します。

## 継続的インテグレーションでのテスト {#testing-in-continuous-integration}

CI環境でKarmaテストを実行するには、次のコマンドを使用します:

```shell
ng test --no-watch --no-progress --browsers=ChromeHeadless
```

NOTE: CI環境において、Karmaでテストを一度だけ実行して正常に終了させるためには、`--no-watch`と`--no-progress`フラグが不可欠です。また、`--browsers=ChromeHeadless`フラグは、グラフィカルインターフェースを持たないブラウザ環境でテストを実行するために必須です。

## テストのデバッグ {#debugging-tests}

テストが期待どおりに動作しない場合は、ブラウザで検査およびデバッグできます。

Karmaテストランナーでアプリケーションをデバッグするには:

1.  Karmaブラウザウィンドウを表示します。このステップでヘルプが必要な場合は、[テストのセットアップ](guide/testing/overview#set-up-for-testing)を参照してください。
2.  **DEBUG**ボタンをクリックして新しいブラウザタブを開き、テストを再実行します。
3.  ブラウザの**開発者ツール**を開きます。Windowsでは、`Ctrl-Shift-I`を押します。macOSでは、`Command-Option-I`を押します。
4.  **Sources**セクションを選択します。
5.  `Control/Command-P`を押し、テストファイルの名前を入力して開きます。
6.  テストにブレークポイントを設定します。
7.  ブラウザを更新すると、ブレークポイントで停止することがわかります。

<img alt="Karmaのデバッグ" src="assets/images/guide/testing/karma-1st-spec-debug.png">
