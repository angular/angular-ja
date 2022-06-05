# アプリケーションのデプロイ

アプリケーションのデプロイとは、コードをコンパイルしたり、ビルドしたりして、JavaScript、CSS、HTML をウェブサーバー上でホスティングするプロセスです。

このセクションでは、[入門](start "Try it: A basic application") チュートリアルの前のステップをもとに、アプリケーションをデプロイする方法を説明します。

## 前提条件

ベストプラクティスは、デプロイする前にプロジェクトをローカルで実行することです。プロジェクトをローカルで実行するには、次のものがコンピュータにインストールされている必要があります。

*   [Node.js](https://nodejs.org/en/)。
*   [Angular CLI](https://cli.angular.io/)。
    ターミナルから、Angular CLIをグローバルにインストールします。

    <code-example format="shell" language="shell">

    npm install -g &commat;angular/cli

    </code-example>

    Angular CLIでは、`ng`コマンドを使って新しいワークスペースや新しいプロジェクトを作成したり、開発中のアプリケーションにサービスを提供したり、ビルドを作成して共有したり配布したりすることができます。

## アプリケーションをローカルで実行する

1.  左メニューの `Project` の横にある `Download Project` アイコンをクリックして、StackBlitz プロジェクトのソースコードをZIP形式でダウンロードできます。

    <div class="lightbox">

    <img alt="Download the stackblitz project" src="generated/images/guide/start/download-project.png">

    </div>

1.  アーカイブを解凍し、新しく作成したプロジェクトにディレクトリを変更します。たとえば

    <code-example format="shell" language="shell">

    cd angular-ynqttp

    </code-example>

1.  npmパッケージのダウンロードとインストールは、次のnpm CLIコマンドを使用します。

    <code-example format="shell" language="shell">

    npm install

    </code-example>

1.  次のCLIコマンドを使ってアプリケーションをローカルで実行します。

    <code-example format="shell" language="shell">

    ng serve

    </code-example>

1.  ブラウザでアプリケーションを確認するには、http://localhost:4200/ にアクセスします。
    デフォルトの4200番ポートが利用できない場合は、次の例のようにポートフラグを指定して別のポートを指定することができます。

    <code-example format="shell" language="shell">

    ng serve --port 4201

    </code-example>

    アプリケーションをサーブしている間に、コードを編集したり、変更がブラウザで自動的に更新されるのを見ることができます。
    `ng serve` コマンドを停止するには、`Ctrl`+`c` を押してください。

<a id="building"></a>

## アプリケーションのビルドとホスティング

1.  本番用にアプリケーションをビルドするには、`build` コマンドを使います。By default, this command uses the `production` build configuration.

    <code-example format="shell" language="shell">

    ng build

    </code-example>

    このコマンドはアプリケーションのルートディレクトリに `dist` フォルダを作成し、ホスティングサービスがアプリケーションにサービスを提供するために必要なすべてのファイルを格納します。

    <div class="alert is-helpful">

    上記の `ng build` コマンドでパッケージが見つからないというエラーが出た場合は、ローカルプロジェクトの `package.json` ファイルに見つからない依存関係を追加して、ダウンロードした StackBlitz プロジェクトの依存関係と一致させてください。

    </div> </div

1.  `dist/my-project-name` フォルダの内容をウェブサーバーにコピーします。
    これらのファイルは静的なものなので、`Node.js`、Java、.NET、または [Firebase](https://firebase.google.com/docs/hosting)、[Google Cloud](https://cloud.google.com/solutions/web-hosting)、[App Engine](https://cloud.google.com/appengine/docs/standard/python/getting-started/hosting-a-static-website) などのバックエンドなど、ファイルを提供できるウェブサーバーであれば、どのような場所でもホストすることができます。
    詳細については、 [ビルドとサーブ](guide/build "「Angular Appsのビルドとサーブ」")、[デプロイ](guide/deployment "Deployment guide")を参照してください。

## 次は何をするの？

このチュートリアルでは、モバイル開発、UX/UI開発、サーバーサイドレンダリングなどの分野でAngularの世界を探求するための基礎を築きました。
Angularの機能をより深く学び、活気あるコミュニティに参加し、堅牢なエコシステムを探索することで、より深く理解を深めることができます。

### Angularをもっと学ぶ

ローカルでアプリケーションを構築し、Angularの人気のある機能の多くを探求する、より詳細なチュートリアルについては、[Tour of Heroes](tutorial)を参照してください。

Angularの基本的な概念については、[Angularコンポーネントの概要](guide/component-overview)や[テンプレート構文](guide/template-syntax)などの、「Angularを理解する」セクションのガイドを参照してください。

### コミュニティに参加する

このチュートリアルを終えたことを[ツイート](https://twitter.com/intent/tweet?url=https://angular.jp/start&text=Angularの入門チュートリアルを終了しました！ "Angular on Twitter")したり、感想を伝えたり、[今後のバージョンへの提案](https://github.com/angular/angular/issues/new/choose "Angular GitHub リポジトリ新規発行フォーム")を投稿したりしてください。

また、[Angularブログ](https://blog.angular.io/ "Angular blog")をフォローして最新情報を入手してください。

### Angularのエコシステムを探る

UX/UI開発をサポートするには、[Angular Material](https://material.angular.io/ "Angular Material web site")を参照してください。

また、Angularコミュニティには広範な[サードパーティのツールやライブラリのネットワーク](resources "「Angularリソースリスト」")があります。

@reviewed 2021-09-15
