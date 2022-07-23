# HTTPによるバックエンドサービスとの通信

ほとんどのフロントエンドアプリケーションは、データをダウンロードやアップロードし、他のバックエンドサービスにアクセスするため、HTTPプロトコルによってサーバーと通信する必要があります。
Angularは、Angularアプリケーション向けのHTTPクライアントのAPIとして、`@angular/common/http`内に`HttpClient`サービスクラスを提供しています。

HTTPクライアントサービスの主な機能は次のとおりです。

* [型付けされたレスポンスオブジェクト](#typed-response)を要求
* 合理化された[エラーハンドリング](#error-handling)
* [テスタビリティ](#testing-requests)
* リクエストとレスポンスへの[インターセプション](#intercepting-requests-and-responses)

##### 前提条件

`HttpClientModule`を使用する前に、次の基礎的な理解が必要です。

* TypeScriptプログラミング
* HTTPプロトコル
* [Angularの概念の紹介](guide/architecture)で説明されている、Angularアプリケーションのアーキテクチャ
* Observable技術とオペレーターについて。[Observables](guide/observables)ガイドを参照。

## サーバーとの通信の設定

`HttpClient`を使う前に、Angularの`HttpClientModule`をインポートする必要があります。
ほとんどのアプリケーションはルートの`AppModule`で行います。

<code-example
  path="http/src/app/app.module.ts"
  region="sketch"
  header="app/app.module.ts (excerpt)">
</code-example>

そして、次の`ConfigService`の例に示すように、依存として`HttpClient`サービスをアプリケーションクラスに注入できるようになります。

<code-example
  path="http/src/app/config/config.service.ts"
  region="proto"
  header="app/config/config.service.ts (excerpt)">
</code-example>

`HttpClient`サービスはすべてのトランザクションで[Observable](guide/glossary#observable "Observable definition")を使用します。サンプルのスニペットに現れるRxJS Observableとオペレーターをインポートする必要があります。これらの`ConfigService`のインポートは典型的なものです。

<code-example
  path="http/src/app/config/config.service.ts"
  region="rxjs-imports"
  header="app/config/config.service.ts (RxJS imports)">
</code-example>

<div class="alert is-helpful">

このガイドを達成する<live-example></live-example>を実行できます。

サンプルアプリケーションはデータサーバーを必要としません。
[Angular _in-memory-web-api_](https://github.com/angular/angular/tree/main/packages/misc/angular-in-memory-web-api)
に依存しています。
これは、_HttpClient_モジュールの`HttpBackend`に取って代わります。
この代わりのサービスはRESTのようなバックエンドの振る舞いをシミュレートしたものです。

それがどのように設定されているかを確認するには、`AppModule`の_imports_を見てください。

</div>

## サーバーにデータをリクエストする

サーバーからデータを取得するには、[`HttpClient.get()`](api/common/http/HttpClient#get)メソッドを使います。
非同期メソッドがHTTPリクエストを送信し、レスポンスを受信すると要求されたデータを発行するObservableを返します。
戻り値の型は呼び出し時に渡す`observe`と`responseType`の値によって変わります。

`get()`メソッドは2つの引数を取ります。取得元のエンドポイントURLと、リクエストの設定をするための*options* オブジェクトです。

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

*observe*と*responseType*プロパティは、重要なオプションです。

* *observe* オプションはどのくらいの量のレスポンスを返すのかを指定します。
* *responseType* オプションはどのようなフォーマットでデータを返すのかを指定します。

<div class="alert is-helpful">

`options`オブジェクトは送信するリクエストに対して他にもさまざまな設定を行うことができます。
たとえば、[ヘッダーの追加](#adding-headers)にあるように、サービスは `headers`オプションプロパティを使ってデフォルトのヘッダーを設定できます。

`params`プロパティでリクエストの[HTTP URLパラメーター](#url-params)の設定を行い、`reportProgress`オプションで大量のデータを送信するときの[リクエストの進行状況の監視](#report-progress)の設定を行うことができます。

</div>

アプリケーションはサーバーにJSONデータを要求することがよくあります。
`ConfigService`の例では、
アプリケーションはリソースURLを指定する`config.json`という設定ファイルが必要です。

<code-example
  path="http/src/assets/config.json"
  header="assets/config.json">
</code-example>

この種のデータを取得するには、`get()`の呼び出し時に次のオプションが必要です: `{observe: 'body', responseType: 'json'}` 。
これらはオプションのデフォルト値であるため、次の例ではoptionsオブジェクトを渡していません。
追加で指定可能なオプションは、後続のセクションで説明します。

{@a config-service}

この例は、データ処理機能を実行するため再利用できる[注入可能なサービス](guide/glossary#service "service definition")を定義することで、スケーラブルな解決法を生み出す上でのベストプラクティスにしたがっています。
サービスは、データの取得に加え、データの後処理、エラー処理の追加、リトライロジックの追加が可能です。

`ConfigService`は`HttpClient.get()`メソッドにより、このファイルを取得します。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_1"
  header="app/config/config.service.ts (getConfig v.1)">
</code-example>

`ConfigComponent`は`ConfigService`を注入し、
`getConfig`サービスメソッドを呼び出します。

サービスメソッドが設定データの`Observable`を返すため、
コンポーネントはメソッドの戻り値を*サブスクライブ*します。
サブスクリプションのコールバックは最小限の後処理を行います。
データフィールドの内容がコンポーネントの`config`オブジェクトにコピーされ、表示用にコンポーネントテンプレートへデータバインドされます。

<code-example
  path="http/src/app/config/config.component.ts"
  region="v1"
  header="app/config/config.component.ts (showConfig v.1)">
</code-example>

<a id="always-subscribe"></a>

### Starting the request

For all `HttpClient` methods, the method doesn't begin its HTTP request until you call `subscribe()` on the observable the method returns.

This is true for *all* `HttpClient` *methods*.

<div class="alert is-helpful">

The [`AsyncPipe`](api/common/AsyncPipe) subscribes and unsubscribes for you automatically.

</div>

All observables returned from `HttpClient` methods are *cold* by design.
Execution of the HTTP request is *deferred*, letting you extend the observable with additional operations such as  `tap` and `catchError` before anything actually happens.

Calling `subscribe()` triggers execution of the observable and causes `HttpClient` to compose and send the HTTP request to the server.

Think of these observables as *blueprints* for actual HTTP requests.

<div class="alert is-helpful">

In fact, each `subscribe()` initiates a separate, independent execution of the observable.
Subscribing twice results in two HTTP requests.

<code-example format="javascript" language="javascript">

const req = http.get&lt;Heroes&gt;('/api/heroes');
// 0 requests made - .subscribe() not called.
req.subscribe();
// 1 request made.
req.subscribe();
// 2 requests made.

</code-example>

</div>

<a id="typed-response"></a>

### 型付けされたレスポンスをリクエストする

`HttpClient`のリクエストを、そのレスポンスオブジェクトの型を宣言して構成すると、アウトプットをより簡単かつ明瞭に使えます。
レスポンスの型を指定することでコンパイル時に型アサーションとして機能します。

<div class="alert is-important">

レスポンスの型の指定は、レスポンスを指定された型として扱うべきであるというTypeScriptへの宣言です。
これはビルド時のチェックであり、サーバーが実際にこの型のオブジェクトでレスポンスを返すことは保証しません。サーバーAPIによって指定された型が返されることを保証するのは、サーバーの責任です。

</div>

まず、レスポンスオブジェクトの型を指定するため、必要なプロパティを持ったインターフェースを定義してください。
レスポンスはクラスのインスタンスに自動的に変換ができないプレーンオブジェクトであるため、クラスではなくインターフェースを使用してください。

<code-example
  path="http/src/app/config/config.service.ts"
  region="config-interface">
</code-example>

次に、そのインターフェースを`HttpClient.get()`呼び出しの型パラメーターとして指定してください。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_2"
  header="app/config/config.service.ts (getConfig v.2)">
</code-example>

<div class="alert is-helpful">

 インターフェースを型パラメーターとして`HttpClient.get()`メソッドに渡す際、[RxJSの`map`オペレーター](guide/rx-library#operators)を使用してUIで必要とされる形式にレスポンスデータを変換することができます。そして、変換されたデータを[asyncパイプ](api/common/AsyncPipe)に渡すことができます。

</div>

更新されたコンポーネントメソッドのコールバックは、型付けされたデータオブジェクトを受け取ります。
これは使用がより簡単で安全です。

<code-example
  path="http/src/app/config/config.component.ts"
  region="v2"
  header="app/config/config.component.ts (showConfig v.2)">
</code-example>

インターフェースで定義されているプロパティにアクセスするには、JSONから取得したプレーンオブジェクトを必要なレスポンスの型に明示的に変換する必要があります。
たとえば、次の`subscribe`のコールバックは、`data`をObjectとして受け取り、プロパティにアクセスするためにそれを型キャストします。

<code-example format="typescript" language="typescript">
   .subscribe(data => this.config = {
     heroesUrl: (data as any).heroesUrl,
     textfile:  (data as any).textfile,
   });
</code-example>

{@a string-union-types}

<div class="callout is-important">
<header>*observe*と*response*の型</header>

`observe`オプションと`response`オプションの型は、単なるstringではなく*string unions*です。

```
options: {
    ...
    observe?: 'body' | 'events' | 'response',
    ...
    responseType?: 'arraybuffer'|'blob'|'json'|'text',
    ...
  }
```
これは混乱を引き起こす可能性があります。たとえば、

```typescript
// これは動作する
client.get('/foo', {responseType: 'text'})

// これは動作しない
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

### レスポンス全体の読み取り

前の例で、`HttpClient.get()`の呼び出しでは何のオプションも指定していませんでした。デフォルトでは、レスポンスボディに含まれているJSONデータを返しました。

レスポンスボディに含まれているよりも多くのトランザクションに関する情報が必要になる場合があります。サーバーは、アプリケーションワークフローにとって重要な特定の状態を表すために、特別なヘッダーまたはステータスコードを返す場合があります。

`get()`メソッドの`observe`オプションにより、レスポンス全体が必要であることを`HttpClient`に伝えます。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfigResponse">
</code-example>

これで、`HttpClient.get()`は、ボディに含まれるJSONデータだけでなく、 `HttpResponse`型の`Observable`を返します。

コンポーネントの`showConfigResponse()`メソッドは、レスポンスヘッダーと設定値を表示します。

<code-example
  path="http/src/app/config/config.component.ts"
  region="showConfigResponse"
  header="app/config/config.component.ts (showConfigResponse)"
 >
</code-example>

見てのとおり、レスポンスオブジェクトは正しい型の`body`プロパティを持っています。

### JSONPリクエストの作成

サーバーが[CORSプロトコル](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)をサポートしていない場合、アプリケーションは`HttpClient`を使用してドメインをまたいで[JSONP](https://ja.wikipedia.org/wiki/JSONP)リクエストを実行できます。

AngularのJSONPリクエストは`Observable`を返します。
Observableを購読するためのパターンに従い、[asyncパイプ](api/common/AsyncPipe)を使用して結果を処理する前に、RxJSの`map`オペレーターを使用してレスポンスを変換します。

Angularでは、`NgModule`のインポートに`HttpClientJsonpModule`を含めることで、JSONPを使用します。
次の例では、`searchHeroes()`メソッドはJSONPリクエストを使用して、名前に検索語が含まれているヒーローをクエリします。

<code-example format="typescript" language="typescript">

/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable {
  term = term.trim();

  const heroesURL = `&dollar;{this.heroesURL}?&dollar;{term}`;
  return this.http.jsonp(heroesUrl, 'callback').pipe(
      catchError(this.handleError('searchHeroes', [])) // then handle the error
    );
}

</code-example>

このリクエストは、1つ目の引数として`heroesURL`を渡し、2つ目の引数としてコールバック関数名を渡します。
レスポンスはコールバック関数でラップされます。そのコールバック関数は、JSONPメソッドによって返されたObservableを受け取って、パイプでエラーハンドラーに通します。

### JSON以外のデータをリクエストする

すべてのAPIがJSONデータを返すわけではありません。
この次の例では、`DownloaderService`のメソッドがサーバーからテキストファイルを読み取り、ファイルの内容をログに記録してから、それらの内容を` Observable<string>`として呼び出し元に返します。

<code-example
  path="http/src/app/downloader/downloader.service.ts"
  region="getTextFile"
  header="app/downloader/downloader.service.ts (getTextFile)" linenums="false">
</code-example>

`HttpClient.get()`は`responseType`オプションがあるため、デフォルトのJSONではなく文字列を返します。

RxJSの `tap` オペレーターにより、Obervableを通過する正常値とエラー値の双方を、コードがそれらを妨害することなく検査できます。

`DownloaderComponent`の`download()`メソッドは、サービスのメソッドを購読することでリクエストを開始します。

<code-example
  path="http/src/app/downloader/downloader.component.ts"
  region="download"
  header="app/downloader/downloader.component.ts (download)" linenums="false">
</code-example>

{@a error-handling}

## リクエストエラーの処理

サーバーでリクエストが失敗した場合、`HttpClient`は成功したレスポンスの代わりに_error_オブジェクトを返します。

サーバートランザクションを実行するのと同じサービスが、エラーの検査、解釈、および解決も実行する必要があります。

エラーが発生した場合、ユーザーに通知するために失敗した内容の詳細を取得できます。場合によっては、自動的に[リクエストの再試行](#retry)も可能です。

{@a error-details}
### エラーの詳細を取得する

アプリケーションは、データアクセスが失敗したときに、ユーザーに役立つフィードバックを提供する必要があります。
生のエラーオブジェクトは、フィードバックとして特に役立ちません。
エラーが発生したことを検出することに加えて、エラーの詳細を取得し、それらの詳細を使用してユーザーフレンドリーなレスポンスを作成する必要があります。

2種類のエラーが発生する可能性があります。

* サーバーバックエンドがリクエストを拒否し、404や500などのステータスコードでHTTPレスポンスを返す場合があります。これらはエラー_レスポンス_です。

* 要求を正常に完了できないネットワークエラーや、RxJSオペレーター内でスローされた例外など、クライアント側で問題が発生する可能性があります。これらのエラーは`0`に設定された`status`と、`ProgressEvent`オブジェクトが含まれる`error`プロパティを持っています。`ProgressEvent`オブジェクトの`type`は詳細な情報を提供する可能性があります。

`HttpClient`は、`HttpErrorResponse`で両方の種類のエラーをキャプチャします。そのレスポンスを調べて、エラーの原因を特定できます。

次の例では、以前に定義された[ConfigService](#config-service "ConfigService defined")の中でエラーハンドラーを定義します。

<code-example
  path="http/src/app/config/config.service.ts"
  region="handleError"
  header="app/config/config.service.ts (handleError)">
</code-example>

ハンドラーは、ユーザーフレンドリーなエラーメッセージとともにRxJS`ErrorObservable`を返します。
次のコードでは、[パイプ](guide/pipes "Pipes guide")を使用し`HttpClient.get()`呼び出しによって返されたすべてのObservableをエラーハンドラーに送信するように、`getConfig()`メソッドが更新されています。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_3"
  header="app/config/config.service.ts (getConfig v.3 with error handler)">
</code-example>

{@a retry}
### 失敗したリクエストの再試行

エラーは一時的なものであり、再試行すると自動的に消える場合があります。
たとえば、ネットワークの中断はモバイルシナリオで一般的であり、再試行すると
成功する可能性があります。

[RxJSライブラリ](guide/rx-library)はいくつかの_再試行_オペレーターを提供しています。
たとえば、`retry()`オペレーターは、失敗した`Observable`を指定された回数だけ自動的に再サブスクライブします。`HttpClient`メソッド呼び出しの結果を_再サブスクライブ_すると、HTTPリクエストを再発行する効果があります。

次の例は、失敗したリクエストをエラーハンドラーに渡す前に、`retry()`オペレーターにパイプする方法を示しています。

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig"
  header="app/config/config.service.ts (getConfig with retry)">
</code-example>


## サーバーへのデータの送信

サーバーからデータを取得することに加えて、`HttpClient`はPUT、POST、DELETEなどの他のHTTPメソッドをサポートしています。これらは遠隔のデータを変更するために使用できます。

このガイドのサンプルアプリケーションには、
ヒーローを取得し、ユーザーがヒーローを追加、削除、更新できる「Tour of Heroes」の例の簡略版が含まれています。
次のセクションでは、サンプルの`HeroesService`からのデータ更新メソッドの例を示します。

### POSTリクエストの作成

多くの場合、アプリケーションはフォームを送信するときにPOSTリクエストを使用してサーバーにデータを送信します。
次の例では、データベースにヒーローを追加するときに、`HeroesService`がHTTP POSTリクエストを実行します。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="addHero"
  header="app/heroes/heroes.service.ts (addHero)">
</code-example>

`HttpClient.post()`メソッドは、型パラメータがあり、サーバーが特定の型のデータを返すことを期待するのを明示できるという点で、`get()`に似ています。このメソッドは、リソースURLと2つの追加パラメーターを取ります。

* *body* - POSTするリクエストのボディ内のデータ
* *options* - メソッドオプションを含むオブジェクト。この場合のオプションは、[必要なヘッダーを指定してします](#adding-headers)。

この例では、[前述](#error-details)のようにエラーを捕捉します。

`HeroesComponent`がこのサービスのメソッドが返す`Observable`を購読することによって、
実際のPOST処理が開始します。

<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="add-hero-subscribe"
  header="app/heroes/heroes.component.ts (addHero)">
</code-example>

サーバーが新しく追加されたヒーローを正常に返すと、
コンポーネントはそのヒーローを画面に表示されている`heroes`リストに追加します。

### DELETEリクエストの作成

このアプリケーションは、リクエストURLにヒーローのIDを渡すことによって、
`HttpClient.delete`メソッドを使用してヒーローを削除します。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="deleteHero"
  header="app/heroes/heroes.service.ts (deleteHero)">
</code-example>

`HeroesComponent`がこのサービスのメソッドが返す`Observable`を購読することによって、
実際のDELETE処理が開始します。

<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="delete-hero-subscribe"
  header="app/heroes/heroes.component.ts (deleteHero)">
</code-example>

コンポーネントは削除処理の結果を要求していないため、コールバックなしで購読します。結果を使用していなくても、購読する必要があります。`subscribe()`メソッドを呼び出すと、Observableが_実行_され、DELETEリクエストが開始します。

<div class="alert is-important">

_subscribe()_を呼び出さなければ何も起こりません。`HeroesService.deleteHero()`を呼び出すだけでは、DELETEリクエストは開始されません。

</div>


<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="delete-hero-no-subscribe">
</code-example>

### PUTリクエストの作成

アプリケーションは、HTTPクライアントサービスを使用してPUTリクエストを送信できます。
次の`HeroesService`の例は、POSTの例と同様に、リソースを更新されたデータに置き換えます。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="updateHero"
  header="app/heroes/heroes.service.ts (updateHero)">
</code-example>

Observableを返すHTTPメソッドについていえば、呼び出し元の`HeroesComponent.update()`はリクエストを開始するため、`HttpClient.put()`から返されたObservableを[`subscribe()`する必要があります。](#always-subscribe "Why you must always subscribe.")

### ヘッダーの追加と更新

多くのサーバーでは、保存操作のために追加のヘッダーが必要です。
たとえば、サーバーは認可トークンや、リクエスト本文のMIMEタイプを明示的に宣言するために「Content-Type」ヘッダーを必要とする場合があります。

##### ヘッダーの追加 {@a adding-headers}

`HeroesService`は、`HttpClient`の保存メソッドすべてに渡される`httpOptions`オブジェクトで、
そのようなヘッダーを定義しています。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="http-options"
  header="app/heroes/heroes.service.ts (httpOptions)">
</code-example>

##### ヘッダーの更新

`HttpHeaders`クラスのインスタンスはイミュータブルなので、
前述のoptionsオブジェクト内の既存のヘッダーを直接変更することはできません。
代わりに`set()`メソッドを使用して、新しい変更が適用された現在のインスタンスのクローンを返します。

次の例は、古いトークンの有効期限が切れたときに、次のリクエストを行う前に認可ヘッダーを更新する方法を示しています。

<code-example
  path="http/src/app/heroes/heroes.service.ts"
   region="update-headers" linenums="false">
</code-example>

{@a url-params}

## HTTP URLパラメーターの設定

URLクエリ文字列を`HttpRequest`に追加するには、`params`リクエストオプションに`HttpParams`クラスを使用します。

次の例では、`searchHeroes()`メソッドは、名前に検索語が含まれているヒーローをクエリします。

`HttpParams`クラスのインポートから始めます。

<code-example hideCopy language="typescript">
import {HttpParams} from "@angular/common/http";
</code-example>

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="searchHeroes" linenums="false">
</code-example>

検索語がある場合、コードはHTML URLエンコードされた検索パラメーターをもつoptionsオブジェクトを作成します。
たとえば検索語が「cat」の場合、GETリクエストのURLは`api/heroes?name=cat`になります。

`HttpParams`オブジェクトはイミュータブルです。optionsを更新する必要がある場合、`.set()`メソッドの戻り値を保存してください。

`fromString`変数を使用して、クエリ文字列から直接HTTPパラメータを作成することもできます。

<code-example hideCopy language="typescript">
const params = new HttpParams({fromString: 'name=foo'});
</code-example>


{@a intercepting-requests-and-responses}
## リクエストとレスポンスのインターセプト

インターセプトのために、アプリケーションからサーバーへのHTTPリクエストを検査して変換する_インターセプター_を宣言します。
同じインターセプターが、アプリケーションに返ってくるサーバーのレスポンスを検査および変換することもできます。
複数のインターセプターが、リクエスト/レスポンスハンドラーの_前後の_チェーンを形成します。

インターセプターは、すべてのHTTPリクエスト/レスポンスに対して、認証からロギングまで、さまざまな_暗黙の_タスクを型どおりの、標準的な方法で実行できます。

インターセプト無しでは、開発者は
各`HttpClient`メソッド呼び出しに対してこれらのタスクを_明示的に_実装する必要があります。

### インターセプターを書く

インターセプターを実装するには、`HttpInterceptor`インターフェースの`intercept()`メソッドを実装するクラスを宣言します。

ここには、リクエストに触れずに渡すことだけする、_noop_インターセプターがあります。

<code-example
  path="http/src/app/http-interceptors/noop-interceptor.ts"
  header="app/http-interceptors/noop-interceptor.ts">
</code-example>

`intercept`メソッドは、リクエストを最終的にHTTPレスポンスを返す`Observable`に変換します。
こういう意味では、各インターセプターは完全に単独でリクエストを処理することができます。

ほとんどのインターセプターは、途中でリクエストを検査し、[`HttpHandler`](api/common/http/HttpHandler)インターフェースを実装する`next`オブジェクトの`handle()`メソッドに変更された可能性のあるリクエストを転送します。

```javascript
export abstract class HttpHandler {
  abstract handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}
```

`intercept()`と同様に、`handle()`メソッドは、HTTPリクエストを最終的にサーバーのレスポンスを含む[`HttpEvents`](#interceptor-events)の`Observable`に変換します。`intercept()`メソッドは、そのObservableを検査し、呼び出し元に返す前に変更することができます。

この_何もしない_インターセプターは、元のリクエストを渡して`next.handle()`を呼び出し、何もせずにObservableを返します。

### _next_オブジェクト

`next`オブジェクトは、インターセプターのチェーン内の次のインターセプターを表します。
チェーンの最後の`next`は、リクエストをサーバーに送信し、サーバーのレスポンスを受け取る`HttpClient`バックエンドハンドラーです。


ほとんどのインターセプターは、`next.handle()`を呼び出して、リクエストが次のインターセプター、そして最終的にはバックエンドハンドラーに流れるようにします。
インターセプターは、`next.handle()`の呼び出しをスキップしチェーンを近道して、人工のサーバーレスポンスで[自身の`Observable`を返す](#caching)こともできます。

これは、Express.jsなどのフレームワークでよく見られるミドルウェアパターンです。

### インターセプターを提供する

`NoopInterceptor`は、Angularの[依存性の注入（DI）](guide/dependency-injection)システムによって管理されるサービスです。
他のサービスと同様に、アプリケーションが使用する前にインターセプタークラスを提供する必要があります。

インターセプターは`HttpClient`サービスの依存オブジェクトであるため、
`HttpClient`を提供しているのと同じインジェクター、または親インジェクターにそれらを提供する必要があります。
DIが`HttpClient`を作成した_後に_提供されるインターセプターは無視されます。

このアプリケーションは、`AppModule`で`HttpClientModule`をインポートする副作用として、アプリケーションのルートインジェクターに`HttpClient`を提供しています。
同様にインターセプターは`AppModule`の中で提供すべきです。

`@angular/common/http`から`HTTP_INTERCEPTORS`インジェクショントークンをインポートした後、
次のように`NoopInterceptor`プロバイダーを記述します。

<code-example
  path="http/src/app/http-interceptors/index.ts"
  region="noop-provider">
</code-example>

`multi：true`オプションに注意してください。
この必須設定は、Angularに`HTTP_INTERCEPTORS`は
単一の値ではなく値の配列を注入する_マルチプロバイダー_のトークンであることを伝えます。

このプロバイダーを `AppModule`のproviders配列に直接追加することができます。
ただし、それはむしろ冗長であり、
より多くのインターセプターを作成し、同じ方法でそれらを提供するよい方法があります。
また、これらのインターセプターを提供する
[順序に細心の注意](#interceptor-order)を払う必要があります。

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

新しいインターセプターを作成するとき、それらを`httpInterceptorProviders`配列に追加するだけです。
`AppModule`を開く必要はありません。

<div class="alert is-helpful">

完全なサンプルコードには、より多くのインターセプターがあります。

</div>

### インターセプターの順番 {@a interceptor-order}

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
ただし、一部のインターセプターは、`next.handle()`からのレスポンスを検査して変更する必要があります。これらの操作は、ストリーム内のこれらのイベントのすべてを確認できます。

{@a immutability}

インターセプターはリクエストとレスポンスを変更できますが、
`HttpRequest`と`HttpResponse`インスタンスのプロパティは`readonly`であり、
ほとんどイミュータブルになります。
これらは正当な理由でイミュータブルです。アプリケーションはリクエストが成功する前に数回再試行する場合がある、すなわち、インターセプターチェーンが同じリクエストを複数回再処理する可能性があるためです。
インターセプターが元のリクエストオブジェクトを変更できる場合、再試行された操作は、元のリクエストではなく、変更されたリクエストから開始します。イミュータビリティは、インターセプターが試行ごとに同じ要求を確認することを保証します。

<div class="alert is-helpful">

   インターセプターは、やむを得ない理由がない限り、すべてのイベントを変更せず返す必要があります。

</div>

TypeScriptが、`HttpRequest`の読み取り専用プロパティを設定できないようにしています。

```javascript
  // req.urlがreadonlyであるため、Typescriptは次の代入を許可しない
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

`readonly`の代入ガードは、深い更新を防ぐことはできません。特に、
リクエストボディオブジェクトのプロパティを変更することを防ぐことはできません。

```javascript
  req.body.name = req.body.name.trim(); // 良くないアイディア！
```

リクエストボディを変更する必要がある場合は、次の手順にしたがってください。

1. ボディをコピーして、コピーに変更を加えます。
2. `clone()`メソッドを使用して、リクエストオブジェクトのクローンを作成します。
3. クローンのボディを変更されたコピーに置き換えます。

<code-example
  path="http/src/app/http-interceptors/trim-name-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/trim-name-interceptor.ts (excerpt)">
</code-example>

#### クローンのリクエストボディを消去する

リクエストボディを置き換えるのではなく、消去する必要がある場合があります。
これを行うには、複製されたリクエストボディを `null`に設定します。

<div class="alert is-helpful">

**Tip**: 複製されたリクエストボディを`undefined`に設定すると、Angularはボディをそのままにしておくつもりであると想定します。

</div>

```javascript
  newReq = req.clone({ ... }); // ボディは記載されていない => 元々のボディを保持する
  newReq = req.clone({ body: undefined }); // 元々のボディを保持する
  newReq = req.clone({ body: null }); // ボディを消去する
```

## Httpインターセプターのユースケース

以下は、インターセプターのよくある使用法です。

### デフォルトのヘッダーをセットする

アプリケーションでは、インターセプターを使用して外部へのリクエストにデフォルトのヘッダーを設定することがよくあります。

サンプルアプリケーションには、認可トークンを生成する`AuthService`があります。
これは、トークンを取得するサービスを注入し、
トークンをすべての外部へのリクエストの認可ヘッダーに追加する、`AuthInterceptor`です。

<code-example
  path="http/src/app/http-interceptors/auth-interceptor.ts"
  header="app/http-interceptors/auth-interceptor.ts">
</code-example>

新しいヘッダーを設定するため、リクエストのクローンを作成するというプラクティスは非常によくあるため、
`setHeaders`ショートカットがあります。

<code-example
  path="http/src/app/http-interceptors/auth-interceptor.ts"
  region="set-header-shortcut">
</code-example>

ヘッダーを変更するインターセプターは、次のようなさまざまな操作に使用できます。

* 認証/認可
* キャッシュ動作。たとえば、`If-Modified-Since`
* XSRF保護

### リクエストとレスポンスのペアをロギングする

インターセプターはリクエストとレスポンスを_一緒に_処理できるため、HTTPオペレーション全体について時間の計測やログの記録ができます。

次の`LoggingInterceptor`を考えてみましょう。
これは、リクエストの時間とレスポンスの時間を取得し、
注入された`MessageService`で経過時間とともに結果を記録します。

<code-example
  path="http/src/app/http-interceptors/logging-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/logging-interceptor.ts)">
</code-example>

RxJSの`tap`オペレーターは、リクエストが成功したか失敗したかを取得します。
RxJSの`finalize`オペレーターは、レスポンスのObservableがエラーとなったか、完了したときに呼ばれ、その結果を`MessageService`に報告します。

`tap`も`finalize`も、呼び出し元に返されるObservableのストリームの値には影響を及ぼしません。

{@a custom-json-parser}

### カスタムJSONパース処理

インターセプターを使用して、組み込みのJSONパース処理をカスタム実装に置き換えることができます。

次の例の`CustomJsonInterceptor`は、これを実現する方法を示しています。
インターセプトされたリクエストが`'json'`レスポンスを期待している場合、組み込みのJSONパース処理を無効化するため、`responseType`は`'text'`に変更されます。
次に、注入された`JsonParser`を介してレスポンスがパースされます。

<code-example
  path="http/src/app/http-interceptors/custom-json-interceptor.ts"
  region="custom-json-interceptor"
  header="app/http-interceptors/custom-json-interceptor.ts">
</code-example>

独自のカスタム`JsonParser`を実装できます。
これは、特別なdate reviverをもつカスタムJsonParserです。

<code-example
  path="http/src/app/http-interceptors/custom-json-interceptor.ts"
  region="custom-json-parser"
  header="app/http-interceptors/custom-json-interceptor.ts">
</code-example>

`CustomJsonInterceptor`とともに、`CustomParser`を提供します。

<code-example
  path="http/src/app/http-interceptors/index.ts"
  region="custom-json-interceptor"
  header="app/http-interceptors/index.ts">
</code-example>


{@a caching}
### リクエストをキャッシュする

インターセプターは`next.handle()`に転送せずに、自分でリクエストを処理できます。

たとえば、パフォーマンスを向上させるために、特定のリクエストとレスポンスをキャッシュすると決めることがあるかもしれません。
既存のデータサービスを妨げることなく、インターセプターにキャッシュを移譲できます。

次の例の`CachingInterceptor`はこのアプローチを示しています。

<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="v1"
  header="app/http-interceptors/caching-interceptor.ts)">
</code-example>

* `isCachable()`関数はリクエストがキャッシュ可能かどうかを決定します。
このサンプルでは、npmパッケージの検索APIに対するGETリクエストのみがキャッシュ可能です。

* リクエストがキャッシュ可能でない場合、インターセプターはリクエストを
チェーン内の次のハンドラーに転送します。

* キャッシング可能なリクエストがキャッシュ内に見つかった場合、インターセプターは
キャッシュされたレスポンスを`of()`_Observable_で返し、`next`ハンドラーおよび他のすべての下流のインターセプターをバイパスします。

* キャッシュ可能なリクエストがキャッシュにない場合、コードは`sendRequest()`を呼び出します。
この関数はリクエストのクローンを`next.handle()`に転送し、最終的にサーバーを呼び出してサーバーのレスポンスを返します。

{@a send-request}
<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="send-request">
</code-example>

<div class="alert is-helpful">

`sendRequest()`がアプリケーションに返ってくる途中の_レスポンスをインターセプトする_方法に注意してください。
`tap()`オペレーターによりレスポンスを_パイプ_して、そのコールバックでレスポンスをキャッシュに追加します。

元のレスポンスは、インターセプターのチェーンを通って
アプリケーション呼び出し元にオリジナルの状態で戻ります。

`PackageSearchService`のようなデータサービスは、
`HttpClient`リクエストのいくつかは実際にはキャッシュされたレスポンスを返すものがあることを知りません。

</div>

<a id="cache-refresh"></a>

### インターセプターを使用して複数の値を要求する

`HttpClient.get()`メソッドは通常、データまたはエラーのいずれかの単一の値を発行するObservableを返します。
インターセプターはこれを、[複数の値](guide/observables)を発行するObservableに変更できます。

次の修正された`CachingInterceptor`は、任意でObservableを返します。
このObservableは、キャッシュされたレスポンスをすぐに発行し、リクエストをパッケージ検索APIに送信し、
後で最新の検索結果を再度発行します。

<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="intercept-refresh">
</code-example>

<div class="alert is-helpful">

_cache-then-refresh_オプションは、カスタムの`x-refresh`ヘッダーが存在するとトリガーされます。

`PackageSearchComponent`のチェックボックスは、`withRefresh`フラグを切り替えます。
これは`PackageSearchService.search()`の引数の1つです。
`search()`メソッドはカスタムの`x-refresh`ヘッダーを作成し、
`HttpClient.get()`を呼び出す前にそれをリクエストに追加します。

</div>

修正された`CachingInterceptor`は、[上記](#send-request)で説明したのと同じ`sendRequest()`メソッドを使用して、
キャッシュされた値があるかどうかに関係なく、
サーバーリクエストを設定します。
`results$`Observableは、サブスクライブ時にリクエストを行います。

* キャッシュされた値がない場合、インターセプターは`results$`を返します。
*   If there is a cached value, the code *pipes* the cached response onto `results$`. This produces a recomposed observable that emits two responses, so subscribers will see a sequence of these two responses:  
  *   The cached response that's emitted immediately
  *   The response from the server, that's emitted later

{@a report-progress}

## リクエストの進行状況の追跡と表示

アプリケーションが大量のデータを転送し、それらの転送に長い時間がかかる場合があります。
ファイルのアップロードは典型的な例です。
そのような転送の進行状況に関するフィードバックを提供することにより、ユーザーによりよい体験を提供します。

プログレスイベントを有効にしてリクエストを行うには、
`reportProgress`オプションをtrueに設定して`HttpRequest`のインスタンスを作成し、プログレスイベントを追跡できるようにします。

<code-example
  path="http/src/app/uploader/uploader.service.ts"
  region="upload-request"
  header="app/uploader/uploader.service.ts (upload request)">
</code-example>

<div class="alert is-important">

**Tip**: すべてのプログレスイベントは変更検知をトリガーします。したがって、UIで進捗状況を本当に報告する必要がある場合にのみ、それらを有効にしてください。

[`HttpClient.request()`](api/common/http/HttpClient#request)でHTTPメソッドを使うときには、
[`observe: 'events'`](api/common/http/HttpClient#request)で転送の進行を含むすべてのイベントを見るように設定してください。

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
`app/http-interceptors/upload-interceptor.ts`の`UploadInterceptor`は、
アップロードリクエストをインターセプトしてショートサーキットし、
シミュレートされたイベントのObservableを返します。

</div>

## デバウンスによるサーバーとのやりとりの最適化

ユーザー入力に応じてHTTPリクエストを行う必要がある場合、キーストロークごとにリクエストを送信するのは効率的ではありません。
ユーザーが入力をやめるのを待ってからリクエストを送信する方がよいでしょう。
この手法はデバウンスとして知られています。

次のテンプレートについて考えてみます。このテンプレートでは、ユーザーが検索語を入力して、名前からパッケージを見つけることができます。
ユーザーが検索ボックスに名前を入力すると、`PackageSearchComponent`は
その名前のパッケージの検索リクエストをパッケージ検索APIに送信します。

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
これは、RxJSの`Subject`として定義されています。
`Subject`は、`search()`メソッドで行っているように、`next(value)`を呼び出すことによって、
自身に対して値を発行できるマルチキャスト`Observable`です。

すべての`searchText`値を注入された`PackageSearchService`に直接転送するのではなく、
`ngOnInit()`のコードは、検索値を3つのオペレーターにパイプしています。これにより、検索値が新しい値でかつユーザーが入力を停止した場合にのみ、検索値がサービスに到達します。

* `debounceTime(500)`⁠—ユーザーが入力を停止するのを待ちます（この場合は1/2秒）。

* `distinctUntilChanged()`⁠—検索テキストが変わるまで待ちます。

* `switchMap()`⁠—検索リクエストをサービスに送信します。

このコードは、この再構成された検索結果の`Observable`に`packages$`を設定します。
テンプレートは、[AsyncPipe](api/common/AsyncPipe)を使用して`packages$`をサブスクライブし、
検索結果が届いた際に表示します。

<div class="alert is-helpful">

`withRefresh`オプションの詳細については、[インターセプターを使用して複数の値を要求する](#cache-refresh)を参照してください。

</div>

### *switchMap()*オペレーターの使用

The `switchMap()`オペレーターは、`Observable`を返す関数を引数に取ります。
たとえば、`PackageSearchService.search`は他のデータサービスメソッドと同様に`Observable`を返します。
以前の検索リクエストがまだ実行中である場合（接続が悪い場合など）、
オペレーターはリクエストをキャンセルして新しいリクエストを送信します。

サービスのレスポンスをサーバーが順不同で返したとしても、
`switchMap()`は、元のリクエストの順序で返すことに注意してください。


<div class="alert is-helpful">

このデバウンスロジックを再利用しようと考えるなら、
ユーティリティ関数または `PackageSearchService`自体に移動することを検討してください。

</div>


## セキュリティ：XSRF保護 {@a security-xsrf-protection}

[Cross-Site Request Forgery (XSRF or CSRF)](https://en.wikipedia.org/wiki/Cross-site_request_forgery)は、攻撃者が認証されたユーザーにそうとは知らずにあなたのWebサイト上のアクションを実行させる攻撃手法です。
`HttpClient`は、XSRF攻撃を防ぐための[共通メカニズム](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-Header_Token)をサポートしています。
HTTPリクエストを実行するとき、インターセプターはクッキーからトークンを読み取り（デフォルトでは「XSRF-TOKEN」）、それをHTTPヘッダの`X-XSRF-TOKEN`として設定します。
ドメインで実行されているコードのみがクッキーを読み取ることができるため、バックエンドはHTTPリクエストが攻撃者ではなくクライアントアプリケーションから送信されたことを確認できます。

デフォルトでは、インターセプターは相対URLへのすべての変更リクエスト（POSTなど）に対してこのヘッダーを送信しますが、
GET/HEADリクエストや絶対URLには送りません。

これを利用するには、サーバーがページ読み込みまたは最初のGETリクエストのいずれかで、`XSRF-TOKEN`というJavaScriptで読み取れるセッションクッキーにトークンを設定する必要があります。
その後のリクエストで、サーバーはクッキーが`X-XSRF-TOKEN`HTTPヘッダーと一致することを検証でき、よって、ドメイン上で実行されているコードだけがリクエストを送信可能だと保証できます。
トークンは、各ユーザーごとに一意でなければならず、サーバーによって検証可能でなければなりません。これにより、クライアントは独自のトークンを作成することができなくなります。
セキュリティを強化するために、ソルトをつけたサイトの認証クッキーのダイジェストをトークンに設定します。

複数のAngularアプリケーションが同じドメインまたはサブドメインを共有する環境での衝突を防ぐために、各アプリケーションに固有のクッキー名を付けましょう。

<div class="alert is-important">

*`HttpClient`は、XSRFプロテクションのスキームの半分であるクライアント側をサポートするのみです。*
バックエンドサービスは、ページのクッキーを設定し、
該当するすべてのリクエストにヘッダーが存在することを検証するように構成する必要があります。
そうでない場合、Angularのデフォルトの保護は効果がありません。

</div>

### カスタムのクッキー/ヘッダーの名前を設定する

バックエンドサービスがXSRFトークンのクッキーまたはヘッダーに異なる名前を使っている場合、
`HttpClientXsrfModule.withOptions()`を使用してデフォルト設定を上書きします。

<code-example
  path="http/src/app/app.module.ts"
  region="xsrf">
</code-example>

{@a testing-requests}
## HTTPリクエストをテストする {@a testing-http-requests}

外部依存と同様に、テストがリモートサーバーとのやりとりをシミュレートできるようにするには、HTTPバックエンドをモックする必要があります。
`@angular/common/http/testing`ライブラリでは、そのようなモッキングを簡単に設定できます。

AngularのHTTPテスティングライブラリは、アプリケーションがコードを実行して最初にリクエストを行うテストパターンに向けて設計されています。
テストは特定のリクエストが作成されたかどうかを期待し、
リクエストに対してアサーションを実行し、
最終的に期待された各リクエストを「フラッシュ」することによってレスポンスを提供します。

最後に、期待しないリクエストをしていないことを確認できます。

<div class="alert is-helpful">

ライブコーディング環境で
<live-example stackblitz="specs">これらのサンプルテスト</live-example>を実行できます。

このガイドで説明されているテストは、`src/testing/http-client.spec.ts`にあります。
`src/app/heroes/heroes.service.spec.ts`に
`HttpClient`を呼び出すアプリケーションデータサービスのテストもあります。

</div>

### テストのセットアップ

`HttpClient`への呼び出しをテストするには、
`HttpClientTestingModule`とモックコントローラ`HttpTestingController`を、
テストに必要な他のシンボルと共にインポートしてください。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="imports"
  header="app/testing/http-client.spec.ts (imports)">
</code-example>

次に`HttpClientTestingModule`を`TestBed`に追加し、
_テスト環境下のサービス_の設定を続けます。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="setup"
  header="app/testing/http-client.spec.ts(setup)">
</code-example>

これで、テストの過程で行われたリクエストは、通常のバックエンドの代わりにテストバックエンドにヒットします。

この設定では`TestBed.inject()`を呼び出して`HttpClient`サービスとモックコントローラを注入し、
テスト中に参照できるようにします。

### リクエストの期待と応答

これで、GETリクエストの発生を期待し、モックレスポンスを提供するテストを作成できます。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="get-test"
  header="app/testing/http-client.spec.ts (HttpClient.get)">
</code-example>

最後に残ったステップは、未解決のリクエストが残っていないことを確認することです。これは、`afterEach()`ステップに移動して行うことが一般的です。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="afterEach">
</code-example>

#### カスタムリクエストの期待

URLによる照合では不十分な場合は、独自の照合機能を実装することができます。
たとえば、認可ヘッダーをもつ外部へのリクエストを検索できます。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="predicate">
</code-example>

以前の`expectOne()`と同様に、
0または2以上のリクエストがこの条件を満たしていれば、テストは失敗します。

#### 複数のリクエストの処理

テストで重複したリクエストに応答する必要がある場合は、`expectOne()`の代わりに`match()`APIを使用してください。
同じ引数をとりますが、一致するリクエストの配列を返します。
これらのリクエストは一度返されると、その後の照合から削除され、
それらをフラッシュして検証する必要があります。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="multi-request">
</code-example>

### エラーのテスト

失敗したHTTPリクエストに対するアプリケーションの防御をテストするべきです。

次の例に示すように、エラーメッセージと共に`request.flush()`を呼び出します。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="404">
</code-example>

あるいは、`ProgressEvent`と共に`request.error()`を呼び出すこともできます。

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="network-error">
</code-example>


## メタデータをインターセプターに渡す

多くのインターセプターは、設定を必要とするか、設定から恩恵を受けます。失敗したリクエストを再試行するインターセプターについて考えてみます。
デフォルトでは、インターセプターはリクエストを3回再試行してよいですが、特にエラーが発生しやすいリクエストや機密性の高いリクエストの場合は、この再試行回数を上書きしたくなるでしょう。

`HttpClient`リクエストには、リクエストに関するメタデータを運ぶことができる_コンテキスト_が含まれています。
このコンテキストは、インターセプターが読み取りまたは変更するために使用できますが、リクエスト送信時にバックエンドサーバーには送信されません。
これにより、アプリケーションまたは他のインターセプターは、リクエストに対しリクエストを再試行する回数などの設定パラメーターを付加できます。

### コンテキストトークンの作成

Angularは、`HttpContextToken`を使用してコンテキスト内への値の格納とコンテキストからの値の取得を行います。
次の例のように、`new`オペレーターを使用してコンテキストトークンを作成できます。

<code-example path="http/src/app/http-interceptors/retry-interceptor.ts" region="context-token" header="creating a context token"></code-example>

`HttpContextToken`の作成中に渡されるラムダ関数`() => 3`は2つの目的を果たします。

1. このトークンの型を、`HttpContextToken<number>`とTypeScriptが推論できるようにします。
  リクエストコンテキストは型安全です。&mdash;リクエストのコンテキストからトークンを読み取ると、適切な型の値が返されます。

1. トークンのデフォルト値を設定します。
  これは、このトークンに他の値が設定されていない場合にリクエストコンテキストが返す値です。
  デフォルト値を使用すると、個々の値が設定されているかどうかを確認する必要がなくなります。

### リクエスト作成時にコンテキスト値を設定する

リクエストを作成するときに、`HttpContext`インスタンスを提供できます。これにはコンテキスト値を設定済みです。

<code-example path="http/src/app/http-interceptors/retry-interceptor.ts" region="set-context" header="setting context values"></code-example>

### インターセプターでのコンテキスト値の読み取り

インターセプター内では、`HttpContext.get()`を使用して、与えられたリクエストのコンテキストでトークンの値を読み取ることができます。
トークンの値を明示的に設定していない場合、Angularはトークンに指定されたデフォルト値を返します。

<code-example path="http/src/app/http-interceptors/retry-interceptor.ts" region="reading-context" header="reading context values in an interceptor"></code-example>

### コンテキストはミュータブル

`HttpRequest`インスタンスの他の多くの性質とは異なり、リクエストコンテキストはミュータブルであり、リクエストの他のイミュータブルな変換にまたがって持続します。
これにより、インターセプターはコンテキストを介してオペレーターを協調して動作させることができます。
たとえば、`RetryInterceptor`の例では、2番目のコンテキストトークンを使用して、特定のリクエストの実行中に発生したエラーの数を追跡できます。

<code-example path="http/src/app/http-interceptors/retry-interceptor.ts" region="mutable-context" header="coordinating operations through the context"></code-example>
