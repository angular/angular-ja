# Angular CLI MCPサーバーセットアップ

Angular CLIには、開発環境のAIアシスタントがAngular CLIと対話できるようにする実験的な[Model Context Protocol (MCP) サーバー](https://modelcontextprotocol.io/)が含まれています。CLIによるコード生成、パッケージの追加などに対応しています。

開始するには、ターミナルで次のコマンドを実行します。

```bash
ng mcp
```

インタラクティブなターミナルから実行すると、このコマンドはMCPサーバーを使用するためのホスト環境の設定方法についての指示を表示します。以下のセクションでは、いくつかの人気のあるエディタとツールの設定例を提供します。

### Cursor

プロジェクトのルートに`.cursor/mcp.json`という名前のファイルを作成し、以下の設定を追加します。`~/.cursor/mcp.json`でグローバルに設定することもできます。

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

### Firebase Studio

プロジェクトのルートに`.idx/mcp.json`という名前のファイルを作成し、以下の設定を追加します：

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

### Gemini CLI

プロジェクトのルートに`.gemini/settings.json`という名前のファイルを作成し、以下の設定を追加します：

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

### JetBrains IDEs

JetBrains IDEs（IntelliJ IDEAやWebStormなど）では、JetBrains AI Assistantプラグインをインストールした後、`Settings | Tools | AI Assistant | Model Context Protocol (MCP)`に移動します。新しいサーバーを追加し、`As JSON`を選択します。サーバーリストにトップレベルプロパティを使用しない以下の設定を貼り付けます。

```json
{
  "name": "Angular CLI",
  "command": "npx",
  "args": [
    "-y",
    "@angular/cli",
    "mcp"
  ]
}
```

### VS Code

プロジェクトのルートに`.vscode/mcp.json`という名前のファイルを作成し、以下の設定を追加します。`servers`プロパティの使用に注意してください。

```json
{
  "servers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

### その他のIDE

その他のIDEについては、MCP設定ファイルの適切な場所（多くの場合`mcp.json`）について、IDEのドキュメントを確認してください。設定には以下のスニペットを含める必要があります。

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

## コマンドオプション

`mcp`コマンドは、IDEのMCP設定で引数として渡される以下のオプションで設定できます：

| オプション         | 型      | 説明                                                                                                | デフォルト |
| :------------- | :-------- | :--------------------------------------------------------------------------------------------------------- | :------ |
| `--read-only`  | `boolean` | プロジェクトに変更を加えないツールのみを登録します。エディタまたはコーディングエージェントは引き続き編集を実行する場合があります。 | `false` |
| `--local-only` | `boolean` | インターネット接続を必要としないツールのみを登録します。エディタまたはコーディングエージェントは引き続きネットワーク経由でデータを送信する場合があります。 | `false` |


たとえば、VS Codeで読み取り専用モードでサーバーを実行する場合は、`mcp.json`を次のように更新します：

```json
{
  "servers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp", "--read-only"]
    }
  }
}
```

## 利用可能なツール

Angular CLI MCPサーバーは、開発ワークフローを支援するいくつかのツールを提供します。デフォルトで、以下のツールが有効になっています：

| 名前                   | 説明                                                                                                                                                                                        | `local-only` | `read-only` |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: | :---------: |
| `get_best_practices`   | Angularベストプラクティスガイドを取得します。このガイドは、スタンドアロンコンポーネント、型付きフォーム、モダンな制御フローなど、すべてのコードが現代的な標準に準拠することを保証するために不可欠です。 |      ✅      |      ✅     |
| `list_projects`        | Angularワークスペース内で定義されたすべてのアプリケーションとライブラリの名前を一覧表示します。`angular.json`設定ファイルを読み取ってプロジェクトを識別します。                                    |      ✅      |      ✅     |
| `search_documentation` | https://angular.dev の公式Angularドキュメントを検索します。このツールは、API、チュートリアル、ベストプラクティスなど、Angularに関する質問に答えるために使用する必要があります。               |      ❌      |      ✅     |

## フィードバックと新しいアイデア

Angularチームは、既存のMCP機能に対するフィードバックや新しいツールまたは機能のアイデアを歓迎します。[angular/angular GitHubリポジトリ](https://github.com/angular/angular/issues)でissueを作成して、ご意見をお聞かせください。