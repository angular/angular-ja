{@a code-coverage}

# テストしているコードの量を調べる

CLIでユニットテストを実行し、コードカバレッジレポートを作成することができます。
コードカバレッジレポートは、ユニットテストで正しくテストされていないコードベースの部分を表示します。

<div class="alert is-helpful">

  For the sample app that the testing guides describe, see the <live-example name="testing" embedded-style noDownload>sample app</live-example>.

  For the tests features in the testing guides, see <live-example name="testing" stackblitz="specs" noDownload>tests</live-example>.

</div>


カバレッジレポートを生成するには、プロジェクト直下で次のコマンドを実行します。

<code-example language="sh" class="code-shell">
  ng test --no-watch --code-coverage
</code-example>

テストが完了すると、コマンドはプロジェクト内に新しく`/coverage`フォルダを作成します。ソースコードとコードカバレッジ値のレポートを見るためには`index.html`ファイルを開きます。

テストするたびにコードカバレッジレポートを作成したい場合は、CLIの設定ファイル、`angular.json`で次のようなオプションを設定します:

```
  "test": {
    "options": {
      "codeCoverage": true
    }
  }
```

## コードカバレッジの適用

コードカバレッジ率から、テストされたコードの量を見積もることができます。
あなたのチームがユニットテストされている最低限の量を決定する場合、Angular CLIを使用して、この最小値を適用することができます。

たとえば、コードベースに最低80％のコードカバレッジを設定するとします。
これを有効にするには、[Karma](https://karma-runner.github.io)テストプラットフォーム設定ファイル、`karma.conf.js`を開いて、`coverageIstanbulReporter:`に次のような内容を追加します。

```
coverageIstanbulReporter: {
  reports: [ 'html', 'lcovonly' ],
  fixWebpackSourcePaths: true,
  thresholds: {
    statements: 80,
    lines: 80,
    branches: 80,
    functions: 80
  }
}
```

`thresholds`プロパティは、ユニットテストがプロジェクトで実行されたときに、ツールが最低80％のコードカバレッジを強制するようにします。

