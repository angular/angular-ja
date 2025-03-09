# ハイブリッドレンダリング

## ハイブリッドレンダリングとは何か？

ハイブリッドレンダリングは、サーバーサイドレンダリング（SSR）、プリレンダリング（「静的サイト生成」またはSSGとしても知られています）、クライアントサイドレンダリング（CSR）の利点を組み合わせて、Angularアプリケーションを最適化します。これにより、アプリケーションのさまざまな部分を異なる戦略を使用してレンダリングでき、アプリケーションがユーザーに配信される方法をきめ細かく制御できます。

Angularの新しい**開発者プレビュー**のサーバーレンダリングAPIは、最新のウェブアプリケーションを構築するためのより効率的で適応性の高いアプローチを提供します。これらのAPIは、アプリケーションのレンダリングを完全に制御できるため、パフォーマンスや検索エンジン最適化（SEO）、および全体的なユーザー体験を向上させる最適化が可能です。

**これらの新しいAPIのメリット：**

- **柔軟性の向上：**
  - レンダリングに対するきめ細かい制御を活用することで、アプリケーションのさまざまな部分のパフォーマンスとユーザー体験を最適化できます。
  - 各ルートに最適なレンダリング戦略を選択できます。高速な初期ロード時間のためのサーバーサイドレンダリング、動的なインタラクティブ性のためのクライアントサイドレンダリング、またはハイブリッドアプローチなどです。
- **組み込みの国際化（i18n）：**
  - すぐに使えるi18nサポートにより、アプリケーションをさまざまな言語や地域に簡単に適応させることができます。
- **環境に依存しない：**
  - Node.jsだけでなく、任意のJavaScriptランタイム環境でこれらのAPIを使用できます。
  - テクノロジースタックに関係なく、強化されたレンダリング機能の利点を享受できます。
- **シームレスな開発サーバー統合：**
  - 完全統合された開発サーバーからスムーズで効率的な開発エクスペリエンスを活用できます。

この開発者プレビューでは、これらの強力な新機能をいち早く確認できます。Angularチームは、皆様がこれらの機能を探索し、フィードバックを提供してAngularサーバーレンダリングの将来を形作ることを奨励しています。

## ハイブリッドレンダリングの設定

Angular CLIを使用して、サーバーサイドルーティングを備えた**新しい**プロジェクトを作成できます。

```shell
ng new --ssr --server-routing
```

`ng add`コマンドを使用して、既存のプロジェクトにサーバーサイドルーティングの追加もできます。

```shell
ng add @angular/ssr --server-routing
```

## サーバールーティング

### サーバールートの設定

`ServerRoute`オブジェクトの配列を宣言することで、サーバールート設定を作成できます。この設定は、通常`app.routes.server.ts`という名前のファイルに格納されます。

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
    path: 'profile', // このページはユーザー固有のデータが必要なので、SSR を使用します
    renderMode: RenderMode.Server,
  },
  {
    path: '**', // その他すべてのルートはサーバーでレンダリングされます (SSR)
    renderMode: RenderMode.Server,
  },
];
```

[`provideServerRouting`](api/ssr/provideServerRouting 'API reference')関数を使用して、この設定をアプリケーションに追加できます。

```typescript
import { provideServerRouting } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    // ... other providers ...
  ]
};
```

[App Shellパターン](ecosystem/service-workers/app-shell)を使用する場合は、クライアントサイドでレンダリングされたルートのアプリケーションシェルとして使用するルートを指定する必要があります。これを行うには、`appShellRoute`プロパティを持つオプションオブジェクトを[`provideServerRouting`](api/ssr/provideServerRouting 'API reference')に提供します。

```typescript
import { provideServerRouting, withAppShell } from '@angular/ssr';
import { AppShellComponent } from './app-shell/app-shell.component';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRouting(serverRoutes, withAppShell(AppShellComponent)),
    // ... other providers ...
  ]
};
```

### レンダリングモード

サーバールーティング設定では、`RenderMode`を設定することで、アプリケーションの各ルートがどのようにレンダリングされるかを指定できます。

| レンダリングモード      | 説明                                                                                                                                                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Server (SSR)**    | 各リクエストに対してサーバーでアプリケーションをレンダリングし、完全に完成したHTMLページをブラウザに送信します。詳細については、[サーバーサイドレンダリング（SSR）ガイド](guide/ssr)を参照してください。                                                             |
| **Client (CSR)**    | ブラウザでアプリケーションをレンダリングします。これはAngularのデフォルトの動作です。                                                                                                                                                                        |
| **Prerender (SSG)** | ビルド時にアプリケーションをプリレンダリングし、各ルートの静的HTMLファイルを生成します。詳細については、[プリレンダリングガイド](guide/prerendering)を参照してください。                                                                                        |

#### レンダリングモードの選択

各レンダリングモードには、それぞれ異なる利点と欠点があります。アプリケーションの具体的なニーズに基づいてレンダリングモードを選択できます。

##### クライアントサイドレンダリング

クライアントサイドレンダリングは、常にウェブブラウザで実行されると仮定してコードを記述できるため、最もシンプルな開発モデルです。これにより、ブラウザで実行されると仮定する広範なクライアントサイドライブラリを使用できます。

クライアントサイドレンダリングは、一般的に他のレンダリングモードよりもパフォーマンスが劣ります。ユーザーがレンダリングされたコンテンツを表示する前に、ページのJavaScriptをダウンロード、解析、および実行する必要があるためです。ページがレンダリング中にサーバーからさらにデータを取得する場合、ユーザーは完全なコンテンツを表示する前に、それらの追加リクエストを待つ必要もあります。

ページが検索クローラーによってインデックス付けされている場合、クライアントサイドレンダリングは検索エンジン最適化（SEO）に悪影響を与える可能性があります。検索クローラーは、ページをインデックス付けする際に実行するJavaScriptの量に制限があるためです。

クライアントサイドレンダリングの場合、サーバーは静的JavaScriptアセットを提供する以外に、ページをレンダリングするための作業はありません。サーバーコストが懸念事項である場合は、この要素を考慮できます。

[サービスワーカー](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)を使用してインストール可能なオフラインエクスペリエンスをサポートするアプリケーションは、サーバーと通信する必要なく、クライアントサイドレンダリングに依存できます。

##### サーバーサイドレンダリング

サーバーサイドレンダリングは、クライアントサイドレンダリングよりもページのロードが高速になります。JavaScriptのダウンロードと実行を待つ代わりに、サーバーはブラウザからリクエストを受信すると、直接HTMLドキュメントをレンダリングします。ユーザーは、サーバーがデータを取得して要求されたページをレンダリングするために必要な待ち時間しか経験しません。このモードでは、ブラウザからの追加のネットワークリクエストも不要になります。コードはサーバーでレンダリング中にデータを取得できるためです。

サーバーサイドレンダリングは、一般的に検索エンジン最適化（SEO）に優れています。検索クローラーは完全にレンダリングされたHTMLドキュメントを受け取るためです。

サーバーサイドレンダリングでは、ブラウザAPIに厳密に依存しないコードを作成する必要があり、ブラウザで実行されると仮定するJavaScriptライブラリの選択が制限されます。

サーバーサイドレンダリングの場合、サーバーはAngularを実行して、すべてのリクエストに対してHTMLレスポンスを生成します。この追加コストは、サーバーのホスティングコストに影響を与える可能性があります。

##### ビルド時のプリレンダリング

プリレンダリングは、クライアントサイドレンダリングとサーバーサイドレンダリングの両方よりもページのロードが高速になります。プリレンダリングは_ビルド時_にHTMLドキュメントを作成するため、サーバーは追加の作業をすることなく、静的HTMLドキュメントですぐにリクエストに応答できます。

プリレンダリングでは、ページをレンダリングするために必要なすべての情報が_ビルド時_に利用可能である必要があります。つまり、プリレンダリングされたページには、ページを読み込んでいる特定のユーザーへのデータを含めることができません。これは、プリレンダリングは主に、アプリケーションのすべてのユーザーに対して同じであるページに役立つことを意味します。

プリレンダリングはビルド時に行われるため、本番ビルドにかなりの時間がかかる可能性があります。[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference')を使用して多数のHTMLドキュメントを生成すると、展開ファイルの総サイズに影響し、デプロイが遅くなる可能性があります。

ビルド出力に含まれる静的HTMLドキュメントの数によっては、デプロイ時間が長くなる可能性もあります。

プリレンダリングは、一般的に検索エンジン最適化（SEO）に優れています。検索クローラーは完全にレンダリングされたHTMLドキュメントを受け取るためです。

プリレンダリングでは、ブラウザAPIに厳密に依存しないコードを作成する必要があり、ブラウザで実行されると仮定するJavaScriptライブラリの選択が制限されます。

プリレンダリングは、サーバーが静的HTMLドキュメントで応答するため、サーバーリクエストごとのオーバーヘッドが非常に少なくなります。静的ファイルは、コンテンツデリバリーネットワーク（CDN）、ブラウザ、および中間キャッシュレイヤーによって簡単にキャッシュされるため、その後のページロードがさらに高速になります。静的HTMLファイルをCDNに展開すると、アプリケーションウェブサーバーからの作業負荷を軽減できるため、トラフィックの多いアプリケーションにとって大きな影響があります。

### ヘッダーとステータスコードの設定

`ServerRoute`設定の`headers`プロパティと`status`プロパティを使用して、個々のサーバールートのカスタムヘッダーとステータスコードを設定できます。

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
  // ... other routes
];
```

### リダイレクト

Angularは、ルート設定の[`redirectTo`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference')プロパティで指定されたリダイレクトを、サーバーサイドでは異なる方法で処理します。

**サーバーサイドレンダリング（SSR）**
リダイレクトは、サーバーサイドレンダリングプロセス内で標準のHTTPリダイレクト（例：301、302）を使用して実行されます。

**プリレンダリング（SSG）**
リダイレクトは、プリレンダリングされたHTMLで`<meta http-equiv="refresh">`タグを使用して「ソフトリダイレクト」として実装されます。これにより、サーバーへのラウンドトリップを行うことなくリダイレクトが可能になります。

### ビルド時のプリレンダリング（SSG）のカスタマイズ

[`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference')を使用する場合、プリレンダリングとサービスプロセスをカスタマイズするためのいくつかの設定オプションを指定できます。

#### パラメータ化されたルート

[`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference')を持つ各ルートについて、[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference')関数を指定できます。この関数を使用すると、どの特定のパラメータで個別のプリレンダリングされたドキュメントを生成するかを制御できます。

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference')関数は、オブジェクトの配列に解決される`Promise`を返します。各オブジェクトは、ルートパラメータ名と値のキーと値のマップです。たとえば、`posts/:id`のようなルートを定義した場合、`getPrerenderParams`は配列`[{id: 123}, {id: 456}]`を返し、`posts/123`と`posts/456`の個別のドキュメントをレンダリングします。

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference')の本文では、Angularの[`inject`](api/core/inject 'API reference')関数を使用して依存関係を注入し、プリレンダリングするルートを決定するための任意の作業ができます。これには、通常、データを取得するためのリクエストを実行して、パラメータ値の配列を作成することが含まれます。

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(PostService);
      const ids = await dataService.getIds(); // これは ['1', '2', '3'] を返すことを想定しています

      return ids.map(id => ({ id })); // プリレンダリング用のオブジェクトの配列に変換します

      // これにより、パス `/post/1`、`/post/2`、`/post/3` がプリレンダリングされます
    },
  },
];
```

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference')は[`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference')のみに適用されるため、この関数は常に_ビルド時_に実行されます。`getPrerenderParams`は、データに対してブラウザ固有またはサーバー固有のAPIに依存してはなりません。ルートが[`fallback`](api/ssr/ServerRoutePrerenderWithParams#fallback 'API reference')オプションを指定しない場合、ルートはデフォルトで[`PrerenderFallback.Server`](api/ssr/PrerenderFallback#Server 'API reference')（SSR）にフォールバックします。

IMPORTANT: `getPrerenderParams`内で[`inject`](api/core/inject 'API reference')を使用する場合は、`inject`を同期的に使用する必要があることを覚えておいてください。非同期コールバック内、または`await`ステートメントの後で使用できません。詳細については、[`runInInjectionContext` APIリファレンス](api/core/runInInjectionContext)を参照してください。

#### フォールバック戦略

[`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference')モードを使用する場合、プリレンダリングされていないパスのリクエストを処理するためのフォールバック戦略を指定できます。

利用可能なフォールバック戦略は次のとおりです。

- **Server:** サーバーサイドレンダリングにフォールバックします。これは、`fallback`プロパティが指定されていない場合の**デフォルト**の動作です。
- **Client:** クライアントサイドレンダリングにフォールバックします。
- **None:** フォールバックはありません。Angularは、プリレンダリングされていないパスのリクエストを処理しません。

```typescript
// app.routes.server.ts
import { RenderMode, PrerenderFallback, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client, // プリレンダリングされていない場合はCSRにフォールバックします
    async getPrerenderParams() {
      // この関数は、パス `/post/1`、`/post/2`、`/post/3` で
      // プリレンダリングされた投稿を表すオブジェクトの配列を返します。
      // パス `/post/4` は、要求された場合にフォールバック動作を使用します。
      return [{ id: 1 }, { id: 2 }, { id: 3 }];
    },
  },
];
```

## DIによるリクエストとレスポンスへのアクセス

`@angular/core`パッケージは、サーバーサイドレンダリング環境とやり取りするためのいくつかのトークンを提供します。これらのトークンを使用すると、SSR中にAngularアプリケーション内で重要な情報とオブジェクトにアクセスできます。

- **[`REQUEST`](api/core/REQUEST 'API reference'):** Web APIの[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)型である現在のリクエストオブジェクトへのアクセスを提供します。これにより、ヘッダー、Cookie、その他のリクエスト情報にアクセスできます。
- **[`RESPONSE_INIT`](api/core/RESPONSE_INIT 'API reference'):** Web APIの[`ResponseInit`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#parameters)型であるレスポンス初期化オプションへのアクセスを提供します。これにより、ヘッダーとレスポンスのステータスコードを動的に設定できます。ランタイムで決定する必要があるヘッダーまたはステータスコードを設定するには、このトークンを使用します。
- **[`REQUEST_CONTEXT`](api/core/REQUEST_CONTEXT 'API reference'):** 現在のリクエストに関する追加のコンテキストへのアクセスを提供します。このコンテキストは、[`handle`](api/ssr/AngularAppEngine#handle 'API reference')関数の2番目のパラメータとして渡すことができます。通常、これは標準のWeb APIの一部ではない追加のリクエスト関連情報を提供するために使用されます。

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

IMPORTANT: 上記のトークンは、次のシナリオでは`null`になります。

- ビルドプロセス中。
- アプリケーションがブラウザでレンダリングされる場合（クライアントサイドレンダリング）。
- 静的サイト生成（SSG）を実行する場合。
- 開発中のルート抽出時（リクエスト時）。

## Node.js以外のサーバーの設定

`@angular/ssr`は、Node.js以外のプラットフォームでAngularアプリケーションをサーバーサイドレンダリングするための重要なAPIを提供します。Web APIの標準的な[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)と[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)オブジェクトを活用することで、さまざまなサーバー環境にAngular SSRを統合できます。詳細情報と例については、[`@angular/ssr` APIリファレンス](api/ssr/AngularAppEngine)を参照してください。

```typescript
// server.ts
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const angularApp = new AngularAppEngine();

/**
 * これはAngular CLI（開発サーバーとビルド中）で使用されるリクエストハンドラーです。
 */
const reqHandler = createRequestHandler(async (req: Request) => {
  const res: Response|null = await angularApp.render(req);

  // ...
});
```

## Node.jsサーバーの設定

`@angular/ssr/node`は、Node.js環境用に`@angular/ssr`を拡張したものです。Node.jsアプリケーション内でサーバーサイドレンダリングを実装しやすくするためのAPIを提供します。関数の完全なリストと使用例については、[`@angular/ssr/node` APIリファレンス](api/ssr/node/AngularNodeAppEngine) APIリファレンスを参照してください。

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
        next(); // 次のミドルウェアに制御を渡します
      }
    })
    .catch(next);
);

/**
 * Angular CLI（開発サーバーとビルド中）で使用されるリクエストハンドラーです。
 */
export const reqHandler = createNodeRequestHandler(app);
```
