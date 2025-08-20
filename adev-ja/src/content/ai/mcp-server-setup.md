# Angular CLI MCPサーバーセットアップ

Angular CLIには、開発環境のAIアシスタントがAngular CLIと対話できるようにする実験的な[Model Context Protocol (MCP) サーバー](https://modelcontextprotocol.io/)が含まれています。CLIによるコード生成、パッケージの追加などに対応しています。

開始するには、ターミナルで次のコマンドを実行します。

```bash
ng mcp
```

このコマンドを使用して、環境のベースとなるJSON設定を作成します。ファイル構造はIDEによって異なることに注意してください。以下のセクションでは、いくつかの人気のあるエディタの設定を提供します。

### VS Code {#vs-code}
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

### JetBrains IDEs {#jetbrains-ides}
JetBrains IDEs（IntelliJ IDEAやWebStormなど）では、MCP Serverプラグインをインストールした後、`Settings | Tools | AI Assistant | Model Context Protocol (MCP)`に移動します。新しいサーバーを追加し、`As JSON`を選択します。サーバーリストにトップレベルプロパティを使用しない以下の設定を貼り付けます。

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

### Firebase Studio {#firebase-studio}
プロジェクトのルートに`.idx/mcp.json`という名前のファイルを作成し、以下の設定を追加します。
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

### その他のIDE {#other-ides}
これらのIDEの場合、設定ファイルを作成し、以下のスニペットを追加します。`mcpServers`プロパティの使用に注意してください。
*   **Cursor:** プロジェクトのルートに`.cursor/mcp.json`という名前のファイルを作成します。`~/.cursor/mcp.json`でグローバルに設定できます。
*   **その他のIDE:** MCP設定ファイルの適切な場所（多くの場合`mcp.json`）について、IDEのドキュメントを確認してください。

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