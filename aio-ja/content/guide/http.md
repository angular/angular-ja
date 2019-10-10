# HttpClient

ほとんどのフロントエンドアプリケーションは、HTTPプロトコルを使用してバックエンドサービスと通信します。
モダンブラウザは、HTTPリクエストを行うための2つのAPIをサポートしています。`XMLHttpRequest`インターフェースと`fetch()`APIです。

`@angular/common/http`の`HttpClient`は、Angularアプリケーション用のシンプルなクライアントHTTP APIを提供します。
これはブラウザによって公開される`XMLHttpRequest`インターフェースに依存します。
さらに`HttpClient`の利点としては、テスト機能、リクエストとレスポンスオブジェクトの型付け、リクエストとレスポンスのインターセプト、`Observable`のAPI、そして合理化されたエラー処理が含まれます。

このガイドに付属の<live-example></live-example>はその場で実行できます。

<div class="alert is-helpful">

サンプルアプリはデータサーバーを必要としません。
_HttpClient_モジュールの`HttpBackend`を置き換える[Angular _in-memory-web-api_](https://github.com/angular/in-memory-web-api/blob/master/README.md)に依存しています。
このサービスはRESTのようなバックエンドの動作をシミュレートします。

`AppModule`の_imports_を見て、それがどのように設定されているかを見てください。

</div>

## セットアップ

`HttpClient`を使う前に、Angular`HttpClientModule`をインポートする必要があります。ほとんどのアプリはルート`AppModule`で行います。

<code-example 
  path="http/src/app/app.module.ts"
  region="sketch"
  header="app/app.module.ts (excerpt)">
</code-example>

`HttpClientModule`を`AppModule`にインポートしたら、次の`ConfigService`の例に示すように`HttpClient`をアプリケーションクラスに注入できるようになります。

<code-example 
  path="http/src/app/config/config.service.ts"
  region="proto"
  header="app/config/config.service.ts (excerpt)">
</code-example>

## サーバーからのデータをリクエストする

アプリケーションはしばしばJSONデータをサーバーに要求します。
たとえば、リソースURLを指定するサーバーの設定ファイル`config.json`が必要になるかもしれません。

<code-example 
  path="http/src/assets/config.json"
  header="assets/config.json">
</code-example>

`ConfigService`はこのファイルを`HttpClient`の`get()`メソッドでフェッチします。

<code-example 
  path="http/src/app/config/config.service.ts"
  region="getConfig_1"
  header="app/config/config.service.ts (getConfig v.1)">
</code-example>

`ConfigComponent`というコンポーネントは、`ConfigService`を注入し`getConfig`サービスメソッドを呼び出します。

<code-example 
  path="http/src/app/config/config.component.ts"
  region="v1"
  header="app/config/config.component.ts (showConfig v.1)">
</code-example>

サービスメソッドは構成データの`Observable`を返すので、コンポーネントはメソッドの戻り値を**購読**します。
サブスクリプションのコールバックでは、データフィールドをコンポーネントの`config`オブジェクトにコピーします。
このオブジェクトは、表示のためにコンポーネントのテンプレート内でデータバインドされています。

<div class="callout is-helpful">
 <header>Why write a service?</header>

この例はとてもシンプルで、`Http.get()`をコンポーネント自身に書いてサービスは作りません。
しかし実践では、データアクセスはめったにこのようなシンプルな形にはなりません。
典型的には、データの後処理、エラー処理の追加、断続的な接続に対処するためのリトライロジックなどが必要になります。

このコンポーネントは、データアクセスの細分化ですぐに乱雑になります。
コンポーネントの理解が難しくなり、テストが難しくなり、データアクセスロジックを再利用したり標準化することができなくなります。

そのため、このサービスのような単純なケースでも、データアクセスを別のサービスにカプセル化し、コンポーネント内のそのサービスに委任することによって、データの表示とデータアクセスを分離することがベストプラクティスです。
</div>

### Requesting a typed response

You can structure your `HttpClient` request to declare the type of the response object, to make consuming the output easier and more obvious.
Specifying the response type acts as a type assertion during the compile time.

To specify the response object type, first define an interface with the required properties.
(Use an interface rather than a class; a response cannot be automatically converted to an instance of a class.)

<code-example 
  path="http/src/app/config/config.service.ts"
  region="config-interface">
</code-example>

次に、そのインターフェースをサービスの`HttpClient.get()`呼び出しの型パラメーターとして指定します。

<code-example 
  path="http/src/app/config/config.service.ts"
  region="getConfig_2" 
  header="app/config/config.service.ts (getConfig v.2)">
</code-example>

<div class="alert is-helpful">

 When you pass an interface as a type parameter to the `HttpClient.get()` method, use the RxJS `map` operator to transform the response data as needed by the UI. You can then pass the transformed data to the [async pipe](api/common/AsyncPipe).

</div>

更新されたコンポーネントメソッドのコールバックは、より簡単で安全な型指定されたデータオブジェクトを受け取ります。

<code-example 
  path="http/src/app/config/config.component.ts"
  region="v2"
  header="app/config/config.component.ts (showConfig v.2)">
</code-example>

<div class="alert is-important">

Specifying the response type is a declaration to TypeScript that it should expect your response to be of the given type.
This is a build-time check and doesn't guarantee that the server will actually respond with an object of this type. It is up to the server to ensure that the type specified by the server API is returned.

</div>

To access properties that are defined in an interface, you must explicitly convert the Object you get from the JSON to the required response type.
For example, the following `subscribe` callback receives `data` as an Object, and then type-casts it in order to access the properties.

<code-example>
   .subscribe(data => this.config = {
    heroesUrl: (data as any).heroesUrl,
    textfile:  (data as any).textfile,
   });
</code-example>


### レスポンス全体を読む

レスポンスボディはすべてのデータを返しません。場合によっては、サーバーは特別なヘッダーやステータスコードを返すことがあります。
アプリケーションのワークフローに重要な特定の条件を示すためにです。

`HttpClient`に`observe`オプションをつければレスポンス全体が読めるようになります。

<code-example 
  path="http/src/app/config/config.service.ts"
  region="getConfigResponse">
</code-example>

今度は`HttpClient.get()`は、JSONデータだけではなく、型付けされた`HttpResponse`の`Observable`を返します。

コンポーネントの`showConfigResponse()`メソッドはレスポンスヘッダとコンフィグレーションを表示します。

<code-example 
  path="http/src/app/config/config.component.ts"
  region="showConfigResponse" 
  header="app/config/config.component.ts (showConfigResponse)"
 >
</code-example>

ご覧のように、レスポンスオブジェクトは正しい型の`body`プロパティを持っています。

### Making a JSONP request

Apps can use the the `HttpClient` to make [JSONP](https://en.wikipedia.org/wiki/JSONP) requests across domains when the server doesn't support [CORS protocol](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

Angular JSONP requests return an `Observable`.
Follow the pattern for subscribing to observables and use the RxJS `map` operator to transform the response before using the [async pipe](api/common/AsyncPipe) to manage the results.

In Angular, use JSONP by including `HttpClientJsonpModule` in the `NgModule` imports.
In the following example, the `searchHeroes()` method uses a JSONP request to query for heroes whose names contain the search term.

```ts
/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable {
  term = term.trim();

  let heroesURL = `${this.heroesURL}?${term}`;
  return this.http.jsonp(heroesUrl, 'callback').pipe(
      catchError(this.handleError('searchHeroes', []) // then handle the error
    );
};
```

This request passes the `heroesURL` as the first parameter and the callback function name as the second parameter.
The response is wrapped in the callback function, which takes the observables returned by the JSONP method and pipes them through to the error handler.

### Requesting non-JSON data

Not all APIs return JSON data.
In this next example, a `DownloaderService` method reads a text file from the server and logs the file contents, before returning those contents to the caller as an `Observable<string>`.

<code-example
  path="http/src/app/downloader/downloader.service.ts"
  region="getTextFile"
  header="app/downloader/downloader.service.ts (getTextFile)" linenums="false">
</code-example>

`HttpClient.get()` returns a string rather than the default JSON because of the `responseType` option.

The RxJS `tap` operator (as in "wiretap") lets the code inspect both success and error values passing through the observable without disturbing them.

A `download()` method in the `DownloaderComponent` initiates the request by subscribing to the service method.

<code-example
  path="http/src/app/downloader/downloader.component.ts"
  region="download"
  header="app/downloader/downloader.component.ts (download)" linenums="false">
</code-example>

## エラーハンドリング

サーバーでリクエストが失敗した場合、または貧弱なネットワーク接続が原因でサーバーに到達できない場合はどうなるでしょうか？
`HttpClient`は成功したレスポンスの代わりに _エラー_ オブジェクトを返します。

`.subscribe()`に2番目のコールバックを追加することでコンポーネント内で処理 _できました_

<code-example 
  path="http/src/app/config/config.component.ts"
  region="v3" 
  header="app/config/config.component.ts (showConfig v.3 with error handling)"
 >
</code-example>

データアクセスが失敗したときにユーザーに何らかのフィードバックを与えることは、確かによい考えです。
しかし、`HttpClient`によって返された生のエラーオブジェクトを表示することは、最善の方法からほど遠いです。

{@a error-details}
### エラーの詳細を得る

エラーが発生したことを検出することが重要です。そのエラーを解釈し、ユーザーフレンドリーなレスポンスを構成することはもう少し複雑です。

2種類のエラーが発生する可能性があります。サーバーバックエンドはリクエストを拒否し、HTTPレスポンスに404または500などのステータスコードを返します。
これらはエラー_レスポンス_です。

あるいは、リクエストが正常に完了するのを妨げるネットワークエラーや、RxJSオペレーターでスローされた例外など、クライアント側で何かが間違っている可能性があります。
これらのエラーは、JavaScriptの`ErrorEvent`オブジェクトを生成します。

`HttpClient`は`HttpErrorResponse`で両方の種類のエラーを捕捉し、実際に何が起きたのかを調べるためにレスポンスを調べることができます。

エラー検査、解釈、および解決は、_component_ではなく_service_で実行したいことです。

このようなエラーハンドラーを最初に考案するかもしれません。

<code-example 
  path="http/src/app/config/config.service.ts"
  region="handleError" 
  header="app/config/config.service.ts (handleError)">
</code-example>

このハンドラーは、RxJSの[`ErrorObservable`](#rxjs)を使いやすいエラーメッセージとともに返します。
サービスの利用者は、サービスメソッドが何らかの`Observable`、特に"悪い"Observableを返すことを期待しています。

今度は、`HttpClient`メソッドによって返された`Observables`を取得し、エラーハンドラーに_それらを渡します。_

<code-example 
  path="http/src/app/config/config.service.ts"
  region="getConfig_3" 
  header="app/config/config.service.ts (getConfig v.3 with error handler)">
</code-example>

### Retrying

場合によってはエラーが一時的で、再試行すると自動的に消えます。
たとえば、ネットワークの中断はモバイルシナリオでは一般的であり、再試行すると成功する可能性があります。

[RxJSライブラリ](#rxjs)には、価値のある_retry_オペレーターがいくつか用意されています。
もっとも単純なものは`retry()`と呼ばれ、失敗した`Observable`に指定された回数だけ自動的に再購読します。
`HttpClient`メソッド呼び出しの結果を_再購読_することは、HTTPリクエストを再発行するという効果があります。

それをエラーハンドラーの直前の`HttpClient`メソッドの結果に_パイプ_します。

<code-example 
  path="http/src/app/config/config.service.ts"
  region="getConfig" 
  header="app/config/config.service.ts (getConfig with retry)">
</code-example>

{@a rxjs}
## Observablesとオペレーター

このガイドの前のセクションでは、RxJSの`Observables`と`catchError`や`retry`などのオペレーターについて説明しました。
以降のセクションに進むと、もっと多くのRxJS由来のものに出会います。

[RxJS](http://reactivex.io/rxjs/)は、非同期およびコールバックベースのコードを_関数的かつリアクティブなスタイル_で作成するためのライブラリです。
`HttpClient`を含む多くのAngular APIは、RxJSの`Observables`を生成し、利用します。

RxJS自体はこのガイドの範囲外です。 あなたはウェブ上で多くの学習リソースを見つけるでしょう。
最低限のRxJS知識を身に付けることができますが、やがて`HttpClient`を効果的に使用するためにRxJSスキルを成長させたくなるでしょう。

これらのコードスニペットにしたがっている場合、そのスニペットに表示されるRxJSのObservableとオペレーターのシンボルをインポートする必要があることに注意してください。
次の`ConfigService`のインポートは典型的なものです。

<code-example 
  path="http/src/app/config/config.service.ts"
  region="rxjs-imports" 
  header="app/config/config.service.ts (RxJS imports)">
</code-example>

## HTTP headers

Many servers require extra headers for save operations.
For example, they may require a "Content-Type" header to explicitly declare the MIME type of the request body; or the server may require an authorization token.

### Adding headers

The `HeroesService` defines such headers in an `httpOptions` object that will be passed
to every `HttpClient` save method.

<code-example 
  path="http/src/app/heroes/heroes.service.ts"
  region="http-options"
  header="app/heroes/heroes.service.ts (httpOptions)">
</code-example>

### Updating headers

You can't directly modify the existing headers within the previous options
object because instances of the `HttpHeaders` class are immutable.

Use the `set()` method instead, to return a clone of the current instance with the new changes applied.

Here's how you might update the authorization header (after the old token expired) before making the next request.

<code-example 
  path="http/src/app/heroes/heroes.service.ts"
   region="update-headers" linenums="false">
</code-example>

## サーバーにデータを送る

`HttpClient`は、サーバーからデータを取得するだけでなく、PUT、POST、DELETEなどの他のHTTPメソッドを使用してサーバーにデータを送信するという、変更リクエストをサポートします。

このガイドのサンプルアプリケーションには、ヒーローを取得してユーザーが追加、削除、および更新できるようにする、ツアー・オブ・ヒーローの簡略版が含まれています。

次のセクションでは、サンプルのHeroesServiceメソッドの抜粋を示します。

### POSTリクエストを行う

アプリケーションはしばしばサーバーにデータをPOSTします。 フォームを送信するときにPOSTします。
次の例では、ヒーローをデータベースに追加するときに `HeroesService`がポストします。

<code-example 
  path="http/src/app/heroes/heroes.service.ts"
  region="addHero" 
  header="app/heroes/heroes.service.ts (addHero)">
</code-example>

`HttpClient.post()`メソッドは、型パラメーター（サーバーが新しいヒーローを返すことを期待しています）を持っていてリソースURLを必要とする点で`get()`と似ています。

さらに2つのパラメーターを取ります。

1. `hero` - リクエストのボディでPOSTするデータ
1. `httpOptions` - このケースでは[要求されたヘッダーを定義する](#adding-headers)メソッドオプション

もちろん、これは[前述](#error-details)とほぼ同じ方法でエラーを捕捉します。
また、成功したPOSTを記録するために、戻されたobservableを_tap_します。

`HeroesComponent`は、このサービスメソッドによって返された`Observable`を購読することによって、実際のPOST操作を開始します。

<code-example 
  path="http/src/app/heroes/heroes.component.ts"
  region="add-hero-subscribe" 
  header="app/heroes/heroes.component.ts (addHero)">
</code-example>

サーバーが新しくヒーローを追加することに成功してレスポンスすると、コンポーネントはそのヒーローを表示中の`heroes`リストに追加します。

### DELETEリクエストを作る

このアプリケーションは、リクエストURLにヒーローのIDを渡すことによって、`HttpClient.delete`メソッドでヒーローを削除します。

<code-example 
  path="http/src/app/heroes/heroes.service.ts"
  region="deleteHero" 
  header="app/heroes/heroes.service.ts (deleteHero)">
</code-example>

`HeroesComponent`は、このサービスメソッドによって返された`Observable`を購読することによって、実際のDELETEオペレーションを開始します。

<code-example 
  path="http/src/app/heroes/heroes.component.ts"
  region="delete-hero-subscribe" 
  header="app/heroes/heroes.component.ts (deleteHero)">
</code-example>

コンポーネントは削除操作の結果を期待していないため、コールバックなしで購読します。結果を使用していなくても、依然として購読する必要があります。 `subscribe()`メソッドを呼び出すと、observableが _実行_ されます。これは、DELETEリクエストを開始するものです。

<div class="alert is-important">

_subscribe()_ を呼ばなければ何も起こりません。 `HeroesService.deleteHero()`を呼び出すだけでは、**DELETEリクエストは開始されません。**

</div>


<code-example 
  path="http/src/app/heroes/heroes.component.ts"
  region="delete-hero-no-subscribe">
</code-example>

{@a always-subscribe}
**常に_subscribe_を忘れないでください!**

`HttpClient`メソッドは、そのメソッドから返されたObservableで`subscribe()`を呼び出すまでHTTPリクエストを開始しません。
これは_すべての`HttpClient`メソッド_に当てはまります。

<div class="alert is-helpful">

[`AsyncPipe`](api/common/AsyncPipe)なら自動的に購読したり購読を取り消しします。

</div>

`HttpClient`メソッドから返されたすべてのObservableは、意図的に_cold_です。
HTTPリクエストは_遅延実行_され、実際に何かが起こる前に、`tap`や`catchError`のような追加の操作でObservableを拡張することができます。

`subscribe(...)`を呼び出すと、Observableの実行がトリガーされ、`HttpClient`がHTTPリクエストを作成してサーバーに送信します。

これらのObservableは実際のHTTPリクエストの_設計図_と考えることができます。

<div class="alert is-helpful">

実際、個々の`subscribe()`はObservableを分離して独立した実行を開始します。
2回の購読は2つのHTTPリクエストを引き起こします。

```javascript
const req = http.get<Heroes>('/api/heroes');
// .subscribe()が呼ばれていないため、まだ0リクエストです。
req.subscribe();
// 1つ目のリクエストが作られます。
req.subscribe();
// 2つ目のリクエストが作られます。
```
</div>

### PUTリクエストを作る

アプリケーションはリソースを更新されたデータで完全に置き換えるためにPUTリクエストを送信します。
次の`HeroesService`の例はPOSTの例と似ています。

<code-example 
  path="http/src/app/heroes/heroes.service.ts"
  region="updateHero" 
  header="app/heroes/heroes.service.ts (updateHero)">
</code-example>

[上記で説明](#always-subscribe)した理由で、呼び出し元（この場合は`HeroesComponent.update()`）は、リクエストを開始するために`HttpClient.put()`から返されたObservableを`subscribe()`する必要があります。

## 高度な使い方

私たちは、`@angular/common/http`の基本的なHTTP機能について議論しましたが、単純な要求をしてデータを戻す以上のことを行う必要があることもあります。

{@a intercepting-requests-and-responses }
### HTTP interceptors

_HTTP Interception_は`@angular/common/http`の主要な機能です。
インターセプトのために、アプリケーションからサーバーへのHTTPリクエストを検査および変換する_interceptors_を宣言します。
また、同じインターセプターは、アプリケーションの途中でサーバーのレスポンスを検査して変換することもできます。
複数のインターセプターは、リクエスト/レスポンスハンドラーの_前後の_チェインを形成します。

インターセプターは、すべてのHTTPリクエスト/レスポンスに対して、認証からロギングまで、さまざまな_暗黙_のタスクを一まとまりの標準的な方法で実行できます。

インターセプト無しでは、開発者は各HttpClientメソッド呼び出しに対してこれらのタスクを_明示的_に行う必要があります。

#### インターセプターを書く

インターセプターを実装するには、`HttpInterceptor`インターフェースの`intercept()`メソッドを実装するクラスを宣言します。

ここに、何も触れずにリクエストを単に渡すだけの_noop_インターセプターがあります。
<code-example 
  path="http/src/app/http-interceptors/noop-interceptor.ts"
  header="app/http-interceptors/noop-interceptor.ts"
 >
</code-example>

`intercept`メソッドは、リクエストを最終的にHTTPレスポンスを含む`Observable`に変換します。
この意味で、各インターセプターは完全に単独でリクエストを処理することができます。

ほとんどのインターセプターは、リクエストを検査し、[`HttpHandler`](api/common/http/HttpHandler)インターフェースを実装している`next`オブジェクトの`handle()`メソッドへ（おそらく変更された）リクエストを転送します。

```javascript
export abstract class HttpHandler {
  abstract handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}
```

`intercept()`と同様に、`handle()`メソッドは、HTTPリクエストを最終的にサーバーのレスポンスを含む[`HttpEvents`](#httpevents)の`Observable`に変換します。
`intercept()`メソッドは、そのObservableを検査し、それを呼び出し側に返す前に変更することができます。

この_何もしない_インターセプターは、単に元のリクエストとともに`next.handle()`を呼び出し、何もせずにobservableを返します。

#### _next_オブジェクト

`next`オブジェクトは、インターセプターのチェーン内の次のインターセプターを表します。
チェーンの最後の`next`は、リクエストをサーバーに送信し、サーバーのレスポンスを受け取る`HttpClient`バックエンドハンドラーです。


ほとんどのインターセプターは、`next.handle()`を呼び出して、リクエストが次のインターセプター、そして最終的にはバックエンドハンドラーに流れるようにします。
インターセプターは、`next.handle()`をスキップしチェーンを近道して、人工のサーバーレスポンスで[自身の`Observable`を返す](#caching)こともできます。

これは、Express.jsなどのフレームワークでよく見られるミドルウェアパターンです。

#### インターセプターを提供する

`NoopInterceptor`は、Angularの[Dependency Injection（DI）](guide/dependency-injection)システムによって管理されるサービスです。
他のサービスと同様に、アプリケーションが使用する前にインターセプタークラスを提供する必要があります。

インターセプターは`HttpClient`サービスの（オプショナルな）依存関係であるため、
`HttpClient`を提供する同じインジェクター（またはインジェクターの親）にそれらを指定する必要があります。
DIが`HttpClient`を作成した_後に_提供されるインターセプターは無視されます。

このアプリケーションは、`AppModule`の`HttpClientModule`をインポートする副作用として、アプリケーションのルートインジェクターに`HttpClient`を提供します。
同様にインターセプターは`AppModule`の中で提供すべきです。

`@angular/common/http`から`HTTP_INTERCEPTORS`インジェクショントークンをインポートした後、
次のように`NoopInterceptor`プロバイダーを記述します。

<code-example 
  path="http/src/app/http-interceptors/index.ts"
  region="noop-provider">
</code-example>

`multi：true`オプションに注意してください。
この必須設定は、Angularに`HTTP_INTERCEPTORS`は単一の値ではなく値の配列を注入する_マルチプロバイダー_のトークンであることを伝えます。

このプロバイダーを`AppModule`のプロバイダー配列に直接追加することができますが、それはむしろ冗長であり、より多くのインターセプターを作成し、同じ方法でそれらを提供するよい方法があります。
これらのインターセプターを提供する[順序に細心の注意](#インターセプターの順番)を払う必要があります。

最初のインターセプターである`NoopInterceptor`から始まる`httpInterceptorProviders`配列の中にすべてのインターセプタープロバイダーを集める「バレル」ファイルを作成することを検討してください。

<code-example 
  path="http/src/app/http-interceptors/index.ts"
  region="interceptor-providers"
  header="app/http-interceptors/index.ts">
</code-example>

次に、それをインポートして`AppModule`の _providers配列_ に追加します。

<code-example 
  path="http/src/app/app.module.ts"
  region="interceptor-providers"
  header="app/app.module.ts (interceptor providers)">
</code-example>

新しいインターセプターを作成するとき、それらを`httpInterceptorProviders`配列に追加するだけです。`AppModule`を開く必要はありません。

<div class="alert is-helpful">

完全なサンプルコードには、より多くのインターセプターがあります。

</div>

#### インターセプターの順番

Angularは、あなたが提供した順序でインターセプターを適用します。
インターセプター_A_、_B_、_C_を提供すると、リクエストは_A-> B-> C_で流れ、レスポンスは_C-> B-> A_で流れます。

後でインターセプターを変更したり、インターセプターを削除したりすることはできません。
インターセプターを動的に有効または無効にする必要がある場合は、その機能をインターセプター自体に組み込む必要があります。

#### _HttpEvents_

ほとんどの`HttpClient`メソッドが行うように、`intercept()`と`handle()`メソッドは`HttpResponse<any>`のObservableを返すと思っていたかもしれません。

代わりに`HttpEvent<any>`のObservableを返します。

これは、インターセプターがそれらの`HttpClient`のメソッドよりも低いレベルで動作するためです。
ひとつのHTTPリクエストでは、アップロードおよびダウンロードの進行状況イベントを含む複数の_イベント_を生成できます。
`HttpResponse`クラス自体は実際にはイベントで、その型は`HttpEventType.Response`です。

多くのインターセプターは外に出ていくリクエストのみに関心があり、単に`next.handle()`からイベントストリームを変更せずに返します。

しかし、`next.handle()`からのレスポンスを調べて変更するインターセプターは、これらすべてのイベントが表示されます。
インターセプターは、_やむを得ない理由_がない限り、_すべてのイベントをそのまま_返す必要があります。

{@a immutability}
#### イミュータビリティ（不変性）

インターセプターはリクエストとレスポンスを変更することができますが、`HttpRequest`と`HttpResponse`のインスタンスのプロパティは`readonly`で、それらをほぼ不変にします。

それらは正当な理由からイミュータブルです。アプリケーションは、成功する前にリクエストを何度か再試行することがあります。
つまり、インターセプターのチェーンが同じリクエストを複数回再処理する可能性があります。
インターセプターが元のリクエストオブジェクトを変更できる場合、再試行された操作は元のものではなく変更されたリクエストから開始されます。
不変性は、インターセプターが各試行に対して同じリクエストを見ることを保証します。

TypeScriptは、`HttpRequest`の読み取り専用プロパティにセットできないようにします。

```javascript
  // req.urlが読み取り専用であるため、Typescriptは次の割り当てを許可しません
  req.url = req.url.replace('http://', 'https://');
```
リクエストを変更するには、最初にクローンを作成し、クローンを変更してから`next.handle()`に渡します。
この例のように、ひとつの手順でリクエストを複製して変更することができます。

<code-example 
  path="http/src/app/http-interceptors/ensure-https-interceptor.ts"
  region="excerpt" 
  header="app/http-interceptors/ensure-https-interceptor.ts (excerpt)">
</code-example>

`clone()`メソッドのハッシュ引数は、他のものをコピーしながらリクエストの特定のプロパティを変更することを可能にします。

##### リクエストボディ

`readonly`代入ガードは、プロパティの深い更新を防ぐことはできません。
特に、リクエストボディオブジェクトのプロパティを変更できないようにすることはできません。

```javascript
  req.body.name = req.body.name.trim(); // bad idea!
```

リクエストボディを変更する必要がある場合は、次の例のように、最初にコピーし、コピーを変更し、リクエストを`clone()`して、クローンのボディを新しいボディで設定します。

<code-example 
  path="http/src/app/http-interceptors/trim-name-interceptor.ts"
  region="excerpt" 
  header="app/http-interceptors/trim-name-interceptor.ts (excerpt)">
</code-example>

##### リクエストボディを消去する

場合によっては、リクエストボディを置き換えるのではなく消去する必要があります。
クローンされたリクエストボディを`undefined`に設定した場合、Angularはボディをそのまま保持しようとしていると推論します。
これはあなたが望むものではありません。
クローンされたリクエストボディを`null`に設定すると、Angularはリクエストボディをクリアしようとしていることを知ります。

```javascript
  newReq = req.clone({ ... }); // ボディは言及しない=>元のボディを保持する
  newReq = req.clone({ body: undefined }); // 元のボディを保持する
  newReq = req.clone({ body: null }); // ボディを消去する
```

#### デフォルトのヘッダーをセットする

アプリケーションでは、インターセプターを使用して外に出ていくリクエストにデフォルトのヘッダーを設定することがよくあります。

サンプルアプリケーションには、認証トークンを生成する`AuthService`があります。
トークンを取得するためにそのサービスを注入する`AuthInterceptor`があり、そのトークンをもつ承認ヘッダーをすべての外部リクエストに追加します。

<code-example 
  path="http/src/app/http-interceptors/auth-interceptor.ts"
  header="app/http-interceptors/auth-interceptor.ts">
</code-example>

新しいヘッダーを設定するリクエストを複製する方法は非常に一般的です。そのために`setHeaders`ショートカットがあります。

<code-example 
  path="http/src/app/http-interceptors/auth-interceptor.ts"
  region="set-header-shortcut">
</code-example>

ヘッダーを変更するインターセプターは、次のようなさまざまな操作に使用できます。

* 認証/承認
* キャッシュ動作 たとえば、`If-Modified-Since`
* XSRFプロテクション

#### ロギング

インターセプターはリクエストとレスポンスを_一緒に_処理できるため、HTTP操作全体について時間の計測やログの記録ができます。

次の`LoggingInterceptor`を考えてみましょう。
これは、リクエストの時間とレスポンスの時間を取得し、注入された`MessageService`で経過時間とともに結果を記録します。

<code-example 
  path="http/src/app/http-interceptors/logging-interceptor.ts"
  region="excerpt" 
  header="app/http-interceptors/logging-interceptor.ts)">
</code-example>

RxJSの`tap`オペレーターは、リクエストが成功するか失敗したかを取得します。
RxJSの`finalize`オペレーターは、レスポンスのObservableがエラーか（必ず起きる）完了のいずれかを返したときに呼ばれ、その結果を`MessageService`に報告します。

`tap`も`finalize`も、呼び出し元に返されたObservableのストリームの値には触れません。

{@a caching}
#### キャッシング

インターセプターは`next.handle()`に転送せずに、リクエスト自体を処理できます。

たとえば、特定の要求と応答をキャッシュして、パフォーマンスを向上させることができます。
既存のデータサービスを妨げることなく、インターセプターにキャッシュを委任できます。

`CachingInterceptor`はこのアプローチを示しています。

<code-example 
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="v1" 
  header="app/http-interceptors/caching-interceptor.ts)">
</code-example>

`isCachable()`関数はリクエストがキャッシュ可能かどうかを決定します。
このサンプルでは、npmパッケージの検索APIに対するGETリクエストのみがキャッシュ可能です。

リクエストがキャッシュ可能でない場合、インターセプターはリクエストをチェーン内の次のハンドラーに転送します。

キャッシング可能なリクエストがキャッシュ内に見つかった場合、インターセプターはキャッシュされたレスポンスをもつ`of()`_observable_を返し、`next`ハンドラー（および他のすべての下流のインターセプター）をバイパスします。

キャッシュ可能なリクエストがキャッシュにない場合、コードは`sendRequest`を呼び出します。

{@a send-request}
<code-example 
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="send-request">
</code-example>

`sendRequest`関数は、npm apiが禁止しているため、ヘッダーを保たない[リクエストのクローン](#immutability)を作成します。

そのリクエストを`next.handle()`に転送します。これは最終的にサーバーを呼び出し、サーバーのレスポンスを返します。

`sendRequest`がアプリケーションに戻る途中で_レスポンスをインターセプトする_方法に注意してください。
`tap()`オペレーターによりレスポンスを_パイプ_して、そのコールバックでレスポンスをキャッシュに追加します。

元のレスポンスは、インターセプターのチェーンを通ってアプリケーション呼び出し元にオリジナルの状態で戻ります。

`PackageSearchService`のようなデータサービスは、`HttpClient`リクエストのいくつかは実際にはキャッシュされたレスポンスを返すものがあることに気づいていません。

{@a cache-refresh}
#### 複数の値を返す_Observable_

`HttpClient.get()`メソッドは、通常、データまたはエラーを発行する_Observable_を返します。
一部の人々は、それを "_one and done_"Observableと表現しています。

しかし、インターセプターはこれを1回以上発火する_Observable_に変更することができます。

改訂されたバージョンの`CachingInterceptor`は、オプションでキャッシュされたレスポンスを直ちに出力する_Observable_を返します。
これは、リクエストをNPM web APIに送信し、更新された検索結果で後で再度出力します。

<code-example 
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="intercept-refresh">
</code-example>

_cache-then-refresh_オプションは、**カスタム `x-refresh`ヘッダー**の存在によってトリガーされます。

<div class="alert is-helpful">

`PackageSearchComponent`のチェックボックスは、`PackageSearchService.search()`の引数の1つである`withRefresh`フラグをトグルします。
その`search()`メソッドは、`HttpClient.get()`を呼び出す前にカスタム`x-refresh`ヘッダを作成し、それをリクエストに追加します。

</div>

改訂された`CachingInterceptor`は、[上記](#send-request)の`sendRequest()`メソッドを使用して、キャッシュされた値があるかどうかにかかわらずサーバーリクエストを準備します。
`results$`observableは購読したときにリクエストを行います。

キャッシュされた値がない場合、インターセプターは`results$`を返します。

キャッシュされた値がある場合、コードはキャッシュされたレスポンスを`results$`にパイプし、2回発行する再構成されたObservableを生成します。
最初に（そして直ちに）キャッシュされたレスポンスを、その後サーバーからのレスポンスが続きます。subscriberは_2つ_のレスポンスのシーケンスを参照します。

### Configuring the request

Other aspects of an outgoing request can be configured via the options object
passed as the last argument to the `HttpClient` method.

In [Adding headers](#adding-headers), the `HeroesService` set the default headers by
passing an options object (`httpOptions`) to its save methods.
You can do more.

#### URL query strings

In this section, you will see how to use the `HttpParams` class to add URL query strings in your `HttpRequest`.

The following `searchHeroes` method queries for heroes whose names contain the search term.
Start by importing `HttpParams` class.

<code-example hideCopy language="typescript">
import {HttpParams} from "@angular/common/http";
</code-example>

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="searchHeroes" linenums="false">
</code-example>

If there is a search term, the code constructs an options object with an HTML URL-encoded search parameter.
If the term were "foo", the GET request URL would be `api/heroes?name=foo`.

The `HttpParams` are immutable so you'll have to save the returned value of the `.set()` method in order  to update the options.

#### Use `fromString` to create HttpParams

You can also create HTTP parameters directly from a query string by using the `fromString` variable:

<code-example hideCopy language="typescript">
const params = new HttpParams({fromString: 'name=foo'});
</code-example>

### Debouncing requests

The sample includes an _npm package search_ feature.

When the user enters a name in a search-box, the `PackageSearchComponent` sends
a search request for a package with that name to the NPM web API.

Here's a pertinent excerpt from the template:

<code-example
  path="http/src/app/package-search/package-search.component.html"
  region="search"
  header="app/package-search/package-search.component.html (search)">
</code-example>

The `keyup` event binding sends every keystroke to the component's `search()` method.

Sending a request for every keystroke could be expensive.
It's better to wait until the user stops typing and then send a request.
That's easy to implement with RxJS operators, as shown in this excerpt.

<code-example
  path="http/src/app/package-search/package-search.component.ts"
  region="debounce"
  header="app/package-search/package-search.component.ts (excerpt)">
</code-example>

The `searchText$` is the sequence of search-box values coming from the user.
It's defined as an RxJS `Subject`, which means it is a multicasting `Observable`
that can also emit values for itself by calling `next(value)`,
as happens in the `search()` method.

Rather than forward every `searchText` value directly to the injected `PackageSearchService`,
the code in `ngOnInit()` _pipes_ search values through three operators:

1. `debounceTime(500)` - wait for the user to stop typing (1/2 second in this case).

2. `distinctUntilChanged()` - wait until the search text changes.

3. `switchMap()` - send the search request to the service.

The code sets `packages$` to this re-composed `Observable` of search results.
The template subscribes to `packages$` with the [AsyncPipe](api/common/AsyncPipe)
and displays search results as they arrive.

A search value reaches the service only if it's a new value and the user has stopped typing.

<div class="alert is-helpful">

The `withRefresh` option is explained [below](#cache-refresh).

</div>

#### _switchMap()_

The `switchMap()` operator has three important characteristics.

1. It takes a function argument that returns an `Observable`.
`PackageSearchService.search` returns an `Observable`, as other data service methods do.

2. If a previous search request is still _in-flight_ (as when the network connection is poor),
it cancels that request and sends a new one.

3. It returns service responses in their original request order, even if the
server returns them out of order.

<div class="alert is-helpful">

If you think you'll reuse this debouncing logic,
consider moving it to a utility function or into the `PackageSearchService` itself.

</div>

### プログレスイベントをリッスンする

アプリケーションによって大量のデータが転送され、転送に時間がかかることがあります。
ファイルのアップロードは典型的な例です。
そのような転送の進捗状況に関するフィードバックを提供することにより、ユーザーによりよい経験を提供します。

プログレスイベントを有効にしてリクエストを行うには、`reportProgress`オプションをtrueに設定して`HttpRequest`のインスタンスを作成し、プログレスイベントを追跡できるようにします。

<code-example 
  path="http/src/app/uploader/uploader.service.ts"
  region="upload-request" 
  header="app/uploader/uploader.service.ts (upload request)">
</code-example>

<div class="alert is-important">

すべてのプログレスイベントはchange detectionをトリガーします。したがって、UIで進捗状況を本当に報告するつもりの場合にのみ、それらを有効にしてください。

[`HttpClient#request()`](api/common/http/HttpClient#request)でHTTPメソッドを使うときには、configure with
[`observe: 'events'`](api/common/http/HttpClient#request)で転送のプログレスを含むすべてのイベントを見るように設定してください。

</div>

次に、このリクエストオブジェクトを`HttpClient.request()`メソッドに渡します。
このメソッドは、インターセプターによって処理された同じイベントである`HttpEvents`の`Observable`を返します。

<code-example 
  path="http/src/app/uploader/uploader.service.ts"
  region="upload-body" 
  header="app/uploader/uploader.service.ts (upload body)">
</code-example>

`getEventMessage`メソッドは、イベントストリーム中の各タイプの`HttpEvent`を解釈します。

<code-example 
  path="http/src/app/uploader/uploader.service.ts"
  region="getEventMessage" 
  header="app/uploader/uploader.service.ts (getEventMessage)">
</code-example>

<div class="alert is-helpful">

このガイドのサンプルアプリケーションには、アップロードされたファイルを受け入れるサーバーがありません。
`app/http-interceptors/upload-interceptor.ts`の`UploadInterceptor`は、アップロードリクエストにインターセプトし、シミュレートされたイベントのObservableを返して省略します。

</div>

## セキュリティ: XSRFプロテクション

[XSRF(Cross-Site Request Forgery)](https://en.wikipedia.org/wiki/Cross-site_request_forgery)は、攻撃者が認証されたユーザーにそうとは知らずにあなたのWebサイト上のアクションを実行させる攻撃手法です。
`HttpClient`は、XSRF攻撃を防ぐための[共通メカニズム](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-Header_Token)をサポートしています。
HTTPリクエストを実行するとき、インターセプターはデフォルトでは`XSRF-TOKEN`によってクッキーからトークンを読み込み、それをHTTPヘッダの`X-XSRF-TOKEN`として設定します。
ドメイン上で動作するコードだけがCookieを読み取ることができるため、バックエンドはHTTPリクエストが攻撃者ではなくクライアントアプリケーションからのものであることを保証できます。

デフォルトでは、インターセプターは相対URLへのすべての変更リクエスト（POSTなど）に対してこのヘッダーを送信しますが、GET/HEADリクエストや絶対URLには送りません。

これを利用するには、サーバーがページ読み込みまたは最初のGET要求のいずれかで、`XSRF-TOKEN`というJavaScriptで読み取れるセッションクッキーにトークンを設定する必要があります。
その後のリクエストでは、サーバーはCookieが`X-XSRF-TOKEN`HTTPヘッダーと一致することを検証することができ、したがって、ドメイン上で実行されているコードだけがリクエストを送信できたと確認できます。
トークンは、各ユーザーごとに一意でなければならず、サーバーによって検証可能でなければなりません。これにより、クライアントは独自のトークンを作成することができなくなります。
セキュリティを強化するために、トークンをサイトの認証クッキーのダイジェストに設定します。

複数のAngularアプリケーションが同じドメインまたはサブドメインを共有する環境での衝突を防ぐために、各アプリケーションに固有のCookie名を付けましょう。

<div class="alert is-important">

*`HttpClient`のサポートはクライアント側だけであり、XSRFプロテクションのスキーマの半分だけです*
あなたのバックエンドサービスは、ページのCookieを設定し、該当するすべてのリクエストにヘッダが存在することを検証するように構成する必要があります。
そうでない場合、Angularのデフォルトの保護は効果がありません。

</div>

### カスタムcookie/headerの名前を設定する

バックエンドサービスがXSRFトークンのクッキーまたはヘッダーに異なる名前を使っている場合、`HttpClientXsrfModule.withConfig()`を使用してデフォルト設定を上書きします。

<code-example 
  path="http/src/app/app.module.ts"
  region="xsrf" 
 >
</code-example>

## HTTPリクエストをテストする　{@a testing-http-requests}

As for any external dependency, you must mock the HTTP backend so your tests can simulate interaction with a remote server.
The `@angular/common/http/testing` library makes it straightforward to set up such mocking .

Angular HTTPテストライブラリは、アプリケーションがコードを実行してリクエストを最初に行うテストパターン用に設計されています。
そして、ある種のリクエストがあったかどうかをテストします。
これらのリクエストに対してアサーションを実行し、最終的に各リクエストを「フラッシュ」することによってレスポンスを提供します。
 
最後に、予期しないリクエストをしていないことを確認します。

<div class="alert is-helpful">

実際のコーディング環境で<live-example stackblitz = "specs">これらのサンプルテスト</live-example>を実行できます。

このガイドで説明されているテストは、`src/testing/http-client.spec.ts`にあります。
`src/app/heroes/heroes.service.spec.ts`に`HttpClient`を呼び出すアプリケーションデータサービスのテストもあります。

</div>

### セットアップ

`HttpClient`への呼び出しをテストするには、`HttpClientTestingModule`とモックコントローラ`HttpTestingController`をテストに必要な他のシンボルと共にインポートしてください。

<code-example 
  path="http/src/testing/http-client.spec.ts"
  region="imports" 
  header="app/testing/http-client.spec.ts (imports)">
</code-example>

次に`HttpClientTestingModule`を`TestBed`に追加し_テスト環境のサービス_の設定を続けます。

<code-example 
  path="http/src/testing/http-client.spec.ts"
  region="setup" 
  header="app/testing/http-client.spec.ts(setup)">
</code-example>

テストの過程で行われたリクエストは、通常のバックエンドの代わりにテストバックエンドにヒットするでしょう。

この設定では`TestBed.get()`を呼び出してテスト中に参照できるように`HttpClient`サービスとモックコントローラを注入します。

### リクエストの待ち受けと応答

これで、GETリクエストが発生することを待ち受けるテストを作成し、モックレスポンスを提供することができます。

<code-example 
  path="http/src/testing/http-client.spec.ts"
  region="get-test" 
  header="app/testing/http-client.spec.ts(httpClient.get)">
</code-example>

最後のステップは、まだ未解決のリクエストが残ってないことを確認することです。これは、`afterEach()`ステップに移動して行うことが一般的です。

<code-example 
  path="http/src/testing/http-client.spec.ts"
  region="afterEach" 
 >
</code-example>

#### カスタムリクエストの待ち受け

URLによる照合では不十分な場合は、独自の照合機能を実装することができます。
たとえば、認証ヘッダーをもつ外部リクエストを検索できます。

<code-example 
  path="http/src/testing/http-client.spec.ts"
  region="predicate" 
 >
</code-example>

以前の`expectOne()`と同様に、0または2以上のリクエストがこの条件を満たしていれば、テストは失敗します。

#### 複数のリクエストの処理

テストで重複したリクエストに応答する必要がある場合は、`expectOne()`の代わりに`match()`APIを使用してください。
同じ引数をとりますが、一致するリクエストの配列を返します。
戻されたこれらのリクエストは、今後の照合から削除され、それらをフラッシュして検証する責任があります。

<code-example 
  path="http/src/testing/http-client.spec.ts"
  region="multi-request" 
 >
</code-example>

### エラーのテスト

失敗したHTTPリクエストに対してアプリケーションがどう防御しているかテストする必要があります。

次の例に示すように、`request.flush()`を呼び出してエラーメッセージを表示します。

<code-example 
  path="http/src/testing/http-client.spec.ts"
  region="404" 
 >
</code-example>

あるいは、`ErrorEvent`と共に`request.error()`を呼び出すこともできます。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="network-error"
 >
</code-example>
