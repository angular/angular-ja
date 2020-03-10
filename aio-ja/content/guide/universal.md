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
1. モバイルおよび非力なデバイスのパフォーマンスを改善する
1. [first-contentful paint (FCP)](https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint) で最初のページをすばやく表示します

{@a seo}
{@a web-crawlers}
### Web クローラーを促進する (SEO)

Google、Bing、Facebook、Twitter、およびその他のソーシャルメディアサイトは、Web クローラーに依存してアプリケーションコンテンツのインデックスを作成し、
そのコンテンツを Web 上で検索可能にします。
これらの Web クローラーは、人間のユーザーのように、高度にインタラクティブな Angular アプリケーションをナビゲートおよびインデックス化できない場合があります。

Angular Universal は、JavaScript なしで簡単に検索、リンク、ナビゲートできるアプリの静的バージョンを生成できます。また、Universal は、各 URL が完全にレンダリングされたページを返すため、サイトプレビューを利用可能にします。

{@a no-javascript}
### モバイルおよび非力なデバイスのパフォーマンスを改善する

一部のデバイスはJavaScriptをサポートしていないか、JavaScriptの実行が不十分であるため、
そのユーザー体験は受け入れがたいものです。
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
## Universal Web サーバー

Universal Web サーバーは、[Universal テンプレートエンジン](#universal-engine)によってレンダリングされた静的 HTML でアプリケーションページリクエストに応答します。
サーバーは、クライアント (通常はブラウザ) から HTTP リクエストを受信して応答し、スクリプト、CSS、画像などの静的アセットを提供します。
データリクエストに、直接または別のデータサーバーへのプロキシとして応答する場合があります。

このガイドのサンプル Web サーバーは、一般的な [Express](https://expressjs.com/) フレームワークに基づいています。

<div class="alert is-helpful">

  **メモ:** Universal の `renderModule()` 関数を呼び出すことができる限り、_どの_ Web サーバーテクノロジーでも Universal アプリを提供できます。
  ここで説明する原則と決定事項は、すべての Web サーバーテクノロジーに適用されます。

</div>

ユニバーサルアプリケーションは、Angular `platform-server` パッケージ (`platform-browser` ではなく) を使用します。
これは、DOM、`XMLHttpRequest`、およびブラウザに依存しないその他の低レベル機能のサーバー実装を提供します。

サーバー (このガイドの例では [Node Express](https://expressjs.com/)) は、アプリケーションページのクライアントリクエストを NgUniversal の `ngExpressEngine` に渡します。
内部では、これは Universal の `renderModule()` 関数を呼び出しますが、
キャッシングやその他の有用なユーティリティを提供します。

`renderModule()` 関数は、入力としてテンプレート HTML ページ (通常は `index.html`)、
コンポーネントを含む Angular *モジュール*、
および表示するコンポーネントを決定する *ルート* を受け取ります。
ルートは、クライアントの要求からサーバーに到達します。

各リクエストの結果、リクエストされたルートの適切なビューが表示されます。
`renderModule()` 関数は、テンプレートの `<app>` タグ内でビューをレンダリングし、
クライアント用の完成した HTML ページを作成します。

最後に、サーバーはレンダリングされたページをクライアントに返します。

### ブラウザ API の回避

ユニバーサルアプリはブラウザで実行されないため、ブラウザ API と機能の一部がサーバー上にない場合があります。

たとえば、サーバー側のアプリケーションは、`window`、`document`、`navigator`、`location` などのブラウザのみのグローバルオブジェクトを参照できません。

Angular は、[`Location`](api/common/Location) や [`DOCUMENT`](api/common/DOCUMENT) など、
これらのオブジェクトに対して注入可能な抽象化を提供します。
これらの API を適切に置き換えることができます。
Angular がそれを提供しない場合、ブラウザ内ではブラウザ API に委任し、サーバー上では別名実装 (別名シミング) に委任する新しい抽象化を記述することができます。

同様に、マウスまたはキーボードイベントがない場合、サーバーサイドアプリは、ユーザーがボタンをクリックしてコンポーネントを表示することに依存できません。
アプリは、受信するクライアントリクエストのみに基づいてレンダリングするものを決定する必要があります。
これは、アプリを[ルーティング可能](guide/router)にするためのよい議論です。

{@a http-urls}
### サーバーリクエストに絶対 URL を使用する

チュートリアルの `HeroService` と `HeroSearchService` は、Angular `HttpClient` モジュールに委任して、アプリケーションデータを取得します。
これらのサービスは、`api/heroes` などの _相対_ URL にリクエストを送信します。
ユニバーサルアプリでは、HTTP URL は _絶対_ (たとえば、`https://my-server.com/api/heroes`) である必要があります。
つまり、サーバーで実行する場合は絶対 URL で、
ブラウザで実行する場合は相対 URL でリクエストを行うようにサービスを変更する必要があります。

1つの解決策は、サーバー上のアプリケーションに完全な URL を提供し、この値を取得してリクエスト URL に追加できるインターセプターを作成することです。
このガイドの例に示すように、`ngExpressEngine` を使用している場合、作業の半分はすでに完了しています。
これが当てはまると仮定しますが、同じ機能を提供するのは簡単です。

[HttpInterceptor](api/common/http/HttpInterceptor) を作成することから始めます。

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

次に、サーバー `AppModule` のプロバイダーにインターセプターを提供します。

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

これで、サーバーで行われたすべての HTTP リクエストで、このインターセプターが起動し、
リクエスト URL を Express `Request` オブジェクトで提供された絶対 URL に置き換えます。

{@a universal-engine}
### Universal テンプレートエンジン

`server.ts` ファイルの重要な部分は `ngExpressEngine()` 関数です。

<code-example path="universal/server.ts" header="server.ts" region="ngExpressEngine">
</code-example>

`ngExpressEngine()` 関数は、クライアントのリクエストをサーバーレンダリングされた HTML ページに変換する
Universal の `renderModule()` 関数のラッパーです。

* 最初のパラメータは `AppServerModule` です。
これは、Universal の サーバーサイドレンダラーと Angular アプリケーション間のブリッジです。

* 2番目のパラメータは `extraProviders` で、オプショナルです。
このサーバーで実行されている場合にのみ適用される依存関係プロバイダーを指定できます。
これは、現在実行中のサーバーインスタンスによってのみ判断できる情報がアプリに必要な場合に実行できます。
1つの例としては、実行中のサーバーのオリジンがあります。
これは、上記のように `Request` トークンを使用しない場合に[絶対 HTTP URL を計算する](#http-urls) ために使用できます。

`ngExpressEngine()` 関数は、レンダリングされたページに解決される `Promise` コールバックを返します。
そのページをどう処理するかはエンジン次第です。
このエンジンの `Promise` コールバックは、レンダリングされたページを Web サーバーに返し、
Web サーバーはそれを HTTP レスポンスでクライアントに転送します。

<div class="alert is-helpful">

  **メモ:**  これらのラッパーは、`renderModule()` 関数の複雑さを隠すのに役立ちます。
  [Universal リポジトリ](https://github.com/angular/universal)には、さまざまなバックエンドテクノロジー用のラッパーがさらにあります。

</div>

### リクエスト URL のフィルタリング

メモ: NgUniversal Express schematic を使用すると、次に説明する基本的な動作が自動的に処理されます。
これは、基本的な動作を理解したり、schematic を使用せずに複製したりするときに役立ちます。

Web サーバーは、_アプリのページのリクエスト_ を他の種類のリクエストと区別する必要があります。

ルートアドレス `/` へのリクエストをインターセプトするほど簡単ではありません。
ブラウザは、`/dashboard`、`/heroes`、`/detail:12` などのアプリケーションルートのいずれかをリクエストできます。
実際、アプリがサーバーによってのみレンダリングされた場合、
クリックされた _すべての_ アプリリンクは、ルーター向けのナビゲーション URL としてサーバーに到達します。

幸いなことに、アプリケーションルートには共通点があります。URL にはファイル拡張子がありません。
(データリクエストにも拡張子はありませんが、常に `/api` で始まるため、簡単に認識できます。)
すべての静的アセットリクエストには (`main.js` や `/node_modules/zone.js/dist/zone.js` など) ファイル拡張子があります。

ルーティングを使用するため、3種類のリクエストを簡単に認識して、異なる方法で処理できます。

1. **データリクエスト**: `/api` で始まるリクエスト URL
1. **アプリのナビゲーション**: ファイル拡張子のないリクエスト URL
1. **静的アセット**: 他のすべてのリクエスト

Node Express サーバーは、リクエストを次々にフィルタリングして処理するミドルウェアのパイプラインです。
Node Express サーバーパイプラインは、データリクエスト用にこのような `app.get()` の呼び出しで構成します。

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

単一の `app.use()` は、他のすべての URL を
JavaScript、画像、スタイルファイルなどの静的アセットのリクエストとして扱います。

クライアントが表示が許可されているファイルのみをダウンロードできるようにするには、すべてのクライアント向けアセットファイルを `/dist` フォルダーに入れ、
`/dist` フォルダーからのファイルのリクエストのみを受け入れます。

次の Node Express コードは、残りのすべてのリクエストを `/dist` にルーティングし、
ファイルが見つからない場合は `404 - NOT FOUND` エラーを返します。

<code-example path="universal/server.ts" header="server.ts (static files)" region="static"></code-example>
