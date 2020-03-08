# Angular Universal を使ったサーバーサイドレンダリング (SSR)

このガイドでは、Angular アプリケーションをサーバー上でレンダリングするテクノロジーである **Angular Universal** について説明します。

通常の Angular アプリケーションは _ブラウザ_ で実行され、ユーザーのアクションに応じて DOM にページをレンダリングします。
Angular Universal は _サーバー_ 上で実行され、あとでクライアント上でブートストラップされる _静的_ アプリケーションページを生成します。
これは通常、アプリケーションがより高速にレンダリングされ、
ユーザーが完全にインタラクティブになる前にアプリケーションのレイアウトを表示する機会を与えることを意味します。

SSR を取り巻くさまざまな手法と概念の詳細については、
この[記事](https://developers.google.com/web/updates/2019/02/rendering-on-the-web)をご覧ください。

[Angular CLI](guide/glossary#cli) を使用して、サーバーサイドレンダリング用のアプリを簡単に準備できます。
CLI の schematic `@nguniversal/express-engine` は、以下で説明するように、必要な手順を実行します。

<div class="alert is-helpful">

  **メモ:** [Node.js® Express](https://expressjs.com/) サーバーで実行される
  [完成したサンプルコードをダウンロード](generated/zips/universal/universal.zip)します。

</div>

{@a the-example}
## Universal チュートリアル

[ツアー オブ ヒーローズ チュートリアル](tutorial) は、このチュートリアルの基礎です。

この例では、Angular CLI は [Ahead-of-Time (AOT) コンパイラー](guide/aot-compiler)を使用して
アプリの Universal バージョンをコンパイルおよびバンドルします。
Node Express Web サーバーは、クライアント要求に基づいて、Universal で HTML ページをコンパイルします。

サーバー側のアプリモジュール `app.server.module.ts` を作成するには、次の CLI コマンドを実行します。

<code-example language="bash">

ng add @nguniversal/express-engine

</code-example>

このコマンドは、次のフォルダ構造を作成します。

<code-example language="none">
src/
  index.html                 <i>アプリの Web ページ</i>
  main.ts                    <i>クライアントアプリのブートストラップ</i>
  main.server.ts             <i>* サーバーアプリのブートストラップ</i>
  style.css                  <i>アプリのスタイル</i>
  app/ ...                   <i>アプリケーションコード</i>
    app.server.module.ts     <i>* サーバーサイドアプリケーションモジュール</i>
server.ts                    <i>* Express Web サーバー</i>
tsconfig.json                <i>TypeScript クライアント構成</i>
tsconfig.app.json            <i>TypeScript クライアント構成</i>
tsconfig.server.json         <i>* TypeScript サーバー構成</i>
tsconfig.spec.json           <i>TypeScript 仕様の構成</i>
package.json                 <i>npm 構成</i>
</code-example>

`*` でマークされたファイルは新しいもので、元のチュートリアルサンプルにはありません。

### Universal in action

ローカルシステムで Universal を使用してアプリのレンダリングを開始するには、次のコマンドを使用します。

<code-example language="bash">
npm run build:ssr && npm run serve:ssr
</code-example>

ブラウザを開き、http://localhost:4000/ に移動します。
おなじみの Tour of Heroes ダッシュボードページが表示されます。

`routerLinks` を介したナビゲーションはネイティブアンカー (`<a>`) タグを使用するため、正常に機能します。
ダッシュボードからヒーローページに遷移して戻ることができます。
ダッシュボードページでヒーローをクリックすると、その詳細ページが表示されます。

クライアント側のスクリプトのダウンロードに時間がかかるように (次の手順) ネットワーク速度を調整する場合、
次のことに気づくでしょう:
* ヒーローページでヒーローをクリックしても何も起こりません。
* ヒーローを追加または削除することはできません。
* ダッシュボードページの検索ボックスは無視されます。
* 詳細ページの *戻る* ボタンと *保存* ボタンは機能しません。

`routerLink` クリック以外のユーザーイベントはサポートされていません。
完全なクライアントアプリがブートストラップして実行されるのを待つか、
[preboot](https://github.com/angular/preboot) などのライブラリを使用してイベントをバッファリングする必要があります。

サーバーレンダリングされたアプリからクライアントアプリへの移行は開発マシンで迅速に行われますが、
実際のシナリオでは常にアプリをテストする必要があります。

遅いネットワークをシミュレートして、次のように移行をより明確に確認できます:

1. Chrome Dev Tools を開き、ネットワークタブに移動します。
1. メニューバーの右端にある [Network Throttling](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#throttling)
ドロップダウンを見つけます。
1. "3G" 速度のいずれかを試します。

サーバーレンダリングされたアプリは引き続き迅速に起動しますが、完全なクライアントアプリの読み込みには数秒かかる場合があります。

{@a why-do-it}
## サーバーサイドレンダリングを使用する理由

アプリの Universal バージョンを作成する主な理由は3つあります。

1. [検索エンジン最適化 (SEO)](https://support.google.com/webmasters/answer/7451184?hl=ja)による Web クローラーの促進
1. モバイルおよび低電力デバイスのパフォーマンスを改善する
1. [first-contentful paint (FCP)](https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint) で最初のページをすばやく表示します

{@a seo}
{@a web-crawlers}
### Web クローラーを促進する (SEO)

Google、Bing、Facebook、Twitter、およびその他のソーシャルメディアサイトは、Web クローラーに依存してアプリケーションコンテンツのインデックスを作成し、
そのコンテンツを Web 上で検索可能にします。
これらの Web クローラーは、人間のユーザーのように、高度にインタラクティブな Angular アプリケーションをナビゲートおよびインデックス化できない場合があります。

Angular Universal は、JavaScript なしで簡単に検索、リンク、ナビゲートできるアプリの静的バージョンを生成できます。また、Universal は、各 URL が完全にレンダリングされたページを返すため、サイトプレビューを利用可能にします。

{@a no-javascript}
### モバイルおよび低電力デバイスのパフォーマンスを改善する

一部のデバイスはJavaScriptをサポートしていないか、JavaScriptの実行が不十分であるため、
ユーザー体験が受け入れられません。
このような場合、サーバーレンダリングされたJavaScriptなしのアプリが必要になる場合があります。
このバージョンは、制限はありますが、アプリをまったく使用できなかった場合の唯一の実用的な代替手段になる可能性があります。

{@a startup-performance}
### 最初のページをすばやく表示する

最初のページをすばやく表示することは、ユーザーエンゲージメントにとって重要です。
読み込みが高速なページは、[100ミリ秒の小さな変更でも](https://web.dev/shopping-for-speed-on-ebay/)パフォーマンスが向上します。
これらのユーザーが何か他のことをする前にエンゲージするには、アプリの起動を高速化する必要があります。

Angular Universal を使用すると、完全なアプリのように見えるアプリのランディングページを生成できます。
ページは純粋な HTML であり、JavaScript が無効になっていても表示できます。
ページはブラウザイベントを処理しませんが、[`routerLink`](guide/router#router-link) を使用してサイト内のナビゲーションをサポート _します_ 。

実際には、静的バージョンのランディングページを提供して、ユーザーの注意を引き付けます。
同時に、その背後にある完全な Angular アプリをロードします。
ユーザーは、ランディングページからほぼ瞬時のパフォーマンスを認識し、
アプリが完全に読み込まれた後、完全なインタラクティブエクスペリエンスを取得します。

{@a how-does-it-work}
## Universal web servers

A Universal web server responds to application page requests with static HTML rendered by the [Universal template engine](#universal-engine).
The server receives and responds to HTTP requests from clients (usually browsers), and serves static assets such as scripts, CSS, and images.
It may respond to data requests, either directly or as a proxy to a separate data server.

The sample web server for this guide is based on the popular [Express](https://expressjs.com/) framework.

<div class="alert is-helpful">

  **Note:** _Any_ web server technology can serve a Universal app as long as it can call Universal's `renderModule()` function.
  The principles and decision points discussed here apply to any web server technology.

</div>

Universal applications use the Angular `platform-server` package (as opposed to `platform-browser`), which provides
server implementations of the DOM, `XMLHttpRequest`, and other low-level features that don't rely on a browser.

The server ([Node Express](https://expressjs.com/) in this guide's example)
passes client requests for application pages to the NgUniversal `ngExpressEngine`. Under the hood, this
calls Universal's `renderModule()` function, while providing caching and other helpful utilities.

The `renderModule()` function takes as inputs a *template* HTML page (usually `index.html`),
an Angular *module* containing components,
and a *route* that determines which components to display.
The route comes from the client's request to the server.

Each request results in the appropriate view for the requested route.
The `renderModule()` function renders the view within the `<app>` tag of the template,
creating a finished HTML page for the client.

Finally, the server returns the rendered page to the client.

### Working around the browser APIs

Because a Universal app doesn't execute in the browser, some of the browser APIs and capabilities may be missing on the server.

For example, server-side applications can't reference browser-only global objects such as `window`, `document`, `navigator`, or `location`.

Angular provides some injectable abstractions over these objects, such as [`Location`](api/common/Location)
or [`DOCUMENT`](api/common/DOCUMENT); it may substitute adequately for these APIs.
If Angular doesn't provide it, it's possible to write new abstractions that delegate to the browser APIs while in the browser
and to an alternative implementation while on the server (aka shimming).

Similarly, without mouse or keyboard events, a server-side app can't rely on a user clicking a button to show a component.
The app must determine what to render based solely on the incoming client request.
This is a good argument for making the app [routable](guide/router).

{@a http-urls}
### Using absolute URLs for server requests

The tutorial's `HeroService` and `HeroSearchService` delegate to the Angular `HttpClient` module to fetch application data.
These services send requests to _relative_ URLs such as `api/heroes`.
In a Universal app, HTTP URLs must be _absolute_ (for example, `https://my-server.com/api/heroes`).
This means you need to change your services to make requests with absolute URLs when running on the server and with relative
URLs when running in the browser.

One solution is to provide the full URL to your application on the server, and write an interceptor that can retrieve this
value and prepend it to the request URL. If you're using the `ngExpressEngine`, as shown in the example in this guide, half
the work is already done. We'll assume this is the case, but it's trivial to provide the same functionality.

Start by creating an [HttpInterceptor](api/common/http/HttpInterceptor).

<code-example language="typescript" header="universal-interceptor.ts">

import {Injectable, Inject, Optional} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders} from '@angular/common/http';
import {Request} from 'express';
import {REQUEST} from '@nguniversal/express-engine/tokens';

@Injectable()
export class UniversalInterceptor implements HttpInterceptor {

  constructor(@Optional() @Inject(REQUEST) protected request?: Request) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let serverReq: HttpRequest<any> = req;
    if (this.request) {
      let newUrl = `${this.request.protocol}://${this.request.get('host')}`;
      if (!req.url.startsWith('/')) {
        newUrl += '/';
      }
      newUrl += req.url;
      serverReq = req.clone({url: newUrl});
    }
    return next.handle(serverReq);
  }
}

</code-example>

Next, provide the interceptor in the providers for the server `AppModule`.

<code-example language="typescript" header="app.server.module.ts">

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {UniversalInterceptor} from './universal-interceptor';

@NgModule({
  ...
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: UniversalInterceptor,
    multi: true
  }],
})
export class AppServerModule {}

</code-example>

Now, on every HTTP request made on the server, this interceptor will fire and replace the request URL with the absolute
URL provided in the Express `Request` object.

{@a universal-engine}
### Universal template engine

The important bit in the `server.ts` file is the `ngExpressEngine()` function.

<code-example path="universal/server.ts" header="server.ts" region="ngExpressEngine">
</code-example>

The `ngExpressEngine()` function is a wrapper around Universal's `renderModule()` function which turns a client's
requests into server-rendered HTML pages.

* The first parameter is `AppServerModule`.
It's the bridge between the Universal server-side renderer and the Angular application.

* The second parameter, `extraProviders`, is optional. It lets you specify dependency providers that apply only when
running on this server.
You can do this when your app needs information that can only be determined by the currently running server instance.
One example could be the running server's *origin*, which could be used to [calculate absolute HTTP URLs](#http-urls) if
not using the `Request` token as shown above.

The `ngExpressEngine()` function returns a `Promise` callback that resolves to the rendered page.
It's up to the engine to decide what to do with that page.
This engine's `Promise` callback returns the rendered page to the web server,
which then forwards it to the client in the HTTP response.

<div class="alert is-helpful">

  **Note:**  These wrappers help hide the complexity of the `renderModule()` function. There are more wrappers
  for different backend technologies at the [Universal repository](https://github.com/angular/universal).

</div>

### Filtering request URLs

NOTE: the basic behavior described below is handled automatically when using the NgUniversal Express schematic, this
is helpful when trying to understand the underlying behavior or replicate it without using the schematic.

The web server must distinguish _app page requests_ from other kinds of requests.

It's not as simple as intercepting a request to the root address `/`.
The browser could ask for one of the application routes such as `/dashboard`, `/heroes`, or `/detail:12`.
In fact, if the app were only rendered by the server, _every_ app link clicked would arrive at the server
as a navigation URL intended for the router.

Fortunately, application routes have something in common: their URLs lack file extensions.
(Data requests also lack extensions but they're easy to recognize because they always begin with `/api`.)
All static asset requests have a file extension (such as `main.js` or `/node_modules/zone.js/dist/zone.js`).

Because we use routing, we can easily recognize the three types of requests and handle them differently.

1. **Data request**: request URL that begins `/api`.
1. **App navigation**: request URL with no file extension.
1. **Static asset**: all other requests.

A Node Express server is a pipeline of middleware that filters and processes requests one after the other.
You configure the Node Express server pipeline with calls to `app.get()` like this one for data requests.

<code-example path="universal/server.ts" header="server.ts (data URL)" region="data-request"></code-example>

<div class="alert is-helpful">

  **Note:** This sample server doesn't handle data requests.

  The tutorial's "in-memory web API" module, a demo and development tool, intercepts all HTTP calls and
  simulates the behavior of a remote data server.
  In practice, you would remove that module and register your web API middleware on the server here.

</div>

The following code filters for request URLs with no extensions and treats them as navigation requests.

<code-example path="universal/server.ts" header="server.ts (navigation)" region="navigation-request"></code-example>

### Serving static files safely

A single `app.use()` treats all other URLs as requests for static assets
such as JavaScript, image, and style files.

To ensure that clients can only download the files that they are permitted to see, put all client-facing asset files in
the `/dist` folder and only honor requests for files from the `/dist` folder.

The following Node Express code routes all remaining requests to `/dist`, and returns a `404 - NOT FOUND` error if the
file isn't found.

<code-example path="universal/server.ts" header="server.ts (static files)" region="static"></code-example>
