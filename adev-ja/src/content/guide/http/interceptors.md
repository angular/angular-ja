# インターセプター

`HttpClient` は、_インターセプター_ と呼ばれるミドルウェアの一種をサポートしています。

TLDR: インターセプターは、再試行、キャッシュ、ロギング、認証など、一般的なパターンを個々のリクエストから抽象化できるミドルウェアです。

`HttpClient` は、関数型インターセプターとDIベースのインターセプターの2種類のインターセプターをサポートしています。複雑な設定では特に、関数型インターセプターの方が動作が予測しやすいので、関数型インターセプターの使用をお勧めします。このガイドの例では、関数型インターセプターを使用しており、[DI ベースのインターセプター](#di-based-interceptors)については、最後に別のセクションで説明します。

## インターセプター

インターセプターは、一般的には各リクエストに対して実行できる関数であり、リクエストとレスポンスの内容と全体的なフローに影響を与える幅広い機能を持っています。複数のインターセプターをインストールできます。インストールしたインターセプターはインターセプターチェーンを形成します。各インターセプターは、リクエストまたはレスポンスをチェーン内の次のインターセプターに転送する前に処理します。

インターセプターを使用して、さまざまな一般的なパターンを実装できます。たとえば、以下のようなものがあります。

* 特定のAPIへの送信リクエストに認証ヘッダーを追加する。
* 失敗したリクエストを指数関数的バックオフで再試行する。
* レスポンスを一定時間キャッシュするか、変更によって無効になるまでキャッシュする。
* レスポンスの解析をカスタマイズする。
* サーバーの応答時間を測定してログに記録する。
* ネットワーク操作が進行中の間、ローディングスピナーなどのUI要素を制御する。
* 特定のタイムフレーム内で作成されたリクエストを収集してバッチ処理する。
* 設定可能な期限またはタイムアウト後にリクエストを自動的に失敗させる。
* サーバーを定期的にポーリングして結果を更新する。

## インターセプターの定義

インターセプターの基本的な形式は、送信される `HttpRequest` と、インターセプターチェーン内の次の処理ステップを表す `next` 関数を受け取る関数です。

たとえば、この `loggingInterceptor` は、リクエストを転送する前に、送信されるリクエストのURLを `console.log` にログに記録します。

<docs-code language="ts">
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}
</docs-code>

このインターセプターが実際にリクエストをインターセプトするためには、`HttpClient` がインターセプターを使用するように構成する必要があります。

## インターセプターの構成

`HttpClient` を構成するときに使用するインターセプターのセットは、`withInterceptors` 機能を使用して、依存性の注入によって宣言します。

<docs-code language="ts">
bootstrapApplication(AppComponent, {providers: [
  provideHttpClient(
    withInterceptors([loggingInterceptor, cachingInterceptor]),
  )
]});
</docs-code>

構成したインターセプターは、プロバイダーにリストした順序でチェーンされます。上記の例では、`loggingInterceptor` がリクエストを処理し、`cachingInterceptor` に転送します。

### レスポンスイベントのインターセプト

インターセプターは、`next` から返される `HttpEvent` の `Observable` ストリームを変換して、レスポンスにアクセスしたり、レスポンスを操作したりできます。このストリームにはすべてのレスポンスイベントが含まれているため、最終的なレスポンスオブジェクトを識別するためには、各イベントの `.type` を調べる必要がある場合があります。

<docs-code language="ts">
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response) {
      console.log(req.url, 'returned a response with status', event.status);
    }
  }));
}
</docs-code>

TIP: インターセプターは、レスポンスストリームをリクエストオブジェクトをキャプチャするクロージャー内で変換するため、レスポンスを送信リクエストに自然に関連付けます。

## リクエストの変更

`HttpRequest` と `HttpResponse` インスタンスのほとんどの側面は _変更不可能_ であり、インターセプターは直接変更できません。代わりに、インターセプターは `.clone()` 操作を使用してこれらのオブジェクトを複製し、新しいインスタンスでどのプロパティを変更するべきかを指定することによって、変更を適用します。これには、値自体（`HttpHeaders` や `HttpParams` など）に対しては変更不可能な更新が含まれる場合があります。

たとえば、リクエストにヘッダーを追加するには、次のようにします。

<docs-code language="ts">
const reqWithHeader = req.clone({
  headers: req.headers.set('X-New-Header', 'new header value'),
});
</docs-code>

この変更不能性により、ほとんどのインターセプターは、同じ `HttpRequest` がインターセプターチェーンに複数回送信された場合でも、べき等性を持つことができます。これは、リクエストが失敗後に再試行された場合など、いくつかの理由で発生する可能性があります。

CRITICAL: リクエストまたはレスポンスの本文は、深い変更から **保護されません**。インターセプターが本文を変更する必要がある場合は、同じリクエストに対して複数回実行される場合の処理に注意してください。

## インターセプターでの依存性の注入

インターセプターは、インターセプターを登録したインジェクターの _注入コンテキスト_ で実行され、Angularの `inject` APIを使用して依存関係を取得できます。

たとえば、アプリケーションに `AuthService` というサービスがあり、このサービスが送信リクエストの認証トークンを作成するとします。インターセプターは、このサービスを注入して使用できます。

<docs-code language="ts">
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // 現在の `AuthService` を注入して、認証トークンを取得します。
  const authToken = inject(AuthService).getAuthToken();

  // 認証ヘッダーを追加するようにリクエストを複製します。
  const newReq = req.clone({
    headers: req.headers.append('X-Authentication-Token', authToken),
  });
  return next(newReq);
}
</docs-code>

## リクエストとレスポンスのメタデータ

多くの場合、バックエンドに送信されないリクエストに情報を含めたり、インターセプター専用の情報をリクエストに含めたりすると便利です。`HttpRequest` には、`.context` オブジェクトがあり、このオブジェクトは、この種のメタデータを `HttpContext` のインスタンスとして格納します。このオブジェクトは型付きマップとして機能し、キーは `HttpContextToken` 型です。

このシステムの動作を説明するために、メタデータを使用して、特定のリクエストに対してキャッシュインターセプターを有効にするかどうかを制御します。

### コンテキストトークンの定義

特定のリクエストの `.context` マップに、キャッシュインターセプターがリクエストをキャッシュするかどうかを格納するには、キーとして機能する新しい `HttpContextToken` を定義します。

<docs-code language="ts">
export const CACHING_ENABLED = new HttpContextToken<boolean>(() => true);
</docs-code>

提供される関数は、明示的に値が設定されていないリクエストのトークンのデフォルト値を作成します。関数を用いることで、トークンの値がオブジェクトまたは配列である場合、各リクエストが独自のインスタンスを取得することが保証されます。

### インターセプターでのトークンの読み込み

インターセプターは、トークンを読み取り、その値に基づいてキャッシュロジックを適用するかどうかを選択できます。

<docs-code language="ts">
export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.context.get(CACHING_ENABLED)) {
    // キャッシュロジックを適用する
    return ...;
  } else {
    // このリクエストに対してキャッシュが無効になっている
    return next(req);
  }
}
</docs-code>

### リクエストの作成時のコンテキストトークンの設定

`HttpClient` APIを介してリクエストを作成する際には、`HttpContextToken` の値を指定できます。

<docs-code language="ts">
const data$ = http.get('/sensitive/data', {
  context: new HttpContext().set(CACHING_ENABLED, false),
});
</docs-code>

インターセプターは、リクエストの `HttpContext` からこれらの値を読み取ることができます。

### リクエストコンテキストは変更可能

`HttpRequest` の他のプロパティとは異なり、関連付けられた `HttpContext` は _変更可能_ です。インターセプターが後で再試行されるリクエストのコンテキストを変更した場合、同じインターセプターは、再度実行されるときに、コンテキストの変更を認識します。これは、必要に応じて、複数回の再試行にわたって状態を渡す場合に便利です。

## 合成レスポンス

ほとんどのインターセプターは、リクエストまたはレスポンスを変換しながら、単に `next` ハンドラーを呼び出すだけです。しかし、これは厳密には必須ではありません。このセクションでは、インターセプターがより高度な動作を組み込むことができるいくつかの方法について説明します。

インターセプターは `next` を呼び出す必要はありません。代わりに、キャッシュからレスポンスを作成したり、別の手法でリクエストを送信したりするなど、別の方法でもレスポンスを作成できます。

`HttpResponse` コンストラクターを使用して、レスポンスを作成できます。

<docs-code language="ts">
const resp = new HttpResponse({
  body: 'response body',
});
</docs-code>

## DI ベースのインターセプター {#di-based-interceptors}

`HttpClient` は、注入可能なクラスとして定義され、DIシステムによって構成されるインターセプターもサポートしています。DIベースのインターセプターの機能は、関数型インターセプターと同じですが、構成方法が異なります。

DIベースのインターセプターは、`HttpInterceptor` インターフェースを実装する、注入可能なクラスです。

<docs-code language="ts">
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request URL: ' + req.url);
    return handler.handle(req);
  }
}
</docs-code>

DIベースのインターセプターは、依存性の注入のマルチプロバイダーによって構成されます。

<docs-code language="ts">
bootstrapApplication(AppComponent, {providers: [
  provideHttpClient(
    // DI ベースのインターセプターは明示的に有効にする必要があります。
    withInterceptorsFromDi(),
  ),

  {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true},
]});
</docs-code>

DIベースのインターセプターは、プロバイダーが登録された順序で実行されます。DI構成が複雑で階層的なアプリケーションでは、この順序を予測することは非常に難しい場合があります。
