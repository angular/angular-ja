# ローカル環境とワークスペースのセットアップ


このガイドでは、[Angular CLI ツール](cli 'CLI command reference')を使用して Angular 開発用に環境を設定する方法について説明します。
前提条件、CLI のインストール、初期ワークスペースとスターターアプリの作成、セットアップを確認するためのそのアプリのローカルでの実行に関する情報が含まれています。


<div class="callout is-helpful">
<header>Angularの学習</header>

Angular をはじめて使用する場合は、[入門](start)を参照してください。 入門では基本的なオンラインストアアプリを構築するなかで、Angularの基本事項をすぐに習得できます。 [StackBlitz](https://stackblitz.com/)オンライン開発環境を活用しているので、準備が整うまでローカル環境をセットアップする必要はありません。


</div>


{@a devenv}
{@a prerequisites}
## 前提条件

はじめに、開発環境に`Node.js®`と npm パッケージマネージャーが含まれていることを確認してください。

{@a nodejs}
### Node.js

Angular は `Node.js` の[現行またはアクティブLTS、メンテナンスLTS](https://nodejs.org/about/releases/) バージョンを必要とします。特定のバージョン要求については、 [package.json](https://unpkg.com/@angular/cli/package.json)の `engines`キーを参照してください。

- バージョンを確認するには、ターミナル/コンソールウィンドウで`node -v`を実行してください。

- `Node.js`を取得するには、[nodejs.org](https://nodejs.org 'Nodejs.org')にアクセスしてください。

{@a npm}
### npm パッケージマネージャー

Angular、Angular CLI、および Angular アプリは、[npm パッケージ](https://docs.npmjs.com/getting-started/what-is-npm)として利用可能なライブラリによって提供される機能に依存します。 npm パッケージをダウンロードしてインストールするには、npm パッケージマネージャーが必要です。

このセットアップガイドでは、デフォルトで `Node.js` と共にインストールされる[npmクライアント](https://docs.npmjs.com/cli/install)のコマンドラインインターフェースを使用しています。

npmクライアントがインストールされていることを確認するには、ターミナル/コンソールウィンドウで`npm -v`を実行します。


{@a install-cli}

## ステップ1: Angular CLIをインストールする

Angular CLIを使用して、
プロジェクトの作成、アプリケーションおよびライブラリコードの生成、そしてテスト、バンドル、デプロイなどのさまざまな進行中の開発タスクを実行します。

Angular CLIをグローバルにインストールします。

`npm` を使用してCLIをインストールするには、ターミナル/コンソールウィンドウを開き、次のコマンドを入力します。

<code-example language="sh" class="code-shell">
  npm install -g @angular/cli

</code-example>



{@a create-proj}

## ステップ2: ワークスペースと初期アプリケーションを作成する

Angular [**ワークスペース**](guide/glossary#workspace)のコンテキストでアプリを開発します。

新しいワークスペースと初期スターターアプリを作成するには:

1. 次に示すように、CLIコマンド `ng new` を実行し、`my-app` という名前を付けます。

    <code-example language="sh" class="code-shell">
      ng new my-app

    </code-example>

2. `ng new` コマンドを使用すると、最初のアプリに含める機能に関する情報を入力するよう求められます。 EnterキーまたはReturnキーを押してデフォルトを受け入れます。

Angular CLIは、必要なAngular npmパッケージとその他の依存関係をインストールします。これには数分かかることがあります。 

CLIによって、新しいワークスペースと簡単なWelcomeアプリケーションが作成され、すぐに実行できます。


{@a serve}

## ステップ3: アプリケーションを実行する

Angular CLIにはサーバーが含まれているため、アプリをローカルで簡単にビルドしてサーブできます。

1. ワークスペースフォルダ（`my-app`）に行きます。 

1. CLIコマンド `ng serve` を `--open` オプション付きで使用して、サーバーを起動します。

<code-example language="sh" class="code-shell">
  cd my-app
  ng serve --open
</code-example>

`ng serve` コマンドは、サーバーを起動し、ファイルを監視し、
それらのファイルを変更したときにアプリを再ビルドします。

 `--open`（または単に `-o`）オプションは、ブラウザを自動的に
`http://localhost:4200/` に開きます。 
 
 これが見えるでしょう:


<div class="lightbox">
  <img src='generated/images/guide/setup-local/app-works.png' alt="Welcome to my-app!">
</div>


## 次のステップ


- Angularに慣れていない場合は、[入門](start)チュートリアルを参照してください。 入門では基本的なオンラインストアアプリを構築するなかで、Angularの基本事項をすぐに習得できます。

  <div class="alert is-helpful">

  入門は[StackBlitz](https://stackblitz.com/)のオンライン開発環境を想定しています。
   StackBlitzからローカル環境にアプリをエクスポートする方法については、[デプロイ](start/deployment 'Getting Started: Deployment')のセクションに進んでください。

  </div>


* Angular CLIの使用方法の詳細については、[CLIの概要](cli 'CLI Overview')を参照してください。初期ワークスペースとアプリの雛形を作成するだけでなく、CLIを使用してコンポーネントやサービスなどのAngularコードを生成できます。 CLIは、ビルド、テスト、バンドリング、およびデプロイを含む開発サイクル全体をサポートします。


- `ng new` によって生成されたAngularファイルの詳細については、[ワークスペースとプロジェクトのファイル構造](guide/file-structure)を参照してください。
