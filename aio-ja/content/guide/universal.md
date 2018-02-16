# Angular Universal: サーバーサイドレンダリング

このガイドでは、サーバー上で Angular アプリケーションを実行する技術である **Angular Universal** について説明します。

通常の Angular アプリケーションは、_ブラウザー_ 上で実行され、ユーザーアクションに応じて DOM 内のページをレンダリングします。

**Angular Universal** は **server-side rendering (SSR)** と呼ばれるプロセスを通じて、_サーバー_ 上に _静的な_ アプリケーションページを生成します。

ブラウザーからのリクエストに応じて、これらのページを生成し配信することができます。また後に配信する HTML ファイルとして、ページを事前に生成することもできます。

このガイドでは、サーバーレンダリングされたページとしてすぐに起動する Universal アプリケーションのサンプルについて説明します。その過程において、ブラウザーは完全なクライアントバージョンをダウンロードし、コードがロードされた後自動でそれに切り替わります。

<div class="l-sub-section">

[最終的なサンプルコードのダウンロード](generated/zips/universal/universal.zip) (これは [node / express フレームワーク](https://expressjs.com/) で動作するサーバーです)

</div>

{@a why-do-it}

### なぜ Universal が必要なのか

アプリケーションの Universal バージョンを作成する主な理由は 3 つあります。

1. Web クローラー（SEO）を容易にする
1. モバイルおよび低スペックデバイスのパフォーマンスを向上させる
1. 最初のページを素早く表示する

{@a seo}
{@a web-crawlers}

#### Web クローラー を支援する

Google、Bing、Facebook、Twitter などのソーシャルメディアサイトは、Web クローラーに依存してアプリケーションコンテンツのインデックスを作成し、そのコンテンツを Web 上で検索可能にします。

これらの Web クローラーは、高度にインタラクティブな Angular アプリケーションをユーザーと同様に操作してインデックス化できないかもしれません。

Angular Universal は、JavaScript なしで簡単に検索、リンク、ナビゲートできる静的バージョンのアプリケーションを生成できます。また、各 URL は完全にレンダリングされたページを返すため、サイトのプレビューも利用可能となります。

Web クローラーの有効化は、よく [Search Engine Optimization (SEO)](https://static.googleusercontent.com/media/www.google.com/en//webmasters/docs/search-engine-optimization-starter-guide.pdf) と呼ばれます。

{@a no-javascript}

### モバイルおよび低スペックデバイスのパフォーマンス

一部の端末では JavaScript をサポートしていないか、ユーザー体験が容認できないほどに JavaScript の実行が不完全です。

このような場合、サーバー側でレンダリングされた JavaScript 未使用バージョンのアプリケーションが必要になることがあります。そのバージョンを使用するケースはそう多くありませんが、このアプリケーションをまったく利用できない人々のための唯一の実用的な代替手段になるかもしれません。

{@a startup-performance}

### 最初のページを素早く表示する

最初のページを素早く表示することは、ユーザーエンゲージメントの面で非常に重要です。

ページの表示に 3 秒以上かかる場合、[モバイルサイト訪問者の 53% が離脱しました](https://www.doubleclickbygoogle.com/articles/mobile-speed-matters/)。あなたのアプリケーションは、ユーザーの気が散る前に引き止めるため、より早く立ち上げる必要があります。

Angular Universal を使用すると、完全なアプリケーションのようなランディングページを生成できます。このページは純粋な HTML であり、JavaScript が無効になっていても表示できます。このページはブラウザーイベントを処理しませんが、[routerLink](guide/router#router-link) を使用して、サイトを介したナビゲーションをサポートします。

実際には、ランディングページの静的バージョンを配信し、ユーザーの注意を引きつけます。同時に [以下に説明する方法](#transition) で、バックグラウンドに完全な Angular アプリケーションを読み込みます。ユーザーはこのランディングページがら瞬間的なレスポンスを認識し、アプリケーションが完全に読み込まれた後、インタラクティブな体験を得ることができます。

{@a how-does-it-work}

### 使い方

Universal アプリケーションを作成するには、`platform-server` パッケージをインストールします。
`platform-server` パッケージには、DOM、`XMLHttpRequest`、ブラウザーに依存しないその他の低レイヤーなサーバー実装が含まれています。

クライアントアプリケーションを `platform-browser` モジュールの代わりに `platform-server` モジュールでコンパイルします。結果として得られる Universal アプリケーション を Web サーバーで実行します。

サーバー (_この_ ガイドの例では [Node Express](https://expressjs.com/)) は、アプリケーションページからのクライアントリクエストを Universal の
`renderModuleFactory` 関数に渡します。

`renderModuleFactory` 関数は、*template* HTML ページ (通常は `index.html`)、コンポーネントを含む Angular *module*、そしてどのコンポーネントを表示するか決定する *ルート* を入力として受け取ります。

そのルートは、クライアントのサーバーへのリクエストから発生します。各リクエストは、要求されたルートの適切なビューをもたらします。

`renderModuleFactory` はテンプレートの `<app>` タグ内でそのビューをレンダリングし、クライアント用の最終的な HTML ページを作成します。

最後に、サーバーはレンダリングされたページをクライアントに返します。

### ブラウザー API の操作

Universal な `platform-server` アプリケーションはブラウザー上で実行されないため、サーバー上に存在しないいくつかのブラウザー API と機能を回避する必要があります。

`window`、`document`、`navigator` や `location` のようなブラウザー専用のネイティブオブジェクトは参照できません。サーバーレンダリングされたページでそれらを必要としない場合は、条件付きロジックで回避します。

あるいは、`Location` や `Document` など必要なオブジェクトに対して注入可能な Angular abstraction を探します。あなたが使用している特定の API を適切に置き換えることができるかもしれません。
Angular がそれを提供していない場合、ブラウザー上でブラウザー API に委譲し、サーバー上では十分な代替機能を提供するための独自抽象処理を書くことができるかもしれません。

マウスやキーボードのイベントがなければ、Universal アプリケーションはコンポーネントを表示するためにユーザーのボタンクリックを頼ることはできません。Universal アプリケーションは、受信したクライアントリクエストのみに基づき、何をレンダリングするか決定する必要があります。これは、アプリケーションを [ルーティング可能](guide/router) とするために十分な情報です。

サーバーレンダリングされたページのユーザーはリンクをクリックする以外に多くのことを行うことができないため、本来のインタラクティブな体験を得るためにできるだけ早く [実際のクライアントアプリへ移行](#transition) する必要があります。

{@a the-example}

## 例

_Tour of Heroes_ チュートリアルは、このガイドで説明している Universal サンプルのベースです。

コアとなるアプリケーションファイルはほとんど変更されていませんが、次に説明するいくつかの例外があります。
Universal を使用してビルドおよび配信をサポートするファイルを追加しましょう。

この例では、Angular CLI が、アプリケーションの Universal バージョンを [AOT (Ahead-of-Time) コンパイラー](guide/aot-compiler) でコンパイルして一纏めにします。
node/express Web サーバーは、クライアントリクエストを Universal によってレンダリングされた HTML ページへ変換します。

次のファイルを生成しましょう:

* サーバーサイドのアプリケーションモジュール、`app.server.module.ts`
* サーバー側のエントリーポイント、`main.server.ts`
* リクエストを処理するための express web サーバー、`server.ts`
* TypeScript の設定ファイル、`tsconfig.server.json`
* サーバー用の Webpack 設定ファイル、`webpack.server.config.js`

完了後、フォルダー構造は次のようになります:

<code-example format="." language="none" linenums="false">
src/
  index.html                 <i>アプリケーションの web ページ</i>
  main.ts                    <i>クライアント用の初期化処理</i>
  main.server.ts             <i>* サーバー用の初期化処理</i>
  tsconfig.app.json          <i>クライアント用の TypeScript 設定</i>
  tsconfig.server.json       <i>* サーバー用の TypeScript 設定</i>
  tsconfig.spec.json         <i>テスト用の TypeScript 設定</i>
  style.css                  <i>アプリケーションのスタイル</i>
  app/ ...                   <i>アプリケーションコード</i>
    app.server.module.ts     <i>* サーバー用のアプリケーションモジュール</i>
server.ts                    <i>* express web サーバー</i>
tsconfig.json                <i>クライアント用の TypeScript 設定</i>
package.json                 <i>npm の設定</i>
webpack.server.config.js     <i>* サーバー用の Webpack 設定</i>
</code-example>

`*` マークがついているファイルは新規に作成するもので、元のチュートリアルサンプルには含まれていません。このガイドでは、それらを次のセクションで説明します。

{@a preparation}

## 準備

[Tour of Heroes](generated/zips/toh-pt6/toh-pt6.zip) プロジェクトをダウンロードし、そこから依存パッケージをインストールしてください。

{@a install-the-tools}

### ツールのインストール

はじめに、これらのパッケージをインストールします。

* `@angular/platform-server` - Universal サーバーサイドコンポーネント
* `@nguniversal/module-map-ngfactory-loader` - サーバーレンダリング環境下で遅延読み込みを処理するため
* `@nguniversal/express-engine` - Universal アプリケーション用の express エンジン
* `ts-loader` - サーバーアプリケーションをトランスパイルするため

下記コマンドでそれらをインストールしましょう:

<code-example format="." language="bash">
npm install --save @angular/platform-server @nguniversal/module-map-ngfactory-loader ts-loader @nguniversal/express-engine
</code-example>

{@a transition}

### クライアントアプリケーションの編集

Universal アプリケーションは、動的でユーザーを引き付けるコンテンツ満載の "スプラッシュ画面" として機能します。それは、ほぼ瞬間的にアプリケーションの外観を提供します。

その間、ブラウザーはバックグラウンドでクライアントアプリケーションのスクリプトをダウンロードします。ロードが終わると、Angular はサーバー側でレンダリングされた静的なページから、動的にレンダリングされたインタラクティブなクライアントアプリケーションのビューに移行します。

サーバー側のレンダリングとクライアントアプリケーションへの移行を共にサポートするためには、アプリケーションのコードを少し変更する必要があります。

#### ルート `AppModule`

`src/app/app.module.ts` を開き、`NgModule` のメタデータ内で `BrowserModule` インポートを探します。そのインポートを次の内容へ置き換えます：

<code-example path="universal/src/app/app.module.ts" region="browsermodule" title="src/app/app.module.ts (withServerTransition)">
</code-example>

Angular は、サーバーでレンダリングされたページのスタイル名に `appId` 値 (_何らかの_ 文字列) を追加するため、クライアントアプリケーションの起動時にそれらを識別して削除することができます。

現在のプラットホームと `appId` についての実行情報は注入によって取得することができます。

<code-example path="universal/src/app/app.module.ts" region="platform-detection" title="src/app/app.module.ts (platform detection)">
</code-example>

{@a http-urls}

#### HTTP リクエストの絶対 URL

このチュートリアルの `HeroService` と `HeroSearchService` は、アプリケーションデータの取得を Angular の `Http` モジュールに委譲します。これらのサービスは、`api/heroes` などの _相対_ URL にリクエストを送信します。

Universal アプリケーションにおいて `Http` の URL は、Universal web サーバーがこれらのリクエストを扱える場合でも _絶対_ パスでなければなりません。(例. `https://my-server.com/api/heroes`)

サーバーで実行している際は絶対 URL で、ブラウザーで実行している場合は相対 URL をリクエストするように、それらのサービスを変更する必要があります。

解決策の 1 つは、Angular の [`APP_BASE_REF` トークン](api/common/APP_BASE_HREF) を介してサーバー実行時のオリジンを提供してそれをサービスに注入し、リクエスト URL にオリジンを付与することです。

まず、`APP_BASE_HREF` トークンを介してオプションで注入された第 2 引数である `origin` パラメーターを取得するように、`HeroService` のコンストラクタを変更します。

<code-example path="universal/src/app/hero.service.ts" region="ctor" title="src/app/hero.service.ts (constructor with optional origin)">
</code-example>

コンストラクタが `heroesUrl` に対して、(もし存在すれば) オリジンをどのように付与するかに注目してください。

ブラウザーバージョンでは `APP_BASE_HREF` を提供しないので、`heroesUrl` は相対的なままです。

<div class="l-sub-section">

チュートリアルのサンプルで行うように、`index.html` でルーターのベースアドレスを決定するため `<base href="/">` を指定している場合、ブラウザーでは `APP_BASE_HREF` を無視することができます。

</div>

{@a server-code}

## サーバー側のコード

Angular Universal アプリケーションを実行するためには、クライアントリクエストを受け、レンダリングされたページを返すサーバーが必要です。

{@a app-server-module}

### アプリケーションサーバーのモジュール

アプリケーションサーバーのモジュールクラス (慣例的に `AppServerModule` と呼ばれています) は、Universal がアプリケーションとサーバーを仲介できるようにするために、アプリケーションのルートモジュール (`AppModule`) をラップしている Angular モジュールです。
`AppServerModule` は、Universal アプリケーションとして動作している際にアプリケーションを初期化する方法を Angular に伝えます。

次の `AppServerModule` コードを使用し、`src/app/` ディレクトリーに `app.server.module.ts` ファイルを作成しましょう:

<code-example path="universal/src/app/app.server.module.ts" title="src/app/app.server.module.ts">
</code-example>

最初にクライアントアプリケーションの `AppModule`、Angular Universal の　`ServerModule` そして `ModuleMapLoaderModule` をインポートしていることに注目してください。

`ModuleMapLoaderModule` は、ルートの遅延ロードを可能にするサーバー側のモジュールです。

これは、Universal 環境下でアプリケーションを実行するために特定のプロバイダーを登録する場所でもあります。

{@a web-server}

### Universal web サーバー

_Universal_ web サーバーは、[Universal テンプレートエンジン](#universal-engine) によってレンダリングされた静的 HTML を使用して、アプリケーションの _ページ_ リクエストに応答します。

クライアント (通常はブラウザー) からの HTTP リクエストを受信して応答します。それは、スクリプト、CSS、画像などの静的リソースを配信します。おそらく、直接または別のデータサーバーのプロキシとして、データのリクエストに応答するでしょう。

_この_ ガイドのサンプル web サーバーは、一般的な [Express](https://expressjs.com/) フレームワークに基づいています。

<div class="l-sub-section">

_何らかの_ web サーバー技術は Universal の `renderModuleFactory` を呼び出せば Universal アプリケーションを提供することができます。以下で説明する原則と意思決定のポイントは、選択したすべての web サーバー技術に当てはまります。

</div>

ルートディレクトリーに `server.ts` ファイルを作成し、次のコードを追加しましょう:

<code-example path="universal/server.ts" title="server.ts">
</code-example>

<div class="alert is-critical">

**このサンプルサーバーは安全ではありません！**
ミドルウェアを追加して、通常の Angular アプリケーションサーバーと同様に、認証およびユーザー認可を行ってください。

</div>

{@a universal-engine}

#### Universal テンプレートエンジン

このファイルで重要なポイントは、`ngExpressEngine` 関数です:

<code-example path="universal/server.ts" title="server.ts" region="ngExpressEngine">
</code-example>

`ngExpressEngine` は、Universal における `renderModuleFactory` 関数のラッパーで、クライアントのリクエストをサーバーレンダリングされた HTML ページへ変換します。
_テンプレートエンジン_ 内では、サーバー処理に適した関数を呼び出します。

最初のパラメーターは、[先程](#app-server-module) 書いた `AppServerModule` です。これは、Universal サーバー側のレンダリング処理とアプリケーション間を仲介します。

2 番目のパラメーターは `extraProviders` です。これは任意で指定する Angular における依存性の注入を行うプロバイダーであり、サーバー側で実行する際に適用されます。

{@a provide-origin}

アプリケーションが現在実行中のサーバーインスタンスによってのみ決定できる情報を必要とする際に `extraProviders` を指定します。

この場合に必要な情報は `APP_BASE_HREF` トークンの下で提供されている実行中サーバーのオリジンなので、アプリケーションは [HTTP リクエスト の絶対 URL を判断](#http-urls) することができます。

`ngExpressEngine` 関数はレンダリングされたページを解決する _promise_ を返します。

そのページで何をするかはエンジン次第です。
_このエンジンの_ promise コールバックは、レンダリングされたページを [web サーバー](#web-server) へ返し、HTTP レスポンスとしてクライアントに転送します。

<div class="l-sub-section">

このラッパーは `renderModuleFactory` の複雑さを隠蔽するという点で非常に有用です。この他にも、[Universal リポジトリー](https://github.com/angular/universal) には異なるバックエンド技術のためのラッパーが用意されています。

</div>

#### リクエスト URL のフィルター

web サーバーは _アプリケーションページのリクエスト_ と他の種類のリクエストを区別する必要があります。

それは、ルートアドレス `/` に対するリクエストの傍受ほど簡単ではありません。ブラウザーは、`/dashboard`、`/heroes`、`/detail:12` といったアプリケーションルートの 1 つを要求できます。実際に、アプリケーションがサーバーによって _のみ_ レンダリングされた場合、クリックされた _すべての_ アプリケーションリンクはルータ用のナビゲーション URL としてサーバーに到達します。

幸いアプリケーションルートの URL には、ファイル拡張子が存在しないといった共通点があります。

データリクエストには拡張機能もありませんが、常に `/api`で始まるので、簡単に認識できます。

すべての静的アセットリクエストにはファイル拡張子が存在します。(たとえば、`main.js` または `/node_modules/zone.js/dist/zone.js`)

したがって、3 タイプのリクエストを簡単に識別し、それらを別々に処理することができます。

1. データリクエスト - `/api` から始まるリクエスト URL
2. アプリケーションのナビゲーション - ファイル拡張子のないリクエスト URL
3. 静的アセット - 他すべてのリクエスト

Express サーバーは、URLリクエストを順次フィルタリングして処理するミドルウェアのパイプラインです。

データリクエストを行うため、このように `app.get()' を呼び出して Express サーバーのパイプラインを設定しましょう。

<code-example path="universal/server.ts" title="server.ts (data URL)" region="data-request" linenums="false">
</code-example>

<div class="l-sub-section">

このサンプルサーバーはデータのリクエストを処理しません。

このチュートリアルのデモおよび開発ツールである "in-memory web api" モジュールは、すべての HTTP リクエストに割り込み、リモートデータサーバーの動作をシミュレートします。実際にはそのモジュールを削除し、サーバーの web API ミドルウェアをここに登録します。

</div>

<div class="alert is-critical">

** Universal  HTTP リクエストには異なるセキュリティー要件が存在します**

ブラウザーアプリケーションから生じた HTTP リクエストは、サーバー上の Universal アプリケーションから生じた HTTP リクエストと同じではありません。

ブラウザーが HTTP リクエストを行う際、サーバーは Cookie、XSRF ヘッダーなどが付与されていることを前提としています。

たとえば、ブラウザーは現在のユーザー認証 Cookie を自動的に送信します。
Angular Universal はこれらの認証情報を別のデータサーバーに転送することはできません。サーバーが HTTP リクエストを処理する際、それぞれのセキュリティーに対する処理を追加する必要があります。

</div>

次のコードは、拡張子のないリクエストの URL をフィルタリングし、ナビゲーションリクエストとして扱います。

<code-example path="universal/server.ts" title="server.ts (navigation)" region="navigation-request" linenums="false">
</code-example>

#### 静的ファイルを安全に配信する

1 つの `app.use()` を、他すべての  JavaScript、画像、および style ファイルの静的アセット用リクエスト URL として扱います。

クライアントに閲覧 _許可_ があるファイルのみをダウンロードさせるには、[すべてのクライアントアセットファイルを `/dist` フォルダーに配置](#universal-webpack-configuration) し、`/dist` フォルダーへのリクエストのみを許可してください。

次の express コードは、残りすべてのリクエストを `/dist` にルーティングし、ファイルが見つからない場合は `404 - NOT FOUND` を返します。

<code-example path="universal/server.ts" title="server.ts (static files)" region="static" linenums="false">
</code-example>

{@a universal-configuration}

## Universal の設定

サーバーアプリケーションには独自のビルド設定が必要です。

{@a universal-typescript-configuration}

### Universal の TypeScript 設定

TypeScript と Universal アプリケーションの AOT コンパイルを設定するため、プロジェクトのルートディレクトリーに `tsconfig.server.json` ファイルを作成しましょう。

<code-example path="universal/src/tsconfig.server.json" title="src/tsconfig.server.json">
</code-example>

この設定は、ルートディレクトリーの `tsconfig.json` ファイルから拡張されます。いくつかの設定の違いについて注目しましょう。

* `module` プロパティは、サーバーアプリケーションで require() することができる ** commonjs ** でなければなりません。

* `angularCompilerOptions` セクションは AOT コンパイラーをガイドします:
  * `entryModule` - サーバーアプリケーションのルートモジュールであり、`path/to/file#ClassName` で表されます。

{@a universal-webpack-configuration}

### Universal の Webpack 設定

Universal アプリケーションは、何らかの Webpack 拡張設定を必要とせず、Angular CLI がそういった設定を代行します。しかし、サーバーは typescript アプリケーションであるため、Webpack を使用してそれをトランスパイルします。

次のコードを使用して、プロジェクトのルートディレクトリーに `webpack.server.config.js` ファイルを作成します。

<code-example path="universal/webpack.server.config.js" title="webpack.server.config.js">
</code-example>

**Webpack の設定** は、このガイドで扱う範囲を超えた情報量のトピックです。

## Universal でビルドし実行する

TypeScript と Webpack の設定ファイルを作成したので、Universal アプリケーションをビルドして実行できます。

まず、_build_ と _serve_ コマンドを `package.json` の `scripts` セクションに追加してください:

<code-example format="." language="ts">
"scripts": {
    ...
    "build:universal": "npm run build:client-and-server-bundles && npm run webpack:server",
    "serve:universal": "node dist/server.js",
    "build:client-and-server-bundles": "ng build --prod && ng build --prod --app 1 --output-hashing=false",
    "webpack:server": "webpack --config webpack.server.config.js --progress --colors"
    ...
}
</code-example>

{@a build}

#### ビルド

コマンドプロンプトで下記コマンドを入力しましょう。

<code-example format="." language="bash">
npm run build:universal
</code-example>

Angular CLI は、Universal アプリケーションを 2 つの異なるフォルダー、`browser` と `server` にコンパイルして包括します。
Webpack は `server.ts` ファイルを JavaScript にトランスパイルします。

{@a serve}

#### 配信

アプリケーションをビルドしたら、サーバーを立ち上げましょう。

<code-example format="." language="bash">
npm run serve:universal
</code-example>

コンソールウィンドウには、このように表示されるはずです。

<code-example format="." language="bash">
Node server listening on http://localhost:4000
</code-example>

## Universal の挙動

http://localhost:4000/ でブラウザーを開きましょう。お馴染みの Tour of Heroes ダッシュボードページが表示されるはずです。

`routerLinks` 経由のナビゲーションは正しく動作します。ダッシュボードからヒーローリストのページに遷移し、戻ってくることができます。ダッシュボードページのヒーローをクリックすると、詳細ページが表示されます。

しかし、クリック、マウスの移動、そしてキーボード入力に対しては反応しません。

* ヒーローリストページのヒーローをクリックしても何も起こりません。
* ヒーローを追加、または削除することはできません。
* ダッシュボードページの検索ボックスは無反応です。
* 詳細ページの _戻る_ および _保存_ ボタンは機能しません。

`routerLink` のクリック以外のユーザーイベントはサポートされていません。ユーザーは、完全なクライアントアプリケーションが使用可能となるまで待機する必要があります。

それはクライアントアプリケーションをコンパイルし、出力を `dist /` フォルダーに移動するまで使用可能となりません。

## スロットリング

サーバーレンダリングされたアプリケーションからクライアントアプリケーションへの移行は、開発マシン上では迅速に行われます。遅いネットワークをシミュレートすると、移行をより明確に確認することができ、低スペックで接続が芳しくないデバイスで動作する Universal アプリケーションの起動速度に対する優位性をより正しく評価できます。

Chrome Dev Tools を開き、ネットワークタブに移動します。メニューバーの右端にある [Network Throttling](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#throttling) ドロップダウンリストを探します。

"3G" 速度の 1 つを試してみてください。サーバーレンダリングされたアプリケーションは依然として高速で起動しますが、完全なクライアントアプリケーションでは読み込みに数秒かかることがあります。

{@a summary}

## まとめ

このガイドでは、既存の Angular アプリケーションを使用して、それをサーバーサイドレンダリングを行う Universal アプリケーションにする方法を説明しました。また、そうするべき主な理由のいくつかについても説明しました。

- web クローラーを支援する (SEO)
- 低帯域幅または低スペックデバイスのサポート
- 最初のページの高速読み込み

Angular Universal は、アプリケーション起動時のパフォーマンスを大幅に向上させることができます。ネットワークが遅いほど、Universal が最初のページをユーザーに表示するという点で、より優れた効果が発揮されます。
