# ローカル環境とワークスペースのセットアップ


このガイドでは、[Angular CLI ツール](cli 'CLI command reference')を使用して Angular 開発用に環境を設定する方法について説明します。
前提条件、CLI のインストール、初期ワークスペースとスターターアプリの作成、セットアップを確認するためのそのアプリのローカルでの実行に関する情報が含まれています。


<div class="callout is-helpful">
<header>ローカルセットアップなしでAngularを試す</header>

Angular をはじめて使用する場合は、[入門](start)から始めるのがよいかもしれません。入門では変更可能な既成のオンラインストアアプリを構築するなかで、Angularの基本事項をすぐに習得できます。 [StackBlitz](https://stackblitz.com/)オンライン開発環境を活用しているので、準備が整うまでローカル環境をセットアップする必要はありません。

</div>


{@a devenv}
{@a prerequisites}
## 前提条件

Angularフレームワークを使用するには、次の知識が必要です。

* [JavaScript](https://developer.mozilla.org/ja/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
* [HTML](https://developer.mozilla.org/ja/docs/Learn/HTML/Introduction_to_HTML)
* [CSS](https://developer.mozilla.org/ja/docs/Learn/CSS/First_steps)

[TypeScript](https://www.typescriptlang.org/)についての知識は役立ちますが、必須ではありません。

To install Angular on your local system, you need the following:

{@a nodejs}

* **Node.js**

  Angular は `Node.js` の[現行またはアクティブLTS、メンテナンスLTS](https://nodejs.org/about/releases/) バージョンを必要とします。

  <div class="alert is-helpful">

  For information about specific version requirements, see the `engines` key in the [package.json](https://unpkg.com/@angular/cli/package.json) file.

  </div>

  For more information on installing Node.js, see [nodejs.org](http://nodejs.org "Nodejs.org").
  If you are unsure what version of Node.js runs on your system, run `node -v` in a terminal window.

{@a npm}

* **npm package manager**

  Angular, the Angular CLI, and Angular applications depend on [npm packages](https://docs.npmjs.com/getting-started/what-is-npm) for many features and functions.
  To download and install npm packages, you need an npm package manager.
  This guide uses the [npm client](https://docs.npmjs.com/cli/install) command line interface, which is installed with `Node.js` by default.
  To check that you have the npm client installed, run `npm -v` in a terminal window.


{@a install-cli}

## Angular CLIをインストールする

You use the Angular CLI to create projects, generate application and library code, and perform a variety of ongoing development tasks such as testing, bundling, and deployment.

To install the Angular CLI, open a terminal window and run the following command:

<code-example language="sh" class="code-shell">
  npm install -g @angular/cli
</code-example>

{@a create-proj}

## ワークスペースと初期アプリケーションを作成する

Angular [**ワークスペース**](guide/glossary#workspace)のコンテキストでアプリを開発します。

新しいワークスペースと初期スターターアプリを作成するには:

1. 次に示すように、CLIコマンド `ng new` を実行し、`my-app` という名前を付けます。

    <code-example language="sh" class="code-shell">
      ng new my-app

    </code-example>

2. `ng new` コマンドを使用すると、最初のアプリに含める機能に関する情報を入力するよう求められます。 EnterキーまたはReturnキーを押してデフォルトを受け入れます。

Angular CLIは、必要なAngular npmパッケージとその他の依存関係をインストールします。これには数分かかることがあります。 

CLIによって、新しいワークスペースと簡単なWelcomeアプリケーションが作成され、すぐに実行できます。

<div class="alert is-helpful">

You also have the option to use Angular's strict mode, which can help you write better, more maintainable code.
For more information, see [Strict mode](/guide/strict-mode).

</div>

{@a serve}

## アプリケーションを実行する

Angular CLIにはサーバーが含まれているため、アプリをローカルでビルドしてサーブできます。

1. ワークスペースフォルダ（`my-app`）に行きます。 

1. 次のコマンドを実行します。

<code-example language="sh" class="code-shell">
  cd my-app
  ng serve --open
</code-example>

`ng serve` コマンドは、サーバーを起動し、ファイルを監視し、
それらのファイルを変更したときにアプリを再ビルドします。

 `--open`（または単に `-o`）オプションは、ブラウザを自動的に
`http://localhost:4200/` に開きます。 
 
 If your installation and setup was successful, you should see a page similar to the following.


<div class="lightbox">
  <img src='generated/images/guide/setup-local/app-works.png' alt="Welcome to my-app!">
</div>


## 次のステップ


* Angularシングルページアプリのアーキテクチャと設計原則の基本的な概念と用語のより完全な紹介については、[Angularの概念](guide/architecture)セクションをお読みください。

* Angular CLIを使用したアプリ開発プロセスを紹介し、重要なサブシステムをウォークスルーする完全な実践演習である[Tour of Heroes チュートリアル](tutorial)を実行します。

* Angular CLIの使用方法の詳細については、[CLIの概要](cli 'CLI Overview')を参照してください。初期ワークスペースとアプリの雛形を作成するだけでなく、CLIを使用してコンポーネントやサービスなどのAngularコードを生成できます。 CLIは、ビルド、テスト、バンドリング、およびデプロイを含む開発サイクル全体をサポートします。

- `ng new` によって生成されたAngularファイルの詳細については、[ワークスペースとプロジェクトのファイル構造](guide/file-structure)を参照してください。
