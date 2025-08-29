# ローカル環境とワークスペースのセットアップ

このガイドでは、[Angular CLI](cli "CLIコマンドリファレンス")を使用してAngular開発環境をセットアップする方法を説明します。
これには、CLIのインストール、初期ワークスペースとスターターアプリケーションの作成、およびセットアップを確認するためにそのアプリケーションをローカルで実行する方法に関する情報が含まれています。

<docs-callout title="ローカルセットアップなしでAngularを試す">

Angularを初めて使用する場合は、ブラウザでAngularの基本を紹介する[今すぐ試す！](tutorials/learn-angular)から始めることをお勧めします。
このスタンドアロンチュートリアルは、オンライン開発のためのインタラクティブな[StackBlitz](https://stackblitz.com)環境を利用しています。
準備が整うまで、ローカル環境をセットアップする必要はありません。

</docs-callout>

## 始める前に {#before-you-start}

Angular CLIを使用するには、以下の知識が必要です。

<docs-pill-row>
  <docs-pill href="https://developer.mozilla.org/docs/Web/JavaScript/A_re-introduction_to_JavaScript" title="JavaScript"/>
  <docs-pill href="https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML" title="HTML"/>
  <docs-pill href="https://developer.mozilla.org/docs/Learn/CSS/First_steps" title="CSS"/>
</docs-pill-row>

また、コマンドラインインターフェース(CLI)ツールの使用法に精通し、コマンドシェルについて一般的な理解がある必要があります。
[TypeScript](https://www.typescriptlang.org)の知識があると役立ちますが、必須ではありません。

## 依存関係 {#dependencies}

ローカルシステムにAngular CLIをインストールするには、[Node.js](https://nodejs.org/)をインストールする必要があります。
Angular CLIは、Nodeとその関連パッケージマネージャーであるnpmを使用して、ブラウザ外でJavaScriptツールをインストールおよび実行します。

[Node.jsをダウンロードしてインストールする](https://nodejs.org/en/download)。これには`npm` CLIも含まれます。
Angularには、[アクティブLTSまたはメンテナンスLTS](https://nodejs.org/en/about/previous-releases)バージョンのNode.jsが必要です。
詳細については、[Angularのバージョン互換性](reference/versions)ガイドを参照してください。

## Angular CLIのインストール {#install-the-angular-cli}

Angular CLIをインストールするには、ターミナルウィンドウを開き、次のコマンドを実行します。

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

### PowerShell実行ポリシー {#powershell-execution-policy}

Windowsクライアントコンピューターでは、PowerShellスクリプトの実行はデフォルトで無効になっているため、上記のコマンドはエラーで失敗する可能性があります。
npmグローバルバイナリに必要なPowerShellスクリプトの実行を許可するには、次の<a href="https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies">実行ポリシー</a>を設定する必要があります。

<docs-code language="sh">

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

</docs-code>

コマンド実行後に表示されるメッセージを注意深く読み、指示に従ってください。実行ポリシーを設定することの意味を理解していることを確認してください。

### Unixパーミッション {#unix-permissions}

一部のUnix系環境では、グローバルスクリプトがrootユーザーによって所有されている場合があり、上記のコマンドはパーミッションエラーで失敗する可能性があります。
rootユーザーとしてコマンドを実行するには`sudo`を付けて実行し、プロンプトが表示されたらパスワードを入力します。

<docs-code-multifile>
   <docs-code
     header="npm"
     >
     sudo npm install -g @angular/cli
     </docs-code>
   <docs-code
     header="pnpm"
     >
     sudo pnpm install -g @angular/cli
     </docs-code>
   <docs-code
     header="yarn"
     >
     sudo yarn global add @angular/cli
     </docs-code>
   <docs-code
     header="bun"
     >
     sudo bun install -g @angular/cli
     </docs-code>

 </docs-code-multifile>

rootとしてコマンドを実行することの意味を理解していることを確認してください。

## ワークスペースと初期アプリケーションの作成 {#create-a-workspace-and-initial-application}

Angular**ワークスペース**のコンテキストでアプリケーションを開発します。

新しいワークスペースと初期スターターアプリケーションを作成するには、CLIコマンド`ng new`を実行し、ここに示されているように`my-app`という名前を指定してから、含める機能に関するプロンプトに回答します。

<docs-code language="shell">

ng new my-app

</docs-code>

Angular CLIは、必要なAngular npmパッケージとその他の依存関係をインストールします。
これには数分かかる場合があります。

CLIは、新しいワークスペースと、ワークスペースと同じ名前の新しいディレクトリに小さなウェルカムアプリケーションを作成し、すぐに実行できる状態にします。
後続のコマンドがこのワークスペースを使用するように、新しいディレクトリに移動します。

<docs-code language="shell">

cd my-app

</docs-code>

## アプリケーションを実行する {#run-the-application}

Angular CLIには開発サーバーが含まれており、アプリケーションをローカルでビルドして提供できます。次のコマンドを実行してください。

<docs-code language="shell">

ng serve --open

</docs-code>

`ng serve`コマンドはサーバーを起動し、ファイルを監視し、それらのファイルに変更を加えるとアプリケーションを再ビルドしてブラウザをリロードします。

`--open`（または単に`-o`）オプションは、ブラウザを`http://localhost:4200/`に自動的に開き、生成されたアプリケーションを表示します。

## ワークスペースとプロジェクトファイル {#workspaces-and-project-files}

[`ng new`](cli/new)コマンドは、[Angularワークスペース](reference/configs/workspace-config)フォルダーを作成し、その中に新しいアプリケーションを生成します。
ワークスペースには、複数のアプリケーションとライブラリを含めることができます。
[`ng new`](cli/new)コマンドによって作成された初期アプリケーションは、ワークスペースのルートディレクトリにあります。
既存のワークスペースで追加のアプリケーションまたはライブラリを生成すると、デフォルトで`projects/`サブフォルダーに配置されます。

新しく生成されたアプリケーションには、ルートコンポーネントとテンプレートのソースファイルが含まれています。
各アプリケーションには、そのコンポーネント、データ、およびアセットを含む`src`フォルダーがあります。

生成されたファイルを直接編集したり、CLIコマンドを使用して追加および変更したりできます。
[`ng generate`](cli/generate)コマンドを使用して、追加のコンポーネント、ディレクティブ、パイプ、サービスなどの新しいファイルを追加します。
[`ng add`](cli/add)や[`ng generate`](cli/generate)のようなコマンドは、アプリケーションやライブラリを作成または操作するため、実行する必要があります
ワークスペース内から。対照的に、`ng new`のようなコマンドは、新しいワークスペースを作成するため、ワークスペースの*外*で実行する必要があります。

## 次のステップ {#next-steps}

* 生成されたワークスペースの[ファイル構造](reference/configs/file-structure)と[設定](reference/configs/workspace-config)についてさらに学びましょう。

* [`ng test`](cli/test)で新しいアプリケーションをテストしましょう。

* コンポーネント、ディレクティブ、パイプなどのボイラープレートを[`ng generate`](cli/generate)で生成しましょう。

* 新しいアプリケーションをデプロイし、[`ng deploy`](cli/deploy)で実際のユーザーが利用できるようにしましょう。

* [`ng e2e`](cli/e2e)でアプリケーションのE2Eテストをセットアップして実行しましょう。
