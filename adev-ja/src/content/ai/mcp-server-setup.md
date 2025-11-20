# Angular CLI MCPサーバーセットアップ

Angular CLIには、開発環境のAIアシスタントがAngular CLIと対話できるようにする実験的な[Model Context Protocol (MCP) サーバー](https://modelcontextprotocol.io/)が含まれています。CLIによるコード生成、パッケージの追加などに対応しています。

## 利用可能なツール {#available-tools}

Angular CLI MCPサーバーは、開発ワークフローを支援するいくつかのツールを提供します。デフォルトで、以下のツールが有効になっています：

| 名前                        | 説明                                                                                                                                                                                                       | `local-only` | `read-only` |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: | :---------: |
| `ai_tutor`                  | インタラクティブなAI駆動のAngularチューターを起動します。v20以降を使用する新しいAngularプロジェクトから実行することを推奨します。[詳細を見る](ai/ai-tutor)。                                                  |      ✅      |     ✅      |
| `find_examples`             | 公式のベストプラクティス例の厳選されたデータベースから、権威ある コード例を検索します。**モダンで新しい、最近更新された**Angular機能に焦点を当てています。                                                     |      ✅      |     ✅      |
| `get_best_practices`        | Angularベストプラクティスガイドを取得します。このガイドは、スタンドアロンコンポーネント、型付きフォーム、モダンな制御フローなど、すべてのコードが現代的な標準に準拠することを保証するために不可欠です。         |      ✅      |     ✅      |
| `list_projects`             | Angularワークスペース内で定義されたすべてのアプリケーションとライブラリの名前を一覧表示します。`angular.json`設定ファイルを読み取ってプロジェクトを識別します。                                                |      ✅      |     ✅      |
| `onpush-zoneless-migration` | Angularコードを分析し、ゾーンレスアプリケーションの前提条件である`OnPush`変更検知に移行するための段階的で反復的な計画を提供します。                                                                          |      ✅      |     ✅      |
| `search_documentation`      | <https://angular.dev> の公式Angularドキュメントを検索します。このツールは、API、チュートリアル、ベストプラクティスなど、Angularに関する質問に答えるために使用する必要があります。                           |      ❌      |     ✅      |

### 実験的ツール {#experimental-tools}

一部のツールは、新しいまたは完全にテストされていないため、実験的/プレビューステータスで提供されています。[`--experimental-tool`](#command-options)オプションを使用して個別に有効化し、注意して使用してください。

| 名前        | 説明                                                                                                                                                                                         | `local-only` | `read-only` |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: | :---------: |
| `modernize` | コード移行を実行し、最新のベストプラクティスと構文に合わせてAngularコードをモダナイズする方法についてさらなる指示を提供します。[詳細を見る](https://angular.dev/reference/migrations) |      ✅      |     ❌      |

## 開始方法 {#get-started}

開始するには、ターミナルで次のコマンドを実行します。

```bash
ng mcp
```

インタラクティブなターミナルから実行すると、このコマンドはMCPサーバーを使用するためのホスト環境の設定方法についての指示を表示します。以下のセクションでは、いくつかの人気のあるエディタとツールの設定例を提供します。

### Cursor

プロジェクトのルートに`.cursor/mcp.json`という名前のファイルを作成し、以下の設定を追加します。`~/.cursor/mcp.json`でグローバルに設定できます。

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

JetBrains IDEs（IntelliJ IDEAやWebStormなど）では、JetBrains AI Assistantプラグインをインストールした後、`Settings | Tools | AI Assistant | Model Context Protocol (MCP)`に移動します。新しいサーバー（`+`）を追加し、`As JSON`を選択します。次に、以下の設定を貼り付けます：

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

MCPサーバーの設定に関する最新の手順については、JetBrainsのドキュメントを参照してください：[MCPサーバーに接続する](https://www.jetbrains.com/help/ai-assistant/mcp.html#connect-to-an-mcp-server)。

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

## コマンドオプション {#command-options}

`mcp`コマンドは、IDEのMCP設定で引数として渡される以下のオプションで設定できます：

| オプション                    | 型        | 説明                                                                                                                                             | デフォルト |
| :---------------------------- | :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :--------- |
| `--read-only`                 | `boolean` | プロジェクトに変更を加えないツールのみを登録します。エディタまたはコーディングエージェントは引き続き編集を実行する場合があります。                 | `false`    |
| `--local-only`                | `boolean` | インターネット接続を必要としないツールのみを登録します。エディタまたはコーディングエージェントは引き続きネットワーク経由でデータを送信する場合があります。 | `false`    |
| `--experimental-tool`<br>`-E` | `string`  | [実験的ツール](#experimental-tools)を有効にします。複数のオプションをスペースで区切ります。例: `-E tool_a tool_b`。                                  |            |

たとえば、VS Codeにおいて読み取り専用モードでサーバーを実行する場合は、`mcp.json`を次のように更新します：

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

## フィードバックと新しいアイデア {#feedback-and-new-ideas}

Angularチームは、既存のMCP機能に対するフィードバックや新しいツールまたは機能のアイデアを歓迎します。[angular/angular GitHubリポジトリ](https://github.com/angular/angular/issues)でissueを作成して、ご意見をお聞かせください。
