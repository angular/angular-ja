# サーバーサイドレンダリング

サーバーサイドレンダリング (SSR) は、サーバーでページをレンダリングするプロセスです。これにより、初期のページ状態を含む初期HTMLコンテンツが生成されます。HTMLコンテンツがブラウザに配信されると、Angularはアプリケーションを初期化し、HTMLに含まれるデータを利用します。

## SSR を使用する理由 {#why-use-server-side-rendering}

SSRはクライアントサイドレンダリング (CSR) に比べて、主に以下の利点があります。

- **パフォーマンスの向上**: SSRは、完全にレンダリングされたHTMLをクライアントに配信することで、Webアプリケーションのパフォーマンスを向上させることができます。これにより、ブラウザはアプリケーションのJavaScriptをダウンロードする前に、HTMLを解析して表示できます。これは、帯域幅の狭い接続やモバイルデバイスのユーザーにとって特に有利です。
- **Core Web Vitals の向上**: SSRは、[Core Web Vitals (CWV)](https://web.dev/learn-core-web-vitals/) 統計を使用して測定できるパフォーマンスの向上をもたらします。これには、最初のコンテンツフルペイント ([FCP](https://developer.chrome.com/en/docs/lighthouse/performance/first-contentful-paint/)) や最大のコンテンツフルペイント ([LCP](https://web.dev/lcp/))、累積レイアウトシフト ([CLS](https://web.dev/cls/)) などの指標の改善が含まれます。
- **SEO の向上**: SSRは、検索エンジンがアプリケーションのコンテンツをクロールしてインデックス付けしやすくすることで、Webアプリケーションの検索エンジン最適化 (SEO) を向上させることができます。

## サーバーサイドレンダリングを有効にする

SSRを使用して**新規**プロジェクトを作成するには、次のコマンドを実行します。

```shell
ng new --ssr
```

**既存**のプロジェクトにSSRを追加するには、Angular CLIの `ng add` コマンドを使用します。

```shell
ng add @angular/ssr
```

Note: Angularにおける最新のSSRの進化に興味がありますか？開発者プレビューの[ハイブリッドレンダリングAPI](guide/hybrid-rendering)を覗いてみてください。

これらのコマンドは、SSRを有効にするためのアプリケーションコードを作成および更新し、プロジェクト構造に余分なファイルを追加します。

```
my-app
|-- server.ts                       # アプリケーションサーバー
└── src
    |-- app
    |   └── app.config.server.ts    # サーバーアプリケーション構成
    └── main.server.ts              # メインサーバーアプリケーションのブートストラップ
```

アプリケーションがサーバーサイドでレンダリングされていることを確認するには、`ng serve` でローカルに実行します。最初のHTMLリクエストには、アプリケーションのコンテンツが含まれている必要があります。

## サーバーサイドレンダリングの構成

Note: Angular v17以降 `server.ts` は `ng serve` では使用されていません。開発サーバーは `main.server.ts` を直接使用してサーバーサイドレンダリングを行います。

`server.ts` ファイルは、Node.js ExpressサーバーとAngularサーバーサイドレンダリングを構成します。`CommonEngine` はAngularアプリケーションをレンダリングするために使用されます。

<docs-code path="adev/src/content/examples/ssr/server.ts" visibleLines="[31,45]"></docs-code>

Angular CLIは、Angularアプリケーションのサーバーサイドレンダリングに焦点を当てた、初期のサーバー実装をスキャフォールディングします。このサーバーは、APIルート、リダイレクト、静的アセットなど、他の機能をサポートするように拡張できます。詳細については、[Express ドキュメント](https://expressjs.com/) を参照してください。

APIの詳細については、[`CommonEngine` APIリファレンス](api/ssr/node/CommonEngineRenderOptions)を参照してください。

## ハイドレーション

ハイドレーションは、クライアント上でサーバーサイドレンダリングされたアプリケーションを復元するプロセスです。これには、サーバーでレンダリングされたDOM構造の再利用、アプリケーション状態の永続化、サーバーが既に取得したアプリケーションデータの転送、その他のプロセスが含まれます。ハイドレーションは、SSRを使用する場合、デフォルトで有効になります。ハイドレーションの詳細については、[ハイドレーションガイド](guide/hydration) を参照してください。

## HttpClient を使用する場合のデータキャッシュ

[`HttpClient`](api/common/http/HttpClient) は、サーバーで実行されているときに、送信されるネットワークリクエストをキャッシュします。この情報はシリアル化され、サーバーから送信される最初のHTMLの一部としてブラウザに転送されます。ブラウザでは、`HttpClient` はキャッシュにデータが存在するかどうかをチェックし、存在する場合は初期アプリケーションレンダリング中に新しいHTTPリクエストを行う代わりに、キャッシュされたデータを使用します。`HttpClient` は、ブラウザで実行されているアプリケーションが[安定](api/core/ApplicationRef#isStable)すると、キャッシュの使用を停止します。

デフォルトでは、`HttpClient` は、`Authorization` または `Proxy-Authorization` ヘッダーが含まれていないすべての `HEAD` および `GET` リクエストをキャッシュします。これらの設定は、ハイドレーションを提供するときに [`withHttpTransferCacheOptions`](api/platform-browser/withHttpTransferCacheOptions) を使用することでオーバーライドできます。

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(withHttpTransferCacheOptions({
      includePostRequests: true
    }))
  ]
});
```

## サーバー対応コンポーネントのオーサリング

一部の一般的なブラウザAPIや機能は、サーバーでは使用できない場合があります。アプリケーションは、`window`、`document`、`navigator`、`location` などのブラウザ固有のグローバルオブジェクト、および `HTMLElement` の特定のプロパティを使用できません。

一般的に、ブラウザ固有のシンボルに依存するコードは、サーバーではなく、ブラウザでのみ実行する必要があります。これは、[`afterRender`](api/core/afterRender) および [`afterNextRender`](api/core/afterNextRender) ライフサイクルフックを使用して強制できます。これらは、ブラウザでのみ実行され、サーバーではスキップされます。

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
      // `scrollHeight` をチェックしても安全です。これはブラウザでのみ実行され、サーバーでは実行されないためです。
      console.log('content height: ' + this.contentRef.nativeElement.scrollHeight);
    });
  }
}
```

## Angular Service Worker の使用

サーバーでAngularをAngular Service Workerと組み合わせて使用している場合、動作は通常のサーバーサイドレンダリングの動作とは異なります。最初のサーバーリクエストは、期待どおりにサーバーでレンダリングされます。ただし、その最初のリクエストの後、後続のリクエストはService Workerによって処理され、常にクライアントサイドでレンダリングされます。
