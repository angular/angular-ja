# `HttpClient` の設定

`HttpClient` は、Angular v21以降ではデフォルトで注入可能です。

## 依存性の注入による `HttpClient` の提供

`provideHttpClient` ヘルパー関数を使うと、`app.config.ts` のアプリケーション `providers` で、デフォルトのHTTP機能セットを設定したり、機能を追加したりできます。

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(/* add features here, such as withInterceptors(...) */)],
};
```

アプリケーションがNgModuleベースのブートストラップを使用している場合は、アプリケーションのNgModuleのプロバイダーに `provideHttpClient` を含めて、デフォルトのHTTP機能セットを設定したり、機能を追加したりできます。

```ts
@NgModule({
  providers: [provideHttpClient(/* add features here, such as withInterceptors(...) */)],
  // ...その他のアプリケーション設定
})
export class AppModule {}
```

その後、`HttpClient` サービスを、コンポーネント、サービス、またはその他のクラスの依存関係として注入できます。

```ts
@Service()
export class ConfigService {
  private http = inject(HttpClient);
  // このサービスは、`this.http` を介して HTTP リクエストを実行できるようになりました。
}
```

## `HttpClient` の機能の設定

`provideHttpClient` は、クライアントのさまざまな側面の動作を有効化または設定するための、オプションの機能設定のリストを受け取ります。このセクションでは、オプションの機能とその使用方法について詳しく説明します。

### `withXhr`

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withXhr())],
};
```

デフォルトでは、`HttpClient` は [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) APIを使ってリクエストを行います。`withXhr` 機能は、クライアントを [`XMLHttpRequest`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) APIを代わりに使うように切り替えます。

`fetch` はより新しいAPIであり、`XMLHttpRequest` がサポートされていないいくつかの環境で使用できます。アップロードの進行状況イベントを生成しないなど、いくつかの制限があります。

<docs-callout critical title="サーバーサイドレンダリング（SSR）環境では `withXhr` を使用しないでください">

サーバー上でのXHRサポートは**非推奨**であり、Angular 23で削除される予定です。基盤となる `xhr2` ライブラリはリダイレクトを安全に処理しません。クロスオリジンのリダイレクトで `Authorization` ヘッダーを転送してしまう可能性があり、リダイレクトループによるサービス拒否（DoS）攻撃の影響も受けます。SSRアプリケーションでは、代わりにデフォルトの `fetch` バックエンドを使用してください。

</docs-callout>

### `withInterceptors(...)`

`withInterceptors` は、`HttpClient` を介して行われたリクエストを処理する、インターセプター関数のセットを設定します。詳細については、[インターセプターガイド](guide/http/interceptors) を参照してください。

### `withInterceptorsFromDi()`

`withInterceptorsFromDi` は、`HttpClient` 設定に、古いスタイルのクラスベースのインターセプターを含めます。詳細については、[インターセプターガイド](guide/http/interceptors) を参照してください。

HELPFUL: 関数インターセプター（`withInterceptors` を介して）は、より予測可能な順序を持ち、DIベースのインターセプターよりも推奨されます。

### `withRequestsMadeViaParent()`

デフォルトでは、`provideHttpClient` を使って特定のインジェクター内で `HttpClient` を設定すると、この設定は、親インジェクターに存在する可能性のある `HttpClient` の設定を上書きします。

`withRequestsMadeViaParent()` を追加すると、`HttpClient` は、このレベルで設定されたインターセプターを通過した後、親インジェクターの `HttpClient` インスタンスにリクエストを渡すように設定されます。これは、親インジェクターのインターセプターも通過しながら、子インジェクターにインターセプターを追加したい場合に役立ちます。

CRITICAL: 現在のインジェクターよりも上の `HttpClient` のインスタンスを設定する必要があります。そうしないと、このオプションは無効となり、使用しようとすると実行時エラーが発生します。

### `withJsonpSupport()`

`withJsonpSupport` を含めると、`HttpClient` の `.jsonp()` メソッドが有効になり、[JSONP 規約](https://en.wikipedia.org/wiki/JSONP) を介してGETリクエストを行い、データのクロスドメインロードを行います。

HELPFUL: 可能であれば、JSONPの代わりに [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) を使ってクロスドメインリクエストを行うことをお勧めします。

### `withXsrfConfiguration(...)`

このオプションを含めると、`HttpClient` の組み込みのXSRFセキュリティ機能をカスタマイズできます。詳細については、[セキュリティガイド](best-practices/security) を参照してください。

### `withNoXsrfProtection()`

このオプションを含めると、`HttpClient` の組み込みのXSRFセキュリティ機能が無効になります。詳細については、[セキュリティガイド](best-practices/security) を参照してください。

## `HttpClientModule` ベースの設定

一部のアプリケーションでは、NgModuleベースの古いAPIを使って `HttpClient` を設定している場合があります。

この表は、`@angular/common/http` から使用できるNgModuleと、上記のプロバイダー設定関数との関係を示しています。

| **NgModule**                            | `provideHttpClient()` に相当する                         |
| --------------------------------------- | -------------------------------------------------------- |
| `HttpClientModule`                      | `provideHttpClient(withInterceptorsFromDi(), withXhr())` |
| `HttpClientJsonpModule`                 | `withJsonpSupport()`                                     |
| `HttpClientXsrfModule.withOptions(...)` | `withXsrfConfiguration(...)`                             |
| `HttpClientXsrfModule.disable()`        | `withNoXsrfProtection()`                                 |

<docs-callout important title="複数のインジェクターで HttpClientModule を使用する場合、注意してください。">
`HttpClientModule` が複数のインジェクターに存在する場合、インターセプターの動作は明確に定義されておらず、オプションやプロバイダー/インポートの順序に依存します。

マルチインジェクター構成には、`provideHttpClient` を使用することをお勧めします。これは、より安定した動作をします。上記の `withRequestsMadeViaParent` 機能を参照してください。
</docs-callout>
