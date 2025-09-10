# サーバーとハイブリッドレンダリング

Angularはデフォルトですべてのアプリケーションをクライアントサイドレンダリング (CSR) として提供します。このアプローチは軽量な初期ペイロードを提供しますが、ユーザーのデバイスがほとんどの計算をするため、ロード時間の遅延、パフォーマンス指標の低下、リソース要件の増加といったトレードオフを伴います。その結果、多くのアプリケーションはサーバーサイドレンダリング (SSR) をハイブリッドレンダリング戦略に統合することで、大幅なパフォーマンス向上を実現しています。

## ハイブリッドレンダリングとは？ {#what-is-hybrid-rendering}

ハイブリッドレンダリングにより、開発者はサーバーサイドレンダリング (SSR)、プリレンダリング (「静的サイト生成」またはSSGとも呼ばれる)、およびクライアントサイドレンダリング (CSR) の利点を活用して、Angularアプリケーションを最適化できます。これにより、アプリケーションのさまざまな部分がどのようにレンダリングされるかをきめ細かく制御し、ユーザーに可能な限り最高のユーザー体験を提供できます。

## ハイブリッドレンダリングのセットアップ {#setting-up-hybrid-rendering}

Angular CLIの `ng new` コマンドでサーバーサイドレンダリングフラグ (つまり、`--ssr`) を使用すると、ハイブリッドレンダリングを有効にした**新しい**プロジェクトを作成できます。

```shell
ng new --ssr
```

既存のプロジェクトにサーバーサイドレンダリングを追加して、ハイブリッドレンダリングを有効にできます。

```shell
ng add @angular/ssr
```

NOTE: デフォルトでは、Angularはアプリケーション全体をプリレンダリングし、サーバーファイルを生成します。これを無効にして完全に静的なアプリケーションを作成するには、`outputMode` を `static` に設定します。SSRを有効にするには、サーバーのルートを更新して `RenderMode.Server` を使用します。詳細については、[`サーバールーティング`](#server-routing) および [`完全に静的なアプリケーションを生成する`](#generate-a-fully-static-application) を参照してください。

## サーバールーティング {#server-routing}

### サーバールートの設定 {#configuring-server-routes}

[`ServerRoute`](api/ssr/ServerRoute 'API reference') オブジェクトの配列を宣言することで、サーバールート設定を作成できます。この設定は通常、`app.routes.server.ts` というファイルに記述されます。

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '', // これはクライアントで "/" ルートをレンダリングします (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: 'about', // このページは静的なので、プリレンダリングします (SSG)
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'profile', // このページはユーザー固有のデータを必要とするため、SSRを使用します
    renderMode: RenderMode.Server,
  },
  {
    path: '**', // 他のすべてのルートはサーバーでレンダリングされます (SSR)
    renderMode: RenderMode.Server,
  },
];
```

この設定は、[`withRoutes`](api/ssr/withRoutes 'API reference') 関数を使用して [`provideServerRendering`](api/ssr/provideServerRendering 'API reference') でアプリケーションに追加できます。

```typescript
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // ... その他のプロバイダー ...
  ]
};
```

[App shellパターン](ecosystem/service-workers/app-shell)を使用する場合、クライアントサイドレンダリングされたルートのApp shellとして使用するコンポーネントを指定する必要があります。これを行うには、[`withAppShell`](api/ssr/withAppShell 'API reference') 機能を使用します。

```typescript
import { provideServerRendering, withRoutes, withAppShell } from '@angular/ssr';
import { AppShellComponent } from './app-shell/app-shell.component';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(
      withRoutes(serverRoutes),
      withAppShell(AppShellComponent),
    ),
    // ... その他のプロバイダー ...
  ]
};
```

### レンダリングモード {#rendering-modes}

サーバールーティング設定では、[`RenderMode`](api/ssr/RenderMode 'API reference') を設定することで、アプリケーションの各ルートをどのようにレンダリングするかを指定できます。

| レンダリングモード    | 説明                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| **Server (SSR)**    | 各リクエストに対してアプリケーションをサーバーでレンダリングし、完全にデータが投入されたHTMLページをブラウザに送信します。 |
| **Client (CSR)**    | アプリケーションをブラウザでレンダリングします。これはAngularのデフォルトの動作です。                               |
| **Prerender (SSG)** | ビルド時にアプリケーションをプリレンダリングし、各ルートの静的HTMLファイルを生成します。                               |

#### レンダリングモードの選択 {#choosing-a-rendering-mode}

各レンダリングモードには異なる利点と欠点があります。アプリケーションの特定のニーズに基づいてレンダリングモードを選択できます。

##### クライアントサイドレンダリング (CSR) {#client-side-rendering}

クライアントサイドレンダリングは、常にWebブラウザで実行されることを前提としたコードを記述できるため、最もシンプルな開発モデルです。これにより、ブラウザで実行されることを前提とした幅広いクライアントサイドライブラリを使用できます。

クライアントサイドレンダリングは、ユーザーがレンダリングされたコンテンツを見る前にページのJavaScriptをダウンロード、解析、実行する必要があるため、一般的に他のレンダリングモードよりもパフォーマンスが劣ります。ページがレンダリング中にサーバーからさらにデータを取得する場合、ユーザーは完全なコンテンツを表示する前にそれらの追加リクエストを待つ必要があります。

ページが検索クローラーによってインデックス付けされる場合、検索クローラーはページのインデックス付け時に実行するJavaScriptの量に制限があるため、クライアントサイドレンダリングは検索エンジン最適化 (SEO) に悪影響を与える可能性があります。

クライアントサイドレンダリングの場合、サーバーは静的なJavaScriptアセットを配信する以外に、ページをレンダリングするための作業をする必要がありません。サーバーコストが懸念される場合は、この要素を考慮してもよいでしょう。

Service Workerによるインストール可能でオフラインのユーザー体験をサポートするアプリケーションは、サーバーと通信することなくクライアントサイドレンダリングに依存できます。

##### サーバーサイドレンダリング (SSR) {#server-side-rendering}

サーバーサイドレンダリングは、クライアントサイドレンダリングよりも高速なページロードを提供します。JavaScriptのダウンロードと実行を待つ代わりに、サーバーはブラウザからのリクエストを受信すると、直接HTMLドキュメントをレンダリングします。ユーザーは、サーバーがデータを取得し、要求されたページをレンダリングするために必要な遅延のみを経験します。このモードでは、コードがサーバーでのレンダリング中にデータを取得できるため、ブラウザからの追加のネットワークリクエストも不要になります。

サーバーサイドレンダリングは、検索クローラーが完全にレンダリングされたHTMLドキュメントを受け取るため、一般的に優れた検索エンジン最適化 (SEO) を実現します。

サーバーサイドレンダリングでは、ブラウザAPIに厳密に依存しないコードを作成する必要があり、ブラウザで実行されることを前提としたJavaScriptライブラリの選択が制限されます。

サーバーサイドレンダリングの場合、サーバーはAngularを実行してすべてのリクエストに対してHTMLレスポンスを生成するため、サーバーのホスティングコストが増加する可能性があります。

##### ビルド時プリレンダリング {#build-time-prerendering}

プリレンダリングは、クライアントサイドレンダリングとサーバーサイドレンダリングの両方よりも高速なページロードを提供します。プリレンダリングは_ビルド時_にHTMLドキュメントを作成するため、サーバーは追加の作業なしに静的なHTMLドキュメントで直接リクエストに応答できます。

プリレンダリングでは、ページをレンダリングするために必要なすべての情報が_ビルド時_に利用可能である必要があります。これは、プリレンダリングされたページに、ページをロードする特定のユーザーに関するデータを含めることができないことを意味します。プリレンダリングは、アプリケーションのすべてのユーザーにとって同じであるページに主に役立ちます。

プリレンダリングはビルド時に行われるため、本番ビルドにかなりの時間を追加する可能性があります。[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') を使用して多数のHTMLドキュメントを生成すると、デプロイの合計ファイルサイズに影響を与え、デプロイが遅くなる可能性があります。

プリレンダリングは、検索クローラーが完全にレンダリングされたHTMLドキュメントを受け取るため、一般的に優れた検索エンジン最適化 (SEO) を実現します。

プリレンダリングでは、ブラウザAPIに厳密に依存しないコードを作成する必要があり、ブラウザで実行されることを前提としたJavaScriptライブラリの選択が制限されます。

プリレンダリングは、サーバーが静的なHTMLドキュメントで応答するため、サーバーリクエストあたりのオーバーヘッドが非常に少なくなります。静的ファイルは、コンテンツデリバリーネットワーク (CDN)、ブラウザ、および中間キャッシュレイヤーによって簡単にキャッシュされ、その後のページロードをさらに高速化できます。完全に静的なサイトは、CDNまたは静的ファイルサーバーのみを介したデプロイもでき、アプリケーション用のカスタムサーバー実行時を維持する必要がなくなります。これにより、アプリケーションWebサーバーからの作業をオフロードすることでスケーラビリティが向上し、トラフィックの多いアプリケーションにとって特に有益です。

NOTE: Angular Service Workerを使用する場合、最初のリクエストはサーバーレンダリングされますが、それ以降のすべてのリクエストはService Workerによって処理され、クライアントサイドでレンダリングされます。

### ヘッダーとステータスコードの設定 {#setting-headers-and-status-codes}

`ServerRoute` 設定の `headers` および `status` プロパティを使用して、個々のサーバールートにカスタムヘッダーとステータスコードを設定できます。

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'profile',
    renderMode: RenderMode.Server,
    headers: {
      'X-My-Custom-Header': 'some-value',
    },
    status: 201,
  },
  // ... その他のルート
];
```

### リダイレクト {#redirects}

Angularは、ルート設定の [`redirectTo`](api/router/Route#redirectTo 'API reference') プロパティで指定されたリダイレクトを、サーバーサイドでは異なる方法で処理します。

**サーバーサイドレンダリング (SSR)**
リダイレクトは、サーバーサイドレンダリングプロセス内で標準的なHTTPリダイレクト (例: 301、302) を使用して実行されます。

**プリレンダリング (SSG)**
リダイレクトは、プリレンダリングされたHTML内の [`<meta http-equiv="refresh">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#refresh) タグを使用して「ソフトリダイレクト」として実装されます。

### ビルド時プリレンダリング (SSG) のカスタマイズ {#customizing-build-time-prerendering-ssg}

[`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') を使用する場合、プリレンダリングと提供プロセスをカスタマイズするためのいくつかの設定オプションを指定できます。

#### パラメーター化されたルート {#parameterized-routes}

[`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') を持つ各ルートについて、[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 関数を指定できます。この関数を使用すると、どの特定のパラメーターが個別のプリレンダリングされたドキュメントを生成するかを制御できます。

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') 関数は、オブジェクトの配列に解決される `Promise` を返します。各オブジェクトは、ルートパラメーター名から値へのキーと値のマップです。たとえば、`post/:id` のようなルートを定義した場合、`getPrerenderParams` は配列 `[{id: 123}, {id: 456}]` を返し、`post/123` と `post/456` の個別のドキュメントをレンダリングできます。

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') の本体は、Angularの [`inject`](api/core/inject 'API reference') 関数を使用して依存性を注入し、どのルートをプリレンダリングするかを決定するための任意の作業ができます。これには通常、パラメーター値の配列を構築するためにデータを取得するリクエストを行うことが含まれます。

この関数は、キャッチオールルート (例: `/**`) でも使用できます。この場合、パラメーター名は `"**"` となり、戻り値は `foo/bar` のようなパスのセグメントになります。これらは他のパラメーター (例: `/post/:id/**`) と組み合わせて、より複雑なルート設定を処理できます。

```ts
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(PostService);
      const ids = await dataService.getIds(); // これは ['1', '2', '3'] を返すと仮定します

      return ids.map(id => ({ id })); // /post/1, /post/2, /post/3 のようなパスを生成します
    },
  },
  {
    path: 'post/:id/**',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
        { id: '1', '**': 'foo/3' },
        { id: '2', '**': 'bar/4' },
      ]; // /post/1/foo/3, /post/2/bar/4 のようなパスを生成します
    },
  },
];
```

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') は [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') にのみ適用されるため、この関数は常に_ビルド時_に実行されます。`getPrerenderParams` は、データのためにブラウザ固有またはサーバー固有のAPIに依存してはなりません。

IMPORTANT: `getPrerenderParams` 内で `inject` を使用する場合、`inject` は同期的に使用する必要があることに注意してください。非同期コールバック内や `await` ステートメントの後に呼び出すことはできません。詳細については、[`runInInjectionContext`](api/core/runInInjectionContext) を参照してください。

#### フォールバック戦略 {#fallback-strategies}

[`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') モードを使用する場合、プリレンダリングされていないパスへのリクエストを処理するためのフォールバック戦略を指定できます。

利用可能なフォールバック戦略は次のとおりです。

-   **Server:** サーバーサイドレンダリングにフォールバックします。これは、`fallback` プロパティが指定されていない場合の**デフォルト**の動作です。
-   **Client:** クライアントサイドレンダリングにフォールバックします。
-   **None:** フォールバックなし。Angularは、プリレンダリングされていないパスへのリクエストを処理しません。

```typescript
// app.routes.server.ts
import { RenderMode, PrerenderFallback, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client, // プリレンダリングされていない場合はCSRにフォールバック
    async getPrerenderParams() {
      // この関数は、/post/1、/post/2、/post/3 のパスで
      // プリレンダリングされた投稿を表すオブジェクトの配列を返します。
      // /post/4 のパスがリクエストされた場合、フォールバック動作が利用されます。
      return [{ id: 1 }, { id: 2 }, { id: 3 }];
    },
  },
];
```

## サーバー互換コンポーネントの作成 {#authoring-server-compatible-components}

一部の一般的なブラウザAPIと機能は、サーバーでは利用できない場合があります。アプリケーションは、`window`、`document`、`navigator`、`location` などのブラウザ固有のグローバルオブジェクトや、`HTMLElement` の特定のプロパティを使用できません。

一般に、ブラウザ固有のシンボルに依存するコードは、サーバーではなくブラウザでのみ実行されるべきです。これは、[`afterEveryRender`](api/core/afterEveryRender) および [`afterNextRender`](api/core/afterNextRender) ライフサイクルフックによって強制できます。これらはブラウザでのみ実行され、サーバーではスキップされます。

```angular-ts
import { Component, ViewChild, afterNextRender } from '@angular/core';

@Component({
  selector: 'my-cmp',
  template: `<span #content>{{ ... }}</span>`,
})
export class MyComponent {
  @ViewChild('content') contentRef: ElementRef;

  constructor() {
    afterNextRender(() => {
      // これはサーバーではなくブラウザでのみ実行されるため、`scrollHeight` のチェックは安全です。
      console.log('content height: ' + this.contentRef.nativeElement.scrollHeight);
    });
  }
}
```

## DIを介したリクエストとレスポンスへのアクセス {#accessing-request-and-response-via-di}

`@angular/core` パッケージは、サーバーサイドレンダリング環境と対話するためのいくつかのトークンを提供します。これらのトークンにより、SSR中にAngularアプリケーション内で重要な情報とオブジェクトにアクセスできます。

-   **[`REQUEST`](api/core/REQUEST 'API reference'):** Web APIの [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 型である現在のリクエストオブジェクトへのアクセスを提供します。これにより、ヘッダー、Cookie、その他のリクエスト情報にアクセスできます。
-   **[`RESPONSE_INIT`](api/core/RESPONSE_INIT 'API reference'):** Web APIの [`ResponseInit`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#parameters) 型であるレスポンス初期化オプションへのアクセスを提供します。これにより、レスポンスのヘッダーとステータスコードを動的に設定できます。このトークンを使用して、実行時に決定する必要があるヘッダーまたはステータスコードを設定します。
-   **[`REQUEST_CONTEXT`](api/core/REQUEST_CONTEXT 'API reference'):** 現在のリクエストに関連する追加のコンテキストへのアクセスを提供します。このコンテキストは、[`handle`](api/ssr/AngularAppEngine#handle 'API reference') 関数の2番目のパラメーターとして渡すことができます。通常、これは標準のWeb APIの一部ではない追加のリクエスト関連情報を提供するために使用されます。

```angular-ts
import { inject, REQUEST } from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: `<h1>My Component</h1>`,
})
export class MyComponent {
  constructor() {
    const request = inject(REQUEST);
    console.log(request?.url);
  }
}
```

IMPORTANT: 上記のトークンは、次のシナリオでは `null` になります。

-   ビルドプロセス中。
-   アプリケーションがブラウザでレンダリングされるとき (CSR)。
-   静的サイト生成 (SSG) を実行するとき。
-   開発中のルート抽出時 (リクエスト時)。

## 完全に静的なアプリケーションを生成する {#generate-a-fully-static-application}

デフォルトでは、Angularはアプリケーション全体をプリレンダリングし、リクエストを処理するためのサーバーファイルを生成します。これにより、アプリケーションはプリレンダリングされたコンテンツをユーザーに提供できます。ただし、サーバーなしで完全に静的なサイトを希望する場合は、`angular.json` 設定ファイルで `outputMode` を `static` に設定することで、この動作を無効にできます。

`outputMode` が `static` に設定されている場合、Angularはビルド時に各ルートのプリレンダリングされたHTMLファイルを生成しますが、サーバーファイルを生成したり、アプリケーションを提供するためにNode.jsサーバーを必要としたりしません。これは、バックエンドサーバーが不要な静的ホスティングプロバイダーにデプロイする場合に便利です。

これを設定するには、`angular.json` ファイルを次のように更新します。

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "outputMode": "static"
          }
        }
      }
    }
  }
}
```

## HttpClient使用時のデータキャッシュ {#caching-data-when-using-httpclient}

[`HttpClient`](api/common/http/HttpClient) は、サーバーで実行されているときに送信ネットワークリクエストをキャッシュします。この情報はシリアル化され、サーバーから送信される初期HTMLの一部としてブラウザに転送されます。ブラウザでは、`HttpClient` はキャッシュにデータがあるかどうかを確認し、ある場合は、初期アプリケーションレンダリング中に新しいHTTPリクエストを行う代わりにそれを再利用します。`HttpClient` は、ブラウザで実行中にアプリケーションが[安定](api/core/ApplicationRef#isStable)すると、キャッシュの使用を停止します。

デフォルトでは、`HttpClient` は `Authorization` または `Proxy-Authorization` ヘッダーを含まないすべての `HEAD` および `GET` リクエストをキャッシュします。ハイドレーションを提供する際に [`withHttpTransferCacheOptions`](api/platform-browser/withHttpTransferCacheOptions) を使用して、これらの設定をオーバーライドできます。

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(withHttpTransferCacheOptions({
      includePostRequests: true
    }))
  ]
});
```

## サーバーの設定 {#configuring-a-server}

### Node.js {#node-js}

`@angular/ssr/node` は、Node.js環境向けに `@angular/ssr` を拡張したものです。Node.jsアプリケーション内でサーバーサイドレンダリングを実装しやすくするAPIを提供します。関数と使用例の完全なリストについては、[`@angular/ssr/node` APIリファレンス](api/ssr/node/AngularNodeAppEngine) を参照してください。

```typescript
// server.ts
import { AngularNodeAppEngine, createNodeRequestHandler, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use('*', (req, res, next) => {
  angularApp
    .handle(req)
    .then(response => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next(); // 次のミドルウェアに制御を渡す
      }
    })
    .catch(next);
});

/**
 * Angular CLI (開発サーバーおよびビルド時) で使用されるリクエストハンドラー。
 */
export const reqHandler = createNodeRequestHandler(app);
```

### Node.js以外 {#non-node-js}

`@angular/ssr` は、Node.js以外のプラットフォームでAngularアプリケーションをサーバーサイドレンダリングするための重要なAPIを提供します。Web APIの標準的な [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) および [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) オブジェクトを活用することで、さまざまなサーバー環境にAngular SSRを統合できます。詳細情報と例については、[`@angular/ssr` APIリファレンス](api/ssr/AngularAppEngine) を参照してください。

```typescript
// server.ts
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const angularApp = new AngularAppEngine();

/**
 * これは、Angular CLI (開発サーバーおよびビルド時) で使用されるリクエストハンドラーです。
 */
export const reqHandler = createRequestHandler(async (req: Request) => {
  const res: Response|null = await angularApp.render(req);

  // ...
});
```
