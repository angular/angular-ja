# HTTPによるバックエンドサービスとの通信

ほとんどのフロントエンドアプリケーションは、データのダウンロードやアップロードや他のバックエンドサービスへのアクセスのため、HTTPプロトコルによりサーバーと通信する必要があります。
Angularは、Angularアプリケーション向けのHTTPクライアントのAPIとして、`@angular/common/http`内に`HttpClient` サービスクラスを提供しています。

HTTP client serviceの主な機能は以下の通りです。

* [型付けされたレスポンスオブジェクト](#typed-response)を要求
* 最新式の[error handling](#error-handling).
* [テスタビリティ](#testing-requests)
* リクエストとレスポンスへの[interception](#intercepting-requests-and-responses).

##### 前提条件

`HttpClientModule`を使用する前に、以下の基礎的な理解が必要です。

* TypeScriptプログラミング
* HTTPプロトコル
* [Angular Concepts](guide/architecture)で説明されている、Angularアプリケーションのアーキテクチャ
* Observableのテクニックとoperatorについて。[Observables](guide/observables)ガイドを参照

## サーバーとの通信の設定

`HttpClient`を使用可能にするには, Angularの`HttpClientModule`をインポートする必要があります。
ほとんどのアプリケーションではルートの`AppModule`で行います。

<code-example
  path="http/src/app/app.module.ts"
  region="sketch"
  header="app/app.module.ts (excerpt)">
</code-example>

そして、次の`ConfigService`の例のように、依存として`HttpClient`サービスをアプリケーションに注入します。

<code-example
  path="http/src/app/config/config.service.ts"
  region="proto"
  header="app/config/config.service.ts (excerpt)">
</code-example>

`HttpClient` サービスはすべてのトランザクションで[observables](guide/glossary#observable "Observable definition")を使用します。サンプルのスニペットに現れるRxJS observableとoperatorをインポートする必要があります。これらの`ConfigService`のインポートは典型的なものです。

<code-example
  path="http/src/app/config/config.service.ts"
  region="rxjs-imports"
  header="app/config/config.service.ts (RxJS imports)">
</code-example>

<div class="alert is-helpful">

You can run the <live-example></live-example> that accompanies this guide.

サンプルアプリケーションはデータサーバーを必要としていません。
_HttpClient_ モジュールの `HttpBackend`を[Angular _in-memory-web-api_](https://github.com/angular/angular/tree/master/packages/misc/angular-in-memory-web-api)に依存しています。
この代わりのサービスはREST-likeなバックエンドの振る舞いをシミュレートしたものです。

`AppModule` の _imports_ をご覧ください。

</div>

## サーバーにデータを要求する

サーバーからデータを取得するには、[`HttpClient.get()`](api/common/http/HttpClient#get)メソッドを使います。
非同期メソッドがHTTPリクエストを送信し、レスポンスを受信すると要求されたデータを発するObservableを返します。
戻り値の型は呼び出し時に渡す `observe` と `responseType` の値によって変わります。

`get()` メソッドは2つの引数を取ります。取得エンドポイントURLと、リクエストの設定をするための *options* オブジェクトです。

```
options: {
    headers?: HttpHeaders | {[header: string]: string | string[]},
    observe?: 'body' | 'events' | 'response',
    params?: HttpParams|{[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>},
    reportProgress?: boolean,
    responseType?: 'arraybuffer'|'blob'|'json'|'text',
    withCredentials?: boolean,
  }
```

*observe* と *responseType* プロパティは、重要なオプションです。

* *observe* オプションはどのくらいの量のレスポンスを返すのかを指定します。
* *responseType* オプションはどのようなフォーマットでデータを返すのかを指定します。

<div class="alert is-helpful">

`options` オブジェクトは送信するリクエストに対して他にも様々な設定を行うことができます。
例えば、[Adding headers](#adding-headers)にあるように、サービスは `headers`オプションプロパティを使ってデフォルトのヘッダーを設定できます。

`params` プロパティで [HTTP URL parameters](#url-params)の設定を行い、 `reportProgress` オプションで大量のデータを送信するときの [listen for progress events](#report-progress) の設定を行うことができます。

</div>

アプリケーションはサーバーにJSONデータを要求することがよくあります。
`ConfigService` の例では、アプリケーションはリソースURLを指定する `config.json` という設定ファイルが必要です。

<code-example
  path="http/src/assets/config.json"
  header="assets/config.json">
</code-example>

この種のデータを取得するには、 `get()` の呼び出し時に次のオプションが必要です: `{observe: 'body', responseType: 'json'}` 。
これらはオプションのデフォルト値であるため、次の例ではoptionsオブジェクトを渡していません。
追加で指定できるオプションは、後続のセクションで説明します。

{@a config-service}

例は、データ処理機能を果たす再利用可能な[injectable service](guide/glossary#service "service definition")を定義することで、スケーラブルな解決法を生み出すためのベストプラクティスに従っています。
データの取得に加え、サービスはデータの後処理、エラーハンドリングの追加、リトライロジックの追加が可能です。

`ConfigService` は `HttpClient.get()` メソッドにより、このファイルを取得します。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_1"
  header="app/config/config.service.ts (getConfig v.1)">
</code-example>

`ConfigComponent` は `ConfigService` を注入し、
`getConfig` サービスメソッドを呼び出します。

サービスメソッドが設定データの `Observable` を返すため、
コンポーネントはメソッドの戻り値を *subscribe* します。
Subscription のコールバックは最小限の後処理を行います。
データフィールドの内容がコンポーネントの `config` オブジェクトにコピーされ、表示用にコンポーネントテンプレートへデータバインドされます。

<code-example
  path="http/src/app/config/config.component.ts"
  region="v1"
  header="app/config/config.component.ts (showConfig v.1)">
</code-example>

{@a typed-response}

### 型付けされたレスポンスの要求

レスポンスオブジェクトの型を宣言する`HttpClient` リクエストを構築し、出力を消費するのをより簡単かつ明確にすることができます。
レスポンスの型を指定することは、コンパイル時に型アサーションとして機能します。

<div class="alert is-important">

レスポンスの型を指定することは、レスポンスが与えられた型であるとして扱うべきであるというTypeScriptへの宣言です。
これはビルド時のチェックであり、サーバーが実際にこの型のオブジェクトでレスポンスを返すことは保証しません。サーバーAPIによって指定された型が返されることを保証するのは、サーバーの責任です。

</div>

レスポンスオブジェクトの型を指定するため、最初に必要なプロパティを持ったインターフェースを定義してください。
レスポンスはクラスのインスタンスに自動的に変換ができないプレーンオブジェクトであるため、クラスではなくインターフェースを使用してください。

<code-example
  path="http/src/app/config/config.service.ts"
  region="config-interface">
</code-example>

次に、そのインターフェースを `HttpClient.get()` 呼び出しの型パラメータとして指定してください。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_2"
  header="app/config/config.service.ts (getConfig v.2)">
</code-example>

<div class="alert is-helpful">

 インターフェースを型パラメータとして `HttpClient.get()` メソッドに渡す際、[RxJS `map` operator](guide/rx-library#operators)を使用してUIで必要とされる形式にレスポンスデータを変換することができます。そして、変換されたデータを[async pipe](api/common/AsyncPipe)に渡すことができます。

</div>

最新のコンポーネントメソッドのコールバックは、型付けされたデータオブジェクトを受け取ります。これは消費がより簡単で安全です。

<code-example
  path="http/src/app/config/config.component.ts"
  region="v2"
  header="app/config/config.component.ts (showConfig v.2)">
</code-example>

インターフェースで定義されているプロパティにアクセスするには、JSONから取得したプレーンオブジェクトを必要なレスポンス型に明示的に変換する必要があります。
例えば、次の`subscribe`コールバックは、`data`をObjectとして受け取り、プロパティにアクセスするためにそれを型キャストします。

<code-example>
   .subscribe(data => this.config = {
     heroesUrl: (data as any).heroesUrl,
     textfile:  (data as any).textfile,
   });
</code-example>

{@a string-union-types}

<div class="callout is-important">
<header>*observe*と*response*型</header>

`observe`オプションと`response`オプションの型は、単純なstringではなく*string unions*です。

```
options: {
    ...
    observe?: 'body' | 'events' | 'response',
    ...
    responseType?: 'arraybuffer'|'blob'|'json'|'text',
    ...
  }
```
これは混乱を引き起こす可能性があります。例えば、

```typescript
// this works
client.get('/foo', {responseType: 'text'})

// but this does NOT work
const options = {
  responseType: 'text',
};
client.get('/foo', options)
```

2つ目のケースでは、TypeScriptは`options`の型を`{responseType: string}`であると推論します。
型が広すぎて、`responseType`の型が_特定の_文字列の1つであることを期待している`HttpClient.get`に渡すことができません。
コンパイラが指定されたオプションに基づいて正しい戻り値型を報告できるよう、このように`HttpClient`は明示的に型付けされています。

`as const`を使用して、定数のstring型を使用することを本当は意図しているとTypeScriptに知らせましょう。

```typescript
const options = {
  responseType: 'text' as const,
};
client.get('/foo', options);
```

</div>

### 完全なレスポンスの読み取り

前の例で、`HttpClient.get()`の呼び出しでは何のオプションも指定していませんでした。デフォルトでは、レスポンスボディに含まれているJSONデータを返しました。

レスポンスボディに含まれているよりも多くのトランザクションに関する情報が必要になる場合があります。サーバーは、アプリケーションワークフローにとって重要な特定の状態を表すために、特別なヘッダーまたはステータスコードを返す場合があります。

`get（）`メソッドの `observe`オプションにより、完全なレスポンスが必要であることを` HttpClient`に伝えます。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfigResponse">
</code-example>

これで、 `HttpClient.get（）`は、ボディに含まれるJSONデータだけでなく、 `HttpResponse`型の` Observable`を返します。

コンポーネントの`showConfigResponse（）`メソッドは、レスポンスヘッダーと設定値を表示します。

<code-example
  path="http/src/app/config/config.component.ts"
  region="showConfigResponse"
  header="app/config/config.component.ts (showConfigResponse)"
 >
</code-example>

ご覧の通り、レスポンスオブジェクトは正しい型の`body`プロパティを持っています。

### JSONPリクエストの作成

サーバーが[CORSプロトコル](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)をサポートしていない場合、アプリケーションは`HttpClient` を使用してドメインをまたいで[JSONP](https://en.wikipedia.org/wiki/JSONP)リクエストを実行できます。

AngularのJSONPリクエストは`Observable`を返します。
[async pipe](api/common/AsyncPipe)を使用して結果を処理する前に、Observableをsubscribeするためのパターンに従い、RxJSの`map`演算子を使用してレスポンスを変換します。

Angularでは、`NgModule`のインポートに`HttpClientJsonpModule`を含めることで、JSONPを使用します。
次の例では、`searchHeroes()`メソッドはJSONPリクエストを使用して、名前に検索語が含まれているヒーローをクエリします。

```ts
/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable {
  term = term.trim();

  const heroesURL = `${this.heroesURL}?${term}`;
  return this.http.jsonp(heroesUrl, 'callback').pipe(
      catchError(this.handleError('searchHeroes', [])) // then handle the error
    );
}
```

このリクエストは、1つ目の引数として `heroesURL`を渡し、2つ目の引数としてコールバック関数名を渡します。
レスポンスはコールバック関数でラップされます。コールバック関数は、JSONPメソッドによって返されたObservableを取得し、それらをエラーハンドラーにパイプします。

### 非JSONデータのリクエスト

すべてのAPIがJSONデータを返すわけではありません。
この次の例では、`DownloaderService`のメソッドがサーバーからテキストファイルを読み取り、ファイルの内容をログに記録してから、それらの内容を` Observable<string>`として呼び出し元に返します。

<code-example
  path="http/src/app/downloader/downloader.service.ts"
  region="getTextFile"
  header="app/downloader/downloader.service.ts (getTextFile)" linenums="false">
</code-example>

`HttpClient.get()`は`responseType`オプションがあるため、デフォルトのJSONではなく文字列を返します。

RxJSの `tap`演算子は、「wiretap（盗聴器）」のように、コードがObservableを妨害せずに成功値とエラー値の両方を検査することを許可します。

`DownloaderComponent`の`download()`メソッドは、サービスのメソッドをsubscribeすることでリクエストを開始します。

<code-example
  path="http/src/app/downloader/downloader.component.ts"
  region="download"
  header="app/downloader/downloader.component.ts (download)" linenums="false">
</code-example>

{@a error-handling}

## リクエストエラーの処理

サーバーでリクエストが失敗した場合、`HttpClient`は成功したレスポンスではなく_error_オブジェクトを返します。

サーバートランザクションを実行するのと同じサービスが、エラーの検査、解釈、および解決も実行する必要があります。

エラーが発生した場合、ユーザーに通知するために失敗した内容の詳細を取得できます。場合によっては、自動的に[リクエストのリトライ](#retry)が可能です。

{@a error-details}
### エラーの詳細を取得する

アプリケーションは、データアクセスが失敗したときに、ユーザーに役立つフィードバックを提供する必要があります。
生のエラーオブジェクトは、フィードバックとして特に役立ちません。
エラーが発生したことを検出することに加えて、エラーの詳細を取得し、それらの詳細を使用してユーザーフレンドリーなレスポンスを作成する必要があります。

2種類のエラーが発生する可能性があります。

* サーバーバックエンドがリクエストを拒否し、404や500などのステータスコードを含むHTTPレスポンスを返す場合があります。これらはエラー_レスポンス_です。

* 要求を正常に完了できないネットワークエラーや、RxJSオペレーターでスローされた例外など、クライアント側で問題が発生する可能性があります。これらのエラーは`0`に設定された`status`と、`ProgressEvent`オブジェクトが含まれる`error`プロパティを持っています。`ProgressEvent`オブジェクトの`type`は詳細な情報を提供する可能性があります。

`HttpClient`は、`HttpErrorResponse`で両方の種類のエラーをキャプチャします。
そのレスポンスを調べて、エラーの原因を特定できます。

次の例では、以前に定義された[ConfigService](#config-service "ConfigService defined")でエラーハンドラーを定義します。

<code-example
  path="http/src/app/config/config.service.ts"
  region="handleError"
  header="app/config/config.service.ts (handleError)">
</code-example>

ハンドラーは、ユーザーフレンドリーなエラーメッセージとともにRxJS`ErrorObservable`を返します。
次のコードは、[パイプ](guide/pipes "Pipes guide")を使用して`getConfig()`メソッドを更新し、`HttpClient.get()`呼び出しによって返されたすべてのObservableをエラーハンドラーに送信します。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_3"
  header="app/config/config.service.ts (getConfig v.3 with error handler)">
</code-example>

{@a retry}
### 失敗したリクエストのリトライ

エラーは一時的なものであり、再試行すると自動的に消える場合があります。
たとえば、ネットワークの中断はモバイルシナリオで一般的であり、再試行すると
成功する可能性があります。

[RxJS library](guide/rx-library)はいくつかの_retry_オペレーターを提供します。
例えば、`retry()`オペレーターは、失敗した`Observable`を指定された回数だけ自動的に再サブスクライブします。`HttpClient`メソッド呼び出しの結果を_再サブスクライブ_すると、HTTPリクエストを再発行する効果があります。

次の例は、失敗したリクエストをエラーハンドラーに渡す前に、`retry()`オペレーターにパイプする方法を示しています。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig"
  header="app/config/config.service.ts (getConfig with retry)">
</code-example>


## サーバーへのデータの送信

サーバーからデータを取得することに加えて、`HttpClient`は、リモートデータを変更するために使用できるPUT、POST、DELETEなどの他のHTTPメソッドをサポートします。

このガイドのサンプルアプリには、ヒーローを取得し、ユーザーがヒーローを追加、削除、更新できる「Tour of Heroes」の例の要約版が含まれています。
次のセクションでは、サンプルの`HeroesService`からのデータ更新メソッドの例を示します。

### POSTリクエストの作成

多くの場合、アプリはフォームを送信するときにPOSTリクエストを使用してサーバーにデータを送信します。
次の例では、データベースにヒーローを追加するときに、`HeroesService`がHTTP POSTリクエストを実行します。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="addHero"
  header="app/heroes/heroes.service.ts (addHero)">
</code-example>

`HttpClient.post()`メソッドは、型パラメータがあり、サーバーが特定の型のデータを返すことを期待すると明示できるという点で、`get()`に似ています。このメソッドは、リソースURLと2つの追加パラメーターを取ります。

* *body* - POSTするリクエストのボディ内のデータ
* *options* - メソッドオプションを含むオブジェクト。この場合のオプションは、[必要なヘッダーを指定してください](#adding-headers)。

この例では、[前述](#error-details)のようにエラーをキャッチします。

`HeroesComponent`がこのサービスのメソッドが返す`Observable`をサブスクライブすることによって、実際のPOST処理が開始します。

<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="add-hero-subscribe"
  header="app/heroes/heroes.component.ts (addHero)">
</code-example>

サーバーが正常に新しく追加されたヒーローを返すと、コンポーネントはそのヒーローを画面に表示された`heroes`リストに追加します。

### DELETEリクエストの作成

このアプリケーションは、リクエストURLでヒーローのIDを渡すことにより、`HttpClient.delete`メソッドを使用してヒーローを削除します。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="deleteHero"
  header="app/heroes/heroes.service.ts (deleteHero)">
</code-example>

`HeroesComponent`がこのサービスのメソッドが返す`Observable`をサブスクライブすることによって、実際のDELETE処理が開始します。

<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="delete-hero-subscribe"
  header="app/heroes/heroes.component.ts (deleteHero)">
</code-example>

コンポーネントは削除処理の結果を要求していないため、コールバックなしでサブスクライブします。結果を使用していなくても、サブスクライブする必要があります。`subscribe()`メソッドを呼び出すと、Observableが_実行_され、DELETEリクエストが開始します。

<div class="alert is-important">

_subscribe()_を呼び出す必要があります。そうしないと、何も起こりません。`HeroesService.deleteHero()`を呼び出すだけでは、DELETEリクエストは開始しません。

</div>


<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="delete-hero-no-subscribe">
</code-example>

{@a always-subscribe}
**常に_subscribe_!**

`HttpClient`のメソッドは、そのメソッドが返すObservableに対し`subscribe()`を呼び出すまで、HTTPリクエストを開始しません。これは_すべての_`HttpClient`のメソッドに当てはまります。

<div class="alert is-helpful">

[`AsyncPipe`](api/common/AsyncPipe)は自動的にサブスクライブ（およびサブスクライブ解除）します。

</div>

`HttpClient`のメソッドは意図的に_コールド_になっています。
HTTPリクエストの実行は_遅延型_であり、実際に何かが起こる前に、`tap`や`catchError`などの追加のオペレーターでobservableを拡張できます。

`subscribe(...)`を呼び出すと、Observableの実行がトリガーされ、
`HttpClient`はHTTPリクエストを作成してサーバーに送信します。

これらのObservableは、実際のHTTPリクエストの_青写真_と考えることができます。

<div class="alert is-helpful">

実際、各`subscribe()`、Observableの個別の独立した実行を開始します。
2回サブスクライブすると、2つのHTTPリクエストが発生します。

```javascript
const req = http.get<Heroes>('/api/heroes');
// 0 requests made - .subscribe() not called.
req.subscribe();
// 1 request made.
req.subscribe();
// 2 requests made.
```
</div>

### PUTリクエストの作成

アプリケーションは、HTTPクライアントサービスを使用してPUTリクエストを送信できます。
次の`HeroesService`の例は、POSTの例と同様に、リソースを更新されたデータに置き換えます。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="updateHero"
  header="app/heroes/heroes.service.ts (updateHero)">
</code-example>

Observableを返すHTTPメソッドについて言えば、呼び出し元の`HeroesComponent.update()`はリクエストを開始するため、`HttpClient.put()`から返されたObservableを[`subscribe()`する必要があります。](#always-subscribe "Why you must always subscribe.")

### ヘッダーの追加と更新

多くのサーバーでは、保存処理のために追加のヘッダーが必要です。。
例えば、サーバーは、認証トークンや、リクエスト本文のMIMEタイプを明示的に宣言するため「Content-Type」ヘッダーを必要とする場合があります。

##### ヘッダーの追加

`HeroesService`は、`HttpClient`の保存メソッド全てに渡される`httpOptions`オブジェクトで、そのようなヘッダーを定義します。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="http-options"
  header="app/heroes/heroes.service.ts (httpOptions)">
</code-example>

##### ヘッダーの更新

`HttpHeaders`クラスのインスタンスは不変であるため、前述のoptionsオブジェクト内の既存のヘッダーを直接変更することはできません。
代わりに`set()`メソッドを使用して、新しい変更が適用された現在のインスタンスのクローンを返します。

次の例は、古いトークンの有効期限が切れたときに、次のリクエストを行う前に認証ヘッダーを更新する方法を示しています。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
   region="update-headers" linenums="false">
</code-example>

{@a url-params}

## HTTP URLパラメーターの構成

`HttpRequest`において、URLにクエリ文字列を追加する`HttpParams`クラスを`params`リクエストオプションとともに使用します。

次の例では、`searchHeroes()`メソッドは、名前に検索語が含まれているヒーローをクエリします。

`HttpParams`クラスのインポートから始めます。

<code-example hideCopy language="typescript">
import {HttpParams} from "@angular/common/http";
</code-example>

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="searchHeroes" linenums="false">
</code-example>

検索語がある場合、コードはHTML URLエンコードされた検索パラメーターを持つoptionsオブジェクトを作成します。
例えば検索語が「cat」の場合、GETリクエストのURLは`api/heroes?name=cat`になります。

`HttpParams`オブジェクトはイミュータブルです。optionsを更新する必要がある場合、`.set()`メソッドの戻り値を保存してください。

`fromString`変数を使用して、クエリ文字列から直接HTTPパラメータを作成することもできます。

<code-example hideCopy language="typescript">
const params = new HttpParams({fromString: 'name=foo'});
</code-example>


{@a intercepting-requests-and-responses}
## リクエストとレスポンスのインターセプト

インターセプトを使用することで、アプリケーションからサーバーへのHTTPリクエストを検査して変換する_interceptors_を宣言します。
同じインターセプターが、アプリケーションに返ってくるサーバーのレスポンスを検査および変換することもできます。
複数のインターセプターが、リクエスト/レスポンスハンドラーの_前後の_チェーンを形成します。

インターセプターは、すべてのHTTPリクエスト/レスポンスに対して、認証からロギングまで、さまざまな_暗黙の_タスクを1つのルーチンの中で、標準的な方法で実行できます。

インターセプトがなければ、開発者は各`HttpClient`メソッド呼び出しに対してこれらのタスクを_明示的に_実装する必要があります。

### インターセプターを書く

インターセプターを実装するには、`HttpInterceptor`インターフェースの`intercept()`メソッドを実装するクラスを宣言します。

ここには、リクエストに触れずに渡すことだけ行う_noop_インターセプターがあります。

<code-example
  path="http/src/app/http-interceptors/noop-interceptor.ts"
  header="app/http-interceptors/noop-interceptor.ts">
</code-example>

`intercept`メソッドは、リクエストを、最終的にHTTPレスポンスを返す`Observable`に変換します。
こういう意味では、各インターセプターは完全に単独でリクエストを処理することができます。

ほとんどのインターセプターは、途中でリクエストを検査し、[`HttpHandler`](api/common/http/HttpHandler)インターフェースを実装する`next`オブジェクトの`handle()`メソッドに（おそらく変更された）リクエストを転送します。

```javascript
export abstract class HttpHandler {
  abstract handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}
```

`intercept()`と同様に、`handle()`メソッドは、HTTPリクエストを最終的にサーバーのレスポンスを含む[`HttpEvents`](#httpevents)の`Observable`に変換します。`intercept()`メソッドは、そのObservableを検査し、呼び出し元に返す前に変更することができます。

_何もしない_インターセプターは、元のリクエストを渡して`next.handle()`を呼び出し、何もせずにObservableを返します。

### _next_オブジェクト

`next`オブジェクトは、インターセプターのチェーン内の次のインターセプターを表します。
チェーンの最後の`next`は、リクエストをサーバーに送信し、サーバーのレスポンスを受け取る`HttpClient`バックエンドハンドラーです。


ほとんどのインターセプターは、`next.handle()`を呼び出して、リクエストが次のインターセプター、そして最終的にはバックエンドハンドラーに流れるようにします。
インターセプターは、`next.handle()`の呼び出しをスキップしチェーンを近道して、人工のサーバーレスポンスで[自身の`Observable`を返す](#caching)こともできます。

これは、Express.jsなどのフレームワークでよく見られるミドルウェアパターンです。

### インターセプターを提供する

`NoopInterceptor`は、Angularの[依存性の注入（DI）](guide/dependency-injection)システムによって管理されるサービスです。
他のサービスと同様に、アプリケーションが使用する前にインターセプタークラスを提供する必要があります。

インターセプターは`HttpClient`サービスの（オプショナルな）依存関係であるため、
`HttpClient`を提供しているのと同じインジェクター（またはインジェクターの親）にそれらを提供する必要があります。
DIが`HttpClient`を作成した_後に_提供されるインターセプターは無視されます。

このアプリケーションは、`AppModule`で`HttpClientModule`をインポートする副作用として、アプリケーションのルートインジェクターに`HttpClient`を提供します。
同様にインターセプターは`AppModule`の中で提供すべきです。

`@angular/common/http`から`HTTP_INTERCEPTORS`インジェクショントークンをインポートした後、
次のように`NoopInterceptor`プロバイダーを記述します。

<code-example
  path="http/src/app/http-interceptors/index.ts"
  region="noop-provider">
</code-example>

`multi：true`オプションに注意してください。
この必須設定は、Angularに`HTTP_INTERCEPTORS`は単一の値ではなく値の配列を注入する_マルチプロバイダー_のトークンであることを伝えます。

このプロバイダーを `AppModule`のproviders配列に直接追加することができます。
ただし、それはむしろ冗長であるし、より多くのインターセプターを作成して同じ方法で提供できる可能性があります。
また、これらのインターセプターを提供する[順序に細心の注意](#interceptor-order)を払う必要があります。

この最初の`NoopInterceptor`から始まる`httpInterceptorProviders`配列の中にすべてのインターセプタープロバイダーを集める「バレル」ファイルを作成することを検討してください。

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

### インターセプターの順番

Angularは、あなたが提供した順序でインターセプターを適用します。
たとえば、サーバーに送信する前にHTTPリクエストの認証を処理し、ログに記録する必要がある状況を考えてみます。 このタスクを実行するには、`AuthInterceptor`サービスを提供してから、`LoggingInterceptor`サービスを提供します。
送信リクエストは`AuthInterceptor`から`LoggingInterceptor`に流れます。
これらのリクエストからのレスポンスは、`LoggingInterceptor`から`AuthInterceptor`へと逆方向に流れます。
以下は、プロセスを視覚的に表したものです。

<div class="lightbox">
  <img src="generated/images/guide/http/interceptor-order.svg" alt="HttpClient、AuthInterceptor、AuthInterceptor、HttpBackend、Serverの順と、その逆に並んだインターセプターで、双方向のフローを表しています">
</div>

<div class="alert is-helpful">

   プロセスの最後のインターセプターは常に、サーバーとの通信を処理する`HttpBackend`です。

</div>

後で順序を変更したり、インターセプターを削除したりすることはできません。
インターセプターを動的に有効または無効にする必要がある場合は、その機能をインターセプター自体に組み込む必要があります。

{@a interceptor-events}

### インターセプターイベントの処理

ほとんどの`HttpClient`メソッドは`HttpResponse<any>`のObservableを返します。
`HttpResponse`クラス自体は実際にはイベントであり、その型は`HttpEventType.Response`です。
ただし、単一のHTTPリクエストで、アップロードおよびダウンロードの進行状況イベントなど、他の型の複数のイベントが発生する可能性があります。
`HttpInterceptor.intercept()`や`HttpHandler.handle()`は`HttpEvent<any>`のObservableを返します。

多くのインターセプターは、送信リクエストのみに関係し、リクエストを変更せずに `next.handle()`からイベントストリームを返します。
ただし、一部のインターセプターは、`next.handle()`からのレスポンスを検査して変更する必要があります。これらの操作は、ストリーム内のこれらすべてのイベントを確認できます。

{@a immutability}

インターセプターはリクエストとレスポンスを変更できますが、
`HttpRequest`と`HttpResponse`インスタンスのプロパティは`readonly`であり、
ほとんどイミュータブルになります。
これらは正当な理由で不変です。アプリケーションはリクエストが成功する前に数回再試行する場合がある、すなわち、インターセプターチェーンが同じリクエストを複数回再処理する可能性があるためです。
インターセプターが元のリクエストオブジェクトを変更できる場合、再試行された操作は、元のリクエストではなく、変更されたリクエストから開始します。イミュータビリティは、インターセプターが試行ごとに同じ要求を確認することを保証します。

<div class="alert is-helpful">

   インターセプターは、やむを得ない理由がない限り、変更せずにすべてのイベントを返す必要があります。

</div>

TypeScriptにより、`HttpRequest`の読み取り専用プロパティは設定できません。

```javascript
  // Typescript disallows the following assignment because req.url is readonly
  req.url = req.url.replace('http://', 'https://');
```

リクエストを変更する必要がある場合は、最初にクローンを作成し、クローンを変更してから`next.handle()`に渡します。
次の例に示すように、リクエストを1つのステップで複製および変更できます。

<code-example
  path="http/src/app/http-interceptors/ensure-https-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/ensure-https-interceptor.ts (excerpt)">
</code-example>

`clone()`メソッドのハッシュ引数を使用すると、リクエストの特定のプロパティを変更しながら、他のプロパティをコピーできます。

#### リクエストボディの変更

`readonly`への代入に対するガードは、深い更新を防ぐことはできません。特に、
リクエストボディオブジェクトのプロパティを変更することを防ぐことはできません。

```javascript
  req.body.name = req.body.name.trim(); // bad idea!
```

リクエストボディを変更する必要がある場合は、次の手順に従ってください。

1. ボディをコピーして、コピーに変更を加えます。
2. `clone()`メソッドを使用して、リクエストオブジェクトのクローンを作成します。
3. クローンのボディを変更されたコピーに置き換えます。

<code-example
  path="http/src/app/http-interceptors/trim-name-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/trim-name-interceptor.ts (excerpt)">
</code-example>

#### クローンのリクエストボディをクリアする

リクエストボディを置き換えるのではなく、クリアする必要がある場合があります。
これを行うには、複製されたリクエストボディを `null`に設定します。

<div class="alert is-helpful">

**Tip**: 複製されたリクエストボディを`undefined`に設定すると、Angularはボディをそのままにしておくつもりであると想定します。

</div>

```javascript
  newReq = req.clone({ ... }); // body not mentioned => preserve original body
  newReq = req.clone({ body: undefined }); // preserve original body
  newReq = req.clone({ body: null }); // clear the body
```

## Httpインターセプターのユースケース

以下は、インターセプターのよくある使用法です。

### デフォルトのヘッダーをセットする

アプリケーションでは、送信するリクエストにインターセプターを使用してデフォルトのヘッダーを設定することがよくあります。

サンプルアプリケーションには、認可トークンを生成する`AuthService`があります。
これは、トークンを取得するサービスを注入し、トークンを全ての送信するリクエストの認可ヘッダーに追加する、`AuthInterceptor`です。

<code-example
  path="http/src/app/http-interceptors/auth-interceptor.ts"
  header="app/http-interceptors/auth-interceptor.ts">
</code-example>

新しいヘッダーを設定するため、リクエストのクローンを作成するというプラクティスは非常に一般的であるため、
`setHeaders`ショートカットがあります。

<code-example
  path="http/src/app/http-interceptors/auth-interceptor.ts"
  region="set-header-shortcut">
</code-example>

ヘッダーを変更するインターセプターは、次のようなさまざまな操作に使用できます。

* 認証/認可
* キャッシュ動作。例えば、`If-Modified-Since`
* XSRF防止

### リクエストとレスポンスのペアをロギングする

インターセプターはリクエストとレスポンスを_一緒に_処理できるため、HTTPオペレーション全体について時間の計測やログの記録ができます。

次の`LoggingInterceptor`を考えてみましょう。
これは、リクエストの時間とレスポンスの時間を取得し、注入された`MessageService`で経過時間とともに結果を記録します。

<code-example
  path="http/src/app/http-interceptors/logging-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/logging-interceptor.ts)">
</code-example>

RxJSの`tap`オペレーターは、リクエストが成功するか失敗したかを取得します。
RxJSの`finalize`オペレーターは、レスポンスのObservableがエラーとなったか、完了したとき（必ず起きる）に呼ばれ、その結果を`MessageService`に報告します。

`tap`も`finalize`も、呼び出し元に返されたObservableのストリームの値には影響を及ぼしません。

{@a custom-json-parser}

### カスタムJSONパース

インターセプターを使用して、組み込みのJSONパースをカスタム実装に置き換えることができます。

次の例の`CustomJsonInterceptor`は、これを実現する方法を示しています。
インターセプトされたリクエストが`'json'`レスポンスを期待している場合、組み込みのJSONパースを無効化するため、`responseType`は`'text'`に変更されます。
次に、注入された`JsonParser`を介してレスポンスがパースされます。

<code-example
  path="http/src/app/http-interceptors/custom-json-interceptor.ts"
  region="custom-json-interceptor"
  header="app/http-interceptors/custom-json-interceptor.ts">
</code-example>

独自のカスタム`JsonParser`を実装できます。
これは、特別なdate reviverを持つカスタムJsonParserです。

<code-example
  path="http/src/app/http-interceptors/custom-json-interceptor.ts"
  region="custom-json-parser"
  header="app/http-interceptors/custom-json-interceptor.ts">
</code-example>

`CustomParser`とともに`CustomJsonInterceptor`を提供します。

<code-example
  path="http/src/app/http-interceptors/index.ts"
  region="custom-json-interceptor"
  header="app/http-interceptors/index.ts">
</code-example>


{@a caching}
### リクエストをキャッシュする

インターセプターは`next.handle()`に転送せずに、自分でリクエストを処理できます。

たとえば、パフォーマンスを向上させるために、特定のリクエストとレスポンスをキャッシュすると決めることがあります。
既存のデータサービスを妨げることなく、インターセプターにキャッシュを移譲できます。

次の例の`CachingInterceptor`はこのアプローチを示しています。

<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="v1"
  header="app/http-interceptors/caching-interceptor.ts)">
</code-example>

* `isCachable()`関数はリクエストがキャッシュ可能かどうかを決定します。
このサンプルでは、npmパッケージの検索APIに対するGETリクエストのみがキャッシュ可能です。

* リクエストがキャッシュ可能でない場合、インターセプターはリクエストをチェーン内の次のハンドラーに転送します。

* キャッシング可能なリクエストがキャッシュ内に見つかった場合、インターセプターはキャッシュされたレスポンスを`of()`_Observable_で返し、`next`ハンドラー（および他のすべての下流のインターセプター）をバイパスします。

* キャッシュ可能なリクエストがキャッシュにない場合、コードは`sendRequest`を呼び出します。
この関数は、ヘッダーなしで[リクエストのクローン](#immutability)を作成します。これは、npm APIがヘッダーを禁止しているためです。
次に、この関数はリクエストのクローンを`next.handle()`に転送し、最終的にサーバーを呼び出してサーバーのレスポンスを返します。

{@a send-request}
<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="send-request">
</code-example>

`sendRequest`がアプリケーションに戻る途中の_レスポンスをインターセプトする_方法に注意してください。
`tap()`オペレーターによりレスポンスを_パイプ_して、そのコールバックでレスポンスをキャッシュに追加します。

元のレスポンスは、インターセプターのチェーンを通ってアプリケーション呼び出し元にオリジナルの状態で戻ります。

`PackageSearchService`のようなデータサービスは、`HttpClient`リクエストのいくつかは実際にはキャッシュされたレスポンスを返すものがあることを知りません。

{@a cache-refresh}
### インターセプターを使用して複数の値を要求する

`HttpClient.get()`メソッドは通常、データまたはエラーのいずれかの単一の値を発行するObservableを返します。
インターセプターは、[複数の値](guide/observables)を発出するObservableに変更できます。

次の修正された`CachingInterceptor`は、任意でObservableを返します。
このObservableは、キャッシュされたレスポンスをすぐに発出し、リクエストをnpm Web APIに送信し、最新の検索結果を再度発出します。

<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="intercept-refresh">
</code-example>

<div class="alert is-helpful">

_cache-then-refresh_オプションは、カスタムの`x-refresh`ヘッダーが存在するとトリガーされます。

`PackageSearchComponent`のチェックボックスは、`withRefresh`フラグを切り替えます。
これは`PackageSearchService.search()`の引数のメソッドです。
`search()`メソッドはカスタムの`x-refresh`ヘッダーを作成し、
`HttpClient.get()`を呼び出す前にそれをリクエストに追加します。

</div>

修正された`CachingInterceptor`は、[上記](#send-request)で説明したのと同じ`sendRequest()`メソッドを使用して、キャッシュされた値があるかどうかに関係なく、サーバーリクエストを設定します。
`results$`observableは、サブスクライブ時にリクエストを行います。

* キャッシュされた値がない場合、インターセプターは`results$`を返します。

* キャッシュされた値がある場合、コードはキャッシュされたレスポンスを`results$`に_パイプ_します。そして、最初に（ただちに）キャッシュされた応答を発出し、その後にサーバーからのレスポンスを発出する、再構成されたObservableを作成します。
サブスクライバーは、連続の2つの応答を参照します。

{@a report-progress}

## リクエストの進行状況の追跡と表示

アプリケーションが大量のデータを転送し、それらの転送に長い時間がかかる場合があります。
ファイルのアップロードは典型的な例です。
そのような転送の進捗状況に関するフィードバックを提供することにより、ユーザーによりよい経験を提供します。

プログレスイベントを有効にしてリクエストを行うには、`reportProgress`オプションをtrueに設定して`HttpRequest`のインスタンスを作成し、プログレスイベントを追跡できるようにします。

<code-example
  path="http/src/app/uploader/uploader.service.ts"
  region="upload-request"
  header="app/uploader/uploader.service.ts (upload request)">
</code-example>

<div class="alert is-important">

**Tip**: すべてのプログレスイベントは変更検知をトリガーします。したがって、UIで進捗状況を本当に報告する必要がある場合にのみ、それらを有効にしてください。

[`HttpClient.request()`](api/common/http/HttpClient#request)でHTTPメソッドを使うときには、
[`observe: 'events'`](api/common/http/HttpClient#request)で転送の進捗を含むすべてのイベントを見るように設定してください。

</div>

次に、このリクエストオブジェクトを`HttpClient.request()`メソッドに渡します。
このメソッドは、[インターセプター](#interceptor-events)によって処理されたのと同じイベントである`HttpEvents`の`Observable`を返します。

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
`app/http-interceptors/upload-interceptor.ts`の`UploadInterceptor`は、アップロードリクエストをインターセプトしてショートサーキットし、シミュレートされたイベントのObservableを返します。

</div>

## デバウンスによるサーバーインタラクションの最適化

ユーザー入力に応答してHTTPリクエストを行う必要がある場合、キーストロークごとにリクエストを送信するのは効率的ではありません。
ユーザーが入力をやめるのを待ってからリクエストを送信する方がよいでしょう。
この手法はデバウンスとして知られています。

次のテンプレートについて考えてみます。このテンプレートでは、ユーザーが検索語を入力して、名前からnpmパッケージを見つけることができます。
ユーザーが検索ボックスに名前を入力すると、`PackageSearchComponent`はその名前のパッケージの検索リクエストをnpm Web APIに送信します。

<code-example
  path="http/src/app/package-search/package-search.component.html"
  region="search"
  header="app/package-search/package-search.component.html (search)">
</code-example>

ここでは、`keyup`イベントバインディングは、すべてのキーストロークをコンポーネントの`search()`メソッドに送信します。

<div class="alert is-helpful">

`$event.target`の型は、テンプレート内の`EventTarget`に過ぎません。
`getValue()`メソッドでは、ターゲットが`HTMLInputElement`にキャストされ、その`value`プロパティへの型安全なアクセスが可能になります。

<code-example path="http/src/app/package-search/package-search.component.ts" region="getValue"></code-example>

</div>

次のスニペットは、RxJSオペレーターを使用してこの入力のデバウンスを実装します。

<code-example
  path="http/src/app/package-search/package-search.component.ts"
  region="debounce"
  header="app/package-search/package-search.component.ts (excerpt)">
</code-example>

`searchText$`は、ユーザーからの検索ボックス値のシーケンスです。
これは、RxJSの`Subject`として定義されています。`Subject`は、`search()`メソッドで行っているように、`next(value)`を呼び出すことによって、自身に対して値を発行できるマルチキャスト`Observable`です。

すべての`searchText`値を注入された`PackageSearchService`に直接転送するのではなく、
`ngOnInit()`のコードは、検索値を3つのオペレーターにパイプしているので、検索値が新しい値でかつユーザーが入力を停止した場合にのみ、検索値がサービスに到達します。

* `debounceTime(500)`⁠—ユーザーが入力を停止するのを待ちます（この場合は1/2秒）。

* `distinctUntilChanged()`⁠—検索テキストが変わるまで待ちます。

* `switchMap()`⁠—検索リクエストをサービスに送信します。

このコードは、`packages$`をこの再構成された検索結果の`Observable`に設定します。
テンプレートは、[AsyncPipe](api/common/AsyncPipe)を使用して`packages$`をサブスクライブし、
検索結果が届いた際に表示します。

<div class="alert is-helpful">

`withRefresh`オプションの詳細については、[インターセプターを使用して複数の値を要求する](#cache-refresh)を参照してください。

</div>

### *switchMap()*オペレーターの使用

The `switchMap()`オペレーターは、`Observable`を返す関数を引数に取ります。
例えば、`PackageSearchService.search`は他のデータサービスメソッドと同様に`Observable`を返します。
以前の検索リクエストがまだ実行中である場合（接続が悪い場合など）、
オペレーターはリクエストをキャンセルして新しいリクエストを送信します。

サービスのレスポンスをサーバーが順不同で返したとしても、`switchMap()`は、元のリクエストの順序で返すことに注意してください。


<div class="alert is-helpful">

このデバウンスロジックを再利用しようと考えるなら、
ユーティリティ関数または `PackageSearchService`自体に移動することを検討してください。

</div>


## Security: XSRF protection

[Cross-Site Request Forgery (XSRF or CSRF)](https://en.wikipedia.org/wiki/Cross-site_request_forgery) is an attack technique by which the attacker can trick an authenticated user into unknowingly executing actions on your website.
`HttpClient` supports a [common mechanism](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token) used to prevent XSRF attacks.
When performing HTTP requests, an interceptor reads a token from a cookie, by default `XSRF-TOKEN`, and sets it as an HTTP header, `X-XSRF-TOKEN`.
Since only code that runs on your domain could read the cookie, the backend can be certain that the HTTP request came from your client application and not an attacker.

By default, an interceptor sends this header on all mutating requests (such as POST)
to relative URLs, but not on GET/HEAD requests or on requests with an absolute URL.

To take advantage of this, your server needs to set a token in a JavaScript readable session cookie called `XSRF-TOKEN` on either the page load or the first GET request.
On subsequent requests the server can verify that the cookie matches the `X-XSRF-TOKEN` HTTP header, and therefore be sure that only code running on your domain could have sent the request.
The token must be unique for each user and must be verifiable by the server; this prevents the client from making up its own tokens.
Set the token to a digest of your site's authentication cookie with a salt for added security.

In order to prevent collisions in environments where multiple Angular apps share the same domain or subdomain, give each application a unique cookie name.

<div class="alert is-important">

*`HttpClient` supports only the client half of the XSRF protection scheme.*
Your backend service must be configured to set the cookie for your page, and to verify that
the header is present on all eligible requests.
Failing to do so renders Angular's default protection ineffective.

</div>

### Configuring custom cookie/header names

If your backend service uses different names for the XSRF token cookie or header,
use `HttpClientXsrfModule.withOptions()` to override the defaults.

<code-example
  path="http/src/app/app.module.ts"
  region="xsrf">
</code-example>

{@a testing-requests}
## Testing HTTP requests

As for any external dependency, you must mock the HTTP backend so your tests can simulate interaction with a remote server.
The `@angular/common/http/testing` library makes it straightforward to set up such mocking.

Angular's HTTP testing library is designed for a pattern of testing in which the app executes code and makes requests first.
The test then expects that certain requests have or have not been made,
performs assertions against those requests,
and finally provides responses by "flushing" each expected request.

At the end, tests can verify that the app has made no unexpected requests.

<div class="alert is-helpful">

You can run <live-example stackblitz="specs">these sample tests</live-example>
in a live coding environment.

The tests described in this guide are in `src/testing/http-client.spec.ts`.
There are also tests of an application data service that call `HttpClient` in
`src/app/heroes/heroes.service.spec.ts`.

</div>

### Setup for testing

To begin testing calls to `HttpClient`,
import the `HttpClientTestingModule` and the mocking controller, `HttpTestingController`,
along with the other symbols your tests require.

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="imports"
  header="app/testing/http-client.spec.ts (imports)">
</code-example>

Then add the `HttpClientTestingModule` to the `TestBed` and continue with
the setup of the _service-under-test_.

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="setup"
  header="app/testing/http-client.spec.ts(setup)">
</code-example>

Now requests made in the course of your tests hit the testing backend instead of the normal backend.

This setup also calls `TestBed.inject()` to inject the `HttpClient` service and the mocking controller
so they can be referenced during the tests.

### Expecting and answering requests

Now you can write a test that expects a GET Request to occur and provides a mock response.

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="get-test"
  header="app/testing/http-client.spec.ts (HttpClient.get)">
</code-example>

The last step, verifying that no requests remain outstanding, is common enough for you to move it into an `afterEach()` step:

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="afterEach">
</code-example>

#### Custom request expectations

If matching by URL isn't sufficient, it's possible to implement your own matching function.
For example, you could look for an outgoing request that has an authorization header:

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="predicate">
</code-example>

As with the previous `expectOne()`,
the test fails if 0 or 2+ requests satisfy this predicate.

#### Handling more than one request

If you need to respond to duplicate requests in your test, use the `match()` API instead of `expectOne()`.
It takes the same arguments but returns an array of matching requests.
Once returned, these requests are removed from future matching and
you are responsible for flushing and verifying them.

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="multi-request">
</code-example>

### Testing for errors

You should test the app's defenses against HTTP requests that fail.

Call `request.flush()` with an error message, as seen in the following example.

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="404">
</code-example>

Alternatively, you can call `request.error()` with an `ErrorEvent`.

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="network-error">
</code-example>


## Passing metadata to interceptors

Many interceptors require or benefit from configuration. Consider an interceptor that retries failed requests.
By default, the interceptor might retry a request three times, but you might want to override this retry count for particularly error-prone or sensitive requests.

`HttpClient` requests contain a _context_ that can carry metadata about the request.
This context is available for interceptors to read or modify, though it is not transmitted to the backend server when the request is sent.
This allows applications or other interceptors to tag requests with configuration parameters, such as how many times to retry a request.

### Creating a context token

Angular stores and retrieves a value in the context using an `HttpContextToken`.
You can create a context token using the `new` operator, as in the following example:

<code-example path="http/src/app/http-interceptors/retry-interceptor.ts" region="context-token" header="creating a context token"></code-example>

The lambda function `() => 3` passed during the creation of the `HttpContextToken` serves two purposes:

1. It allows TypeScript to infer the type of this token: `HttpContextToken<number>`.
  The request context is type-safe&mdash;reading a token from a request's context returns a value of the appropriate type.

1. It sets the default value for the token.
  This is the value that the request context returns if no other value has been set for this token.
  Using a default value avoids the need to check if a particular value is set.

### Setting context values when making a request

When making a request, you can provide an `HttpContext` instance, in which you have already set the context values.

<code-example path="http/src/app/http-interceptors/retry-interceptor.ts" region="set-context" header="setting context values"></code-example>

### Reading context values in an interceptor

Within an interceptor, you can read the value of a token in a given request's context with `HttpContext.get()`.
If you have not explicitly set a value for the token, Angular returns the default value specified in the token.

<code-example path="http/src/app/http-interceptors/retry-interceptor.ts" region="reading-context" header="reading context values in an interceptor"></code-example>

### Contexts are mutable

Unlike most other aspects of `HttpRequest` instances, the request context is mutable and persists across other immutable transformations of the request.
This allows interceptors to coordinate operations through the context.
For instance, the `RetryInterceptor` example could use a second context token to track how many errors occur during the execution of a given request:

<code-example path="http/src/app/http-interceptors/retry-interceptor.ts" region="mutable-context" header="coordinating operations through the context"></code-example>
