# HttpClient

たいていのフロントエンドアプリケーションは、HTTPプロトコルを通してバックエンドサービスと通信します。モダンブラウザはHTTPリクエストを行うために2つのAPIをサポートします。`XMLHttpRequest` インターフェースと `fetch()` APIです。

`HttpClient` は、 `@angular/common/http` の中に含まれていて、Angularアプリケーションで使われるHTTPのためのシンプルなAPIです。ブラウザが公開している `XMLHttpRequest` インターフェースの上にAPIを築きます。
さらに `HttpClient` は、リクエストやレスポンスオブジェクトの強力な型付け、リクエストとレスポンスのインターセプター、そしてObservableに基づくAPIを通してエラーハンドリングすることで、テストを簡単にします。

## セットアップ: モジュールをインストールする

`HttpClient` を使うために、`HttpClientModule` をインストールします。インストールはアプリケーションモジュールで一度だけ必要です。

```javascript
// app.module.ts:

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

// @angular/common/http から HttpClientModule をインポートします。
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    // application moduleの 'imports' に含めます。
    // BrowserModuleの後に置きます。
    HttpClientModule,
  ],
})
export class MyAppModule {}
```

appモジュールに `HttpClientModule` をインポートすると、コンポーネントやサービスに `HttpClient` を注入できるようになります。

## JSONデータを要求する

アプリケーションはバックエンドへリクエストするケースではたいていJSONデータをリクエストします。たとえば、アイテムをリストするAPIエンドポイント `/api/items` では、次のようにフォームのJSONオブジェクトとして返却します。

```json
{
  "results": [
    "Item 1",
    "Item 2",
  ]
}
```

このデータに `HttpClient` の `get()` メソッドで簡単にアクセスします。


```javascript
@Component(...)
export class MyComponent implements OnInit {

  results: string[];

  // コンポーネントやサービスの中にHttpClientを注入します。
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // HTTPリクエストを作ります。
    this.http.get('/api/items').subscribe(data => {
      // JSONレスポンスからresultsプロパティを読みます。
      this.results = data['results'];
    });
  }
}
```


### レスポンスを型判定する

上記の例では、ブラケット記法を使って `data['results']` とアクセスしていることに注目しましょう。 `data.results` と書こうとしても、TypeScriptが HTTPから戻される `Object` に `results` プロパティが無いと正しくエラーを出すでしょう。 `HttpClient` がJSONレスポンスの `Object` をパースした時にどんなオブジェクトであるかわからないからです。

しかしながら、レスポンスがどんな型であるか `HttpClient` に教えることができます。そのために、まず次のように正しい型のインターフェースを定義します。

```javascript
interface ItemsResponse {
  results: string[];
}
```

次に、 `HttpClient.get` を呼ぶ時に型パラメータを渡します。

```javascript
http.get<ItemsResponse>('/api/items').subscribe(data => {
  // dataはItemsResponse型になっているので次のように書けます。
  this.results = data.results;
});
```

### 完全なレスポンスを読む

レスポンスボディは必要なすべてのデータを返しません。場合によっては、サーバーが特定の条件を示す特別なヘッダーやステータスコードを返すことがあり、それらを解析する必要があります。 `HttpClient` に ` observe` オプションをつければボディだけでなくレスポンス全体が読めるようになります。

```javascript
http
  .get<MyJsonData>('/data.json', {observe: 'response'})
  .subscribe(resp => {
    // ここでrespはHttpResponse<MyJsonData>型です。
    // ヘッダーを読めます。
    console.log(resp.headers.get('X-Custom-Header'));
    // ボディに直接アクセスすると、要求通りMyJsonData型です。
    console.log(resp.body.someField);
  });
```

ご覧のように、結果として得られるオブジェクトは正しい型の `body` プロパティを持っています。



### エラーハンドリング

サーバー上でリクエストが失敗した場合、またはネットワーク接続が原因でサーバーに到達できない場合はどうなるでしょうか？ `HttpClient` は成功したレスポンスの代わりに _エラー_ を返します。

それを制御するために `.subscribe()` 呼び出しの中にエラーハンドラーを加えます。

```javascript
http
  .get<ItemsResponse>('/api/items')
  .subscribe(
    // 成功した場合は最初のコールバックが呼ばれます。
    data => {...},
    // エラーならこちらのコールバックが呼ばれます。
    err => {
      console.log('Something went wrong!');
    }
  );
```

#### エラーの詳細を得る

エラーが発生したことを検出することも重要ですが、実際にどのようなエラーが発生したのかを知ることがより効果的です。上記のコールバックの `err` パラメータは `HttpErrorResponse` 型で、何がうまくいかなかったかの有益な情報が含まれています。

発生し得るエラーは2種類あります。バックエンドが失敗ステータスコード（404,500など）を返すと、エラーとして返されます。また、RxJS演算子に例外がスローされたり、ネットワークエラーによりリクエストが正常に完了しなかったりするなど、クライアント側で何らかの問題が生じた場合は、 `Error` オブジェクトがそのままスローされます。

どちらの場合も、 `HttpErrorResponse` を見て何が起きたのか把握することができます。

```javascript
http
  .get<ItemsResponse>('/api/items')
  .subscribe(
    data => {...},
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        // クライアントサイドまたはネットワークでエラーが発生しました。エラーに応じて処理を行います。
        console.log('An error occurred:', err.error.message);
      } else {
        // バックエンドが失敗ステータスコードを返しました。
        // レスポンスボディに何が間違っていたかの手がかりが含まれているかもしれません。
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    }
  );
```

#### `.retry()`

エラーに対処する1つの方法は、単にリクエストを再試行することです。この戦略は、エラーが一時的であり、繰り返される可能性が低い場合に役立ちます。

RxJSには有用な演算子 `.retry()` があり、Observableに自動的に再発行し、エラーが発生したときにリクエストを再実行します。

最初にインポートしてください。

```js
import 'rxjs/add/operator/retry';
```

すると、このようにHTTP Observablesで使えるようになります。

```javascript
http
  .get<ItemsResponse>('/api/items')
  // このリクエストを最大3回までリトライします。
  .retry(3)
  // 3回目の再試行してもエラーならアプリに送信されます。
  .subscribe(...);
```

### JSON以外のデータをリクエストする

すべてのAPIがJSONデータを返すわけではありません。サーバー上のテキストファイルを読み込みたいとします。 `HttpClient` にテキストが返ってくることを伝える必要があります。

```javascript
http
  .get('/textfile.txt', {responseType: 'text'})
  // get()によって返却されるObservableは、テキストレスポンスが定義されているので
  // Observable<string>型です。get()に<string>型パラメータを渡す必要はありません。
  .subscribe(data => console.log(data));
```

## サーバーにデータを送る

`HttpClient` は、サーバーからデータを取得するだけでなく、さまざまな形式、つまり、変更要求のリクエストもサポートしています。

### POSTリクエストを作る

1つの一般的な操作は、データをサーバーにPOSTすることです。たとえば、フォームを送信するなどです。
POSTリクエストを送信するコードは、GETのコードと非常によく似ています。

```javascript
const body = {name: 'Brad'};

http
  .post('/api/developers/add', body)
  // 下記のようにpost()でもsubscribe()が必要になります。
  .subscribe(...);
```
<div class="alert is-important">

*`subscribe()` メソッドに注意しましょう。* `HttpClient` から返されたObservablesはすべて、 _cold_ です。つまり、リクエストを行うための _設計図_ です。あなたが `subscribe()` を呼び出すまで何も起こりません。そのような呼び出しはたいてい別のリクエストも行います。たとえば、次のコードでは、同じデータをもつPOST要求を2回送信しています。

```javascript
const req = http.post('/api/items/add', body);
// .subscribe()が呼ばれていないため、まだ0リクエストです。
req.subscribe();
// 1つ目のリクエストが作られます。
req.subscribe();
// 2つ目のリクエストが作られます。
```
</div>

### リクエストの他の部分の設定

URLとリクエストボディだけでなく、リクエストの他の部分も設定したいことがあります。これらすべてはオプションオブジェクトを通して利用できます。オプションオブジェクトはリクエストに渡します。

#### Headers

一般的なユースケースは、 `Authorization` ヘッダーをつけることです。次に例を示します。

```javascript
http
  .post('/api/items/add', body, {
    headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
  })
  .subscribe();
```

`HttpHeaders` クラスはイミュータブルです。すべての `set()` は新しいインスタンスを返して変更を適用します。

#### URL Parameters

同じ方法でURLパラメータを追加することもできます。 `id` パラメータを `3` に設定してリクエストを送信するには、次のようにします。

```javascript
http
  .post('/api/items/add', body, {
    params: new HttpParams().set('id', '3'),
  })
  .subscribe();
```

このようにして、POSTリクエストを `/api/items/add？id=3` URLに送ります。

## 高度な使い方

上記のセクションでは、基本的なHTTP機能を `@angular/common/http` で使用する方法について説明しましたが、時にはリクエストを作成してデータを取得する以上のことが必要となることもあります。

### すべてのリクエストまたはレスポンスをインターセプトする

`@angular/Common/http` で実装された主要な機能は _介入_ です。アプリケーションとバックエンドの間で動くインターセプターを定義するためのものです。アプリケーションがリクエストを行うと、サーバーに送信する前にインターセプターがリクエストオブジェクトを変換します。また、インターセプターはレスポンスをアプリケーションが読む前に変換して戻すことができます。これは、認証からロギングまでのあらゆることに役立ちます。

#### インターセプターを書く

インターセプターを作るために `HttpInterceptor` を実装したクラスを宣言します。 `HttpInterceptor` は単一の `intercept()` メソッドを持っています。単純なインターセプターは、リクエストを変更せずに転送するだけです。

```javascript
import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}
```


`intercept` は、リクエストをObservableに変換して最終的にレスポンスを返すメソッドです。この意味では、各インターセプターは、それぞれひとつのリクエストを処理する責務となります。

しかし、ほとんどの場合、インターセプターはリクエストに若干の変更を加え、チェーンの後続に転送します。それが `next` パラメータが入るところです。 `next` は、 `intercept` に似たインターフェースの `HttpHandler` であり、リクエストをレスポンスのためにObservableに変換します。インターセプターでは、 `next` はチェーン内の次のインターセプターが存在していれば次のインターセプターを表し、他のインターセプトがもう無ければ最後のバックエンドを表します。したがって、ほとんどのインターセプターは、彼らが変換したリクエストで `next` を呼ぶことで終了します。

上記の何もしないハンドラは、元のリクエストで単に `next.handle` を呼び出すだけで、それをまったく変更せずに転送します。

このパターンは、Express.jsなどのミドルウェアフレームワークのパターンに似ています。

##### インターセプターを供給する

上記の `NoopInterceptor` を宣言しても、アプリがそれを使用することはありません。次のように、モジュールでプロバイダーにインターセプターを登録する必要があります。

```javascript
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

@NgModule({
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: NoopInterceptor,
    multi: true,
  }],
})
export class AppModule {}
```

<div class="alert is-important">

*`multi: true` オプションに注意しましょう。* これは必須であり、Angularに `HTTP_INTERCEPTORS` は単一の値ではなく配列であることを伝えます。

</div>

##### イベント

`intercept` と `HttpHandler.handle` によって返されたObservableが `Observable<HttpResponse<any>>` ではなく `Observable<HttpEvent<any>>` であることに気づいたかもしれません。インターセプターは `HttpClient` インターフェースよりも低いレベルで動作するからです。1回のリクエストでアップロードおよびダウンロードの進行状況イベントを含む複数のイベントを生成し得ます。 `HttpResponse` クラスは、実際には `HttpEventType.HttpResponseEvent` の `type` を持ったイベントそのものになります。

インターセプターは、たとえ解釈できなかったり変更することがわかっているイベントでもすべて通過させる必要があります。処理する予定のないイベントを除外してはなりません。とはいえ、多くのインターセプターは発信リクエストのみに関心があり、 `next` からのイベントストリームを変更を行わずに単に返すだけでしょう。


##### 順序

アプリケーションで複数のインターセプターを提供する場合、Angularではあなたが提供した順番でそれらを適用します。

##### イミュータビリティ（不変性）

インターセプターは、リクエストとレスポンスを検査して変更するために存在します。しかし、 `HttpRequest` クラスと `HttpResponse` クラスがほとんどイミュータブルであることを知ると驚くかもしれません。

これは、アプリがリクエストを再試行することがあり得るため、インターセプターチェーンは個別のリクエストを複数回処理する可能性があるためです。リクエストがミュータブルであった場合、再試行されたリクエストは元のリクエストと変わってしまいます。イミュータビリティは、インターセプターが各試行に対して同じリクエストを見ることを保証します。

インターセプターを書くときに型安全があなたを守ることができない場合があります。リクエストボディがそうです。インターセプター内のリクエストボディを変更することは無効になりますが、これは型システムによってチェックされません。

リクエストボディを変更するためには、リクエストボディをコピーし、コピーを変更する必要があります。そのときに `clone()` を使用して、リクエストをコピーし、新しいボディを設定します。

リクエストは不変なので、直接変更することはできません。それらを変更するには、 `clone()` を使います：

```javascript
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // これは複製です。オリジナルと全く同じです。
  const dupReq = req.clone();

  // URLを変更し、'http：//'を'https://'に置き換えます。
  const secureReq = req.clone({url: req.url.replace('http://', 'https://')});
}
```

ご覧のように、 `clone()` で受け取られた断片は、他のものをコピーしながらリクエストの特定のプロパティを変更できます。

#### 新しいヘッダーをセットする

インターセプターの一般的な活用場面は、デフォルトのヘッダを発信リクエストに設定することです。たとえば、認証トークンを提供する注入可能な `AuthService` があると仮定すると、これをすべての発信リクエストに追加するインターセプターを作成する方法は次のとおりです。

```javascript
import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // サービスから認証ヘッダーを取得します。
    const authHeader = this.auth.getAuthorizationHeader();
    // 新しいヘッダーを加えたリクエストを複製します。
    const authReq = req.clone({headers: req.headers.set('Authorization', authHeader)});
    // オリジナルのリクエストの代わりに複製したリクエストを投げます。
    return next.handle(authReq);
  }
}
```

新しいヘッダーをセットしてリクエストを複製することはよくあることなので、そのためのショートカットがあります。

```javascript
const authReq = req.clone({setHeaders: {Authorization: authHeader}});
```

ヘッダーを変更するインターセプターは、次のようなさまざまな操作に使用できます。

* 認証/承認
* キャッシュ動作 たとえば、If-Modified-Since
* XSRFプロテクション

#### ロギング

インターセプターはリクエストとレスポンスを _一緒に_ で処理できるので、ログやリクエスト時間などの処理を行うことができます。 `console.log` を使って各リクエストの所要時間を示すインターセプターを考えてみましょう：

```javascript
import 'rxjs/add/operator/do';

export class TimingInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  	const started = Date.now();
    return next
      .handle(req)
      .do(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
        }
      });
  }
}
```
RxJSの `do()` 演算子に注目してください。ストリームの値に影響を与えずにObservableに副作用を加えています。ここでは、 `HttpResponse` イベントを検出し、リクエストにかかった時間を記録します。

#### キャッシュ

インターセプターを使用してキャッシュを実装することもできます。この例では、シンプルなインターフェースでHTTPキャッシュを作成することを想定します。

```javascript
abstract class HttpCache {
  /**
   * キャッシュされたレスポンスがあれば返す。存在しない場合はnullを返します。
   */
  abstract get(req: HttpRequest<any>): HttpResponse<any>|null;

  /**
   * キャッシュ内のレスポンスを追加または更新します。
   */
  abstract put(req: HttpRequest<any>, resp: HttpResponse<any>): void;
}
```

インターセプターは、このキャッシュを発信リクエストに適用できます。

```javascript
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: HttpCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  	// 何かをする前に、GETリクエストだけをキャッシュすることが重要です。
    // リクエストメソッドがGETではないなら、インターセプターをスキップします。
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // まず、キャッシュをチェックして、このリクエストが存在するかどうかを確認します。
    const cachedResponse = this.cache.get(req);
    if (cachedResponse) {
      // キャッシュされたレスポンスが存在します。
      // 次のハンドラにリクエストを転送する代わりにキャッシュを返します。
      return Observable.of(cachedResponse);
    }

    // キャッシュされたレスポンスは存在しません。
    // ネットワークにアクセスし、レスポンスが到着したらキャッシュします。
    return next.handle(req).do(event => {
      // レスポンス以外の他のイベントがあるかもしれないことを覚えておいてください。
      if (event instanceof HttpResponse) {
      	// キャッシュを更新します。
      	this.cache.put(req, event);
      }
    });
  }
}
```

明らかに、この例では、要求の一致、キャッシュの無効化などについて説明していますが、要求を変換する以外にも、インターセプターには多くの機能が備わっています。必要に応じて、これらを使用して要求フローを完全に引き継ぐことができます。

柔軟性を例示するために、リクエストがキャッシュに存在する場合は _２つの_ レスポンスイベントを返すように上記の例を変更できます。最初にキャッシュされたレスポンスを返し、あとで更新されたネットワークレスポンスが返されます。

```javascript
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // 今回もGET以外のリクエストはスキップします。
  if (req.method !== 'GET') {
    return next.handle(req);
  }

  // これは、キャッシュされた値がある場合にはObservableとなり、
  // そうでなければ空のObservableです。まず空のObservableで初期化します。
  let maybeCachedResponse: Observable<HttpEvent<any>> = Observable.empty();

  // キャッシュをチェックします。
  const cachedResponse = this.cache.get(req);
  if (cachedResponse) {
    maybeCachedResponse = Observable.of(cachedResponse);
  }

  // ネットワークリクエストの作成と値のキャッシュを表すObservable（サブスクライブしない）を作成します。
  const networkResponse = next.handle(req).do(event => {
    // これまでと同様に、HttpResponseイベントをチェックしてキャッシュします。
    if (event instanceof HttpResponse) {
      this.cache.put(req, event);
    }
  });

  // さて、2つを結合し、最初にキャッシュされたレスポンス（存在する場合）を、2番目にネットワークレスポンスを送信します。
  return Observable.concat(maybeCachedResponse, networkResponse);
}
```

こうして、 `http.get(url)` を呼び出した関数は、そのURLが以前にキャッシュされていれば _2つの_ レスポンスを受け取ります。

### プログレスイベントをリッスンする

アプリケーションが大量のデータを転送する必要があり、転送に時間がかかることがあります。このような転送の進捗状況に関するフィードバックを提供することは、ユーザーエクスペリエンスのよい実践です。たとえば、ファイルをアップロードすると、 `@angular/common/http` がこれをサポートします。

プログレスイベントを有効にしてリクエストを行うには、まず特別な `reportProgress` オプションをセットして `HttpRequest` のインスタンスを作成します。

```javascript
const req = new HttpRequest('POST', '/upload/file', file, {
  reportProgress: true,
});
```

このオプションを使用すると、プログレスイベントを追跡できます。プログレスイベントごとに変更検知がトリガーされるので、各イベントでUIを実際に更新する場合のみオンにすべきと覚えておいてください。

次に、 `HttpClient` の `request()` メソッドを通してリクエストを作ります。結果は、インターセプターの場合と同様に、Observableのイベントになります。

```javascript
http.request(req).subscribe(event => {
  // このAPIを使用すると、生のイベントストリームにアクセスできます。
  // アップロードのプログレスイベントを見ます。
  if (event.type === HttpEventType.UploadProgress) {
    // これはアップロード進捗イベントです。何％終了したかを計算して表示します。
    const percentDone = Math.round(100 * event.loaded / event.total);
    console.log(`File is ${percentDone}% uploaded.`);
  } else if (event instanceof HttpResponse) {
    console.log('File is completely uploaded!');
  }
});
```

## セキュリティ: XSRFプロテクション

[XSRF(Cross-Site Request Forgery)](https://en.wikipedia.org/wiki/Cross-site_request_forgery)は、攻撃者が認証されたユーザーにそうとは知らずにあなたのWebサイト上のアクションを実行させる攻撃手法です。 `HttpClient` は、XSRF攻撃を防ぐための[共通メカニズム](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-Header_Token)をサポートしています。HTTPリクエストを実行するとき、インターセプターはデフォルトでは `XSRF-TOKEN` によってクッキーからトークンを読み込み、それをHTTPヘッダの `X-XSRF-TOKEN` として設定します。ドメイン上で動作するコードだけがCookieを読み取ることができるため、バックエンドはHTTPリクエストが攻撃者ではなくクライアントアプリケーションからのものであることを保証できます。

デフォルトでは、インターセプターはURLに関するすべての変更要求（POSTなど）に対してこのCookieを送信します。GET/HEADリクエストや絶体URLに基づくものではありません。

これを利用するには、サーバーがページ読み込みまたは最初のGET要求のいずれかで、 `XSRF-TOKEN` というJavaScriptで読み取れるセッションクッキーにトークンを設定する必要があります。その後のリクエストでは、サーバーはCookieが `X-XSRF-TOKEN` HTTPヘッダーと一致することを検証することができ、したがって、ドメイン上で実行されているコードだけがリクエストを送信できたと確認できます。トークンは、各ユーザーごとに一意でなければならず、サーバーによって検証可能でなければなりません。これにより、クライアントは独自のトークンを作成することができなくなります。セキュリティを強化するために、トークンをサイトの認証クッキーのダイジェストに設定します。

<div class="alert is-important">

*`HttpClient` のサポートはクライアント側だけであり、XSRFプロテクションのスキーマの半分であることに注意しましょう。* あなたのバックエンドサービスは、ページのCookieを設定し、該当するすべてのリクエストにヘッダが存在することを検証するように構成する必要があります。そうでない場合、Angularのデフォルトの保護は効果がありません。

</div>

### cookie/headerにカスタムで名前をつける

バックエンドサービスがXSRFトークンのクッキーまたはヘッダーに異なる名前を使っている場合、 `HttpClientXsrfModule.withConfig()` を使用してデフォルト設定を上書きします。

```javascript
imports: [
  HttpClientModule,
  HttpClientXsrfModule.withConfig({
    cookieName: 'My-Xsrf-Cookie',
    headerName: 'My-Xsrf-Header',
  }),
]
```

## HTTPリクエストをテストする

外部依存関係と同様に、HTTPバックエンドはよいテストプラクティスの一環としてモックされる必要があります。 `@angular/common/http` は、このようなっモックを簡単に設定するテストライブラリ `@angular/common/http/testing` を提供します。

### モックの思想

AngularのHTTPテストライブラリは、アプリケーションがコードを実行してリクエストを最初に実行するテストパターン用に設計されています。その後、テストでは、特定のリクエストがあるかどうか、それらのリクエストに対してアサーションを実行し、最後に期待されるリクエストを「flushing」することによってレスポンスを提供します。これにより、より多くの新しいリクエストがトリガーされる可能性があります。最後に、アプリが予期せぬリクエストを行なっていないことを確認します。

### セットアップ

`HttpClient` でリクエストをテストするには、 `HttpClientTestingModule` をインポートして `TestBed` のセットアップに追加します。

```javascript

import {HttpClientTestingModule} from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    ...,
    imports: [
      HttpClientTestingModule,
    ],
  })
});
```

それでおしまいです。これでテストの過程で行われたリクエストは、通常のバックエンドの代わりにテストバックエンドに当たるでしょう。

### リクエストの待ち受けと応答

モックをモジュール経由でインストールすると、モックレスポンスを提供するGETリクエストを期待したテストを作成できます。次の例では、テストに `HttpClient` と `HttpTestingController` というクラスを注入しています。

```javascript
it('expects a GET request', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
  // HTTP GETリクエストを作成し、{name: 'Test Data'}という形式のオブジェクトが返ることを期待します。
  http
    .get('/data')
    .subscribe(data => expect(data['name']).toEqual('Test Data'));

  // この時点で、リクエストは保留中であり、レスポンスは送信されていません。
  // 次のステップは、リクエストが発生したと予想することです。
  const req = httpMock.expectOne('/data');

  // そのURLのリクエストがなかった場合、または複数のリクエストが一致した場合、expectOne()は例外を投げます。
  // ただし、このテストではこのURLに対して1回のリクエストしか行われないため、モックリクエストと一致して返されます。
  // モックリクエストは、レスポンスを送信するか、リクエストに対してアサーションを行うために使用できます。
  // 今回は、テストでリクエストがGETであることをアサートします。
  expect(req.request.method).toEqual('GET');

  // 次に、レスポンスを送信してリクエストを実行します。
  req.flush({name: 'Test Data'});

  // 最後に、未処理のリクエストがないことを確認します。
  httpMock.verify();
}));
```

最後のステップは、リクエストがまだ未解決であることを確認することです。これは、 `afterEach()` ステップに移動するのに十分です。

```javascript
afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
  httpMock.verify();
}));
```

#### 独自のリクエスト待ち受け

URLによる照合では不十分な場合は、独自の照合機能を実装することができます。たとえば、Authorizationヘッダーをもつ発信リクエストを検索できます。

```javascript
const req = httpMock.expectOne((req) => req.headers.has('Authorization'));
```

上記のテストではURLによる `expectOne()` と同様に、0または2以上のリクエストがこの期待値に一致すると、例外を投げます。

#### 1つ以上のリクエストの処理

テストで重複したリクエストに応答する必要がある場合は、 `expect()` の代わりに `match()` APIを使用します。これは同じ引数を取りますが、一致するリクエストの配列を返します。 ここで返却されたリクエストは、今後の照合から削除され、きちんとテストで検証してフラッシュしなければいけません。

```javascript
// 5回のpingが行われることを期待して、フラッシュします。
const reqs = httpMock.match('/ping');
expect(reqs.length).toBe(5);
reqs.forEach(req => req.flush());
```
