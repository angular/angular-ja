
# テストされているコードの量を確認する

Angular CLIは、単体テストを実行し、コードカバレッジレポートを作成できます。
コードカバレッジレポートは、単体テストで適切にテストされていないコードベースの箇所を示します。

カバレッジレポートを生成するには、プロジェクトのルートで次のコマンドを実行します。

<docs-code language="shell">
ng test --no-watch --code-coverage
</docs-code>

テストが完了すると、コマンドによってプロジェクトに新しい `/coverage` ディレクトリが作成されます。
`index.html` ファイルを開くと、ソースコードとコードカバレッジ値を含むレポートが表示されます。

テストを実行するたびにコードカバレッジレポートを作成する場合は、Angular CLI構成ファイル `angular.json` に次のオプションを設定します。

<docs-code language="json">
"test": {
  "options": {
    "codeCoverage": true
  }
}
</docs-code>

## コードカバレッジの強制

コードカバレッジのパーセンテージは、コードのどの程度がテストされているかを推定できます。
チームが単体テストを行う最小限の量を決定した場合、Angular CLIでその最小限を強制できます。

たとえば、コードベースのコードカバレッジを最低80% にしたいとします。
これを有効にするには、[Karma](https://karma-runner.github.io) テストプラットフォーム構成ファイル `karma.conf.js` を開き、`coverageReporter:` キーに `check` プロパティを追加します。

<docs-code language="javascript">
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
</docs-code>

HELPFUL: [テストガイド](guide/testing#configuration) で、Karma構成の作成と微調整について詳しく説明しています。

`check` プロパティによって、プロジェクトで単体テストを実行すると、最低80% のコードカバレッジが強制されます。

[karma カバレッジドキュメント](https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md) で、カバレッジ構成オプションの詳細を確認してください。
