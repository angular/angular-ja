# Service Workerを始める


このドキュメントでは、[Angular CLI](cli)で作られたプロジェクトでAngular Service Workerのサポートを有効にする方法について説明します。次に、単純な例を使用して、Service Workerが実際に動作していることを示し、ロードと基本的なキャッシングを実演します。

#### 前提条件

[Angular Service Worker イントロダクション](guide/service-worker-intro)への基本的な理解があること


## アプリケーションにService Workerを追加する

プロジェクトでAngular Service Workerを設定するには、CLIコマンド`ng add @angular/pwa`を使用します。
必要なサポートファイルの設定とともに`@angular/service-worker`パッケージを追加することで、Service Workerを使用するようにアプリケーションを設定します。

```sh
ng add @angular/pwa --project *project-name* 
```

上記のコマンドを実行すると、次の操作が完了します。

1. `@angular/service-worker`パッケージをプロジェクトに追加します。
2. CLIでService Workerのビルドサポートを有効にします。
3. アプリケーションモジュールにService Workerをインポートして登録します。
4. `index.html`ファイルを更新します。
    * `manifest.webmanifest`ファイルを追加するためのリンクを含めます。
    * `theme=color`のメタタグを追加します。
5. インストール可能なプログレッシブウェブアプリケーション（PWA）をサポートするアイコンファイルをインストールします。 
6. [`ngsw-config.json`](/guide/service-worker-config)というService Worker構成ファイルを作成します。このファイルは、キャッシュの動作やその他の設定を指定します。


今度は、プロジェクトをビルドします。

```sh
ng build
```

CLIプロジェクトはAngular Service Workerを使用するように設定されました。


## Service Workerを動かす: ツアー

このセクションでは、サンプルアプリケーションを使用して、Service Workerを実際に動かします。

### `http-server`を供給する

`ng serve`はService Workerと連携しないので、プロジェクトをローカルでテストするためには、別のHTTPサーバーを使用する必要があります。任意のHTTPサーバーを使用できます。次の例では、npmから[http-server](https://www.npmjs.com/package/http-server)パッケージを使用しています。競合する可能性を減らし、古いコンテンツを配信することを避けるために、専用ポートでテストし、キャッシュを無効化してください。

`http-server`でwebファイルを含むディレクトリを配信するために、次のコマンドを実行してください。

```sh
http-server -p 8080 -c-1 dist/<project-name>
```

### 最初の読み込み

サーバーが稼動している状態なら、ブラウザでhttp://localhost:8080/を指定できます。アプリケーションは正常に読み込まれるでしょう。

<div class="alert is-helpful">

**Tip:** Angular Service Workerをテストするときは、ブラウザでシークレットウィンドウまたはプライベートウィンドウを使うことをお勧めします。以前の状態が残存していると、Service Workerが読み取ったときに予期しない動作を引き起こし終了する可能性があるからです。

</div>

<div class="alert is-helpful">

**Note:**
If you are not using HTTPS, the service worker will only be registered when accessing the app on `localhost`.

</div>

### ネットワークの問題をシミュレートする

ネットワークの問題をシミュレートするには、アプリケーションのネットワーク操作を無効にします。

Chromeの場合は次になります。

1. ツールバーの右にあるメニューから**その他のツール** > **デベロッパー ツール**を選びます。
1. **Networkタブ**を選びます。
1. **Throttling**のドロップダウンメニューで**Offline**を選択します。

<div class="lightbox">
  <img src="generated/images/guide/service-worker/offline-option.png" alt="The offline option in the Network tab is selected">
</div>

これで、アプリケーションはネットワークにアクセスできなくなりました。

Angular Service Workerを使用しないアプリケーションの場合、リフレッシュすると「インターネット接続がありません」と記載されたChromeのインターネット切断ページが表示されます。

Angular Service Workerを追加すると、アプリケーションの動作が変更されます。リフレッシュ時に、ページが正常にロードされます。

networkタブを見ると、Service Workerがアクティブであることを確認できます。

<div class="lightbox">
  <!-- textlint-disable prh --><img src="generated/images/guide/service-worker/sw-active.png" alt="Requests are marked as from ServiceWorker"><!-- textlint-enable prh -->
</div>

「サイズ」列の下にある要求状態は、<!-- textlint-disable prh -->`(ServiceWorker)`<!-- textlint-enable prh -->となっていることに注目してください。これは、リソースがネットワークからロードされていないことを意味します。代わりに、Service Workerのキャッシュからロードされています。


### 何がキャッシュされているのか？

ブラウザがこのアプリケーションをレンダリングするために必要なすべてのファイルがキャッシュされていることに注意してください。`ngsw-config.json`のボイラープレート設定は、CLIが使用する特定のリソースをキャッシュするように設定されています。

* `index.html`
* `favicon.ico`
* ビルド成果物（JSおよびCSSバンドル）
* `assets`の下にあるもの
* 設定された`outputPath`（デフォルトでは`./dist/<project-name>/`）または `resourcesOutputPath` の直下にある画像やフォント。これらのオプションの詳細については[`ng build`](cli/build)を参照してください。


<div class="alert is-important">
2つのポイントに注意してください。

1. 生成された `ngsw-config.json`はキャッシュ可能なフォントと画像の拡張子の限られたリストを含みます。場合によっては、ニーズに合わせてglobパターンを変更するでしょう。

1. 設定ファイルの生成後に `resourcesOutputPath`または` assets`パスが変更された場合は、 `ngsw-config.json` の中のパスを手動で変更する必要があります。
</div>


### アプリケーションを変更する

Service Workerがアプリケーションをキャッシュする方法を見てきました。
次のステップは、アップデートの仕組みを理解することです。アプリケーションを変更して、Service Workerが更新プログラムをインストールするのを確認しましょう。

1. シークレットウィンドウでテストする場合は、2つ目のタブを空白で開きます。これにより、テスト中にシークレットとキャッシュの状態が維持されます。

1. アプリケーションタブを閉じますが、ウィンドウは閉じません。これにより、開発者ツールも閉じる必要があります。

1. `http-server`をシャットダウンします。

1. 編集するために`src/app/app.component.html`を開きます。

1. `Welcome to {{title}}!`のテキストを`Bienvenue à {{title}}!`に変えます。

1. もう一度ビルドしてサーバーを起動します。

```sh
ng build
http-server -p 8080 -c-1 dist/<project-name>
```

### ブラウザでアプリケーションを更新する

ブラウザとService Workerが、更新されたアプリケーションをどのように処理するかを見てみましょう。

1. 同じウィンドウでもう一度[http://localhost:8080](http://localhost:8080)を開きます。何が起こりましたか?

<div class="lightbox">
  <img src="generated/images/guide/service-worker/welcome-msg-en.png" alt="It still says Welcome to Service Workers!">
</div>

何が駄目だったのでしょうか？実際には何も悪いことは起こっていません。Angular Service Workerは、利用可能なアップデートがあるにもかかわらず、**インストールされている**アプリケーションのバージョンを提供しています。速度の観点から、Service Workerは、キャッシュされたアプリケーションを提供する前に、更新の確認を待つことはありません。

`http-server`ログを見ると、`/ngsw.json`を要求しているService Workerを見ることができます。これは、Service Workerが更新をチェックする方法です。

2. ページを再読み込みします。

<div class="lightbox">
  <img src="generated/images/guide/service-worker/welcome-msg-fr.png" alt="The text has changed to say Bienvenue à app!">
</div>

Service Workerは、あなたのアプリケーションの更新版を*バックグラウンドで*インストールし、次にページを読み込んだりリロードしたりすると、Service Workerは最新のバージョンに切り替わります。

## もっとAngular Service Workerを知りたい

次の記事がお勧めです。
* [App Shell](guide/app-shell)
* [Service Workerと通信する](guide/service-worker-communications)
