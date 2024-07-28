# リクエストのテスト

外部へ依存する場合、テストでリモートサーバーとのやり取りをシミュレートできるように、HTTPバックエンドをモックする必要があります。`@angular/common/http/testing` ライブラリは、アプリケーションによって行われたリクエストをキャプチャし、それらについてアサーションを行い、バックエンドの動作をエミュレートするためにレスポンスをモックするためのツールを提供します。

テストライブラリは、アプリケーションがコードを実行して最初にリクエストを行うというパターン用に設計されています。その後、テストは特定のリクエストが行われたか、行われなかったかを期待し、それらのリクエストに対してアサーションを行い、最後に各期待されるリクエストにレスポンスを提供することによってそれらを「フラッシュ」します。

最後に、テストはアプリケーションが予期しないリクエストを行わなかったことを検証できます。

## テストの設定

`HttpClient` の使用のテストを開始するには、`TestBed` を構成してテストの設定に `provideHttpClient()` と `provideHttpClientTesting` を含めます。これにより、`HttpClient` が実際のネットワークではなくテストバックエンドを使用するように構成されます。また、`HttpTestingController` も提供され、これを使用してテストバックエンドとやり取ります。そして、どのリクエストが行われたかについての期待を設定し、それらのリクエストに対するレスポンスを流します。`HttpTestingController` は、構成されたら `TestBed` から注入できます。

<docs-code language="ts">
TestBed.configureTestingModule({
  providers: [
    // ...その他のテストプロバイダー
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);
</docs-code>

これで、テストでリクエストを行うと、通常のバックエンドではなくテストバックエンドにヒットするようになります。`httpTesting` を使用して、それらのリクエストについてアサーションを行うことができます。

## リクエストの期待と応答

たとえば、GETリクエストが発生することを期待し、モックレスポンスを提供するテストを作成できます。

<docs-code language="ts">
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
const config$ = this.configService.getConfig<Config>();

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
</docs-code>

Note: `expectOne` は、テストが指定された基準に一致するリクエストを2つ以上行った場合に失敗します。

`req.method` についてアサートする代わりに、`expectOne` の拡張形式を使用してリクエストメソッドも一致させることができます。

<docs-code language="ts">
const req = httpTesting.expectOne({
  method: 'GET',
  url: '/api/config',
}, '構成をロードするリクエスト');
</docs-code>

HELPFUL: 期待APIは、クエリパラメータを含むリクエストの完全なURLと一致します。

最後のステップである、保留中のリクエストがないことを検証する操作は十分に一般的なので、`afterEach()` ステップに移動できます。

<docs-code language="ts">
afterEach(() => {
  // テストが追加の HTTP リクエストを行わないことを確認します。
  TestBed.inject(HttpTestingController).verify();
});
</docs-code>

## 複数のリクエストを一度に処理する

テストで重複するリクエストに応答する必要がある場合は、`expectOne()` ではなく `match()` APIを使用します。これは同じ引数を受け取りますが、一致するリクエストの配列を返します。返された後、これらのリクエストは今後のマッチングから削除され、それらをフラッシュして検証する責任はあなたにあります。

<docs-code language="ts">
const allGetRequests = httpTesting.match({method: 'GET'});
foreach (const req of allGetRequests) {
  // 各リクエストへの応答処理。
}
</docs-code>

## 高度なマッチング

すべてのマッチング関数は、カスタムマッチングロジックの述語関数を受け取ります。

<docs-code language="ts">
// リクエストボディを持つリクエストを 1 つ探します。
const requestsWithBody = httpTesting.expectOne(req => req.body !== null);
</docs-code>

`expectNone` 関数は、指定された基準に一致するリクエストがないことをアサートします。

<docs-code language="ts">
// 突然変異リクエストが発行されていないことをアサートします。
httpTesting.expectNone(req => req.method !== 'GET');
</docs-code>

## エラー処理のテスト

HTTPリクエストが失敗した場合のアプリケーションのレスポンスをテストする必要があります。

### バックエンドエラー

バックエンドエラー（サーバーが成功ではないステータスコードを返す場合）の処理をテストするには、リクエストが失敗した場合にバックエンドが返すものとエミュレートしたエラーレスポンスを使用して、リクエストをフラッシュします。

<docs-code language="ts">
const req = httpTesting.expectOne('/api/config');
req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});

// アプリケーションがバックエンドエラーを正常に処理したことをアサートします。
</docs-code>

### ネットワークエラー

リクエストは、ネットワークエラーが原因で失敗することもあり、`ProgressEvent` エラーとして現れます。これらは、`error()` メソッドを使用して配信できます。

<docs-code language="ts">
const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));

// アプリケーションがネットワークエラーを正常に処理したことをアサートします。
</docs-code>
