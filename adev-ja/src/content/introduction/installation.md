<docs-decorative-header title="インストール" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

オンラインスターターを使ってAngularをすぐに始めましょう。または、ターミナルを使ってローカルでも開始できます。

## オンラインで試す

プロジェクトを設定せずに、ブラウザでAngularを試したい場合は、オンラインサンドボックスを使うことができます。

<docs-card-container>
  <docs-card title="" href="/playground" link="Playgroundを開く">
  Angularアプリを試す最速の方法です。設定は不要です。
  </docs-card>
</docs-card-container>

## ローカルに新しいプロジェクトを設定する

新しいプロジェクトを開始する場合、Gitなどのツールを使用するために、ローカルにプロジェクトを作成するのが一般的です。

### 前提条件

- **Node.js** - v[^18.19.1以降](/reference/versions)
- **テキストエディタ** - [Visual Studio Code](https://code.visualstudio.com/)を推奨
- **ターミナル** - Angular CLIコマンドを実行するために必要
- **開発ツール** - 開発ワークフローを改善するために、[Angular Language Service](/tools/language-service) をおすすめします

### 手順

以下のガイドは、ローカルにAngularプロジェクトを設定する手順を説明します。

#### Angular CLIをインストールする

ターミナルを開き（[Visual Studio Code](https://code.visualstudio.com/)を使用している場合は、[統合ターミナル](https://code.visualstudio.com/docs/editor/integrated-terminal)を開くことができます）、次のコマンドを実行します。

<docs-code-multifile>
  <docs-code
    header="npm"
    >
    npm install -g @angular/cli
    </docs-code>
  <docs-code
    header="pnpm"
    >
    pnpm install -g @angular/cli
    </docs-code>
  <docs-code
    header="yarn"
    >
    yarn global add @angular/cli
    </docs-code>
  <docs-code
    header="bun"
    >
    bun install -g @angular/cli
    </docs-code>

</docs-code-multifile>

WindowsまたはUnixでこのコマンドを実行する際に問題が発生した場合は、[CLIドキュメント](/tools/cli/setup-local#install-the-angular-cli)を参照してください。

#### 新しいプロジェクトを作成する

ターミナルで、CLIコマンド`ng new`を実行し、目的のプロジェクト名を入力します。次の例では、`my-first-angular-app`というプロジェクト名を使用します。

<docs-code language="shell">

ng new <project-name>

</docs-code>

プロジェクトの設定に関するいくつかのオプションが表示されます。矢印キーとEnterキーを使ってナビゲートし、必要なオプションを選択します。

特に好みがなければ、Enterキーを押してデフォルトのオプションを採用し、設定を続行してください。

設定オプションを選択し、CLIがセットアップを実行すると、次のようなメッセージが表示されます。

```shell
✔ Packages installed successfully.
    Successfully initialized git.
```

これで、ローカルにプロジェクトを実行する準備が整いました！

#### ローカルに新しいプロジェクトを実行する

ターミナルで、新しいAngularプロジェクトに切り替えます。

<docs-code language="shell">

cd my-first-angular-app

</docs-code>

この時点で、すべての依存関係がインストールされているはずです（プロジェクト内に`node_modules`フォルダが存在することを確認できます）。次のコマンドを実行してプロジェクトを開始できます。

<docs-code language="shell">

npm start

</docs-code>

すべてが正常に完了すると、ターミナルに次のような確認メッセージが表示されます。

```shell
Watch mode enabled. Watching for file changes...
NOTE: Raw file sizes do not reflect development server per-request transformations.
  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help
```

これで、`Local`のパス（例：`http://localhost:4200`）にアクセスしてアプリケーションを確認できます。コーディングを楽しんでください！🎉

## 次のステップ

Angularプロジェクトを作成したので、[基本概念ガイド](/essentials)でAngularの詳細について学ぶか、詳しいガイドからトピックを選択してください！
