{@a code-coverage}

# テストしているコードの量を調べる

CLIでユニットテストを実行し、コードカバレッジレポートを作成することができます。
コードカバレッジレポートは、ユニットテストで正しくテストされていないコードベースの部分を表示します。

<div class="alert is-helpful">

  If you'd like to experiment with the application that this guide describes, you can <live-example name="testing" noDownload>run it in your browser</live-example> or <live-example name="testing" downloadOnly>download and run it locally</live-example>.

</div>


カバレッジレポートを生成するには、プロジェクト直下で次のコマンドを実行します。

<code-example language="sh">
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
To enable this, open the [Karma](https://karma-runner.github.io) test platform configuration file, `karma.conf.js`, and add the `check` property in the `coverageReporter:` key.

```js
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

The `check` property causes the tool to enforce a minimum of 80% code coverage when the unit tests are run in the project.

You can find more info about the different coverage configuration options [here](https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md).
