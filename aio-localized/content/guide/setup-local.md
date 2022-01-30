# ローカル環境とワークスペースのセットアップ

このガイドでは、[Angular CLI ツール](cli 'CLI command reference')を使用して Angular 開発用に環境を設定する方法について説明します。
前提条件、CLI のインストール、初期ワークスペースとスターターアプリケーションの作成、セットアップを確認するためのそのアプリケーションのローカルでの実行に関する情報が含まれています。

<div class="callout is-helpful">
<header>ローカルセットアップなしでAngularを試す</header>

Angular をはじめて使用する場合は、[入門](start)から始めるのがよいかもしれません。入門では変更可能な既成のオンラインストアアプリケーションを構築するなかで、Angular の基本事項をすぐに習得できます。 [StackBlitz](https://stackblitz.com/)オンライン開発環境を活用しているので、準備が整うまでローカル環境をセットアップする必要はありません。

</div>

{@a devenv}
{@a prerequisites}

## 前提条件

Angular フレームワークを使用するには、次の知識が必要です。

- [JavaScript](https://developer.mozilla.org/ja/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
- [HTML](https://developer.mozilla.org/ja/docs/Learn/HTML/Introduction_to_HTML)
- [CSS](https://developer.mozilla.org/ja/docs/Learn/CSS/First_steps)

[TypeScript](https://www.typescriptlang.org/)についての知識は役立ちますが、必須ではありません。

ローカルシステムに Angular をインストールするには、次のものが必要です:

{@a nodejs}

- **Node.js**

  Angular は `Node.js` の[アクティブ LTS、メンテナンス LTS](https://nodejs.org/about/releases/) バージョンを必要とします。

  <div class="alert is-helpful">

  特定バージョンの要件については、[package.json](https://unpkg.com/browse/@angular/core/package.json)ファイルの`engines`キーを参照してください。

  </div>

  Node.js のインストールの詳細については、[nodejs.org](https://nodejs.org 'Nodejs.org')を参照してください。
  システムで実行の Node.js のバージョンがわからない場合は、ターミナルウィンドウで`node -v`を実行しましょう。

{@a npm}

- **npm パッケージマネージャー**

  Angular と Angular CLI、Angular アプリケーションは、多くの機能と関数を[npm パッケージ](https://docs.npmjs.com/getting-started/what-is-npm)に依存しています。
  npm パッケージをダウンロードしてインストールするには、npm パッケージマネージャーが必要です。
  このガイドでは、[npm クライアント](https://docs.npmjs.com/cli/install)のコマンドラインインターフェースを使用します。これはデフォルトで`Node.js`とともにインストールされます。
  npm クライアントがインストールされていることを確認するには、ターミナルウィンドウで`npm -v`を実行します。

{@a install-cli}

## Angular CLI をインストールする {@a install-the-angular-cli}

Angular CLI を使用して、プロジェクトを作成し、アプリケーションとライブラリコードを生成し、テストやバンドル、デプロイなどのさまざまな進行中の開発タスクを実行します。

Angular CLI をインストールするには、ターミナルウィンドウを開き、次のコマンドを実行します:

<code-example language="sh">
  npm install -g @angular/cli<aio-angular-dist-tag class="pln"></aio-angular-dist-tag>
</code-example>

{@a create-proj}

## ワークスペースと初期アプリケーションを作成する {@a create-a-workspace-and-initial-application}

Angular [**ワークスペース**](guide/glossary#workspace)のコンテキストでアプリケーションを開発します。

新しいワークスペースと初期スターターアプリケーションを作成するには:

1. 次に示すように、CLI コマンド `ng new` を実行し、`my-app` という名前を付けます。

   <code-example language="sh">
     ng new my-app

   </code-example>

2. `ng new` コマンドを使用すると、最初のアプリケーションに含める機能に関する情報を入力するよう求められます。 Enter キーまたは Return キーを押してデフォルトを受け入れます。

Angular CLI は、必要な Angular npm パッケージとその他の依存関係をインストールします。これには数分かかることがあります。

CLI によって、新しいワークスペースと簡単な Welcome アプリケーションが作成され、すぐに実行できます。

{@a serve}

## アプリケーションを実行する

Angular CLI にはサーバーが含まれているため、アプリケーションをローカルでビルドしてサーブできます。

1. ワークスペースフォルダ（`my-app`）に行きます。

1. 次のコマンドを実行します。

<code-example language="sh">
  cd my-app
  ng serve --open
</code-example>

`ng serve` コマンドは、サーバーを起動し、ファイルを監視し、
それらのファイルを変更したときにアプリケーションを再ビルドします。

`--open`（または単に `-o`）オプションは、ブラウザを自動的に
`http://localhost:4200/` に開きます。

インストールとセットアップが成功すると、次のようなページが表示されます。

<div class="lightbox">
  <img src='generated/images/guide/setup-local/app-works.png' alt="Welcome to my-app!">
</div>

## 次のステップ

- Angular シングルページアプリケーションのアーキテクチャと設計原則の基本的な概念と用語のより完全な紹介については、[Angular の概念](guide/architecture)セクションをお読みください。

- Angular CLI を使用したアプリケーション開発プロセスを紹介し、重要なサブシステムをウォークスルーする完全な実践演習である[Tour of Heroes チュートリアル](tutorial)を実行します。

- Angular CLI の使用方法の詳細については、[CLI の概要](cli 'CLI Overview')を参照してください。初期ワークスペースとアプリケーションの雛形を作成するだけでなく、CLI を使用してコンポーネントやサービスなどの Angular コードを生成できます。 CLI は、ビルド、テスト、バンドリング、およびデプロイを含む開発サイクル全体をサポートします。

* `ng new` によって生成された Angular ファイルの詳細については、[ワークスペースとプロジェクトのファイル構造](guide/file-structure)を参照してください。

@reviewed 2021-09-15
