# 試してみよう: デプロイ


アプリケーションをデプロイするには、それをコンパイルしてから、JavaScript、CSS、およびHTMLをWebサーバー上でホストする必要があります。 ビルドされたAngularアプリケーションは非常に移植性が高く、あらゆる環境で動作したり、Node、Java、.NET、PHP、その他多くのテクノロジーによって提供されます。

<div class="alert is-helpful">

[パート1](start "Try it: A basic app")から直接ここに来ても、[アプリ内ナビゲーション](start/start-routing "Try it: In-app navigation")、[データの管理](start/start-data "Try it: Manage data")、および[ユーザー入力用のフォーム](start/start-forms "Try it: Forms for user input")セクションを通してオンラインストアアプリケーションを完成させても、あなたはこのセクションの指示にしたがってデプロイできるアプリケーションをもっています。

</div>



## アプリケーションを共有する

StackBlitzプロジェクトはデフォルトで公開されているため、プロジェクトのURLを介してAngularアプリを共有できます。 これはアイデアやプロトタイプを共有するのに最適な方法ですが、プロダクションホスティングを目的としたものではありません。

1. StackBlitzプロジェクトで、プロジェクトをフォークまたは保存したことを確認してください。
1. プレビューウィンドウに、 `https://<Project ID>.stackblitz.io` のようなURLが表示されるはずです。
1. このURLを友人や同僚と共有してください。
1. あなたのURLにアクセスしたユーザーは開発サーバーが起動し、その後あなたのアプリケーションがロードされるのを見るでしょう。

## ローカルでビルドする

アプリケーションをローカルまたは本番用にビルドするには、StackBlitzプロジェクトからソースコードをダウンロードする必要があります。 ファイルをダウンロードするには、プロジェクトの横にある左メニューの `Download Project` アイコンをクリックします。

ソースコードをダウンロードして解凍したら、`Node.js`をインストールしてAngular CLIをインストールします。

ターミナルから、Angular CLIをグローバルにインストールします:

```sh
npm install -g @angular/cli
```

これにより、システムに `ng` コマンドがインストールされます。 これは、新しいワークスペース、新しいプロジェクトの作成、開発中のアプリケーションの提供、または共有や配布が可能なビルドの作成に使用するコマンドです。

[`ng new`](cli/new "CLI ng new command reference") コマンドを使用して新しいAngular CLIワークスペースを作成します:

```sh
ng new my-project-name
```

そこから、 `/src` フォルダを `StackBlitz` からダウンロードしたもので置き換え、次にビルドを実行してください。

```sh
ng build --prod
```

これにより、デプロイする必要があるファイルが生成されます。

<div class="alert is-helpful">

上記の `ng build`コマンドがパッケージの欠落についてエラーを投げる場合は、ローカルプロジェクトの` package.json`ファイルに欠落している依存関係を追加して、ダウンロードしたStackBlitzプロジェクトの依存関係と一致させましょう。

</div>

#### ビルドしたプロジェクトをホストする

`dist/my-project-name` フォルダ内のファイルは静的であり、ファイルを提供できる任意のWebサーバー（`Node.js`、Java、.NET）または任意のバックエンド（Firebase、Google Cloud、App Engine、その他）でホストできます。

### FirebaseでAngularアプリをホストする

あなたのサイトを動かすもっとも簡単な方法のひとつはFirebaseを使ってホストすることです。

1. [Firebase](https://firebase.google.com/ "Firebase web site") で firebaseアカウントにサインアップしてください。
1. 新しいプロジェクトを作成し、好きな名前を付けます。
1. `ng add @angular/fire`を使用して、デプロイメントを処理する`@angular/fire` schematicsを追加します。
1. CLIをFirebaseアカウントに接続し、 `firebase login` および `firebase init` を使用してプロジェクトへの接続を初期化します。
1. プロンプトにしたがってホスティング用に作成した `Firebase` プロジェクトを選択します。
  - 最初のプロンプトで`Hosting`オプションを選択します。
  - 先ほどFirebaseで作ったプロジェクトを選択します。
  - 公開ディレクトリとして `dist/my-project-name` を選択します。
1. `ng deploy`でアプリケーションをデプロイします。
1. デプロイが完了したら、 https://your-firebase-project-name.firebaseapp.com にアクセスして動かしてみましょう。

### 別のホストでAngularアプリをホストする

Angularアプリを別のWebホストでホストするには、ファイルをアップロードするかホストに送信する必要があります。
シングルページアプリケーションを構築しているため、無効なURLを `index.html` ファイルにリダイレクトする必要があります。
アプリケーションの開発と配布の詳細については、 [ビルドとサーブ](guide/build "Building and Serving Angular Apps") と [デプロイ](guide/deployment "Deployment guide") のガイドを参照してください。

## Angularコミュニティに参加する

あなたはもうAngularの開発者です！ [この瞬間を共有](https://twitter.com/intent/tweet?url=https://angular.jp/start&text=Angularの入門チュートリアルを終了しました！ "Angular on Twitter") し、この入門についての考えをお聞かせください。 または、 [今後のエディションについての提案](https://github.com/angular/angular/issues/new/choose "Angular GitHub repository new issue form")を送信してください。

Angularはさらに多くの機能を提供します。 そして、あなたは今、アプリケーションを構築し、それらの他の機能を探求することを可能にする基盤を持っています:

* Angularは、モバイルアプリ、アニメーション、国際化、サーバーサイドレンダリングなどの高度な機能を提供します。
* [Angular Material](https://material.angular.io/ "Angular Material web site") は、Material Designコンポーネントの広範なライブラリを提供しています。
* [Angular Protractor](https://protractor.angular.io/ "Angular Protractor web site") はAngularアプリのエンドツーエンドのテストフレームワークを提供します。
* Angularには、広範な[サードパーティ製のツールやライブラリのネットワーク](resources "Angular resources list") もあります。

[Angularのブログ](https://blog.angular.io/ "Angular blog") をフォローして最新の情報を入手してください。
