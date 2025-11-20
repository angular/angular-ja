## リクエストのテスト

外部へ依存する場合、テストでリモートサーバーとのやり取りをシミュレートできるように、HTTPバックエンドをモックする必要があります。`@angular/common/http/testing` ライブラリは、アプリケーションによって行われたリクエストをキャプチャし、それらについてアサーションを行い、バックエンドの動作をエミュレートするためにレスポンスをモックするためのツールを提供します。

テストライブラリは、アプリケーションがコードを実行して最初にリクエストを行うというパターン用に設計されています。その後、テストは特定のリクエストが行われたか、行われなかったかを期待し、それらのリクエストに対してアサーションを行い、最後に各期待されるリクエストにレスポンスを提供することによってそれらを「フラッシュ」します。

最後に、テストはアプリケーションが予期しないリクエストを行わなかったことを検証できます。

## テストの設定

`HttpClient` の使用のテストを開始するには、`TestBed` を構成してテストの設定に `provideHttpClient()` と `provideHttpClientTesting()` を含めます。これにより、`HttpClient` が実際のネットワークではなくテストバックエンドを使用するように構成されます。また、`HttpTestingController` も提供され、これを使用してテストバックエンドとやり取ります。そして、どのリクエストが行われたかについての期待を設定し、それらのリクエストに対するレスポンスを流します。`HttpTestingController` は、構成されたら `TestBed` から注入できます。

IMPORTANT: `provideHttpClientTesting()` は `provideHttpClient()` の一部を上書きするため、`provideHttpClient()` を `provideHttpClientTesting()` の**前**に提供することに留意してください。これを逆に行うと、テストが壊れてしまう可能性があります。

```ts
TestBed.configureTestingModule({
  providers: [
    // ...その他のテストプロバイダー
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);
```

これで、テストでリクエストを行うと、通常のバックエンドではなくテストバックエンドにヒットするようになります。`httpTesting` を使用して、それらのリクエストについてアサーションを行うことができます。

## リクエストの期待と応答

たとえば、GETリクエストが発生することを期待し、モックレスポンスを提供するテストを作成できます。

```ts
TestBed.configureTestingModule({
  providers: [
    ConfigService,
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);

// `ConfigService` をロードして現在の構成を要求します。
const service = TestBed.inject(ConfigService);
const config$ = service.getConfig<Config>();

// `firstValueFrom` は `Observable` を購読し、HTTP リクエストを行い、
// レスポンスの `Promise` を作成します。
const configPromise = firstValueFrom(config$);

// この時点で、リクエストは保留中であり、
// `HttpTestingController` を介して作成されたことをアサートできます。
const req = httpTesting.expectOne('/api/config', '構成をロードするリクエスト');

// 必要に応じて、リクエストのさまざまなプロパティをアサートできます。
expect(req.request.method).toBe('GET');

// リクエストをフラッシュすると、リクエストが完了し、結果が配信されます。
req.flush(DEFAULT_CONFIG);

// その後、`ConfigService` によってレスポンスが正常に配信されたことをアサートできます。
expect(await configPromise).toEqual(DEFAULT_CONFIG);

// 最後に、他のリクエストが行われていないことをアサートできます。
httpTesting.verify();
```

NOTE: `expectOne` は、テストが指定された基準に一致するリクエストを2つ以上行った場合に失敗します。

`req.method` についてアサートする代わりに、`expectOne` の拡張形式を使用してリクエストメソッドも一致させることができます。

```ts
const req = httpTesting.expectOne({
  method: 'GET',
  url: '/api/config',
}, '構成をロードするリクエスト');
```

HELPFUL: 期待APIは、クエリパラメータを含むリクエストの完全なURLと一致します。

最後のステップである、保留中のリクエストがないことを検証する操作は十分に一般的なので、`afterEach()` ステップに移動できます。

```ts
afterEach(() => {
  // テストが追加の HTTP リクエストを行わないことを確認します。
  TestBed.inject(HttpTestingController).verify();
});
```

## 複数のリクエストを一度に処理する

テストで重複するリクエストに応答する必要がある場合は、`expectOne()` ではなく `match()` APIを使用します。これは同じ引数を受け取りますが、一致するリクエストの配列を返します。返された後、これらのリクエストは今後のマッチングから削除され、それらをフラッシュして検証する責任はあなたにあります。

```ts
const allGetRequests = httpTesting.match({method: 'GET'});
for (const req of allGetRequests) {
  // 各リクエストへの応答処理。
}
```

## 高度なマッチング

すべてのマッチング関数は、カスタムマッチングロジックの述語関数を受け取ります。

```ts
// リクエストボディを持つリクエストを 1 つ探します。
const requestsWithBody = httpTesting.expectOne(req => req.body !== null);
```

`expectNone` 関数は、指定された基準に一致するリクエストがないことをアサートします。

```ts
// 突然変異リクエストが発行されていないことをアサートします。
httpTesting.expectNone(req => req.method !== 'GET');
```

## エラー処理のテスト

HTTPリクエストが失敗した場合のアプリケーションのレスポンスをテストする必要があります。

### バックエンドエラー

バックエンドエラー（サーバーが成功ではないステータスコードを返す場合）の処理をテストするには、リクエストが失敗した場合にバックエンドが返すものとエミュレートしたエラーレスポンスを使用して、リクエストをフラッシュします。

```ts
const req = httpTesting.expectOne('/api/config');
req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});

// アプリケーションがバックエンドエラーを正常に処理したことをアサートします。
```

### ネットワークエラー

リクエストは、ネットワークエラーが原因で失敗することもあり、`ProgressEvent` エラーとして現れます。これらは、`error()` メソッドを使用して配信できます。

```ts
const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));

// アプリケーションがネットワークエラーを正常に処理したことをアサートします。
```

## インターセプターのテスト {#testing-an-interceptor}

インターセプターが望ましい状況下で機能することをテストする必要があります。

たとえば、アプリケーションは、サービスによって生成された認証トークンを各送信リクエストに追加する必要がある場合があります。
この動作は、インターセプターの使用によって強制できます。

```ts
export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  const clonedRequest = request.clone({
    headers: request.headers.append('X-Authentication-Token', authService.getAuthToken()),
  });
  return next(clonedRequest);
}
```

このインターセプターの `TestBed` 構成は、`withInterceptors` 機能に依存する必要があります。

```ts
TestBed.configureTestingModule({
  providers: [
    AuthService,
    // 一度に1つのインターセプターをテストすることをお勧めします。
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClientTesting(),
  ],
});
```

`HttpTestingController` は、リクエストインスタンスを取得でき、それを検査してリクエストが変更されたことを確認できます。

```ts
const service = TestBed.inject(AuthService);
const req = httpTesting.expectOne('/api/config');

expect(req.request.headers.get('X-Authentication-Token')).toEqual(service.getAuthToken());
```

同様のインターセプターは、クラスベースのインターセプターで実装することもできます。

```ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      headers: request.headers.append('X-Authentication-Token', this.authService.getAuthToken()),
    });
    return next.handle(clonedRequest);
  }
}
```

これをテストするには、`TestBed` 構成を次のようにする必要があります。

```ts
TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    // HTTP_INTERCEPTORS トークンに依存して、AuthInterceptor を HttpInterceptor として登録します
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
});
```
