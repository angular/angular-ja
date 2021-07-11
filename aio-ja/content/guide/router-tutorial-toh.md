{@a router-tutorial}

# ルーターチュートリアル：ツアーオブヒーローズ

このチュートリアルでは、Angularルーターの広範囲な概要を説明します。
このチュートリアルでは、基本的なルーター構成に基づいて、子ルート、ルートパラメーター、遅延読み込みNgModule、ガードルート、ユーザーエクスペリエンスを向上するデータのプリロードなどの機能を探索します。

最終的なバージョンのアプリのサンプルは、<live-example name = "router"> </ live-example> を参照してください。

{@a router-tutorial-objectives}

## 目的

このガイドでは、複数ページにルーティングされたサンプルアプリケーションの開発について説明します。
その過程で、次のようなルーターの主要な機能に焦点を当てます：

* アプリケーション機能をモジュールに編成します。
* コンポーネントへの移動（*Heroes* は "Heroes List" にリンク）。
* ルートパラメータを含みます（"Hero Detail" へのルーティング中に Hero `id` を渡す）。
* 子ルート（*Crisis Center* は独自のルートを持つ）。
* `CanActivate` ガード（ルートアクセスのチェック）。
* `CanActivateChild` ガード（子ルートアクセスのチェック）。
* `CanDeactivate` ガード（保存されていない変更を破棄する許可を求める）。
* `Resolve` ガード（ルートデータのプリフェッチ）。
* `NgModule` の遅延読み込み。
* `CanLoad` ガード（フィーチャーモジュールアセットをロードする前のチェック）。

このガイドは、アプリケーションを段階的に構築しているかのように一連のマイルストーンとして進行しますが、基本的な[Angularの概念](guide/architecture)に精通していることを前提としています。
Angularの一般的な概要については、[はじめに](start)を参照してください。より詳細な概要については、[Tour of Heroes](tutorial)チュートリアルを参照してください。

## 前提条件

このチュートリアルを完了するには、次の概念の基本を理解している必要があります：

* JavaScript
* HTML
* CSS
* [Angular CLI](/cli)

[Tour of Heroesチュートリアル](/tutorial)が役立つかもしれませんが、必須ではありません。


## サンプルアプリケーションの動作

このチュートリアルのサンプルアプリケーションは、Hero Employment Agency がヒーローが解決すべきクライシス（crises）を見つけることに役立ちます。

このアプリケーションには、次の3つの主要な機能領域があります：

1. ヒーローに割り当てるクライシスのリストを維持するための *Crisis Center*。
1. エージェンシーによって雇用されているヒーローのリストを維持する *Heroes*。
1. クライシスとヒーローのリストを管理するための *Admin*。

このリンクからお試しください。 <live-example name="router" title="Hero Employment Agency Live Example">live example link</live-example>.

アプリケーションは、ナビゲーションボタンの行と、ヒーローのリストを含む *Heroes* ビューでレンダリングします。


<div class="lightbox">
  <img src='generated/images/guide/router/hero-list.gif' alt="Example application with a row of navigation buttons and a list of heroes">
</div>



ヒーローを1人選択すると、アプリケーションによってヒーロー編集画面が表示されます。

<div class="lightbox">
  <img src='generated/images/guide/router/hero-detail.png' alt="Detail view of hero with additional information, input, and back button">
</div>



名前を変更します。
「Back」ボタンをクリックすると、アプリケーションは変更されたヒーロー名を表示するヒーローリストに戻ります。
名前の変更がすぐに有効になったことに注意してください。

アプリケーションの「Back」ボタンではなく、ブラウザの戻るボタンをクリックしていたら、アプリケーションもヒーローのリストに戻っていたでしょう。
Angularのアプリケーション・ナビゲーションは、通常のウェブ・ナビゲーションと同様にブラウザの履歴を更新します。

ここで、*Crisis Center* のリンクをクリックすると、現在進行中のクライシスのリストが表示されます。


<div class="lightbox">
  <img src='generated/images/guide/router/crisis-center-list.gif' alt="Crisis Center list of crises">
</div>

クライシスを選択すると、アプリケーションはクライシスの編集画面を表示します。
_Crisis Detail_ は、同じページの、リストの下にある子コンポーネントに表示されます。

クライシスの名前を変更します。
対応するクライシスリストの名前は変更 _されない_ ことに注意してください。


<div class="lightbox">
  <img src='generated/images/guide/router/crisis-center-detail.gif' alt="Crisis Center detail of a crisis with data, an input, and save and cancel buttons.">
</div>


入力中に更新される *Hero Detail* とは異なり、*Crisis Detail* の変更は、「Save」または「Cancel」ボタンを押して保存または破棄するまで、一時的に行われます。
どちらのボタンも、*Crisis Center* とそのクライシスのリストに戻ります。

ブラウザの戻るボタンや "Heroes"のリンクをクリックすると、ダイアログが表示されます。


<div class="lightbox">
  <img src='generated/images/guide/router/confirm-dialog.png' alt="Alert that asks user to confirm discarding changes">
</div>



「OK」をクリックして変更内容を失うか、「Cancel」をクリックして編集を続けることができます。

この動作の背景には、ルーターの `CanDeactivate` ガードがあります。
このガードは、現在のビューから離れる前に、掃除をしたり、ユーザの許可を得たりする機会を与えてくれます。

「Admin」と「Login」ボタンは、本ガイドで後述するルータの他の機能を説明しています。


{@a getting-started}

## マイルストーン 1: はじめる

まず、2つの空のビューの間を移動する基本的なアプリケーションから始めます。


<div class="lightbox">
  <img src='generated/images/guide/router/router-1-anim.gif' alt="Animated image of application with a Crisis Center button and a Heroes button. The pointer clicks each button to show a view for each.">
</div>

{@a import}

Angular CLI でサンプルアプリケーションを生成します。

<code-example language="sh">
  ng new angular-router-sample
</code-example>

### Routes を定義する

ルーターには、ルート定義のリストを設定する必要があります。

各定義は[Route](api/router/Route)オブジェクトに変換され、2つの要素を持ちます。`path` はこのルートのURLパスセグメントで、`component` はこのルートに関連するコンポーネントです。

ルータは、ブラウザのURLが変更されたときや、アプリケーションコードがルータにルートパスに沿って移動するよう指示したときに、その定義のレジストリを利用します。

最初のルートは次のように行われます：

* ブラウザのロケーション URL がパスセグメント `/crisis-center` と一致するように変更されると、ルーターは `CrisisListComponent` のインスタンスをアクティブにし、そのビューを表示します。

* アプリケーションがパス `/crisis-center` へのナビゲーションを要求すると、ルータは `CrisisListComponent` のインスタンスをアクティブにしてそのビューを表示し、ブラウザのアドレスロケーションと履歴をそのパスの URL で更新します。

最初の構成では、`CrisisListComponent` と `HeroListComponent` につながる最小限のパスを持つ2つのルートの配列を定義しています。

`CrisisList` と `HeroList` のコンポーネントを生成して、ルーターがレンダリングできるようにします。

<code-example language="sh">
  ng generate component crisis-list
</code-example>

<code-example language="sh">
  ng generate component hero-list
</code-example>

各コンポーネントの内容を、以下のサンプルHTMLに置き換えます。

<code-tabs>

  <code-pane header="src/app/crisis-list/crisis-list.component.html" path="router/src/app/crisis-list/crisis-list.component.1.html">

  </code-pane>

  <code-pane header="src/app/hero-list/hero-list.component.html" path="router/src/app/hero-list/hero-list.component.1.html" region="template">

  </code-pane>

</code-tabs>

### `Router` と `Routes` を登録する

`Router` を使用するには、まず `@angular/router` パッケージの `RouterModule` を登録する必要があります。
ルートの配列である `appRoutes` を定義して、それを `RouterModule.forRoot()` メソッドに渡します。
`RouterModule.forRoot()` メソッドは、設定された `Router` サービスプロバイダーと、ルーティングライブラリが必要とする他のプロバイダを含むモジュールを返します。
アプリケーションが起動されると、`Router` は現在のブラウザのURLに基づいて最初のナビゲーションを行います。

<div class="alert is-important">

  **Note:** The `RouterModule.forRoot()` method is a pattern used to register application-wide providers. Read more about application-wide providers in the [Singleton services](guide/singleton-services#forRoot-router) guide.

</div>

<code-example path="router/src/app/app.module.1.ts" header="src/app/app.module.ts (first-config)" region="first-config"></code-example>

<div class="alert is-helpful">

設定した `RouterModule` を `AppModule` に追加することで、最小限のルート設定として十分です。
しかし、アプリケーションの規模が大きくなってきたら、[ルーティング設定をリファクタリング](#refactor-the-routing-configuration-into-a-routing-module)して別ファイルにし、[ルーティングモジュール](#routing-module)を作成します。
ルーティングモジュールは、ルーティングに特化した特別なタイプの`サービスモジュール`です。

</div>

`AppModule` の `imports` 配列に `RouterModule.forRoot()` を登録することで、アプリケーション内のあらゆる場所で `Router` サービスを利用できるようになります。

{@a shell}

### Router Outlet を追加する

ルートの `AppComponent` は、アプリケーションシェルです。タイトル、2つのリンクがあるナビゲーションバー、ルーターがコンポーネントをレンダリングするルーターアウトレットを備えています。

<div class="lightbox">
  <img src='generated/images/guide/router/shell-and-outlet.gif' alt="A nav, made of two navigation buttons, with the first button active and its associated view displayed">
</div>

ルーターアウトレットは、ルーティングされたコンポーネントがレンダリングされるプレースホルダーの役割を果たします。

{@a shell-template}

対応するコンポーネントのテンプレートは以下のようになります：

<code-example path="router/src/app/app.component.1.html" header="src/app/app.component.html"></code-example>

{@a wildcard}

### ワイルドカードルートを定義する

これまでのアプリケーションでは、`/crisis-center` へのルートと `/heroes` へのルートの2つを作成しました。
それ以外のURLだと、ルーターがエラーを起こしてアプリがクラッシュしてしまいます。

ワイルドカードルートを追加して、無効なURLをインターセプトし、優雅に処理します。
ワイルドカードルートは、2つのアスタリスクで構成されるパスを持ちます。
これはすべてのURLにマッチします。
このように、ルーターは、設定の初期段階でルートをマッチできない場合、このワイルドカードルートを選択します。
ワイルドカードルートは、カスタムの「404 Not Found」コンポーネントにナビゲートしたり、既存のルートに[リダイレクト](#redirect)することができます。


<div class="alert is-helpful">

ルーターは、[_初めに合致したものが優先される_](/guide/router-reference#example-config)戦略でルートを選択します。
ワイルドカードルートは最も具体性に欠けるルートなので、ルート設定では最後に配置します。

</div>

この機能をテストするには、`HeroListComponent` テンプレートに `RouterLink` 付きのボタンを追加し、そのリンク先を`"/sidekicks"` という存在しないルートに設定します。

<code-example path="router/src/app/hero-list/hero-list.component.1.html" header="src/app/hero-list/hero-list.component.html (excerpt)"></code-example>

まだ `"/sidekicks"` ルートを定義していないので、ユーザがそのボタンをクリックするとアプリケーションは失敗します。

"/sidekicks"` ルートを追加する代わりに、`wildcard` ルートを定義して、`PageNotFoundComponent` にナビゲートするようにしましょう。

<code-example path="router/src/app/app.module.1.ts" header="src/app/app.module.ts (wildcard)" region="wildcard"></code-example>

ユーザーが無効なURLにアクセスしたときに表示する `PageNotFoundComponent` を作成します。

<code-example language="sh">
  ng generate component page-not-found
</code-example>

<code-example path="router/src/app/page-not-found/page-not-found.component.html" header="src/app/page-not-found.component.html (404 component)"></code-example>

これで、ユーザーが `/sidekicks` やその他の無効なURLにアクセスすると、ブラウザに「Page not found」と表示されます。
ブラウザのアドレスバーには、無効なURLが表示され続けます。

{@a redirect}

### リダイレクト設定

アプリケーションの起動時、ブラウザバーに表示される初期URLはデフォルトで次のようになります：

<code-example>
  localhost:4200
</code-example>

これはハードコードされたルートのどれとも一致しないため、ルーターはワイルドカードのルートに移行し、`PageNotFoundComponent` を表示します。

アプリケーションには、有効なページへのデフォルトルートが必要です。
このアプリケーションのデフォルトページはヒーローのリストです。
ユーザーが "Heroes" リンクをクリックするか、アドレスバーに `localhost:4200/heroes` がペーストされたかのように、アプリケーションはそこにナビゲートしなければなりません。

最初の相対URL(`''`)を希望のデフォルトパス(`/heroes`)に変換する `redirect` ルートを追加します。

ワイルドカードルートの _上_ にデフォルトルートを追加します。
このマイルストーンの `appRoutes` の全体像を示す以下の抜粋では、ワイルドカードルートのすぐ上にあります。


<code-example path="router/src/app/app-routing.module.1.ts" header="src/app/app-routing.module.ts (appRoutes)" region="appRoutes"></code-example>

ブラウザのアドレスバーには `.../heroes` が表示され、あたかもそこに直接アクセスしたかのように見えます。

リダイレクトルートには、URLとルートのパスをどのようにマッチさせるかをルーターに伝えるために、`pathMatch` プロパティが必要です。
このアプリでは、*全体のURL*が `''` にマッチしたときにのみ、ルーターが `HeroListComponent` へのルートを選択する必要があるので、`pathMatch` の値を `'full'` に設定します。

{@a pathmatch}

<div class="callout is-helpful">

  <header>Spotlight on pathMatch</header>

  技術的には、`pathMatch = 'full'` は、URLの*残っている*、マッチしていない部分が`''`にマッチした場合にルートヒットとなります。
  この例では、リダイレクトはトップレベルのルートにあるので、*残っている*URLと*全体*のURLは同じものになります。

  他の可能な `pathMatch` 値は `'prefix'` で、これは、残りのURLがリダイレクトルートのプレフィックスパスで始まる場合に、リダイレクトルートにマッチするようにルーターに指示します。
  `pathMatch` 値が `'prefix'` であれば、すべてのURLが `''` にマッチするので、このサンプルアプリケーションでは適用されません。

  `'prefix'` に設定して、`Go to sidekicks` ボタンをクリックしてみてください。
  これは不正なURLなので、"Page not found" というページが表示されるはずです。
  その代わり、"Heroes" のページが表示されたままになっています。
  ブラウザのアドレスバーに不正なURLを入力します。
  すぐに `/heroes` に再ルーティングされます。
  有効でも不正でも、このルート定義に該当するURLはすべてマッチします。

  デフォルトのルートでは、URL全体が `''` である場合にのみ、`HeroListComponent` にリダイレクトされるようになっています。
  リダイレクトを `pathMatch = 'full'` に戻すことを忘れないでください。

  詳しくはVictor Savkin氏の記事をご覧ください。
  [post on redirects](https://vsavkin.tumblr.com/post/146722301646/angular-router-empty-paths-componentless-routes).

</div>

### マイルストーン1のまとめ

サンプルアプリケーションでは、ユーザーがリンクをクリックすると、2つのビューを切り替えることができます。

マイルストーン1では、次のような方法を取り上げました：

* ルーターライブラリを読み込む。
* アンカータグ、`routerLink` 、 `routerLinkActive` ディレクティブを使って、シェルテンプレートにナビゲーションバーを追加。
* シェルテンプレートに、ビューを表示する `router-outlet` を追加。
* `RouterModule.forRoot()` で、ルーターモジュールを設定。
* HTML5 ブラウザの URL を合成するようにルータを設定。
* `ワイルドカード` ルートで、無効なルートを処理。
* アプリケーションが空のパスで起動した場合、デフォルトのルートにナビゲート。

スターターアプリケーションの構造は次のようになっています：

<div class='filetree'>

  <div class='file'>
    angular-router-sample
  </div>

  <div class='children'>

    <div class='file'>
      src
    </div>

    <div class='children'>

      <div class='file'>
        app
      </div>

      <div class='children'>

        <div class='file'>
          crisis-list
        </div>

        <div class='children'>

          <div class='file'>

            crisis-list.component.css

          </div>

          <div class='file'>

            crisis-list.component.html

          </div>

          <div class='file'>

            crisis-list.component.ts

          </div>

        </div>

        <div class='file'>
          hero-list
        </div>

        <div class='children'>

          <div class='file'>

            hero-list.component.css

          </div>

          <div class='file'>

            hero-list.component.html

          </div>

          <div class='file'>

            hero-list.component.ts

          </div>

        </div>

        <div class='file'>
          page-not-found
        </div>

        <div class='children'>

          <div class='file'>

            page-not-found.component.css

          </div>

          <div class='file'>

            page-not-found.component.html

          </div>

          <div class='file'>

            page-not-found.component.ts

          </div>

        </div>

        <div class='file'>
          app.component.css
        </div>

        <div class='file'>
          app.component.html
        </div>

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

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        styles.css
      </div>

      <div class='file'>
        tsconfig.json
      </div>

    </div>

    <div class='file'>
      node_modules ...
    </div>

    <div class='file'>
      package.json
    </div>

  </div>

</div>



このマイルストーン内のファイルです。


<code-tabs>

  <code-pane header="app.component.html" path="router/src/app/app.component.1.html">

  </code-pane>

  <code-pane header="app.module.ts" path="router/src/app/app.module.1.ts">

  </code-pane>

  <code-pane header="hero-list/hero-list.component.html" path="router/src/app/hero-list/hero-list.component.1.html">

  </code-pane>

  <code-pane header="crisis-list/crisis-list.component.html" path="router/src/app/crisis-list/crisis-list.component.1.html">

  </code-pane>

  <code-pane header="page-not-found/page-not-found.component.html" path="router/src/app/page-not-found/page-not-found.component.html">

  </code-pane>

  <code-pane header="index.html" path="router/src/index.html">

  </code-pane>

</code-tabs>


{@a routing-module}

## マイルストーン 2: *ルーティングモジュール*

このマイルストーンでは、アプリケーションのルーティング設定を保持する、*ルーティングモジュール* と呼ばれる特別な目的のモジュールを設定する方法を説明します。

ルーティングモジュールにはいくつかの特徴があります：

* ルーティングに関する関心事を他のアプリケーションに関する関心事から分離する。
* アプリケーションをテストする際に、交換または削除するモジュールを提供する。
* ガードやリゾルバなどのルーティングサービスプロバイダのための有名なロケーションを提供する。
* コンポーネントを宣言しない。

{@a integrate-routing}

### ルーティングをアプリに組み込む

サンプルのルーティングアプリケーションは、デフォルトではルーティングを含んでいません。
Angular CLI](cli) を使ってルーティングを使用するプロジェクトを作成する際には、プロジェクトやアプリケーション、各NgModuleに `--routing` オプションを設定してください。
新しいプロジェクト（CLIの[`ng new`](cli/new) コマンドを使用）や新しいアプリケーション（[`ng generate app`](cli/generate) コマンドを使用）を作成または初期化する際には、`--routing` オプションを指定します。
これによりCLIは、`@angular/router` のnpmパッケージをインクルードし、`app-routing.module.ts` という名前のファイルを作成するようになります。
これにより、プロジェクトやアプリケーションに追加したNgModuleでルーティングを使用することができます。

例えば、次のコマンドは、ルーティングを使用できるNgModuleを生成します。

```sh
ng generate module my-module --routing
```

これにより、NgModuleのルートを格納するために、`my-module-routing.module.ts` という別のファイルが作成されます。
このファイルには、空の `Routes` オブジェクトが含まれており、ここに様々なコンポーネントやNgModuleへのルートを入力することができます。

{@a routing-refactor}


### ルーティング設定をルーティングモジュールにリファクタリングする

`AppRouting` モジュールを `/app` フォルダ内に作成し、ルーティングの設定を格納します。

<code-example language="sh">
  ng generate module app-routing --module app --flat
</code-example>

`app.module.ts` で行ったように、`CrisisListComponent`、`HeroListComponent`、`PageNotFoundComponent` のシンボルをインポートします。
そして、`Router` のインポートと、`RouterModule.forRoot()` を含むルーティング設定を、このルーティングモジュールに移動します。

モジュールの `exports` 配列に追加して、Angular の `RouterModule` を再エクスポートします。
ここで `RouterModule` を再インポートすることで、`AppModule` で宣言されたコンポーネントは、`RouterLink` や `RouterOutlet` といったルーターディレクティブにアクセスできるようになります。

以上の手順を経て、ファイルは以下のようになります。

<code-example path="router/src/app/app-routing.module.1.ts" header="src/app/app-routing.module.ts"></code-example>

次に、`app.module.ts`ファイルを更新し、`imports` 配列の `RouterModule.forRoot` を削除します。

<code-example path="router/src/app/app.module.2.ts" header="src/app/app.module.ts"></code-example>

<div class="alert is-helpful">

後ほど、このガイドで[複数のルーティングモジュール](#heroes-functionality)を作成し、それらのルーティングモジュールを[正しい順序で](#routing-module-order)インポートする方法を紹介します。

</div>

アプリケーションはそのまま動作し、今後のルーティング設定を維持するための包括的な場所として、`AppRoutingModule` を使用することができます。

{@a why-routing-module}

### ルーティングモジュールのメリット

ルーティングモジュールはしばしば `AppRoutingModule` と呼ばれ、ルートモジュールやフィーチャーモジュールのルーティング設定を代わりになります。

ルーティングモジュールは、アプリケーションが成長したときや、特化したガードやリゾルバサービスを含む構成のときに役立ちます。

開発者の中には、構成が最小限の場合にはルーティングモジュールをスキップして、ルーティングコンフィグレーションをコンパニオンモジュール (例えば、`AppModule`) に直接マージする人もいます。

ほとんどのアプリケーションは、一貫性のためにルーティングモジュールを実装すべきです。
構成が複雑になったときにコードをきれいに保つことができます。
フィーチャーモジュールのテストを容易にします。
ルーティングモジュールの存在は、モジュールがルーティングされているという事実に注意を喚起します。
このモジュールは、開発者がルーティング設定を見つけたり、拡張したりするための場所です。

{@a heroes-feature}

## Milestone 3: ヒーロー機能

このマイルストーンは、以下の内容を含んでいます：

* モジュールを使って、アプリケーションとルートをフィーチャーエリアに整理する。
* あるコンポーネントから別のコンポーネントへの必須のナビゲーション。
* ルートのパラメータに必要な情報とオプションの情報を渡す。

このサンプルアプリケーションは、[Tour of Heroes tutorial](tutorial/toh-pt4 "Tour of Heroes: Services") の"Services"セクションにあるヒーロー機能を再現したもので、<live-example name="toh-pt4" title="Tour of Heroes: Services example code"></live-example>のコードの多くを再利用しています。

典型的なアプリケーションには複数のフィーチャーエリアがあり、それぞれが特定のビジネス目的のために専用のフォルダを持っています。

このセクションでは、アプリケーションを異なるフィーチャーモジュールにリファクタリングし、それらをメインモジュールにインポートして、それらの間をナビゲートする方法を紹介します。


{@a heroes-functionality}

### ヒーロー機能の追加

以下の手順に従ってください：

* ヒーローを管理するために、heroes フォルダにルーティング機能を持つ `HeroesModule` を作成し、ルートの `AppModule` に登録します。

<code-example language="sh">
  ng generate module heroes/heroes --module app --flat --routing
</code-example>

* `app` フォルダの中にあるプレースホルダーの `hero-list` フォルダを `heroes` フォルダの中に移動します。
* <live-example name="toh-pt4" title="Tour of Heroes: Services example code">"Services" tutorial</live-example> から、
  `heroes/heroes.component.html` の内容を `hero-list.component.html` テンプレートにコピーします。

  * `<h2>` のラベルを `<h2>HEROES</h2>` に変更します。
  * テンプレートの下部にある `<app-hero-detail>` コンポーネントを削除します。

* live sample の `heroes/heroes.component.css` の内容を `hero-list.component.css` ファイルにコピーします。
* live sample の `heroes/heroes.component.ts` の内容を `hero-list.component.ts` ファイルにコピーします。

  * コンポーネントのクラス名を `HeroListComponent` に変更します。
  * `selector` を `app-hero-list` に変更します。

<div class="alert is-helpful">

   コンポーネントはページがレンダリングされるときに動的に挿入されるので、ルーティングされたコンポーネントにはセレクタは必要ありません。しかし、HTMLの要素ツリーでコンポーネントを特定し、ターゲットにするには便利です。

</div>

* `hero-detail` フォルダ、`hero.ts`, `hero.service.ts`, `mock-heroes.ts` ファイルを `heroes` サブフォルダにコピーします。
* `message.service.ts` を `src/app` フォルダにコピーします。
* `hero.service.ts` ファイルの `message.service` への相対パスのインポートを更新します。

次に、`HeroesModule` のメタデータを更新します。

  * `HeroesModule` 内の `declarations` 配列に `HeroDetailComponent` と `HeroListComponent` をインポートして追加します。

<code-example path="router/src/app/heroes/heroes.module.ts" header="src/app/heroes/heroes.module.ts"></code-example>

ヒーロー管理のファイル構成は以下の通りです：

<div class='filetree'>

  <div class='file'>
    src/app/heroes
  </div>

  <div class='children'>

    <div class='file'>
      hero-detail
    </div>

      <div class='children'>

        <div class='file'>
          hero-detail.component.css
        </div>

        <div class='file'>
          hero-detail.component.html
        </div>

        <div class='file'>
          hero-detail.component.ts
        </div>

      </div>

    <div class='file'>
      hero-list
    </div>

      <div class='children'>

        <div class='file'>
          hero-list.component.css
        </div>

        <div class='file'>
          hero-list.component.html
        </div>

        <div class='file'>
          hero-list.component.ts
        </div>

      </div>

    <div class='file'>
      hero.service.ts
    </div>

    <div class='file'>
      hero.ts
    </div>

    <div class='file'>
      heroes-routing.module.ts
    </div>

    <div class='file'>
      heroes.module.ts
    </div>

    <div class='file'>
      mock-heroes.ts
    </div>

    </div>

  </div>

</div>

{@a hero-routing-requirements}

#### ヒーロー機能のルーティング要件

ヒーロー機能には、hero list と hero detail という相互作用する2つのコンポーネントがあります。
リストビューに移動すると、ヒーローのリストを取得し、それらを表示します。
ヒーローをクリックすると、detailビューはその特定のヒーローを表示しなければなりません。

ルートURLに選択したヒーローのIDを含めることで、どのヒーローを表示するかをdetailビューに伝えます。

`src/app/moes/` フォルダの新しい場所からヒーローコンポーネントをインポートし、2つのヒーロールートを定義します。

`Heroes` モジュール用のルートができたので、`AppRoutingModule` で行ったように `RouterModule` を使用して `Router` にそれらを登録します。

`AppRoutingModule` では、静的な `RouterModule.forRoot()` メソッドを使用して、ルートとアプリケーションレベルのサービスプロバイダを登録しました。
フィーチャーモジュールでは、静的な `forChild()` メソッドを使用します。


<div class="alert is-helpful">

ルートの `AppRoutingModule` でのみ、`RouterModule.forRoot()` を呼び出します。
（もしくは、トップレベルのアプリケーションルートを登録する場所であれば `AppModule` で呼び出す。）
その他のモジュールでは、追加のルートを登録するためには `RouterModule.forChild()` メソッドを呼び出す必要があります。

</div>

更新された`HeroesRoutingModule` は以下のようになります：


<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts"></code-example>


<div class="alert is-helpful">

各フィーチャーモジュールに独自のルート設定ファイルを与えることを検討してください。
現在、フィーチャーのルートは最小限ですが、小さなアプリケーションでもルートは複雑になる傾向があります。

</div>


{@a remove-duplicate-hero-routes}


#### 重複するヒーロールートの削除

現在、ヒーロールートは `HeroesRoutingModule` 内の2つの場所：`HeroesModule` と `AppRoutingModule` で定義されています。

フィーチャーモジュールによって提供されたルートは、ルーターによってそのインポートされたモジュールのルートに統合されます。
これにより、メインのルート設定を変更することなく、機能モジュールのルートを定義し続けることができます。

`app-routing.module.ts` から、`HeroListComponent` のインポートと `/heroes` のルートを削除します。

デフォルトとワイルドカードのルートは、アプリケーションのトップレベルでまだ使用されているので残しておきます。

<code-example path="router/src/app/app-routing.module.2.ts" header="src/app/app-routing.module.ts (v2)"></code-example>

{@a merge-hero-routes}

#### heroes declarations の削除

`HeroesModule` が `HeroListComponent` を提供するようになったので、`AppModule` の `declarations` 配列からこれを削除します。
これで、独立した `HeroesModule` ができたので、より多くのコンポーネントやさまざまなルートでヒーロー機能を進化させることができます。

以上の手順を経て、`AppModule`は以下のようになるはずです：

<code-example path="router/src/app/app.module.3.ts" header="src/app/app.module.ts" region="remove-heroes"></code-example>

{@a routing-module-order}

### モジュールのインポート順序

モジュールの `imports` 配列では、`AppRoutingModule` が最後で、`HeroesModule` の_後_に来ていることに注意してください。

<code-example path="router/src/app/app.module.3.ts" region="module-imports" header="src/app/app.module.ts (module-imports)"></code-example>


ルーターはナビゲーションのリクエストパスにマッチする最初のルートを受け入れるので、ルート設定の順序は重要です。

すべてのルートが1つの `AppRoutingModule` にあったときは、デフォルトと [wildcard](#wildcard) ルートを `/heroes` ルートの後、つまり最後に置いていました。これにより、ワイルドカードルートにヒットして "Page not found" にナビゲートされる前に、ルーターが `/heroes` ルートにURLをマッチさせるチャンスがありました。

各ルーティングモジュールは、インポートされた順にルート設定を拡張します。
もし `AppRoutingModule` を最初にリストアップした場合、ワイルドカードルートはヒーロールートの_前_に登録されます。
ワイルドカードルート&mdash;は_全ての_URL&mdash;にマッチする_ので、ヒーロールートにナビゲートしようとする試みを遮断します。


<div class="alert is-helpful">

ルーティングモジュールを逆にして、ヒーローのリンクをクリックすると "Page not found" という結果になることを確認します。
ランタイムのルーター設定の検査については[下記](#inspect-config "Inspect the router config")を参照してください。

</div>

### ルートパラメータ

{@a route-def-with-parameter}

#### パラメータ付きのルート定義

`HeroesRoutingModule` に戻り、ルート定義をもう一度見てみましょう。
`HeroDetailComponent` へのルートには、パスに `:id` トークンが含まれています。

<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts (excerpt)" region="hero-detail-route"></code-example>

`:id` トークンは、パスにルートパラメーター用のスロットを作成します。
この場合、この設定によりルーターはヒーローの `id` をそのスロットに挿入します。

detailコンポーネントにナビゲートし、"Magneta" を表示するようルーターに指示した場合、ブラウザのURLにヒーローのidが次のように表示されることが期待されます：


<code-example format="nocode">
  localhost:4200/hero/15

</code-example>



ユーザーがブラウザのアドレスバーにそのURLを入力すると、ルーターはそのパターンを認識し、同じ "Magneta" の詳細画面に移動するはずです。


<div class="callout is-helpful">

<header>
  Route parameter: Required or optional?
</header>

ルートパラメータトークンである `:id` をルート定義のパスに埋め込むことは、このシナリオでは良い選択です。なぜなら `id` は `HeroDetailComponent` で*必須*であり、パス内の値 `15` は "Magneta" へのルートと他のヒーローへのルートを明確に区別するからです。

</div>


{@a route-parameters}

#### リストビューでのルートパラメーターの設定

`id` of the selected hero.
`HeroDetailComponent` にナビゲートした後、選択されたヒーローの詳細を見ることができます。
2つの情報が必要です: コンポーネントへのルーティングパスとヒーローの `id` です。

したがって、_link parameters array_ には2つのアイテムがあります:
ルーティングの _path_ と、選択されたヒーローの `id` を指定する _route parameter_ です。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.html" header="src/app/heroes/hero-list/hero-list.component.html (link-parameters-array)" region="link-parameters-array"></code-example>

The router extracts the route parameter (`id:15`) from the URL and supplies it to
the `HeroDetailComponent` using the `ActivatedRoute` service.
ルーターは、配列から宛先URLを次のように構成します：`localhost:4200/hero/15`

ルータはURLからルートパラメータ(`id:15`)を抽出し、
`ActivatedRoute` サービスを使って，`HeroDetailComponent`に供給します。


{@a activated-route-in-action}

### `Activated Route` の動作

router パッケージから `Router`, `ActivatedRoute`, `ParamMap` トークンをインポートします。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (activated route)" region="imports"></code-example>

後で `Observable` のルートパラメータを処理するために必要になるので、`switchMap` オペレータをインポートします。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (switchMap operator import)" region="rxjs-operator-import"></code-example>

{@a hero-detail-ctor}

Add the services as private variables to the constructor so that Angular injects them (makes them visible to the component).
サービスをプライベート変数としてコンストラクタに追加し、Angularがそれらを注入するようにします（コンポーネントから使えるようにします）。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (constructor)" region="ctor"></code-example>

`ngOnInit()` メソッドでは、`ActivatedRoute` サービスを使用してルートのパラメータを取得し、パラメータからヒーローの `id` を引き出し、表示するヒーローを取得します。


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (ngOnInit)" region="ngOnInit"></code-example>

マップが変更されると、`paramMap` は変更されたパラメータから `id` パラメータを取得します。

そして、その `id` を持つヒーローを取得するように `HeroService` に指示し、`HeroService` のリクエストの結果を返します。

`switchMap` 演算子は2つのことを行います。`HeroService` が返す `Observable<Hero>` をフラット化し、以前の保留中のリクエストをキャンセルします。
`HeroService` が古い `id` を取得している間に、ユーザーが新しい `id` でこのルートに再ナビゲートすると、`switchMap` はその古いリクエストを破棄して、新しい `id` のヒーローを返します。

`AsyncPipe` はオブザーバブルなサブスクリプションを処理し、コンポーネントの `hero` プロパティは取得されたヒーローで(再)設定されます。

#### _ParamMap_ API

The `ParamMap` API is inspired by the [URLSearchParams interface](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams).
It provides methods to handle parameter access for both route parameters (`paramMap`) and query parameters (`queryParamMap`).

<table>
  <tr>
    <th>
      Member
    </th>

    <th>
      Description
    </th>
  </tr>

  <tr>
    <td>
      <code>has(name)</code>
    </td>
    <td>

    Returns `true` if the parameter name is in the map of parameters.

    </td>
  </tr>

  <tr>
    <td>
      <code>get(name)</code>
    </td>
    <td>

    Returns the parameter name value (a `string`) if present, or `null` if the parameter name is not in the map. Returns the _first_ element if the parameter value is actually an array of values.

    </td>
  </tr>

  <tr>
    <td>
      <code>getAll(name)</code>
    </td>
    <td>

    Returns a `string array` of the parameter name value if found, or an empty `array` if the parameter name value is not in the map. Use `getAll` when a single parameter could have multiple values.

    </td>
  </tr>

  <tr>
    <td>
      <code>keys</code>
    </td>
    <td>

    Returns a `string array` of all parameter names in the map.

    </td>
  </tr>
</table>

{@a reuse}

#### Observableの<i>paramMap</i>とコンポーネントの再利用

この例では、`Observable` からルートパラメータマップを取得しています。
これは、ルートパラメータマップがこのコンポーネントの存続期間中に変更される可能性があることを意味します。

デフォルトでは、ルーターは、同じコンポーネントタイプに再ナビゲートする際に、最初に別のコンポーネントを訪れることなく、
コンポーネントインスタンスを再利用します。ルートパラメータはその都度変わる可能性があります。

親コンポーネントのナビゲーションバーに、ヒーローのリストをスクロールする
"forward" と "back" ボタンがあったとします。
クリックするたびに、次または前の `id` を持つ `HeroDetailComponent` に強制的にナビゲートされます。

ルーターが現在の `HeroDetailComponent` インスタンスをDOMから削除し、次の `id` のために再作成することは、ビューを再レンダリングすることになるため、望まないでしょう。
UXを向上させるために、ルーターは同じコンポーネントインスタンスを再利用し、パラメータを更新します。

`ngOnInit()` はコンポーネントのインスタンスごとに一度しか呼び出されないので、オブザーバブルな `paramMap` プロパティを使用して、ルートのパラメータが_同じインスタンス内で_変更されたことを検出することができます。


<div class="alert is-helpful">

コンポーネントのオブザーバブルをサブスクライブする時、ほとんどの場合、そのコンポーネントが破棄されるときにサブスクライブを解除します。

しかし、`ActivatedRoute` とそのオブザーバブルは `Router` 自体から隔離されているため、`ActivatedRoute` のオブザーバブルは例外となります。
`Router` はルート化されたコンポーネントが不要になったときにそれを破棄します。これは、コンポーネントのすべてのメンバーも破棄されることを意味します。
これには、注入された `ActivatedRoute` とその `Observable` プロパティへのサブスクリプションが含まれます。

また、`Router` は `ActivatedRoute` の `Observable` を `complete` しないので、`finalize` や `complete` のブロックは実行されません。
`finalize` で何かを処理する必要がある場合は、やはり `ngOnDestroy` でアンサブスクライブする必要があります。
また、コンポーネントが破棄された後に実行したくないコードの遅延が Observable pipe にある場合にも、アンサブスクライブする必要があります。

</div>

{@a snapshot}

#### `snapshot`: 観察不可能な代替手段

このアプリケーションは `HeroDetailComponent` を再利用しません。
ユーザーは常にヒーローリストに戻り、表示する別のヒーローを選択します。
間にリストコンポーネントを訪れることなく、1つのヒーローの詳細から別のヒーローの詳細へとナビゲートする方法はありません。
そのため、ルーターは毎回、新しい `HeroDetailComponent` インスタンスを作成します。

`HeroDetailComponent` のインスタンスが決して再利用されないことが確実に分かっている場合は、`snapshot` を使用できます。

`route.snapshot` は、ルートのパラメータマップの初期値を提供します。
以下のように，サブスクライブや observable 演算子を追加することなく，パラメータに直接アクセスすることができます：

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.2.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (ngOnInit snapshot)" region="snapshot"></code-example>

<div class="alert is-helpful">

`snapshot` は、この手法ではパラメータマップの初期値しか取得できません。
ルータがコンポーネントを再利用する可能性がある場合は、オブザーバブルな `paramMap` を使用してください。
このチュートリアルのサンプルアプリケーションでは、オブザーバブルな `paramMap` を使用しています。

</div>

{@a nav-to-list}

### リストコンポーネントへ戻るナビゲーション

`HeroDetailComponent` の "Back" ボタンは `gotoHeroes()` メソッドを使って `HeroListComponent` に戻るように命令的にナビゲートします。

ルーターの `navigate()` メソッドは、`[routerLink]` ディレクティブにバインドできるのと同じ、1つの _link parameters array_ を取ります。
これは `HeroListComponent` へのパスを保持します：


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (excerpt)" region="gotoHeroes"></code-example>


{@a optional-route-parameters}

Use [route parameters](#route-parameters) to specify a required parameter value within the route URL
as you do when navigating to the `HeroDetailComponent` in order to view the hero with `id` 15:
#### ルートパラメーター：必須またはオプション？

ルートURL内で必須のパラメータ値を指定するには、`id` 15 のヒーローを表示するために `HeroDetailComponent` にナビゲートした時のように、
[route parameters](#rout-parameters)を使用します。


<code-example format="nocode">
  localhost:4200/hero/15

</code-example>



ルートリクエストにオプションの情報を追加することもできます。
例えば、ヒーローの詳細画面から `hero-detail.component.ts` のリストに戻るとき、表示されたヒーローがリストの中で事前に選択されていれば良いでしょう。

<div class="lightbox">
  <img src='generated/images/guide/router/selected-hero.png' alt="Selected hero">
</div>


`HeroDetailComponent` から戻る際に、閲覧されたヒーローの `id` をオプションのパラメータとしてURLに含めることで、この機能を実装します。

オプション情報には、次のような他の形式も含めることができます：

* 例えば、`name='wind*'` のような緩い構造の検索条件。
* 複数の値；例えば、`after='12/31/2015' & before='1/1/2017'` &mdash;
  順不同で&mdash; `before='1/1/2017' & after='12/31/2015'` &mdash;
  様々なフォーマットで&mdash; `during='currentYear'`。

このようなパラメータはURLパスに収まりにくいため、ナビゲーション時に任意の複雑な情報を伝えるためにオプションパラメータを使用することができます。
オプションのパラメータは、パターンマッチングに関与しないため、柔軟な表現が可能です。

ルーターは、必須のルートパラメーターと同様に、オプショナルパラメーターによるナビゲーションをサポートしています。
オプションのパラメータは、必須ルートのパラメーターを定義した_後_に、別のオブジェクトで定義してください。

一般的には、値が必須の場合（例えば、ある経路パスを他の経路パスと区別するために必要な場合）は必須のルートパラメーターを使用し、値が任意、複雑、可変の場合はオプショナルパラメーターを使用します。

{@a optionally-selecting}

#### Heroes list: 任意でヒーローを選択する

`HeroDetailComponent` に移動する際、編集するヒーローの `id` をルートパラメータで指定し、
それを [_link parameters array_](#link-parameters-array) の2番目の要素にしました。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.html" header="src/app/heroes/hero-list/hero-list.component.html (link-parameters-array)" region="link-parameters-array"></code-example>

The router embedded the `id` value in the navigation URL because you had defined it as a route parameter with an `:id` placeholder token in the route `path`:
ルーターがナビゲーションURLに `id` 値を埋め込んだのは、ルートの `path` に `:id` プレースホルダートークンを使ってルートパラメータとして定義したからです：

<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts (hero-detail-route)" region="hero-detail-route"></code-example>

ユーザーが戻るボタンをクリックすると、`HeroDetailComponent` は別の_link parameters array_を構築します。
これを使って、`HeroListComponent`に戻ります。

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (gotoHeroes)" region="gotoHeroes"></code-example>

以前は `HeroListComponent` に情報を送る必要がなかったので、この配列にはルートパラメータがありません。

今は、`HeroListComponent` がそのリストの中でそのヒーローをハイライトできるように、
現在のヒーローの `id` をナビゲーションリクエストで送ります。

任意の `id` パラメータを含むオブジェクトで `id` を送信します。
デモのために、`HeroListComponent` が無視すべき余分なジャンクパラメータ(`foo`)がオブジェクトの中にあります。
これが修正されたナビゲーション文です：

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (go to heroes)" region="gotoHeroes"></code-example>

アプリケーションはまだ動作しています。"back" をクリックすると、ヒーローリスト画面に戻ります。

ブラウザのアドレスバーを見てください。

実行した場所にもよりますが、以下のように見えるはずです：

<code-example language="bash">
  localhost:4200/heroes;id=15;foo=foo

</code-example>

`id` の値はURLのパスではなく、URLの中に(`;id=15;foo=foo`)として現れます。
"Heroes" ルートのパスには `:id` トークンがありません。

任意ののルートパラメータは、URLのクエリ文字列のように、"? " や "&" で区切られていません。
セミコロン ";" で区切られています。
これはマトリクスURLの表記法です。

<div class="alert is-helpful">

As such, the Router provides support for the matrix notation across browsers.
マトリクスURL表記は、Webの創始者であるTim Berners-Lee氏が[1996年の提案](https://www.w3.org/DesignIssues/MatrixURIs.html)で初めて紹介したアイデアです。

マトリクス記法はHTML標準には採用されませんでしたが、合法であり、親ルートと子ルートに属するパラメータを分離する方法として、ブラウザのルーティングシステムの間で普及しました。
このように、ルーターはマトリクス表記でのブラウザアクセスのサポートを提供しています。

</div>

{@a route-parameters-activated-route}

### `ActivatedRoute` サービスのルートパラメータ

現在の開発状況では、ヒーローのリストは変更されません。
ヒーローの列はハイライトされていません。

`HeroListComponent`には、パラメータを期待するコードが必要です。

これまでは `HeroListComponent` から `HeroDetailComponent` に移動するとき、
ルートのパラメータマップ `Observable` をサブスクライブし、それを `ActivatedRoute` 内の `HeroDetailComponent` で
利用できるようにしていました。
そのサービスを `HeroDetailComponent` のコンストラクタに注入しました。

今回は逆に、`HeroDetailComponent` から `HeroListComponent` へと移動します。

まず、ルーターのインポート文を拡張して、`ActivatedRoute` サービスシンボルを含めるようにします：

<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" header="src/app/heroes/hero-list/hero-list.component.ts (import)" region="import-router"></code-example>

ルートパラメータマップの `Observable` に対する操作を行うために、`switchMap` オペレータをインポートします。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" header="src/app/heroes/hero-list/hero-list.component.ts (rxjs imports)" region="rxjs-imports"></code-example>

`HeroListComponent` のコンストラクタに `ActivatedRoute` を注入します。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" header="src/app/heroes/hero-list/hero-list.component.ts (constructor and ngOnInit)" region="ctor"></code-example>

`ActivatedRoute.paramMap` プロパティは、ルートパラメータの `Observable` マップです。
`paramMap` は、ユーザーがコンポーネントに移動したときに、`id` を含む新しい値のマップを発行します。
`ngOnInit()` では、これらの値をサブスクライブして `selectedId` を設定し、ヒーローを取得します。

テンプレートを[クラスバインディング](guide/attribute-binding#class-binding)で更新します。
このバインディングは、比較結果が `true` を返すと `selected` の CSS クラスを追加し、`false` を返すと削除します。
このバインディングは、以下のように繰り返される `<li>` タグの中にあります：

<code-example path="router/src/app/heroes/hero-list/hero-list.component.html" header="src/app/heroes/hero-list/hero-list.component.html"></code-example>

ヒーローが選択されたときに適用されるスタイルを追加します。

<code-example path="router/src/app/heroes/hero-list/hero-list.component.css" region="selected" header="src/app/heroes/hero-list/hero-list.component.css"></code-example>

ユーザーがヒーローリストから "Magneta " ヒーローに移動して戻ってくると、"Magneta " が選択された状態で表示されます：

<div class="lightbox">
  <img src='generated/images/guide/router/selected-hero.png' alt="Selected hero in list has different background color">
</div>

任意の `foo` ルートパラメータは無害なので、ルータはこれを無視し続けます。

{@a route-animation}

### ルーティング可能なアニメーションの追加

ここでは、`HeroDetailComponent` に[animations](guide/animations)を追加する方法を説明します。

まず、`BrowserAnimationsModule` をインポートして、`imports` 配列に追加します。

<code-example path="router/src/app/app.module.ts" header="src/app/app.module.ts (animations-module)" region="animations-module"></code-example>

次に、`HeroListComponent` と `HeroDetailComponent` のルートに `data` オブジェクトを追加します。
トランジションは `state` に基づいており、ルートからの `animation` データを使用して、トランジションに名前付きのアニメーション `state` を提供します。

<code-example path="router/src/app/heroes/heroes-routing.module.2.ts" header="src/app/heroes/heroes-routing.module.ts (animation data)"></code-example>

ルートの `src/app/` フォルダに `animations.ts` ファイルを作成します。内容は以下のようになります：

<code-example path="router/src/app/animations.ts" header="src/app/animations.ts (excerpt)"></code-example>

このファイルは以下のことを行います：

* アニメーションのトリガーを作成したり、状態を制御したり、状態間の遷移を管理するアニメーションシンボルをインポートします。

* `routeAnimation` という名前のアニメーショントリガーに設定された `slideInAnimation` という名前の定数をエクスポートします。

* `heroes` と `hero` のルートを行き来する際に、アプリケーションビューに入るときにコンポーネントが画面の左から入ってくるようにするためのトランジション（`:enter`）と、アプリケーションビューから出るときにコンポーネントが右に移動するようにするためのトランジション（`:leave`）を定義しています。

`AppComponent`に戻り、`@angular/router` パッケージから `RouterOutlet` トークンを、 `'./animations.ts'` から `slideInAnimation` をインポートします。

`slideInAnimation` を含む`@Component` のメタデータに、`animations` 配列を追加します。

<code-example path="router/src/app/app.component.2.ts" header="src/app/app.component.ts (animations)" region="animation-imports"></code-example>

ルーティング可能なアニメーションを使用するには、`RouterOutlet` をエレメントで囲み、`@routeAnimation` トリガーを使用してエレメントにバインドします。

キーオフ状態への `@routeAnimation` の遷移には、`ActivatedRoute` の `data` を指定します。
`RouterOutlet` は `outlet` テンプレート変数として公開されているので、ルーターのアウトレットへの参照をバインドします。
この例では、`routerOutlet` の変数を使用しています。

<code-example path="router/src/app/app.component.2.html" header="src/app/app.component.html (router outlet)"></code-example>

`@routeAnimation` プロパティは、提供された `routerOutlet` の参照によって `getAnimationData()` にバインドされているので、次のステップでは `AppComponent` でその関数を定義します。
`getAnimationData()` 関数は、`ActivatedRoute` を通じて提供される `data` からアニメーションのプロパティを返します。この `animation` プロパティは `animations.ts` で定義した `slideInAnimation` で使用した `transition` の名前と一致します。

<code-example path="router/src/app/app.component.2.ts" header="src/app/app.component.ts (router outlet)" region="function-binding"></code-example>

これで、2つのルート間で切り替える際`HeroDetailComponent` と `HeroListComponent` はルートにあるときは左からイーズインされ、ナビゲートして離れるときは右にスライドするようになりました。

{@a milestone-3-wrap-up}

### マイルストーン3のまとめ

本節では、以下の内容を取り上げました：

* アプリケーションをフィーチャーエリアに整理する。
* あるコンポーネントから別のコンポーネントへの絶対的な移動。
* ルートパラメータで情報を渡し、コンポーネントでそれをサブスクライブする。
* フィーチャーエリアのNgModuleを`AppModule` にインポートする。
* ページに基づいて、ルーティング可能なアニメーションを適用する。

これらの変更後、フォルダ構造は以下のようになります：

<div class='filetree'>

  <div class='file'>
    angular-router-sample
  </div>

  <div class='children'>

    <div class='file'>
      src
    </div>

    <div class='children'>

      <div class='file'>
        app
      </div>

      <div class='children'>

        <div class='file'>
          crisis-list
        </div>

          <div class='children'>

            <div class='file'>
              crisis-list.component.css
            </div>

            <div class='file'>
              crisis-list.component.html
            </div>

            <div class='file'>
              crisis-list.component.ts
            </div>

          </div>

        <div class='file'>
          heroes
        </div>

        <div class='children'>

          <div class='file'>
            hero-detail
          </div>

            <div class='children'>

              <div class='file'>
                hero-detail.component.css
              </div>

              <div class='file'>
                hero-detail.component.html
              </div>

              <div class='file'>
                hero-detail.component.ts
              </div>

            </div>

          <div class='file'>
            hero-list
          </div>

            <div class='children'>

              <div class='file'>
                hero-list.component.css
              </div>

              <div class='file'>
                hero-list.component.html
              </div>

              <div class='file'>
                hero-list.component.ts
              </div>

            </div>

          <div class='file'>
            hero.service.ts
          </div>

          <div class='file'>
            hero.ts
          </div>

          <div class='file'>
            heroes-routing.module.ts
          </div>

          <div class='file'>
            heroes.module.ts
          </div>

          <div class='file'>
            mock-heroes.ts
          </div>

        </div>

        <div class='file'>
          page-not-found
        </div>

        <div class='children'>

          <div class='file'>

            page-not-found.component.css

          </div>

          <div class='file'>

            page-not-found.component.html

          </div>

          <div class='file'>

            page-not-found.component.ts

          </div>

        </div>

      </div>

      <div class='file'>
        animations.ts
      </div>

      <div class='file'>
        app.component.css
      </div>

      <div class='file'>
        app.component.html
      </div>

      <div class='file'>
        app.component.ts
      </div>

      <div class='file'>
        app.module.ts
      </div>

      <div class='file'>
        app-routing.module.ts
      </div>

      <div class='file'>
        main.ts
      </div>

      <div class='file'>
        message.service.ts
      </div>

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        styles.css
      </div>

      <div class='file'>
        tsconfig.json
      </div>

    </div>

    <div class='file'>
      node_modules ...
    </div>

    <div class='file'>
      package.json
    </div>

  </div>

</div>

このバージョンのサンプルアプリケーションの関連ファイルは以下の通りです。

<code-tabs>

  <code-pane header="animations.ts" path="router/src/app/animations.ts">

  </code-pane>

  <code-pane header="app.component.html" path="router/src/app/app.component.2.html">

  </code-pane>

  <code-pane header="app.component.ts" path="router/src/app/app.component.2.ts">

  </code-pane>

  <code-pane header="app.module.ts" path="router/src/app/app.module.3.ts">

  </code-pane>

  <code-pane header="app-routing.module.ts" path="router/src/app/app-routing.module.2.ts" region="milestone3">

  </code-pane>

  <code-pane header="hero-list.component.css" path="router/src/app/heroes/hero-list/hero-list.component.css">

  </code-pane>

  <code-pane header="hero-list.component.html" path="router/src/app/heroes/hero-list/hero-list.component.html">

  </code-pane>

  <code-pane header="hero-list.component.ts" path="router/src/app/heroes/hero-list/hero-list.component.ts">

  </code-pane>

  <code-pane header="hero-detail.component.html" path="router/src/app/heroes/hero-detail/hero-detail.component.html">

  </code-pane>

  <code-pane header="hero-detail.component.ts" path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts">

  </code-pane>

  <code-pane header="hero.service.ts" path="router/src/app/heroes/hero.service.ts">

  </code-pane>

  <code-pane header="heroes.module.ts" path="router/src/app/heroes/heroes.module.ts">

  </code-pane>

  <code-pane header="heroes-routing.module.ts" path="router/src/app/heroes/heroes-routing.module.2.ts">

  </code-pane>

  <code-pane header="message.service.ts" path="router/src/app/message.service.ts">

  </code-pane>

</code-tabs>



{@a milestone-4}



## マイルストーン4: クライシスセンター機能

このセクションでは、アプリに子ルートを追加し、相対的なルーティングを使用する方法を紹介します。

アプリケーションの現在のクライシスセンターにさらに機能を追加するには、ヒーロー機能の場合と同様の手順で行います：

* `src/app` フォルダ内に `crisis-center` サブフォルダを作成します。
* `app/heroes` からファイルとフォルダを新しい `crisis-center` フォルダにコピーします。
* 新しいファイルで、"hero" のすべての記述を "crisis" に変更し、"heroes" を "crises" に変換します。
* NgModuleファイルの名前を、`crisis-center.module.ts` と `crisis-center-routing.module.ts` に変更します。

モックヒーローの代わりに、モッククライシスを使用します：

<code-example path="router/src/app/crisis-center/mock-crises.ts" header="src/app/crisis-center/mock-crises.ts"></code-example>

結果的にクライシスセンターは、新しいコンセプト&mdash;子ルートを導入するための基盤となっています。
クライシスセンターとの対比として、ヒーローズを現状のままにしておくこともできます。

<div class="alert is-helpful">

<a href="https://blog.8thlight.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html" title="Separation of Concerns">Separation of Concernsの原則</a>に則り、クライシスセンターへの変更は、`AppModule` や他のフィーチャーのコンポーネントには影響を与えません。

</div>

{@a crisis-child-routes}

### 子ルートを持つクライシスセンター

このセクションでは、Angularアプリケーションで推奨される以下のパターンに準拠してクライシスセンターを構成する方法を紹介します：

* 各機フィ＝チャーエリアは、それぞれのフォルダに存在します。
* 各フィーチャーには、独自のAngularフィーチャーモジュールが存在します。
* 各エリアには、それぞれのエリアルートコンポーネントがあります。
* 各エリアルートコンポーネントは、独自のルーターアウトレットと子ルートを持ちます。
* フィーチャーエリアのルートが他のフィーチャーのルートと交差することは、ほとんどありません。

アプリケーションに多くのフィーチャーエリアがある場合、コンポーネントツリーはそれらのフィーチャーのための複数のコンポーネントと、それぞれに関連する他のコンポーネントのブランチで構成されているかもしれません。


{@a child-routing-component}


### 子ルーティングコンポーネント

`crisis-center` フォルダに `CrisisCenter` コンポーネントを生成します：

<code-example language="sh">
  ng generate component crisis-center/crisis-center
</code-example>

コンポーネントテンプレートを以下のマークアップで更新します：

<code-example path="router/src/app/crisis-center/crisis-center/crisis-center.component.html" header="src/app/crisis-center/crisis-center/crisis-center.component.html"></code-example>

`CrisisCenterComponent` は、`AppComponent` と以下の共通点があります：

* `AppComponent` がアプリケーション全体のルートであるように、`CrisisCenterComponent` はクライシスセンターエリアのルートである。
* `AppComponent` がハイレベルなワークフローを管理するためのシェルであるように、クライシスセンター機能エリアのシェルである。

ほとんどのシェルと同様に、`CrisisCenterComponent` クラスはビジネスロジックを持たないため最小限に抑えられており、そのテンプレートにはリンクがなく、クライシス管理センターのタイトルと子コンポーネントのための `<router-outlet>` があるだけです。

{@a child-route-config}

### 子ルートの設定

「クライシスセンター」機能のホストページとして、`crisis-center` フォルダ内に `CrisisCenterHome` コンポーネントを生成します。

<code-example language="sh">
  ng generate component crisis-center/crisis-center-home
</code-example>

テンプレートを更新して、`Crisis Center` へのウェルカムメッセージを表示します。

<code-example path="router/src/app/crisis-center/crisis-center-home/crisis-center-home.component.html" header="src/app/crisis-center/crisis-center-home/crisis-center-home.component.html"></code-example>

`heroes-routing.module.ts` ファイルからコピーして名前を変更した`crisis-center-routing.module.ts` を更新します。
今回は、親の `crisis-center` ルートの中に子のルートを定義します。

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.1.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (Routes)" region="routes"></code-example>

親の `crisis-center` ルートには `children` プロパティがあり、`CrisisListComponent` を含む1つのルートがあることに注意してください。
また、`CrisisListComponent` ルートは、2つのルートを持つ `children` 配列を持っています。

これらの2つのルートはクライシスセンターの子コンポーネントにナビゲートします。
それぞれ、`CrisisCenterHomeComponent` と `CrisisDetailComponent` です。

ルーターの子ルートの扱い方に重要な違いがあります。

ルーターは、これらのルートのコンポーネントを `AppComponent` シェルの `RouterOutlet` ではなく、`CrisisCenterComponent` の `RouterOutlet` に表示します。

`CrisisListComponent` には、クライシスリストと、`Crisis Center Home` と `Crisis Detail` のルートコンポーネントを表示するための `RouterOutlet` が含まれます。

`Crisis Detail` ルートは `Crisis List` の子です。
ルーターはデフォルトで[コンポーネントを再利用](#reuse)するので、`Crisis Detail` のコンポーネントは、異なるクライシスを選択すると再利用されます。
対照的に、`Hero Detail` ルートでは、ヒーローのリストから異なるヒーローを選択するたびに[コンポーネントが再作成](#snapshot-the-no-observable-alternative)されていました。

トップレベルでは、`/`で始まるパスは、アプリケーションのルートを参照します。
しかし、子ルートでは親ルートのパスを拡張します。
ルートツリーの各ステップごとに、
パスが空でない限り、スラッシュの後にルートのパスを追加します。

このロジックを、親パスが `/crisis-center` となっているクライシスセンター内のナビゲーションに適用します。

* `CrisisCenterHomeComponent` に移動するには、完全なURLは `/crisis-center` (`/crisis-center` + `''` + `''`) となります。

* `id=2` のクライシスの `CrisisDetailComponent` に移動するには、完全なURLは、
`/crisis-center/2` (`/crisis-center` + `''` + `'/2'`) となります。

後者の例の絶対URLは、`localhost` のオリジンを含めて、以下のようになります：

<code-example>
  localhost:4200/crisis-center/2

</code-example>

以下は、インポートされた `crisis-center-routing.module.ts` ファイルの全体像です。

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.1.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (excerpt)"></code-example>

{@a import-crisis-module}

### クライシスセンターモジュールを `AppModule` のルートにインポートする

`HeroesModule` と同様に、`AppModule` の `imports` 配列に `CrisisCenterModule` を
`AppRoutingModule` の_前に_追加する必要があります：

<code-tabs>

  <code-pane path="router/src/app/crisis-center/crisis-center.module.ts"header="src/app/crisis-center/crisis-center.module.ts">

  </code-pane>

  <code-pane path="router/src/app/app.module.4.ts" header="src/app/app.module.ts (import CrisisCenterModule)" region="crisis-center-module">

  </code-pane>

</code-tabs>

<div class="alert is-helpful">
モジュールで定義されているルートの順番がルートマッチングに影響するので、モジュールのインポート順序は重要です。
`AppModule` が最初にインポートされた場合、そのワイルドカードルート（`path: '**'`）は、`CrisisCenterModule` で定義されたルートよりも優先されます。
詳しくは、[ルートの順序](guide/router#route-order)の項を参照してください。
</div>

現在は、`HeroesModule` と `CrisisCenter` モジュールがフィーチャールートを提供しているので、`app-routing.module.ts` から最初のクライシスセンターのルートを削除します。

なお、`app-routing.module.ts` ファイルには、デフォルトルートやワイルドカードルートなど、トップレベルのアプリケーションルートが残されています。

<code-example path="router/src/app/app-routing.module.3.ts" header="src/app/app-routing.module.ts (v3)" region="v3"></code-example>

{@a relative-navigation}

### 相対ナビゲーション

クライシスセンターのフィーチャーを構築する際、スラッシュで始まる絶対パスを使って、
クライシスの詳細ルートにナビゲートしました。

ルーターは、このような絶対パスを、ルート構成の先頭から順にルートにマッチさせます。

このような絶対パスを使ってクライシスセンターのフィーチャー内を移動することは可能ですが、その場合は親のルーティング構造へのリンクが固定されます。
親の `/crisis-center` パスを変更すると、リンクのパラメータ配列も変更しなければなりません。

現在のURLセグメントからの相対パスを定義することで、この依存関係からリンクを解放することができます。
フィーチャーへの親ルートのパスを変更しても、フィーチャーエリア内のナビゲーションはそのまま維持されます。


<div class="alert is-helpful">

ルーターは、ルート名の検索を助けるために、 _リンクパラメータリストリンク_ でディレクトリライクな構文をサポートしています：

`./` または `先頭のスラッシュな` は現在のレベルからの相対的なものです。

`../` はルートパスの1つ上のレベルに移動します。

相対的なナビゲーションの構文と祖先のパスを組み合わせることができます。
兄弟ルートに移動しなければならない場合、`../<sibling>`という規約を使って、1つ上の階層に移動した後、
兄弟ルートのパスを越えて下に降りることができます。

</div>

`Router.navigate` メソッドで相対パスをナビゲートするには、`ActivatedRoute` を供給して
現在のルートツリーのどこにいるのかという情報をルーターに与える必要があります。

_リンクパラメータ配列_ の後に、`ActivatedRoute` に `relativeTo` プロパティを設定したオブジェクトを追加します。
するとルーターは、アクティブなルートの位置に基づいて、ターゲットのURLを計算します。

<div class="alert is-helpful">

ルーターの `navigateByUrl()` メソッドを呼び出す際には、常に完全な絶対パスを指定してください。

</div>

{@a nav-to-crisis}

### 相対URLでクライシスリストにナビゲートする

相対的なナビゲーションパスを構成するのに必要な `ActivatedRoute` はすでに注入されています。

`Router` サービスの代わりに `RouterLink` を使用してナビゲートする場合は、同じリンクパラメータ配列を使用しますが、オブジェクトに `relativeTo` プロパティを指定することはありません。
`RouterLink` ディレクティブでは，`ActivatedRoute` が暗黙の了解となっています．

`CrisisDetailComponent` の `gotoCrises()` メソッドを更新し、相対パスナビゲーションを使ってクライシスセンターリストに戻るようにしました。

<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (relative navigation)" region="gotoCrises-navigate"></code-example>

パスは `../` 構文を使って1つ上の階層に上がっていることに注意してください。
現在のクライシスの `id` が `3` であれば、クライシスリストに戻る結果のパスは `/crisis-center/;id=3;foo=foo` となります。

{@a named-outlets}

### 名前付きアウトレットに複数のルートを表示する

クライシスセンターに連絡する手段をユーザーに提供することにしました。
ユーザーが "Contact" ボタンをクリックすると、ポップアップビューにメッセージを表示します。


ポップアップは、アプリケーションのページを切り替えても、ユーザーがメッセージを送信するかキャンセルしてポップアップを閉じるまで、開いたままにしておく必要があります。
ユーザーがメッセージを送信するか、キャンセルしてポップアップを閉じるまで、アプリケーションのページを切り替えても、ポップアップは開いたままでなければなりません。
明らかに、ポップアップを他のページと同じアウトレットに置くことはできません。


これまでは、1つのアウトレットを定義し、そのアウトレットの下に子ルートを入れ子にしてルートをまとめていました。
ルーターは、プライマリな無名アウトレットはテンプレートごとに1つしかサポートしていません。

1つのテンプレートは、任意の数の名前付きアウトレットを持つことができます。
それぞれの名前付きアウトレットは、独自のコンポーネントを持つルートのセットを持っています。
複数のアウトレットは、異なるルートで決定された異なるコンテンツを、すべて同時に表示することができます。

`AppComponent` に "popup"という名前のアウトレットを、無名アウトレットのすぐ下に追加します。

<code-example path="router/src/app/app.component.4.html" header="src/app/app.component.html (outlets)" region="outlets"></code-example>

ポップアップコンポーネントをルーティングする方法を学べば、そこにポップアップが表示されるようになります。

{@a secondary-routes}

#### セカンダリルート

名前の付いたアウトレットは、_セカンダリルート_ のターゲットとなります。

セカンダリルートはプライマリルートに似ており、同じように設定します。
しかし、いくつかの重要な点が異なります。

* 互いに独立しています。
* 他のルートと組み合わせて動作します。
* 名前の付いたアウトレットに表示されます。

メッセージを構成する新しいコンポーネントを生成します。

<code-example language="sh">
  ng generate component compose-message
</code-example>

ヘッダー、メッセージ用の入力ボックス、"Send "と "Cancel "の2つのボタンからなる
ショートフォームを表示します。

<div class="lightbox">
  <img src='generated/images/guide/router/contact-form.png' alt="Contact textarea with send and cancel buttons">
</div>

ここでは、コンポーネントとそのテンプレート、そしてスタイルを紹介します：

<code-tabs>

  <code-pane
      header="src/app/compose-message/compose-message.component.html"
      path="router/src/app/compose-message/compose-message.component.html">
  </code-pane>

  <code-pane
      header="src/app/compose-message/compose-message.component.ts"
      path="router/src/app/compose-message/compose-message.component.ts">
  </code-pane>

  <code-pane
      header="src/app/compose-message/compose-message.component.css"
      path="router/src/app/compose-message/compose-message.component.css">
  </code-pane>

</code-tabs>

このコンポーネントは、このガイドの他のコンポーネントと似ていますが、2つの重要な違いがあります。

`send()` メソッドは、メッセージを "送信" してポップアップを閉じるまでに1秒待つことで、待ち時間をシミュレートしていることに注意してください。

`closePopup()` メソッドは、[セカンダリルートをクリアする](#clear-secondary-routes)のセクションで説明されているように、`null` を使ってポップアップの出口に移動することで、ポップアップビューを閉じます。

{@a add-secondary-route}

#### セカンダリルートの追加

`AppRoutingModule` を開き、`appRoutes` に新しい `compose` ルートを追加します。

<code-example path="router/src/app/app-routing.module.3.ts" header="src/app/app-routing.module.ts (compose route)" region="compose"></code-example>

`path` と `component` プロパティに加えて、`outlet` という新しいプロパティがあり、`'popup'` に設定されています。
これで、このルートはポップアップのアウトレットをターゲットとし、`ComposeMessageComponent` がそこに表示されるようになります。

ユーザーがポップアップを開く方法を提供するために、`AppComponent` テンプレートに "Contact" リンクを追加します。

<code-example path="router/src/app/app.component.4.html" header="src/app/app.component.html (contact-link)" region="contact-link"></code-example>

`compose` ルートには "popup" というアウトレットが設定されていますが、ルートを `RouterLink` ディレクティブに接続するにはそれだけでは不十分です。
_リンクパラメータ配列_ で名前の付いたアウトレットを指定して、それを `RouterLink` にプロパティバインディングで結合する必要があります。

_リンクパラメータ配列_ には、1つの `outlets` プロパティを持つオブジェクトが含まれており、その値は1つ（または複数）のアウトレット名をキーにした別のオブジェクトです。
この例では、"popup" というアウトレットのプロパティだけがあり、その値は別の _リンクパラメータ配列_ で、`compose` ルートを指定しています。

つまり、ユーザーがこのリンクをクリックすると、ルーターは `compose` ルートに関連付けられたコンポーネントを `popup` アウトレットに表示します。

<div class="alert is-helpful">

外側のオブジェクトの中にあるこの `outlets` オブジェクトは、1つのルートと1つの無名アウトレットしかない場合には不要でした。

ルーターは、あなたのルート指定が名前のないプライマリーアウトレットをターゲットにしていると仮定し、これらのオブジェクトを作成しました。

名前のあるアウトレットへのルート指定は、ルーターの機能を明らかにしました。
同じ `RouterLink` ディレクティブで複数のルートを指定して、複数のアウトレットをターゲットにすることができるのです。

</div>

{@a secondary-route-navigation}

#### セカンダリルートナビゲーション：ナビゲーション中にルートをマージする

_Crisis Center_ に移動し、"Contact" をクリックします。
ブラウザのアドレスバーに以下のようなURLが表示されるはずです。

<code-example>
  http://.../crisis-center(popup:compose)

</code-example>

URLの関連部分は、`...`に続いています。

* `crisis-center` はプライマリナビゲーションです。
* 括弧でセカンダリルートを囲みます。
* セカンダリルートは，アウトレット名 (`popup`) 、`colon` セパレーター、およびセカンダリルートのパス (`compose`) で構成されます．

_Heroes_ リンクをクリックして、もう一度URLを見てみましょう。

<code-example>
  http://.../heroes(popup:compose)
</code-example>

プライマリナビゲーションは変更されていますが、セカンダリルートは同じです。

ルーターは、ナビゲーションツリーの2つの別々のブランチを追跡し、そのツリー表現をURLに生成しています。

さらに多くのアウトレットやルートをトップレベルやネストしたレベルに追加して、多くのブランチを持つナビゲーションツリーを作成することができ、ルーターはそれに合わせてURLを生成します。

`outlets` オブジェクトを記入し、そのオブジェクトを _リンクパラメータ配列_ の中に入れて `router.navigate` メソッドに渡すことで、ツリー全体を一度にナビゲートするようルータに指示することができます。

{@a clear-secondary-routes}

#### セカンダリルートの消去

通常のアウトレットと同様に、セカンダリアウトレットは、新しいコンポーネントにナビゲートして移動するまで存続します。

各セカンダリアウトレットは、プライマリアウトレットを駆動するナビゲーションとは独立した独自のナビゲーションを持っています。
プライマリーアウトレットに表示されているルートを変更しても、ポップアップアウトレットには影響しません。
そのため、クライシスやヒーローの間を移動しても、ポップアップは表示されたままになります。

再び `closePopup()` メソッド：

<code-example path="router/src/app/compose-message/compose-message.component.ts" header="src/app/compose-message/compose-message.component.ts (closePopup)" region="closePopup"></code-example>

"send" または "cancel" ボタンをクリックすると、ポップアップビューが消去されます。
`closePopup()` 関数は、`Router.navigate()` メソッドに[リンクパラメータ配列](#link-parameters-array)を渡すことで、必須のナビゲーションを行います。

`AppComponent` の_Contact_`RouterLink`にバインドされた配列と同様に、この配列にも `outlets` プロパティを持つオブジェクトが含まれています。
`outlets` プロパティの値は、キーにアウトレット名を持つ別のオブジェクトです。
唯一のアウトレット名は `'popup'` です。

今回、`'popup'` の値は `null` です。
これはルートではありませんが、正当な値です。
ポップアップの `RouterOutlet` を `null` に設定すると、アウトレットがクリアされ、現在のURLからセカンダリのポップアップルートが削除されます。

{@a guards}

{@a milestone-5-route-guards}


## マイルストーン 5: ルートガード

現時点では、ユーザーはいつでもアプリケーション内の任意の場所に移動することができますが、様々な理由でアプリケーションの異なる部分へのアクセスを制御する必要がある場合があります。その中には以下のようなものがあるかもしれません：

* ユーザーがターゲットコンポーネントへの移動を許可されていない可能性があります。
* おそらく、ユーザーは最初にログイン（認証）する必要があります。
* ターゲット・コンポーネントを表示する前に、いくつかのデータをフェッチする必要があるかもしれません。
* コンポーネントを離れる前に、保留中の変更を保存したい場合があります。
* 保留中の変更を保存するのではなく、破棄してもよいかどうかをユーザに尋ねることがあります。

これらのシナリオを処理するために、ルート設定にガードを追加します。

ガードの戻り値は、ルータの動作を制御します：

* `true` を返した場合、ナビゲーションプロセスは続行されます。
* `false` を返した場合、ナビゲーションプロセスは停止し、ユーザーはそのままの状態になります。
* `UrlTree` を返した場合、現在のナビゲーションはキャンセルされ、返された `UrlTree` への新たなナビゲーションが開始されます。

<div class="alert is-helpful">

**注意：** ガードは、ルーターに別の場所に移動するように指示することもでき、現在の移動を効果的にキャンセルします。
ガードの中でそれを行う場合、ガードは `false` を返さなければなりません。

</div>

ガードはそのブール値の答えを同期的に返すかもしれません。
しかし、多くの場合、ガードは同期的に答えを出すことはできません。
ガードは、ユーザに質問したり、サーバに変更を保存したり、新しいデータを取得したりすることができます。
これらはすべて非同期の操作です。

したがって、ルーティングガードは `Observable<boolean>` や `Promise<boolean>` を返すことができます。
ルーターはオブザバブルが `true` または `false` に解決するのを待ちます。

<div class="alert is-critical">

**注意：** `Router` に提供されるオブザバブルも完了する必要があります。オブザバブルが完了しない場合、ナビゲーションは続行されません。

</div>

ルーターは複数のガードインターフェイスをサポートしています：

* [`CanActivate`](api/router/CanActivate) は、ルート*への*ナビゲーションを仲介します。

* [`CanActivateChild`](api/router/CanActivateChild) は、子ルート*への*ナビゲーションを仲介します。

* [`CanDeactivate`](api/router/CanDeactivate) は、現在のルートから*離れる*ためのナビゲーションを仲介します。

* [`Resolve`](api/router/Resolve) は、ルートをアクティブにする*前に*、ルートデータの検索を行います。

* [`CanLoad`](api/router/CanLoad) は、_非同期的に_ロードされたフィーチャーモジュール*への*ナビゲーションを仲介します。


ルーティング階層の各レベルで複数のガードを持つことができます。
ルーターは、一番深い子ルートから上に向かって、最初に `CanDeactivate` ガードをチェックします。
次に、`CanActivate` と `CanActivateChild` のガードを、一番上から一番下の子ルートまでチェックします。
フィーチャーモジュールが非同期にロードされる場合は、モジュールがロードされる前に `CanLoad` ガードがチェックされます。
もし、_いずれかの_ガードが false を返すと、完了していない保留中のガードがキャンセルされ、ナビゲーション全体がキャンセルされます。

次のいくつかのセクションでは、複数の例を紹介します。

{@a can-activate-guard}

### `CanActivate`: 認証を必要とする

アプリケーションでは、ユーザーが誰であるかに基づいてフィーチャー領域へのアクセスを制限することがよくあります。
認証されたユーザーや特定の役割を持つユーザーにのみアクセスを許可することができます。
また、ユーザのアカウントが有効になるまで、アクセスをブロックしたり制限したりすることもあるでしょう。

`CanActivate` ガードは、これらのナビゲーションビジネスルールを管理するツールです。

#### 管理機能モジュールの追加

このセクションでは、クライシスセンターに新しい管理機能を追加する方法を説明します。
まず、`AdminModule` という名前の新しいフィーチャーモジュールを追加します。

フィーチャーモジュールファイルとルーティング設定ファイルを含む `admin` フォルダを作成します。

<code-example language="sh">
  ng generate module admin --routing
</code-example>

Next, generate the supporting components.

<code-example language="sh">
  ng generate component admin/admin-dashboard
</code-example>

<code-example language="sh">
  ng generate component admin/admin
</code-example>

<code-example language="sh">
  ng generate component admin/manage-crises
</code-example>

<code-example language="sh">
  ng generate component admin/manage-heroes
</code-example>

The admin feature file structure looks like this:


<div class='filetree'>

  <div class='file'>
    src/app/admin
  </div>

  <div class='children'>

    <div class='file'>
      admin
    </div>

      <div class='children'>

        <div class='file'>
          admin.component.css
        </div>

        <div class='file'>
          admin.component.html
        </div>

        <div class='file'>
          admin.component.ts
        </div>

      </div>

    <div class='file'>
      admin-dashboard
    </div>

      <div class='children'>

        <div class='file'>
          admin-dashboard.component.css
        </div>

        <div class='file'>
          admin-dashboard.component.html
        </div>

        <div class='file'>
          admin-dashboard.component.ts
        </div>

      </div>

    <div class='file'>
      manage-crises
    </div>

      <div class='children'>

        <div class='file'>
          manage-crises.component.css
        </div>

        <div class='file'>
          manage-crises.component.html
        </div>

        <div class='file'>
          manage-crises.component.ts
        </div>

      </div>

    <div class='file'>
      manage-heroes
    </div>

      <div class='children'>

        <div class='file'>
          manage-heroes.component.css
        </div>

        <div class='file'>
          manage-heroes.component.html
        </div>

        <div class='file'>
          manage-heroes.component.ts
        </div>

      </div>

    <div class='file'>
      admin.module.ts
    </div>

    <div class='file'>
      admin-routing.module.ts
    </div>

  </div>

</div>

管理機能モジュールには、フィーチャーモジュール内のルーティングに使用される `AdminComponent` と、
ダッシュボードのルート、そしてクライシスとヒーローを管理する2つの未完成のコンポーネントが含まれています。

<code-tabs>

  <code-pane header="src/app/admin/admin/admin.component.html"  path="router/src/app/admin/admin/admin.component.html">

  </code-pane>

  <code-pane header="src/app/admin/admin-dashboard/admin-dashboard.component.html" path="router/src/app/admin/admin-dashboard/admin-dashboard.component.1.html">

  </code-pane>

  <code-pane header="src/app/admin/admin.module.ts" path="router/src/app/admin/admin.module.ts">

  </code-pane>

  <code-pane header="src/app/admin/manage-crises/manage-crises.component.html" path="router/src/app/admin/manage-crises/manage-crises.component.html">

  </code-pane>

  <code-pane header="src/app/admin/manage-heroes/manage-heroes.component.html"  path="router/src/app/admin/manage-heroes/manage-heroes.component.html">

  </code-pane>

</code-tabs>

<div class="alert is-helpful">

管理画面の `RouterLink` には相対スラッシュのみが含まれ、追加のURLセグメントは含まれませんが、管理画面のフィーチャーエリア内のどのルートにもマッチします。
ユーザーがそのルートにアクセスしたときに、`Dashboard` のリンクがアクティブになるようにするだけです。
`Dashboard` の routerLink に追加のバインディング `[routerLinkActiveOptions]="{ exact: true }"` を追加すると、ユーザーが `/admin` のURLに移動したときに `./` リンクがアクティブになり、子ルートに移動したときにはアクティブになりません。

</div>

{@a component-less-route}

##### コンポーネントレスルート：コンポーネントを持たないルートのグループ化

アドミンのルーティングの初期設定は、このようになっています：

<code-example path="router/src/app/admin/admin-routing.module.1.ts" header="src/app/admin/admin-routing.module.ts (admin routing)" region="admin-routes"></code-example>

`AdminComponent` の下にある子ルートは、`path` と`children` のプロパティを持っていますが、`component` を使っていません。
これは _component-less_ ルートを定義しています。

マネジメントルートである `Crisis Center` を `admin` パスにまとめるためには、コンポーネントは必要ありません。
さらに、_component-less_ ルートは、[子ルートのガード](#can-activate-child-guard) を容易にします。

Next, import the `AdminModule` into `app.module.ts` and add it to the `imports` array
to register the admin routes.
次に、`AdminModule` を `app.module.ts` にインポートして、`imports` 配列に追加し、
アドミンルートを登録します。

<code-example path="router/src/app/app.module.4.ts" header="src/app/app.module.ts (admin module)" region="admin-module"></code-example>

ユーザーがこの機能を利用できるように、`AppComponent` シェルに "Admin" リンクを追加します。

<code-example path="router/src/app/app.component.5.html" header="src/app/app.component.html (template)"></code-example>

{@a guard-admin-feature}

#### アドミンフィーチャーをガードする

現在、クライシスセンター内のすべてのルートは誰でもアクセス可能です。
新しいアドミンフィーチャーは、認証されたユーザのみがアクセスできるようにする必要があります。

匿名のユーザーがアドミンエリアに入ろうとしたときにログインページにリダイレクトするために、
`canActivate()` ガードメソッドを書きます。

`auth` フォルダに `AuthGuard` を生成します。

<code-example language="sh">
  ng generate guard auth/auth
</code-example>

基本的なことを説明するために、この例ではコンソールにログを出力し、すぐに true を`返し`、ナビゲーションを続行できるようにしています：

<code-example path="router/src/app/auth/auth.guard.1.ts" header="src/app/auth/auth.guard.ts (excerpt)"></code-example>

次に、`admin-routing.module.ts` を開き、`AuthGuard` クラスをインポートします。
それを参照する `canActivate` ガードプロパティで admin ルートを更新します：

<code-example path="router/src/app/admin/admin-routing.module.2.ts" header="src/app/admin/admin-routing.module.ts (guarded admin route)" region="admin-route"></code-example>

アドミンフィーチャーはガードによって守られるようになりましたが、ガードが完全に機能するためにはさらにカスタマイズが必要です。

{@a teach-auth}

#### `AuthGuard` で認証を行う

`AuthGuard` に認証の真似事をさせます。

`AuthGuard` はユーザーをログインさせ、現在のユーザーに関する情報を保持できるアプリケーションサービスを呼び出す必要があります。`auth` フォルダに新しい `AuthService` を作成します：

<code-example language="sh">
  ng generate service auth/auth
</code-example>

ユーザーをログインさせるために、`AuthService` を更新します：

<code-example path="router/src/app/auth/auth.service.ts" header="src/app/auth/auth.service.ts (excerpt)"></code-example>

実際にはログインしませんが、ユーザーが認証されているかどうかを知るために `isLoggedIn` フラグを持っています。
`login()` メソッドは、外部サービスへのAPIコールをシミュレートするために、短い休止時間の後に正常に解決されるオブザーバブルを返します。
`redirectUrl` プロパティには、ユーザーがアクセスしようとしたURLが格納されるので、認証後にそのURLに移動することができます。

<div class="alert is-helpful">

最小限に抑えるために、この例では、認証されていないユーザーを `/admin` にリダイレクトしています。

</div>

`AuthGuard` が `AuthService` を呼び出すように修正しました。

<code-example path="router/src/app/auth/auth.guard.2.ts" header="src/app/auth/auth.guard.ts (v2)"></code-example>

コンストラクタで `AuthService` と `Router` を注入していることに注目してください。
まだ `AuthService` を提供していませんが、便利なサービスをルーティングガードに注入できることを知っておくといいでしょう。

このガードは、同期したブール値の結果を返します。
ユーザーがログインしている場合、このガードは true を返し、ナビゲーションを続行します。

`ActivivatedRouteSnapshot` には、今後有効化される_未来_のルートが格納され、`RouterStateSnapshot` には、ガードチェックを通過した場合のアプリケーションの_未来_の `RouterState` が格納されています。

ユーザーがログインしていない場合には、`RouterStateSnapshot.url` を使ってユーザーが訪れたURLを保存し、ルーターにログインページ&mdash;まだ作成していないページにリダイレクトするように指示します。
`UrlTree` を返すことで、`Router` は現在のナビゲーションをキャンセルし、ユーザーをリダイレクトするための新しいナビゲーションを予約します。

{@a add-login-component}

#### Add the `LoginComponent`

#### `LoginComponent` の追加

ユーザーがアプリケーションにログインするためには、`LoginComponent` が必要です。ログイン後、保存されているURLがあればそこにリダイレクトするか、デフォルトのURLを使用します。
このコンポーネントや、ルーターの設定で使用する方法については、特に目新しいものはありません。

<code-example language="sh">
  ng generate component auth/login
</code-example>

`auth/auth-routing.module.ts` に `/login` ルートを登録します。
`app.module.ts` では、`AuthModule` をインポートして、`AppModule` の import に追加します。


<code-tabs>

  <code-pane header="src/app/app.module.ts" path="router/src/app/app.module.ts" region="auth">

  </code-pane>

  <code-pane header="src/app/auth/login/login.component.html" path="router/src/app/auth/login/login.component.html">

  </code-pane>

  <code-pane header="src/app/auth/login/login.component.ts" path="router/src/app/auth/login/login.component.1.ts">

  </code-pane>

  <code-pane header="src/app/auth/auth.module.ts" path="router/src/app/auth/auth.module.ts">

  </code-pane>

</code-tabs>


{@a can-activate-child-guard}

### `CanActivateChild`: 子ルートのガード

`CanActivateChild` ガードで子ルートを保護することもできます。
`CanActivateChild` ガードは `CanActivate` ガードと似ています。
主な違いは、子ルートがアクティブになる前に実行されることです。

アドミン機能モジュールを不正なアクセスから保護しました。
また、フィーチャーモジュール_内_の子ルートも保護する必要があります。

`AuthGuard` を拡張して、`admin` ルートの間を移動するときに保護するようにします。
`auth.guard.ts` を開き、`CanActivateChild` インターフェースを、ルーターパッケージからインポートしたトークンに追加します。

次に、`canActivate()` メソッドと同じ引数： `ActivatedRouteSnapshot` と `RouterStateSnapshot`を取る、`canActivateChild()` メソッドを実装します。
`canActivateChild()` メソッドは、非同期のチェックでは `Observable<boolean|UrlTree>` や `Promise<boolean|UrlTree>` を、同期のチェックでは `boolean` や `UrlTree` を返すことができます。
これは、ユーザーがアドミンフィーチャーモジュールにアクセスできるようにするためには `true` を、代わりにログインページにリダイレクトするためには `UrlTree` を返します：

<code-example path="router/src/app/auth/auth.guard.3.ts" header="src/app/auth/auth.guard.ts (excerpt)" region="can-activate-child"></code-example>

Add the same `AuthGuard` to the `component-less` admin route to protect all other child routes at one time
instead of adding the `AuthGuard` to each route individually.
`AuthGuard` を各ルートに追加する代わりに、
同じ `AuthGuard` を `component-less` の admin ルートに追加して、他のすべての子ルートを一度に保護します。

<code-example path="router/src/app/admin/admin-routing.module.3.ts" header="src/app/admin/admin-routing.module.ts (excerpt)" region="can-activate-child"></code-example>

{@a can-deactivate-guard}


### `CanDeactivate`: handling unsaved changes

### `CanDeactivate`: 保存されていない変更の処理

"Heroes" のワークフローに戻ると、アプリケーションはヒーローに対するすべての変更を検証なしですぐに受け入れます。

現実の世界では、ユーザーの変更を蓄積したり、フィールド間で検証したり、サーバー上で検証したり、ユーザーがグループとして確認するか、キャンセルしてすべての変更を元に戻すまで、変更を保留状態で保持する必要があるかもしれません。

ユーザーがナビゲートして離れたとき、保存されていない変更をどうするかをユーザーに決めさせることができます。
ユーザーがキャンセルした場合は、そのままの状態で、さらに変更を許可します。
ユーザーが承認した場合、アプリケーションは保存できます。

それでも、保存が成功するまでナビゲーションを遅らせるかもしれません。
ユーザーをすぐに次の画面に移動させ、保存が失敗した場合（データが無効と判断された場合など）、エラーの文脈を失うことになります。

非同期的にサーバーが回答を返すのを待つ間、ナビゲーションを停止する必要があります。

`CanDeactivate` ガードは、保存されていない変更をどうするか、どのように進めるかを決めるのに役立ちます。

{@a cancel-save}

#### キャンセルして保存

ユーザーは `CrisisDetailComponent` でクライシス情報を更新します。
`HeroDetailComponent` とは異なり、ユーザーの変更はクライシスのエンティティをすぐには更新しません。
代わりに、アプリケーションはユーザーが Save ボタンを押したときにエンティティを更新し、ユーザーが Cancel ボタンを押したときに変更を破棄します。

どちらのボタンも、保存またはキャンセル後にクライシスリストに戻るようになっています。

<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (cancel and save methods)" region="cancel-save"></code-example>

このシナリオでは、ユーザーはヒーローのリンクをクリックしたり、キャンセルしたり、ブラウザの戻るボタンを押したり、保存せずに移動したりすることができます。

このアプリケーション例では、確認ダイアログボックスでユーザーに明示的な要求を行い、
ユーザーの応答を非同期的に待ちます。

<div class="alert is-helpful">

同期的なブロッキングコードでユーザーの回答を待つこともできますが、非同期的にユーザーの回答を待った方が、アプリケーションの応答性&mdash;そして他の作業を行うことができます&mdash;。

</div>

ユーザーの確認を行うための `Dialog` サービスを生成します。

<code-example language="sh">
  ng generate service dialog
</code-example>

ユーザーに意思確認を促すために，`DialogService` に `confirm()` メソッドを追加します。
`window.confirm` はモーダルなダイアログを表示して、ユーザーの操作を待つブロッキングアクションです。

<code-example path="router/src/app/dialog.service.ts" header="src/app/dialog.service.ts"></code-example>

これは、ユーザーが最終的に何をすべきかを決定するときに解決する `Observable` を返します。変更を破棄してナビゲートする（`true`）か、保留中の変更を保持して危機管理エディタに留まる（`false`）かのどちらかです。

{@a CanDeactivate}

コンポーネント&mdash;あらゆるコンポーネントに `canDeactivate()` メソッドがあるかどうかをチェックするガードを生成します。

<code-example language="sh">
  ng generate guard can-deactivate
</code-example>

以下のコードをガードに貼り付けます。

<code-example path="router/src/app/can-deactivate.guard.ts" header="src/app/can-deactivate.guard.ts"></code-example>

ガードはどのコンポーネントが deactivate メソッドを持っているかを知る必要はありませんが、`CrisisDetailComponent` コンポーネントが `canDeactivate()` メソッドを持っていることを検出して、それを呼び出すことができます。
ガードがどのコンポーネントの deactivate メソッドの詳細を知らないことで、ガードの再利用が可能になります。

あるいは、`CrisisDetailComponent` のために，コンポーネント固有の `CanDeactivate` ガードを作ることもできます。
`canDeactivate()` メソッドは、外部の情報にアクセスする必要がある場合に備えて、`component` の現在のインスタンス、現在の`ActivatedRoute`、`RouterStateSnapshot`を提供します。
これは、このコンポーネントに対してのみこのガードを使用したい場合や、コンポーネントのプロパティを取得したり、ルーターがコンポーネントからのナビゲーションを許可するかどうかを確認する必要がある場合に便利です。

<code-example path="router/src/app/can-deactivate.guard.1.ts" header="src/app/can-deactivate.guard.ts (component-specific)"></code-example>

`CrisisDetailComponent` を見てみると、未保存の変更に対する確認のワークフローが実装されています。

<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (excerpt)" region="canDeactivate"></code-example>

`canDeactivate()` メソッドは同期的に返すことができることに注意してください。クライシスがなかったり、保留中の変更がなかったりすると、すぐに `true` を返します。
しかし、`Promise` や `Observable` を返すこともでき、ルーターはそれが truthy (ナビゲートする)または falsy (現在のルートに留まる)に解決するのを待ちます。

`crisis-center-routing.module.ts` のクライシスの詳細ルートに、`canDeactivate` の配列プロパティを使って `Guard` を追加します。

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.3.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (can deactivate guard)"></code-example>

これで、ユーザーに保存されていない変更に対する保護手段を与えたことになります。

{@a Resolve}

{@a resolve-guard}

### _Resolve_: pre-fetching component data

In the `Hero Detail` and `Crisis Detail`, the application waited until the route was activated to fetch the respective hero or crisis.

If you were using a real world API, there might be some delay before the data to display is returned from the server.
You don't want to display a blank component while waiting for the data.

To improve this behavior, you can pre-fetch data from the server using a resolver so it's ready the
moment the route is activated.
This also allows you to handle errors before routing to the component.
There's no point in navigating to a crisis detail for an `id` that doesn't have a record.
It'd be better to send the user back to the `Crisis List` that shows only valid crisis centers.

In summary, you want to delay rendering the routed component until all necessary data has been fetched.


{@a fetch-before-navigating}

#### Fetch data before navigating

At the moment, the `CrisisDetailComponent` retrieves the selected crisis.
If the crisis is not found, the router navigates back to the crisis list view.

The experience might be better if all of this were handled first, before the route is activated.
A `CrisisDetailResolver` service could retrieve a `Crisis` or navigate away, if the `Crisis` did not exist, _before_ activating the route and creating the `CrisisDetailComponent`.

Generate a `CrisisDetailResolver` service file within the `Crisis Center` feature area.

<code-example language="sh">
  ng generate service crisis-center/crisis-detail-resolver
</code-example>

<code-example path="router/src/app/crisis-center/crisis-detail-resolver.service.1.ts" header="src/app/crisis-center/crisis-detail-resolver.service.ts (generated)"></code-example>

Move the relevant parts of the crisis retrieval logic in `CrisisDetailComponent.ngOnInit()` into the `CrisisDetailResolverService`.
Import the `Crisis` model, `CrisisService`, and the `Router` so you can navigate elsewhere if you can't fetch the crisis.

Be explicit and implement the `Resolve` interface with a type of `Crisis`.

Inject the `CrisisService` and `Router` and implement the `resolve()` method.
That method could return a `Promise`, an `Observable`, or a synchronous return value.

The `CrisisService.getCrisis()` method returns an observable in order to prevent the route from loading until the data is fetched.
The `Router` guards require an observable to `complete`, which means it has emitted all
of its values.
You use the `take` operator with an argument of `1` to ensure that the `Observable` completes after retrieving the first value from the Observable returned by the `getCrisis()` method.

If it doesn't return a valid `Crisis`, then return an empty `Observable`, cancel the previous in-progress navigation to the `CrisisDetailComponent`, and navigate the user back to the `CrisisListComponent`.
The updated resolver service looks like this:

<code-example path="router/src/app/crisis-center/crisis-detail-resolver.service.ts" header="src/app/crisis-center/crisis-detail-resolver.service.ts"></code-example>

Import this resolver in the `crisis-center-routing.module.ts` and add a `resolve` object to the `CrisisDetailComponent` route configuration.

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.4.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (resolver)"></code-example>

The `CrisisDetailComponent` should no longer fetch the crisis.
When you re-configured the route, you changed where the crisis is.
Update the `CrisisDetailComponent` to get the crisis from the  `ActivatedRoute.data.crisis` property instead;

<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (ngOnInit v2)" region="ngOnInit"></code-example>

Note the following three important points:

1. The router's `Resolve` interface is optional.
The `CrisisDetailResolverService` doesn't inherit from a base class.
The router looks for that method and calls it if found.

1. The router calls the resolver in any case where the user could navigate away so you don't have to code for each use case.

1. Returning an empty `Observable` in at least one resolver will cancel navigation.

The relevant Crisis Center code for this milestone follows.

<code-tabs>

  <code-pane header="app.component.html" path="router/src/app/app.component.html">

  </code-pane>

  <code-pane header="crisis-center-home.component.html" path="router/src/app/crisis-center/crisis-center-home/crisis-center-home.component.html">

  </code-pane>

  <code-pane header="crisis-center.component.html" path="router/src/app/crisis-center/crisis-center/crisis-center.component.html">

  </code-pane>

  <code-pane header="crisis-center-routing.module.ts" path="router/src/app/crisis-center/crisis-center-routing.module.4.ts">

  </code-pane>

  <code-pane header="crisis-list.component.html" path="router/src/app/crisis-center/crisis-list/crisis-list.component.html">

  </code-pane>

  <code-pane header="crisis-list.component.ts" path="router/src/app/crisis-center/crisis-list/crisis-list.component.ts">

  </code-pane>

  <code-pane header="crisis-detail.component.html" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.html">

  </code-pane>

  <code-pane header="crisis-detail.component.ts" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts">

  </code-pane>

  <code-pane header="crisis-detail-resolver.service.ts" path="router/src/app/crisis-center/crisis-detail-resolver.service.ts">

  </code-pane>

  <code-pane header="crisis.service.ts" path="router/src/app/crisis-center/crisis.service.ts">

  </code-pane>

  <code-pane header="dialog.service.ts" path="router/src/app/dialog.service.ts">

  </code-pane>

</code-tabs>

Guards

<code-tabs>

  <code-pane header="auth.guard.ts" path="router/src/app/auth/auth.guard.3.ts">

  </code-pane>

  <code-pane header="can-deactivate.guard.ts" path="router/src/app/can-deactivate.guard.ts">

  </code-pane>

</code-tabs>

{@a query-parameters}

{@a fragment}

### Query parameters and fragments

In the [route parameters](#optional-route-parameters) section, you only dealt with parameters specific to the route.
However, you can use query parameters to get optional parameters available to all routes.

[Fragments](https://en.wikipedia.org/wiki/Fragment_identifier) refer to certain elements on the page
identified with an `id` attribute.

Update the `AuthGuard` to provide a `session_id` query that will remain after navigating to another route.

Add an `anchor` element so you can jump to a certain point on the page.

Add the `NavigationExtras` object to the `router.navigate()` method that navigates you to the `/login` route.

<code-example path="router/src/app/auth/auth.guard.4.ts" header="src/app/auth/auth.guard.ts (v3)"></code-example>

You can also preserve query parameters and fragments across navigations without having to provide them again when navigating.
In the `LoginComponent`, you'll add an *object* as the second argument in the `router.navigateUrl()` function and provide the `queryParamsHandling` and `preserveFragment` to pass along the current query parameters and fragment to the next route.

<code-example path="router/src/app/auth/login/login.component.ts" header="src/app/auth/login/login.component.ts (preserve)" region="preserve"></code-example>

<div class="alert is-helpful">

The `queryParamsHandling` feature also provides a `merge` option, which preserves and combines the current query parameters with any provided query parameters when navigating.

</div>

To navigate to the Admin Dashboard route after logging in, update `admin-dashboard.component.ts` to handle the
query parameters and fragment.

<code-example path="router/src/app/admin/admin-dashboard/admin-dashboard.component.1.ts" header="src/app/admin/admin-dashboard/admin-dashboard.component.ts (v2)"></code-example>

Query parameters and fragments are also available through the `ActivatedRoute` service.
Like route parameters, the query parameters and fragments are provided as an `Observable`.
The updated Crisis Admin component feeds the `Observable` directly into the template using the `AsyncPipe`.

Now, you can click on the Admin button, which takes you to the Login page with the provided `queryParamMap` and `fragment`.
After you click the login button, notice that you have been redirected to the `Admin Dashboard` page with the query parameters and fragment still intact in the address bar.

You can use these persistent bits of information for things that need to be provided across pages like authentication tokens or session ids.

<div class="alert is-helpful">

The `query params` and `fragment` can also be preserved using a `RouterLink` with
the `queryParamsHandling` and `preserveFragment` bindings respectively.

</div>


{@a asynchronous-routing}

## Milestone 6: Asynchronous routing

As you've worked through the milestones, the application has naturally gotten larger.
At some point you'll reach a point where the application takes a long time to load.

To remedy this issue, use asynchronous routing, which loads feature modules lazily, on request.
Lazy loading has multiple benefits.

* You can load feature areas only when requested by the user.
* You can speed up load time for users that only visit certain areas of the application.
* You can continue expanding lazy loaded feature areas without increasing the size of the initial load bundle.

You're already part of the way there.
By organizing the application into modules&mdash;`AppModule`,
`HeroesModule`, `AdminModule` and `CrisisCenterModule`&mdash;you
have natural candidates for lazy loading.

Some modules, like `AppModule`, must be loaded from the start.
But others can and should be lazy loaded.
The `AdminModule`, for example, is needed by a few authorized users, so
you should only load it when requested by the right people.

{@a lazy-loading-route-config}

### Lazy Loading route configuration

Change the `admin` path in the `admin-routing.module.ts` from `'admin'` to an empty string, `''`, the empty path.

Use empty path routes to group routes together without adding any additional path segments to the URL.
Users will still visit `/admin` and the `AdminComponent` still serves as the Routing Component containing child routes.

Open the `AppRoutingModule` and add a new `admin` route to its `appRoutes` array.

Give it a `loadChildren` property instead of a `children` property.
The `loadChildren` property takes a function that returns a promise using the browser's built-in syntax for lazy loading code using dynamic imports `import('...')`.
The path is the location of the `AdminModule` (relative to the application root).
After the code is requested and loaded, the `Promise` resolves an object that contains the `NgModule`, in this case the `AdminModule`.

<code-example path="router/src/app/app-routing.module.5.ts" region="admin-1" header="app-routing.module.ts (load children)"></code-example>

<div class="alert is-important">

*Note*: When using absolute paths, the `NgModule` file location must begin with `src/app` in order to resolve correctly. For custom [path mapping with absolute paths](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping), you must configure the `baseUrl` and `paths` properties in the project `tsconfig.json`.

</div>

When the router navigates to this route, it uses the `loadChildren` string to dynamically load the `AdminModule`.
Then it adds the `AdminModule` routes to its current route configuration.
Finally, it loads the requested route to the destination admin component.

The lazy loading and re-configuration happen just once, when the route is first requested; the module and routes are available immediately for subsequent requests.


<div class="alert is-helpful">

Angular provides a built-in module loader that supports SystemJS to load modules asynchronously. If you were
using another bundling tool, such as Webpack, you would use the Webpack mechanism for asynchronously loading modules.

</div>

Take the final step and detach the admin feature set from the main application.
The root `AppModule` must neither load nor reference the `AdminModule` or its files.

In `app.module.ts`, remove the `AdminModule` import statement from the top of the file
and remove the `AdminModule` from the NgModule's `imports` array.

{@a can-load-guard}

### `CanLoad`: guarding unauthorized loading of feature modules

You're already protecting the `AdminModule` with a `CanActivate` guard that prevents unauthorized users from accessing the admin feature area.
It redirects to the login page if the user is not authorized.

But the router is still loading the `AdminModule` even if the user can't visit any of its components.
Ideally, you'd only load the `AdminModule` if the user is logged in.

Add a `CanLoad` guard that only loads the `AdminModule` once the user is logged in _and_ attempts to access the admin feature area.

The existing `AuthGuard` already has the essential logic in its `checkLogin()` method to support the `CanLoad` guard.

Open `auth.guard.ts`.
Import the `CanLoad` interface from `@angular/router`.
Add it to the `AuthGuard` class's `implements` list.
Then implement `canLoad()` as follows:

<code-example path="router/src/app/auth/auth.guard.ts" header="src/app/auth/auth.guard.ts (CanLoad guard)" region="canLoad"></code-example>

The router sets the `canLoad()` method's `route` parameter to the intended destination URL.
The `checkLogin()` method redirects to that URL once the user has logged in.

Now import the `AuthGuard` into the `AppRoutingModule` and add the `AuthGuard` to the `canLoad`
array property for the `admin` route.
The completed admin route looks like this:

<code-example path="router/src/app/app-routing.module.5.ts" region="admin" header="app-routing.module.ts (lazy admin route)"></code-example>

{@a preloading}

### Preloading: background loading of feature areas

In addition to loading modules on-demand, you can load modules asynchronously with preloading.

The `AppModule` is eagerly loaded when the application starts, meaning that it loads right away.
Now the `AdminModule` loads only when the user clicks on a link, which is called lazy loading.

Preloading allows you to load modules in the background so that the data is ready to render when the user activates a particular route.
Consider the Crisis Center.
It isn't the first view that a user sees.
By default, the Heroes are the first view.
For the smallest initial payload and fastest launch time, you should eagerly load the `AppModule` and the `HeroesModule`.

You could lazy load the Crisis Center.
But you're almost certain that the user will visit the Crisis Center within minutes of launching the app.
Ideally, the application would launch with just the `AppModule` and the `HeroesModule` loaded and then, almost immediately, load the `CrisisCenterModule` in the background.
By the time the user navigates to the Crisis Center, its module will have been loaded and ready.

{@a how-preloading}

#### How preloading works

After each successful navigation, the router looks in its configuration for an unloaded module that it can preload.
Whether it preloads a module, and which modules it preloads, depends upon the preload strategy.

The `Router` offers two preloading strategies:

* No preloading, which is the default. Lazy loaded feature areas are still loaded on-demand.
* Preloading of all lazy loaded feature areas.

The router either never preloads, or preloads every lazy loaded module.
The `Router` also supports [custom preloading strategies](#custom-preloading) for fine control over which modules to preload and when.

This section guides you through updating the `CrisisCenterModule` to load lazily by default and use the `PreloadAllModules` strategy to load all lazy loaded modules.

{@a lazy-load-crisis-center}

#### Lazy load the crisis center

Update the route configuration to lazy load the `CrisisCenterModule`.
Take the same steps you used to configure `AdminModule` for lazy loading.

1. Change the `crisis-center` path in the `CrisisCenterRoutingModule` to an empty string.

1. Add a `crisis-center` route to the `AppRoutingModule`.

1. Set the `loadChildren` string to load the `CrisisCenterModule`.

1. Remove all mention of the `CrisisCenterModule` from `app.module.ts`.


Here are the updated modules _before enabling preload_:


<code-tabs>

  <code-pane header="app.module.ts" path="router/src/app/app.module.ts" region="preload">

  </code-pane>

  <code-pane header="app-routing.module.ts" path="router/src/app/app-routing.module.6.ts" region="preload-v1">

  </code-pane>

  <code-pane header="crisis-center-routing.module.ts" path="router/src/app/crisis-center/crisis-center-routing.module.ts">

  </code-pane>

</code-tabs>

You could try this now and confirm that the  `CrisisCenterModule` loads after you click the "Crisis Center" button.

To enable preloading of all lazy loaded modules, import the `PreloadAllModules` token from the Angular router package.

The second argument in the `RouterModule.forRoot()` method takes an object for additional configuration options.
The `preloadingStrategy` is one of those options.
Add the `PreloadAllModules` token to the `forRoot()` call:

<code-example path="router/src/app/app-routing.module.6.ts" header="src/app/app-routing.module.ts (preload all)" region="forRoot"></code-example>

This configures the `Router` preloader to immediately load all lazy loaded routes (routes with a `loadChildren` property).

When you visit `http://localhost:4200`, the `/heroes` route loads immediately upon launch and the router starts loading the `CrisisCenterModule` right after the `HeroesModule` loads.

Currently, the `AdminModule` does not preload because `CanLoad` is blocking it.

{@a preload-canload}

#### `CanLoad` blocks preload

The `PreloadAllModules` strategy does not load feature areas protected by a [CanLoad](#can-load-guard) guard.

You added a `CanLoad` guard to the route in the `AdminModule` a few steps back to block loading of that module until the user is authorized.
That `CanLoad` guard takes precedence over the preload strategy.

If you want to preload a module as well as guard against unauthorized access, remove the `canLoad()` guard method and rely on the [canActivate()](#can-activate-guard) guard alone.

{@a custom-preloading}

### Custom Preloading Strategy

Preloading every lazy loaded module works well in many situations.
However, in consideration of things such as low bandwidth and user metrics, you can use a custom preloading strategy for specific feature modules.

This section guides you through adding a custom strategy that only preloads routes whose `data.preload` flag is set to `true`.
Recall that you can add anything to the `data` property of a route.

Set the `data.preload` flag in the `crisis-center` route in the `AppRoutingModule`.

<code-example path="router/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts (route data preload)" region="preload-v2"></code-example>

Generate a new `SelectivePreloadingStrategy` service.

<code-example language="sh">
  ng generate service selective-preloading-strategy
</code-example>

Replace the contents of `selective-preloading-strategy.service.ts` with the following:

<code-example path="router/src/app/selective-preloading-strategy.service.ts" header="src/app/selective-preloading-strategy.service.ts"></code-example>

`SelectivePreloadingStrategyService` implements the `PreloadingStrategy`, which has one method, `preload()`.

The router calls the `preload()` method with two arguments:

1. The route to consider.
1. A loader function that can load the routed module asynchronously.

An implementation of `preload` must return an `Observable`.
If the route does preload, it returns the observable returned by calling the loader function.
If the route does not preload, it returns an `Observable` of `null`.

In this sample, the  `preload()` method loads the route if the route's `data.preload` flag is truthy.

As a side-effect, `SelectivePreloadingStrategyService` logs the `path` of a selected route in its public `preloadedModules` array.

Shortly, you'll extend the `AdminDashboardComponent` to inject this service and display its `preloadedModules` array.

But first, make a few changes to the `AppRoutingModule`.

1. Import `SelectivePreloadingStrategyService` into `AppRoutingModule`.
1. Replace the `PreloadAllModules` strategy in the call to `forRoot()` with this `SelectivePreloadingStrategyService`.

Now edit the `AdminDashboardComponent` to display the log of preloaded routes.

1. Import the `SelectivePreloadingStrategyService`.
1. Inject it into the dashboard's constructor.
1. Update the template to display the strategy service's `preloadedModules` array.

Now the file is as follows:

<code-example path="router/src/app/admin/admin-dashboard/admin-dashboard.component.ts" header="src/app/admin/admin-dashboard/admin-dashboard.component.ts (preloaded modules)"></code-example>

Once the application loads the initial route, the `CrisisCenterModule` is preloaded.
Verify this by logging in to the `Admin` feature area and noting that the `crisis-center` is listed in the `Preloaded Modules`.
It also logs to the browser's console.

{@a redirect-advanced}

### Migrating URLs with redirects

You've setup the routes for navigating around your application and used navigation imperatively and declaratively.
But like any application, requirements change over time.
You've setup links and navigation to `/heroes` and `/hero/:id` from the `HeroListComponent` and `HeroDetailComponent` components.
If there were a requirement that links to `heroes` become `superheroes`, you would still want the previous URLs to navigate correctly.
You also don't want to update every link in your application, so redirects makes refactoring routes trivial.

{@a url-refactor}

#### Changing `/heroes` to `/superheroes`

This section guides you through migrating the `Hero` routes to new URLs.
The `Router` checks for redirects in your configuration before navigating, so each redirect is triggered when needed. To support this change, add redirects from the old routes to the new routes in the `heroes-routing.module`.

<code-example path="router/src/app/heroes/heroes-routing.module.ts" header="src/app/heroes/heroes-routing.module.ts (heroes redirects)"></code-example>

Notice two different types of redirects.
The first change is from  `/heroes` to `/superheroes` without any parameters.
The second change is from `/hero/:id` to `/superhero/:id`, which includes the `:id` route parameter.
Router redirects also use powerful pattern-matching, so the `Router` inspects the URL and replaces route parameters in the `path` with their appropriate destination.
Previously, you navigated to a URL such as `/hero/15` with a route parameter `id` of `15`.

<div class="alert is-helpful">

The `Router` also supports [query parameters](#query-parameters) and the [fragment](#fragment) when using redirects.

* When using absolute redirects, the `Router` will use the query parameters and the fragment from the `redirectTo` in the route config.
* When using relative redirects, the `Router` use the query params and the fragment from the source URL.

</div>

Currently, the empty path route redirects to `/heroes`, which redirects to `/superheroes`.
This won't work because the `Router` handles redirects once at each level of routing configuration.
This prevents chaining of redirects, which can lead to endless redirect loops.

Instead, update the empty path route in `app-routing.module.ts` to redirect to `/superheroes`.

<code-example path="router/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts (superheroes redirect)"></code-example>

A `routerLink` isn't tied to route configuration, so update the associated router links to remain active when the new route is active.
Update the `app.component.ts` template for the `/heroes` `routerLink`.

<code-example path="router/src/app/app.component.html" header="src/app/app.component.html (superheroes active routerLink)"></code-example>

Update the `goToHeroes()` method in the `hero-detail.component.ts` to navigate back to `/superheroes` with the optional route parameters.

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.ts" region="redirect" header="src/app/heroes/hero-detail/hero-detail.component.ts (goToHeroes)"></code-example>

With the redirects setup, all previous routes now point to their new destinations and both URLs still function as intended.

{@a inspect-config}

### Inspect the router's configuration

To determine if your routes are actually evaluated [in the proper order](#routing-module-order), you can inspect the router's configuration.

Do this by injecting the router and logging to the console its `config` property.
For example, update the `AppModule` as follows and look in the browser console window
to see the finished route configuration.

<code-example path="router/src/app/app.module.7.ts" header="src/app/app.module.ts (inspect the router config)" region="inspect-config"></code-example>

{@a final-app}

## Final application

For the completed router application, see the <live-example name="router"></live-example> for the final source code.

{@a link-parameters-array}
