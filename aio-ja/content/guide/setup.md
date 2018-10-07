# ローカル開発環境のセットアップ

{@a develop-locally}

<live-example name=quickstart>クイックスタートライブコーディング</live-example> の例はAngularの_遊び場_です。
これは実際のアプリケーションを開発する場ではありません。
あなたは自分のマシン上で[ローカルに開発をするべきです](guide/setup#why-locally "なぜローカルで開発するのか")...そして私たちはそうやってAngularを学ぶべきだと考えています。

あなたのマシン上に新しいプロジェクトをセットアップするのは、[github](https://github.com/angular/quickstart "github上のクイックスタートリポジトリをインストール")で管理されている**クイックスタートシード**を使って素早く、簡単にできます。

[Node.js®とnpm](guide/setup#install-prerequisites "Node.jsとnpmがない場合は?")がインストールされていることが必要です。

{@a clone}


## クローン

次のコマンドを使って、_クローンから起動まで_を実行します。


<code-example language="sh" class="code-shell">
  git clone https://github.com/angular/quickstart.git quickstart
  cd quickstart
  npm install
  npm start

</code-example>



<div class="alert is-important">



Creator's Update (2017年4月) よりも前のバージョンの _Bash for Windows_では`npm start`が失敗します。


</div>



{@a download}


## ダウンロード
<a href="https://github.com/angular/quickstart/archive/master.zip" title="クイックスタートシードリポジトリをダウンロード">クイックスタートシードをダウンロード</a>
し、あなたのプロジェクトフォルダーの中に解凍します。そして残りのステップを次のターミナルコマンドで実行します。


<code-example language="sh" class="code-shell">
  cd quickstart
  npm install
  npm start

</code-example>



<div class="alert is-important">



Creator's Update (2017年4月) よりも前のバージョンの _Bash for Windows_では`npm start`が失敗します。


</div>



{@a non-essential}



## _必要ではない_ファイルの削除 (任意)

テストに関するファイルとクリックスタートのリポジトリ管理のためのファイル(`.git`フォルダと`.gitignore`のような***git関連のアーティファクトを含みます。***)はすぐに削除できます。


<div class="alert is-important">



あなた自身のテストやgitセットアップを誤って削除しないようにセットアップの開始時にだけ行ってください！


</div>



プロジェクトフォルダでターミナルを開いて、次のコマンドを環境に合わせて実行してください。

### OS/X (bash)

<code-example language="sh" class="code-shell">
  xargs rm -rf &lt; non-essential-files.osx.txt
  rm src/app/*.spec*.ts
  rm non-essential-files.osx.txt

</code-example>



### Windows

<code-example language="sh" class="code-shell">
  for /f %i in (non-essential-files.txt) do del %i /F /S /Q
  rd .git /s /q
  rd e2e /s /q

</code-example>



{@a seed}



## クイックスタートのシードには何が入っているでしょうか？



**クイックスタートシード**にはクイックスタートプレイグラウンドと同じアプリケーションが入っています。
しかし、このプロジェクトの真の目的は_ローカル_開発環境の確かな基盤を提供することです。
結果として、マシン上のプロジェクトフォルダには_もっと数多くの_ファイルがあり、
それらのほとんどは[あとで学ぶ](guide/setup-systemjs-anatomy "セットアップの解剖学")ことができます。



{@a app-files}


**`/src`**フォルダ内の次の3つのTypeScript (`.ts`) ファイルに注目しましょう。


<div class='filetree'>

  <div class='file'>
    src
  </div>

  <div class='children'>

    <div class='file'>
      app
    </div>

    <div class='children'>

      <div class='file'>
        app.component.ts
      </div>

      <div class='file'>
        app.module.ts
      </div>

    </div>

    <div class='file'>
      main.ts
    </div>

  </div>

</div>



<code-tabs>

  <code-pane title="src/app/app.component.ts" path="setup/src/app/app.component.ts">

  </code-pane>

  <code-pane title="src/app/app.module.ts" path="setup/src/app/app.module.ts">

  </code-pane>

  <code-pane title="src/main.ts" path="setup/src/main.ts">

  </code-pane>

</code-tabs>



すべてのガイドとクックブックは_少なくともこのコアファイル_を持っています。
個々のファイルは個々の目的があり、アプリケーションが成長するにつれ独立して発達していきます。

`src/`の外側にあるファイルはビルド、デプロイ、そしてテストに関するものです。
それらは設定ファイルや外部の依存です。

`src/`内のファイルはあなたのアプリに属します。
特に指示がない限り、新規のTypeScript, HTML, CSSファイルは`src/`ディレクトリ、ほとんどは`src/app`に追加します。

次のファイルはすべて`src/`内にあります。


<style>
  td, th {vertical-align: top}
</style>



<table width="100%">

  <col width="20%">

  </col>

  <col width="80%">

  </col>

  <tr>

    <th>
      File
    </th>

    <th>
      Purpose
    </th>

  </tr>

  <tr>

    <td>
      <code>app/app.component.ts</code>
    </td>

    <td>


      クイックスタートプレイグラウンドのものと同じ`AppComponent`を定義しています。
      これはアプリが成長するにつれてコンポーネントの入れ子の木のルートコンポーネントになります。
    </td>

  </tr>

  <tr>

    <td>
      <code>app/app.module.ts</code>
    </td>

    <td>


      Angularにどのようにアプリケーションを組み立てるのかを伝える[ルートモジュール](guide/bootstrapping "AppModule: ルートモジュール") `AppModule`を定義します。
      いま時点では、`AppComponent`のみを宣言しています。
      すぐに他のコンポーネントも定義することになります。
    </td>

  </tr>

  <tr>

    <td>
      <code>main.ts</code>
    </td>

    <td>


      アプリケーションをブラウザで実行するために、アプリケーションを[JITコンパイラ](guide/glossary#jit)でコンパイルし、
      メインモジュール(`AppModule`)を[ブートストラップ](guide/bootstrapping)します。
      JITコンパイラはほとんどのプロジェクトの開発期間中には現実的な選択であり、
      Stackblitzのようにサンプルを実行する_ライブコーディング_環境ではただひとつの実行可能な選択です。
      別のコンパイルと[デプロイ](guide/deployment)の選択肢についてはこのドキュメントの後半で学びます。

    </td>

  </tr>

</table>



<div class="alert is-helpful">



### 次のステップ

もしAngularになじみがないのであれば、この[チュートリアル](tutorial "ツアー・オブ・ヒーローズ チュートリアル")に進むことをお勧めします。


</div>

<br></br><br></br>

{@a install-prerequisites}



## 付録: Node.jsとnpm


[Node.js](https://nodejs.org/ja/)と[npm](https://www.npmjs.com/)パッケージマネージャはAngularと他のプラットフォームを使ってモダンなWeb開発をするにあたり不可欠なものです。
Node.jsはクライアント開発とビルドツールを供給します。
_npm_ パッケージマネージャーは、それ自身が _Node.js_ アプリケーションであり、JavaScriptのライブラリをインストールします。

もしまだマシン上にインストールされていない場合は<a href="https://docs.npmjs.com/getting-started/installing-node" target="_blank" title="Node.jsをインストール、npmをアップデートしましょう">
いますぐ手に入れましょう。</a>

ターミナル/コンソール上で`node -v`と`npm -v`を実行して、
**Node.js `v8.x` 以上とnpm `5.x`以上で実行していることを確認してください。**
古いバージョンではエラーになります。

我々はNode.jsとnpmの複数バージョンを管理するために[nvm](https://github.com/creationix/nvm)を使用することを推奨しています。
もしあなたのマシン上で古いバージョンのNode.jsとnpmで動作するプロジェクトがある場合には[nvm](https://github.com/creationix/nvm)が必要になるでしょう。


{@a why-locally}



## 付録: なぜローカルで開発するのか

ブラウザ上での<live-example title="QuickStart Seed in Stackblitz">ライブコーディング</live-example>はAngularを探るのにとてもよいです。

ほぼすべてのドキュメントページ上のリンクが完成されたサンプルをブラウザに表示します。
サンプルコードで遊ぶこともできますし、改修したものを友達とシェアできますし、ダウンロードしてマシン上で実行することもできます。

[入門](guide/quickstart "Angularクイックスタートプレイグラウンド")は`AppComponent`ファイルしか示しません。
それは_プレイグラウンドだけのために_`app.module.ts`と`main.ts`に等しいものを作ります。
なので、読み手は注意散漫にならずにAngularについて知ることができます。
他のサンプルはクイックスタートのシードにもとづいています。

これほど楽しいですが...

* アプリケーションをStackblitzにはデプロイできません
* コードを書くとき常にオンラインとは限りません
* TypeScriptをブラウザでトランスパイルするのは遅いです
* 型サポート、リファクタリング、コード補完はローカルのIDEでのみ機能します

<live-example title="QuickStart Seed in Stackblitz">ライブコーディング</live-example>環境は遊び場として使ってください。
ドキュメントのサンプルを試したり、あなた自身で実験するために使ってください。
また
<a href="https://github.com/angular/angular/issues/new" title="ドキュメントのイシューを報告">ドキュメントに関してのイシューを報告</a> したり
<a href="https://github.com/angular/angular/issues/new" title="Angularのイシューを報告">Angular自体のイシューを報告</a>
したりするときのバグの再現環境として最適です。

実際の開発では、[ローカル開発](guide/setup#develop-locally)を強く推奨します。

## 付録: IEを使ったローカル開発

`ng serve`を使ってローカルでAngular開発をする際、自動的にブラウザとローカル開発サーバーとの間で`websocket`接続がセットアップされるためコードが変更されると、ブラウザは自動的にリフレッシュします。

windowsではデフォルトではアプリケーションは6つの接続しかできません。
<a href="https://msdn.microsoft.com/library/ee330736%28v=vs.85%29.aspx?f=255&MSPPError=-2147217396#websocket_maxconn" title="MSDN WebSocket settings">MSDN WebSocket Settings</a>.
なので、IEが手動または`ng serve`によって自動的にリフレッシュされると、たまに、websocketが適切に切断されず、
websocketの接続が限度を超えると、`SecurityError`が投げられます。このエラーはAngularアプリケーションに影響しません。
このエラーをクリアするためにはIEを再起動するか、またはwindowsのレジストリを書き換えて限度数を更新します。

{@a appendix-test-using-fakeasyncasync}

## 付録: `fakeAsync()/async()` を使ったテスト

もしユニットテストを実行するために `fakeAsync()/async()` ヘルパー関数を使う場合 （詳細は[テスティングガイド](guide/testing#async-test-with-fakeasync)を参照してください。) は、`zone.js/dist/zone-testing` をテストのセットアップファイルでインポートしなければなりません。

<div class="alert is-important">
もし Angular CLIを使ってプロジェクトを作っていれば、すでに `src/text.ts` の中でインポートされています。
</div>

そしてAngularの古いバージョンでは、次のファイルがインポートされるか、HTMLファイルに追加されていました。

```
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
```

これらを個別に読み込むこともまだできますが、しかしその順序が重要であり、 `proxy` は `sync-test`や`async-test`、`fake-async-test`、`jasmine-patch`の前に読み込まなければなりません。そしてまた　`sync-test` は `jasmine-patch`の前にインポートする必要があります。なので、個別に読み込むよりも `zone-testing` だけを読み込むことを推奨します。