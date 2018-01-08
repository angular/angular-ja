# Service Workerを始める

#### 前提条件

次の基本的理解があること
* [Angular Service Worker イントロダクション](guide/service-worker-intro)

<hr />


Angular 5.0.0から、どのCLIプロジェクトでもAngular Service Workerのサポートを簡単に有効にすることができます。このドキュメントでは、新規および既存のプロジェクトでAngular Service Workerのサポートを有効にする方法について説明します。次に、単純な例を使用して、Service Workerが実際に動作していることを確認し、読み込みとキャッシングの基本を実演します。

## 新しいアプリケーションにService Workerを追加する

新しくCLIプロジェクトを作る場合は、CLIを使用して、プロジェクト作成の一環としてAngular Service Workerを設定できます。これを行うには、`--service-worker`フラグを`ng new`コマンドに追加します。

```sh
ng new my-project --service-worker 
```

`--service-worker`フラグにより、`service-worker`パッケージを追加して、Service Workerを使うために必要なファイルをアプリケーションに設定します。詳細については、次のセクションを参照してください。Service Workerを既存のアプリに手動で追加するために、プロセスを詳しく説明しています。



## 既存のアプリケーションにService Workerを追加する

既存のアプリケーションにService Workerを追加するためには、次のステップになります。

1. Service Workerのパッケージを追加します。
2. CLIでService Workerのビルドサポートを有効にします。
3. Service Workerをインポートして登録します。
4. キャッシュの振る舞いなどの設定を指定するService Workerの設定ファイルを作成します。
5. プロジェクトをビルドします。

### ステップ1: Service Workerのパッケージを追加します

次のように、yarnを使用して、`@angular/service-worker`パッケージを追加してください。

```sh
yarn add @angular/service-worker
```

### ステップ2: CLIでService Workerのビルドサポートを有効にします

Angular Service Workerを有効にするために、CLIはビルド時にAngular Service Workerマニフェストを生成する必要があります。CLIが既存のプロジェクトでマニフェストを生成するようにするためには、プロジェクトの`.angular-cli.json`ファイルで`serviceWorker`フラグを`true`に設定します。

```sh
ng set apps.0.serviceWorker=true
```

### ステップ3: Service Workerをインポートして登録します

Angular Service Workerをインポートして登録するために

ルートモジュール`src/app/app.module.ts`のトップで、`ServiceWorkerModule`と`environment`をインポートしてください。

<code-example path="service-worker-getting-started/src/app/app.module.ts" linenums="false" title="src/app/app.module.ts" region="sw-import"> </code-example>


`ServiceWorkerModule`を`@NgModule`の`imports`配列に追加してください。プロダクションモードで実行していないときに、Service Workerを無効にするように登録するためには、`register()`ヘルパーを使用してください。

<code-example path="service-worker-getting-started/src/app/app.module.ts" linenums="false" title="src/app/app.module.ts" region="sw-module"> </code-example>

`ngsw-worker.js`ファイルは、あなたのサーバーに一緒にデプロイするためにCLIが`dist/`にコピーする、事前構築されたService Workerのスクリプトの名前です。

### ステップ4: 設定ファイル`ngsw-config.json`を作成します

Angular CLIには、`ngsw-config.json`というService Workerの設定ファイルが必要です。設定ファイルは、Service Workerがファイルおよびデータリソースをどのようにキャッシュするかを制御します。

CLIによるひな形を使って始めることができます。このひな形では、多くのアプリケーションで適切であろう推奨設定が行われています。

代わりに、以下を`src/ngsw-config.json`として保存してください。

<code-example path="service-worker-getting-started/src/ngsw-config.json" linenums="false" title="src/ngsw-config.json"> </code-example>

### ステップ5: プロジェクトをビルドします

最後にプロジェクトをビルドします。

```sh
ng build --prod
```

CLIプロジェクトはAngular Service Workerを使用するように設定されました。


## Service Workerを動かす: ツアー

このセクションでは、サンプルアプリケーションを使用して、Service Workerを実際に動かします。

### `http-server`を供給する

`ng serve`はService Workerと連携しないので、プロジェクトをローカルでテストするためには、別のHTTPサーバーを使用する必要があります。任意のHTTPサーバーを使用できます。次の例では、npmから[http-server](https://www.npmjs.com/package/http-server)パッケージを使用しています。競合する可能性を減らすために、専用ポートでテストしてください。

`http-server`で供給するために、Webファイルが入っているディレクトリに移動し、Webサーバーを起動してください。

```sh
cd dist
http-server -p 8080
```

### 最初の読み込み

サーバーが稼動している状態なら、ブラウザーでhttp://localhost:8080/を指定できます。アプリケーションは正常に読み込まれるでしょう。

**Tip:** Angular Service Workerをテストするときは、ブラウザでシークレットウィンドウまたはプライベートウィンドウを使うことをお勧めします。以前の状態が残存していると、Service Workerが読み取ったときに予期しない動作を引き起こし終了する可能性があるからです。

### ネットワークの問題をシミュレートする

ネットワークの問題をシミュレートするには、アプリケーションのネットワーク操作を無効にします。Chromeの場合は次になります。

1. ツールバーの右にあるメニューから**その他のツール** > **デベロッパー ツール**を選びます。
2. **Networkタブ**を選びます。
3. **Offlineボックス**をチェックしてください。

<figure>
  <img src="generated/images/guide/service-worker/offline-checkbox.png" alt="The offline checkbox in the Network tab is checked">
</figure>

これで、アプリケーションはネットワークにアクセスできなくなりました。

Angular Service Workerを使用しないアプリケーションの場合、リフレッシュすると「インターネット接続がありません」と記載されたChromeのインターネット切断ページが表示されます。

Angular Service Workerを追加すると、アプリケーションの動作が変更されます。リフレッシュ時に、ページが正常にロードされます。

networkタブを見ると、Service Workerがアクティブであることを確認できます。

<figure>
  <!-- textlint-disable prh -->
  <img src="generated/images/guide/service-worker/sw-active.png" alt="Requests are marked as from ServiceWorker">
  <!-- textlint-enable prh -->
</figure>

「サイズ」列の下にある要求状態は、<!-- textlint-disable prh -->(from ServiceWorker)<!-- textlint-enable prh -->となっていることに注目してください。これは、リソースがネットワークからロードされていないことを意味します。代わりに、Service Workerのキャッシュからロードされています。


### 何がキャッシュされているのか？

ブラウザがこのアプリケーションをレンダリングするために必要なすべてのファイルがキャッシュされていることに注意してください。`ngsw-config.json`のボイラープレート設定は、CLIが使用する特定のリソースをキャッシュするように設定されています。

* `index.html`
* `favicon.ico`
* ビルド成果物（JSおよびCSSバンドル）
* `assets`の下にあるもの

### アプリケーションを変更する

Service Workerがアプリケーションをキャッシュする方法を見てきました。
次のステップは、アップデートの仕組みを理解することです。

1. シークレットウィンドウでテストする場合は、2つ目のタブを空白で開きます。これにより、テスト中にシークレットとキャッシュの状態が維持されます。

2. アプリケーションタブを閉じますが、ウィンドウは閉じません。これにより、開発者ツールも閉じる必要があります。

3. `http-server`をシャットダウンします。

4. 次に、アプリケーションを変更して、Service Workerが更新プログラムをインストールするのを確認します。

5. 編集するために`src/app/app.component.html`を開きます。

6. `Welcome to {{title}}!`のテキストを`Bienvenue à {{title}}!`に変えます。

7. もう一度ビルドしてサーバーを起動します。

```sh
ng build --prod
cd dist
http-server -p 8080
```

### ブラウザでアプリケーションを更新する

ブラウザとService Workerが、更新されたアプリケーションをどのように処理するかを見てみましょう。

1. 同じウィンドウでもう一度http://localhost:8080を開きます。何が起こりましたか?

<figure>
  <img src="generated/images/guide/service-worker/welcome-msg-en.png" alt="It still says Welcome to Service Workers!">
</figure>

何が駄目だったのでしょうか？実際には何も悪いことは起こっていません。Angular Service Workerは、利用可能なアップデートがあるにもかかわらず、**インストールされている**アプリケーションのバージョンを提供しています。速度の観点から、Service Workerは、キャッシュされたアプリケーションを提供する前に、更新の確認を待つことはありません。

`http-server`ログを見ると、`/ngsw.json`を要求しているService Workerを見ることができます。これは、Service Workerが更新をチェックする方法です。

2. ページを再読み込みします。

<figure>
  <img src="generated/images/guide/service-worker/welcome-msg-fr.png" alt="The text has changed to say Bienvenue à app!">
</figure>

Service Workerは、あなたのアプリケーションの更新版を*バックグラウンドで*インストールし、次にページを読み込んだりリロードしたりすると、Service Workerは最新のバージョンに切り替わります。

<hr />

## もっとAngular Service Workerを知りたい

次の記事がお勧めです。
* [Service Workerと通信する](guide/service-worker-communications)
