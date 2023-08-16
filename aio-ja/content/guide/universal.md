# Angular Universal を使ったサーバーサイドレンダリング (SSR)

このガイドでは、Angular アプリケーションをサーバー上でレンダリングするテクノロジーである **Angular Universal** について説明します。

デフォルトでは、Angularはアプリケーションを*ブラウザー*でのみレンダリングします。Angular Universalでは、Angularが*サーバー*上でアプリケーションをレンダリングし、アプリケーションの状態を表す*静的な*HTMLコンテンツを生成します。HTMLコンテンツがブラウザでレンダリングされると、Angularはアプリケーションをブートストラップし、サーバーで生成されたHTMLにある情報を再利用します。

サーバーサイドレンダリングでは、一般にアプリケーションはブラウザでより速く描画され、ユーザーはアプリケーションのUIを完全にインタラクティブになる前に確認することができます。詳しくは、次の [サーバーサイドレンダリングを使用する理由](#why-do-it) をご覧ください。

また、SSRをめぐるさまざまなテクニックやコンセプトについては、こちらの[記事](https://developers.google.com/web/updates/2019/02/rendering-on-the-web)をご覧ください。

次のように、`@nguniversal/express-engine` パッケージを使用して、Angularアプリケーションでサーバーサイドレンダリングを有効にすることができます。

<div class="alert is-helpful">

  Angular Universal requires an [active LTS or maintenance LTS](https://nodejs.org/about/releases) version of Node.js.
  For information see the [version compatibility](guide/versions) guide to learn about the currently supported versions.

</div>

<a id="the-example"></a>

## Universal チュートリアル

[Tour of Heroes チュートリアル](tutorial/tour-of-heroes) は、このチュートリアルの基礎です。

この例では、Angular CLI は [Ahead-of-Time (AOT) コンパイラー](guide/aot-compiler)を使用してアプリケーションの Universal バージョンをコンパイルおよびバンドルします。
Node.js Express Web サーバーは、クライアント要求に基づいて、Universal で HTML ページをコンパイルします。

<div class="alert is-helpful">

<live-example downloadOnly>Download the finished sample code</live-example>, which runs in a [Node.js® Express](https://expressjs.com) server.

</div>

### Step 1. Enable Server-Side Rendering

Run the following command to add SSR support into your application:

<code-example language="bash">

ng add @nguniversal/express-engine

</code-example>

The command updates the application code to enable SSR and adds extra files to the project structure (files that are marked with the `*` symbol).

<div class='filetree'>
    <div class='file'>
        src
    </div>
    <div class='children'>
        <div class='file'>
          index.html &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- app web page
        </div>
        <div class='file'>
          main.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- bootstrapper for client app
        </div>
        <div class='file'>
          main.server.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- &ast; bootstrapper for server app
        </div>
        <div class='file'>
          style.css &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- styles for the app
        </div>
        <div class='file'>
          app/ &nbsp;&hellip; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- application code
        </div>
        <div class='children'>
            <div class='file'>
              app.config.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- client-side application configuration (standalone app only)
            </div>
            <div class='file'>
              app.module.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- client-side application module (NgModule app only)
            </div>
        </div>
        <div class='children'>
            <div class='file'>
              app.config.server.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- &ast; server-side application configuration (standalone app only)
            </div>
            <div class='file'>
              app.module.server.ts &nbsp;&nbsp;&nbsp; // &lt;-- &ast; server-side application module (NgModule app only)
            </div>
        </div>
        <div class='file'>
          server.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- &ast; express web server
        </div>
        <div class='file'>
          tsconfig.json &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- TypeScript base configuration
        </div>
        <div class='file'>
          tsconfig.app.json &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- TypeScript browser application configuration
        </div>
        <div class='file'>
          tsconfig.server.json &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- TypeScript server application configuration
        </div>
        <div class='file'>
          tsconfig.spec.json &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // &lt;-- TypeScript tests configuration
        </div>
    </div>
</div>

### Step 2. Enable Client Hydration

<div class="alert is-important">

The hydration feature is available for [developer preview](/guide/releases#developer-preview). It's ready for you to try, but it might change before it is stable.

</div>

Hydration is the process that restores the server side rendered application on the client. This includes things like reusing the server rendered DOM structures, persisting the application state, transferring application data that was retrieved already by the server, and other processes. Learn more about hydration in [this guide](guide/hydration).

You can enable hydration by updating the `app.module.ts` file. Import the `provideClientHydration` function from `@angular/platform-browser` and add the function call to the `providers` section of the `AppModule` as shown below.

```typescript
import {provideClientHydration} from '@angular/platform-browser';
// ...

@NgModule({
  // ...
  providers: [ provideClientHydration() ],  // add this line
  bootstrap: [ AppComponent ]
})
export class AppModule {
  // ...
}
```

### Step 3. Start the server

ローカルシステムで Universal を使用してアプリケーションのレンダリングを開始するには、次のコマンドを使用します。

<code-example format="shell" language="shell">

npm run dev:ssr

</code-example>

### Step 4. Run your application in a browser

Webサーバーが起動したら、ブラウザを開いて`http://localhost:4200`に移動します。
おなじみの Tour of Heroes ダッシュボードページが表示されます。

`routerLinks` を介したナビゲーションは組み込みのアンカー (`<a>`) タグを使用するため、正常に機能します。
ダッシュボードからヒーローページに遷移して戻ることができます。
ダッシュボードページでヒーローをクリックすると、その詳細ページが表示されます。

クライアント側のスクリプトのダウンロードに時間がかかるように (次の手順) ネットワーク速度を調整する場合、
次のことに気づくでしょう:
* ヒーローを追加または削除することはできません。
* ダッシュボードページの検索ボックスは無視されます。
* 詳細ページの *戻る* ボタンと *保存* ボタンは機能しません。

サーバーレンダリングされたアプリケーションからクライアントアプリケーションへの移行は開発マシンで迅速に行われますが、
実際のシナリオでは常にアプリケーションをテストする必要があります。

遅いネットワークをシミュレートして、次のように移行をより明確に確認できます:

1. Chrome Dev Tools を開き、ネットワークタブに移動します。
1. メニューバーの右端にある [Network Throttling](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#throttling)
ドロップダウンを見つけます。
1. "3G" 速度のいずれかを試します。

サーバーレンダリングされたアプリケーションは引き続き迅速に起動しますが、完全なクライアントアプリケーションの読み込みには数秒かかる場合があります。

<a id="why-do-it"></a>

## サーバーサイドレンダリングを使用する理由

アプリケーションの Universal バージョンを作成する主な理由は3つあります。

1. [検索エンジン最適化 (SEO)](https://support.google.com/webmasters/answer/7451184?hl=ja)による Web クローラーの促進
1. モバイルおよび非力なデバイスのパフォーマンスを改善する
1. [first-contentful paint (FCP)](https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint) で最初のページをすばやく表示します

{@a seo}
{@a web-crawlers}
### Web クローラーを促進する (SEO)

Google、Bing、Facebook、Twitter、およびその他のソーシャルメディアサイトは、Web クローラーに依存してアプリケーションコンテンツのインデックスを作成し、
そのコンテンツを Web 上で検索可能にします。
これらの Web クローラーは、人間のユーザーのように、高度にインタラクティブな Angular アプリケーションをナビゲートおよびインデックス化できない場合があります。

Angular Universal は、JavaScript なしで簡単に検索、リンク、ナビゲートできるアプリケーションの静的バージョンを生成できます。また、Universal は、各 URL が完全にレンダリングされたページを返すため、サイトプレビューを利用可能にします。

{@a no-javascript}
### モバイルおよび非力なデバイスのパフォーマンスを改善する

一部のデバイスはJavaScriptをサポートしていないか、JavaScriptの実行が不十分であるため、
そのユーザー体験は受け入れがたいものです。
このような場合、サーバーレンダリングされたJavaScriptなしのアプリケーションが必要になる場合があります。
このバージョンは、制限はありますが、アプリケーションをまったく使用できなかった場合の唯一の実用的な代替手段になる可能性があります。

{@a startup-performance}
### 最初のページをすばやく表示する

最初のページをすばやく表示することは、ユーザーエンゲージメントにとって重要です。
読み込みが高速なページは、[100ミリ秒の小さな変更でも](https://web.dev/shopping-for-speed-on-ebay/)パフォーマンスが向上します。
これらのユーザーが何か他のことをする前にエンゲージするには、アプリケーションの起動を高速化する必要があります。

Angular Universal を使用すると、完全なアプリケーションのように見えるアプリケーションのランディングページを生成できます。
ページは純粋な HTML であり、JavaScript が無効になっていても表示できます。
ページはブラウザイベントを処理しませんが、[`routerLink`](guide/router-reference#router-link) を使用してサイト内のナビゲーションをサポート _します_ 。

実際には、静的バージョンのランディングページを提供して、ユーザーの注意を引き付けます。
同時に、その背後にある完全な Angular アプリケーションをロードします。
ユーザーは、ランディングページからほぼ瞬時のパフォーマンスを認識し、
アプリケーションが完全に読み込まれた後、完全なインタラクティブエクスペリエンスを取得します。

{@a how-does-it-work}
## Universal Web サーバー

Universal Web サーバーは、[Universal テンプレートエンジン](#universal-engine)によってレンダリングされた静的 HTML でアプリケーションページリクエストに応答します。
サーバーは、クライアント (通常はブラウザ) から HTTP リクエストを受信して応答し、スクリプト、CSS、画像などの静的アセットを提供します。
データリクエストに、直接または別のデータサーバーへのプロキシとして応答する場合があります。

このガイドのサンプル Web サーバーは、一般的な [Express](https://expressjs.com/) フレームワークに基づいています。

<div class="alert is-helpful">

**NOTE**: <br />
*Any* web server technology can serve a Universal application as long as it can call Angular `platform-server` package [`renderModule`](api/platform-server/renderModule) or [`renderApplication`](api/platform-server/renderApplication) functions.
ここで説明する原則と決定事項は、すべての Web サーバーテクノロジーに適用されます。

</div>

ユニバーサルアプリケーションは、Angular `platform-server` パッケージ (`platform-browser` ではなく) を使用します。
これは、DOM、`XMLHttpRequest`、およびブラウザに依存しないその他の低レベル機能のサーバー実装を提供します。

サーバー (このガイドの例では [Node.js Express](https://expressjs.com/)) は、アプリケーションページのクライアントリクエストを NgUniversal の `ngExpressEngine` に渡します。
裏側では、このエンジンがアプリケーションをレンダリングし、キャッシュやその他の便利なユーティリティも提供します。

render関数は、*テンプレート*となるHTMLページ(通常は`index.html`)と、コンポーネントを含むAngularの*モジュール*を入力として受け取ります。あるいは、呼び出されたときに `ApplicationRef` に解決される`Promise`を返す関数と、どのコンポーネントを表示するかを決定する*ルート*を受け取ることもできます。ルートはクライアントからサーバーへのリクエストに基づきます。

各リクエストの結果、リクエストされたルートの適切なビューが表示されます。
render 関数は、テンプレートの `<app>` タグ内でビューをレンダリングし、
クライアント用の完成した HTML ページを作成します。

最後に、サーバーはレンダリングされたページをクライアントに返します。

### ブラウザ API の回避

ユニバーサルアプリケーションはブラウザで実行されないため、ブラウザ API と機能の一部がサーバー上にない場合があります。

たとえば、サーバー側のアプリケーションは、`window`、`document`、`navigator`、`location` などのブラウザのみのグローバルオブジェクトを参照できません。

Angular は、[`Location`](api/common/Location) や [`DOCUMENT`](api/common/DOCUMENT) など、
これらのオブジェクトに対して注入可能な抽象化を提供します。
これらの API を適切に置き換えることができます。
Angular がそれを提供しない場合、ブラウザ内ではブラウザ API に委任し、サーバー上では別名実装 (別名シミング) に委任する新しい抽象化を記述することができます。

同様に、マウスまたはキーボードイベントがない場合、サーバーサイドアプリケーションは、ユーザーがボタンをクリックしてコンポーネントを表示することに依存できません。
アプリケーションは、受信するクライアントリクエストのみに基づいてレンダリングするものを決定する必要があります。
これは、アプリケーションを[ルーティング可能](guide/router)にするためのよい議論です。

<a id="service-worker"></a>
### Universal and the Angular Service Worker

If you are using Universal in conjunction with the Angular service worker, the behavior is different than the normal server side rendering behavior. The initial server request will be rendered on the server as expected. However, after that initial request, subsequent requests are handled by the service worker. For subsequent requests, the `index.html` file is served statically and bypasses server side rendering.

<a id="universal-engine"></a>

### Universal テンプレートエンジン

`server.ts` ファイルの重要な部分は `ngExpressEngine()` 関数です。

<code-example path="universal/server.ts" header="server.ts" region="ngExpressEngine">
</code-example>

The `ngExpressEngine()` function is a wrapper around the Angular `platform-server` package [`renderModule`](api/platform-server/renderModule) and [`renderApplication`](api/platform-server/renderApplication) functions which turns a client's requests into server-rendered HTML pages.

| Properties       | Details |
|:---              |:---     |
| `bootstrap`      | The root `NgModule` or function that when invoked returns a `Promise` that resolves to an `ApplicationRef` of the application when rendering on the server. For the example application, it is `AppServerModule`. It's the bridge between the Universal server-side renderer and the Angular application. |
| `extraProviders` | This property is optional and lets you specify dependency providers that apply only when rendering the application on the server. Do this when your application needs information that can only be determined by the currently running server instance.       |

`ngExpressEngine()` 関数は、レンダリングされたページに解決される `Promise` コールバックを返します。
そのページをどう処理するかはエンジン次第です。
このエンジンの `Promise` コールバックは、レンダリングされたページを Web サーバーに返し、Web サーバーはそれを HTTP レスポンスでクライアントに転送します。

### リクエスト URL のフィルタリング

<div class="alert is-helpful">

**NOTE**: <br />
メモ: NgUniversal Expressパッケージを使用すると、次に説明する基本的な動作が自動的に処理されます。
これは、基本的な動作を理解したり、パッケージを使用せずに複製したりするときに役立ちます。

</div>

Web サーバーは、_アプリのページのリクエスト_ を他の種類のリクエストと区別する必要があります。

ルートアドレス `/` へのリクエストをインターセプトするほど簡単ではありません。
ブラウザは、`/dashboard`、`/heroes`、`/detail:12` などのアプリケーションルートのいずれかをリクエストできます。
実際、アプリケーションがサーバーによってのみレンダリングされた場合、
クリックされた _すべての_ アプリケーションリンクは、ルーター向けのナビゲーション URL としてサーバーに到達します。

幸いなことに、アプリケーションルートには共通点があります。URL にはファイル拡張子がありません。
(データリクエストにも拡張子はありませんが、常に `/api` で始まるため、簡単に認識できます。)
すべての静的アセットリクエストには (`main.js` や `/node_modules/zone.js/bundles/zone.umd.js` など) ファイル拡張子があります。

ルーティングを使用するため、3種類のリクエストを簡単に認識して、異なる方法で処理できます。

1. **データリクエスト**: `/api` で始まるリクエスト URL
1. **アプリケーションのナビゲーション**: ファイル拡張子のないリクエスト URL
1. **静的アセット**: 他のすべてのリクエスト

Node.js Express サーバーは、リクエストを次々にフィルタリングして処理するミドルウェアのパイプラインです。
Node.js Express サーバーパイプラインは、データリクエスト用にこのような `app.get()` の呼び出しで構成します。

<code-example path="universal/server.ts" header="server.ts (data URL)" region="data-request"></code-example>

<div class="alert is-helpful">

  **メモ:** このサンプルサーバーはデータリクエストを処理しません。

  チュートリアルの「インメモリ Web API」モジュールであるデモおよび開発ツールは、
  すべての HTTP 呼び出しをインターセプトし、リモートデータサーバーの動作をシミュレートします。
  実際には、このモジュールを削除して、Web API ミドルウェアをサーバーに登録します。

</div>

次のコードは、拡張子のないリクエスト URL をフィルタリングし、それらをナビゲーションリクエストとして扱います。

<code-example path="universal/server.ts" header="server.ts (navigation)" region="navigation-request"></code-example>

### 静的ファイルを安全に提供する

単一の `server.use()` は、他のすべての URL を
JavaScript、画像、スタイルファイルなどの静的アセットのリクエストとして扱います。

クライアントが表示が許可されているファイルのみをダウンロードできるようにするには、すべてのクライアント向けアセットファイルを `/dist` フォルダーに入れ、
`/dist` フォルダーからのファイルのリクエストのみを受け入れます。

次の Node.js Express コードは、残りのすべてのリクエストを `/dist` にルーティングし、
ファイルが見つからない場合は `404 - NOT FOUND` エラーを返します。

<code-example path="universal/server.ts" header="server.ts (static files)" region="static"></code-example>

### Using absolute URLs for HTTP (data) requests on the server

The tutorial's `HeroService` and `HeroSearchService` delegate to the Angular `HttpClient` module to fetch application data.
These services send requests to _relative_ URLs such as `api/heroes`.
In a server-side rendered app, HTTP URLs must be _absolute_ (for example, `https://my-server.com/api/heroes`).
This means that the URLs must be somehow converted to absolute when running on the server and be left relative when running in the browser.

If you are using one of the `@nguniversal/*-engine` packages (such as `@nguniversal/express-engine`), this is taken care for you automatically.
You don't need to do anything to make relative URLs work on the server.

If, for some reason, you are not using an `@nguniversal/*-engine` package, you may need to handle it yourself.

The recommended solution is to pass the full request URL to the `options` argument of [renderModule](api/platform-server/renderModule).
This option is the least intrusive as it does not require any changes to the app.
Here, "request URL" refers to the URL of the request as a response to which the app is being rendered on the server.
For example, if the client requested `https://my-server.com/dashboard` and you are rendering the app on the server to respond to that request, `options.url` should be set to `https://my-server.com/dashboard`.

Now, on every HTTP request made as part of rendering the app on the server, Angular can correctly resolve the request URL to an absolute URL, using the provided `options.url`.

### Useful scripts

| Scripts                                                                                                    | Details |
|:---                                                                                                        |:---     |
| <code-example format="shell" language="shell"> npm run dev:ssr </code-example>                            | Similar to [`ng serve`](cli/serve), which offers live reload during development, but uses server-side rendering. The application runs in watch mode and refreshes the browser after every change. This command is slower than the actual `ng serve` command.                                                                                                                                                  |
| <code-example format="shell" language="shell"> ng build &amp;&amp; ng run app-name:server </code-example> | Builds both the server script and the application in production mode. Use this command when you want to build the project for deployment.                                                                                                                                                                                                                                                                     |
| <code-example format="shell" language="shell"> npm run serve:ssr </code-example>                          | Starts the server script for serving the application locally with server-side rendering. It uses the build artifacts created by `npm run build:ssr`, so make sure you have run that command as well. <div class="alert is-helpful"> **NOTE**: <br /> `serve:ssr` is not intended to be used to serve your application in production, but only for testing the server-side rendered application locally. </div> |
| <code-example format="shell" language="shell"> npm run prerender </code-example>                          | Used to prerender an application's pages. Read more about prerendering [here](guide/prerendering).                                                                                                                                                                                                                                                                                                            |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-06-21