# HttpClient

たいていのフロントエンドアプリケーションは、HTTPプロトコルを通してバックエンドサービスと通信します。モダンブラウザはHTTPリクエストを行うために2つのAPIをサポートします。`XMLHttpRequest` インターフェースと `fetch()` APIです。

`HttpClient` は、 `@angular/common/http` の中に含まれていて、Angularアプリケーションで使われるHTTPのためのシンプルなAPIです。ブラウザが公開している `XMLHttpRequest` インターフェースの上にAPIを築きます。
さらに `HttpClient` は、リクエストやレスポンスオブジェクトの強力な型付け、リクエストとレスポンスのインターセプタ、そしてオブザーバブルに基づくAPIを通してエラーハンドリングすることで、テストを簡単にします。

## セットアップ: モジュールをインストールする

`HttpClient` を使うために、`HttpClientModule` をインストールします。インストールはアプリケーションモジュールで一度だけ必要です。

```javascript
// app.module.ts:

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

// @angular/common/http から HttpClientModule をインポートする
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    // application moduleの 'imports' に含める
    // BrowserModuleの後に置く
    HttpClientModule,
  ],
})
export class MyAppModule {}
```

appモジュールに `HttpClientModule` をインポートすると、コンポーネントやサービスに `HttpClient` を注入できるようになります。

## JSONデータのリクエストを作る

アプリケーションはバックエンドへリクエストするケースではたいていJSONデータをリクエストします。例えば、アイテムをリストするAPIエンドポイント `/api/items` では、以下のようにフォームのJSONオブジェクトとして返却します。

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

  // コンポーネントやサービスの中にHttpClientを注入する
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // HTTPリクエストを作る:
    this.http.get('/api/items').subscribe(data => {
      // JSONレスポンスからresultsプロパティを読む
      this.results = data['results'];
    });
  }
}
```


### レスポンスを型判定する

上記の例では、ブラケット記法を使って `data['results']` とアクセスしていることに注目しましょう。 `data.results` と書こうとしても、TypeScriptが HTTPから戻される `Object` に `results` プロパティが無いと正しくエラーを出すでしょう。 `HttpClient` がJSONレスポンスの `Object` をパースした時にどんなオブジェクトであるかわからないからです。

とはいえ、レスポンスがどんな型であるか `HttpClient` に教えることができます。そのために、まず次のように正しい型のインターフェースを定義します。

```javascript
interface ItemsResponse {
  results: string[];
}
```

次に、 `HttpClient.get` を呼ぶ時に型パラメータを渡します。

```javascript
http.get<ItemsResponse>('/api/items').subscribe(data => {
  // dataはItemsResponse型になっているので次のように書ける
  this.results = data.results;
});
```

### 完全なレスポンスを読む

レスポンスボディは必要なすべてのデータを返しません。場合によっては、サーバーが特定の条件を示す特別なヘッダーやステータスコードを返すことがあり、それらを解析する必要があります。 `HttpClient` に ` observe` オプションをつければボディだけでなくレスポンス全体が読めるようになります。

```javascript
http
  .get<MyJsonData>('/data.json', {observe: 'response'})
  .subscribe(resp => {
    // ここでrespはHttpResponse<MyJsonData>型である。
    // ヘッダーを読める
    console.log(resp.headers.get('X-Custom-Header'));
    // ボディに直接アクセスするとリクエストしたようにMyJsonData型である。
    console.log(resp.body.someField);
  });
```

ご覧のように、結果として得られるオブジェクトは正しいタイプの `body` プロパティを持っています。



### エラーハンドリング

サーバー上でリクエストが失敗した場合、またはネットワーク接続が原因でサーバーに到達できない場合はどうなるでしょうか？ `HttpClient` は成功したレスポンスの代わりに _エラー_ を返します。

それを制御するために `.subscribe()` 呼び出しの中にエラーハンドラーを加えます。

```javascript
http
  .get<ItemsResponse>('/api/items')
  .subscribe(
    // 成功した場合は最初のコールバックが呼ばれる
    data => {...},
    // エラーならこちらのコールバックが呼ばれる
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
        // クライアントサイドまたはネットワークでエラーが発生した。それに応じて処理を行う。
        console.log('An error occurred:', err.error.message);
      } else {
        // バックエンドが失敗ステータスコードを返した。
        // レスポンスボディに何が間違っていたかの手がかりが含まれているかもしれない。
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
  // このリクエストを最大3回までリトライする
  .retry(3)
  // 3回目の再試行してもエラーならアプリに送信される
  .subscribe(...);
```

### non-JSONデータをリクエストする

すべてのAPIがJSONデータを返すわけではありません。サーバー上のテキストファイルを読み込みたいとします。 `HttpClient` にテキストが返ってくることを伝える必要があります。

```javascript
http
  .get('/textfile.txt', {responseType: 'text'})
  // get()によって返却されるObservableは、テキストレスポンスが定義されているので
  // Observable<string>型になる。get()に<string>型パラメータを渡す必要はない。
  .subscribe(data => console.log(data));
```

## サーバーにデータを送る

`HttpClient` は、サーバからデータを取得するだけでなく、様々な形式、つまり、変更要求のリクエストもサポートしています。

### POSTリクエストを作る

1つの一般的な操作は、データをサーバーにPOSTすることです。例えば、フォームを送信するなどです。
POSTリクエストを送信するコードは、GETのコードと非常によく似ています。

```javascript
const body = {name: 'Brad'};

http
  .post('/api/developers/add', body)
  // 下記のようにpost()でもsubscribe()が必要になる。
  .subscribe(...);
```
<div class="alert is-important">

*Note `subscribe()` メソッド* `HttpClient` から返されたObservablesはすべて、_cold_です。つまり、リクエストを行うための_blueprint_です。あなたが `subscribe()` を呼び出すまで何も起こりません。そのような呼び出しはたいてい別のリクエストも行います。たとえば、次のコードでは、同じデータを持つPOST要求を2回送信しています。

```javascript
const req = http.post('/api/items/add', body);
// .subscribe()が呼ばれていないため、まだ 0リクエストである
req.subscribe();
// 1リクエスト実施
req.subscribe();
// 2リクエスト実施
```
</div>

### リクエストの他の部分の設定

URLとリクエストボディだけでなく、リクエストの他の部分も設定したいことがあります。これら全てはオプションオブジェクトを通して利用できます。オプションオブジェクトはリクエストに渡します。

#### Headers

一般的なユースーケースは、 `Authorization` ヘッダーをつけることです。以下に例を示します。

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

`@angular/Common/http` で実装された主要な機能に、アプリケーションとバックエンドの間で動くインターセプタを定義した _interception_ があります。アプリケーションがリクエストを行うと、サーバーに送信する前にインターセプタがリクエストオブジェクトを変換します。また、インターセプタはレスポンスをアプリケーションが読む前に変換して戻すことができます。これは、認証からロギングまでのあらゆることに役立ちます。

#### インターセプターを書く

インターセプタを作るために `HttpInterceptor` を実装したクラスを宣言します。 `HttpInterceptor` は単一の `intercept()` メソッドを持っています。単純なインターセプタは、リクエストを変更せずに転送するだけです。

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


`intercept` は、リクエストをObservableに変換して最終的にレスポンスを返すメソッドです。この意味では、各インターセプタは、それぞれ一つのリクエストを処理する責務となります。

しかし、ほとんどの場合、インターセプタはリクエストに若干の変更を加え、チェーンの後続に転送します。それは `next` パラメータが入るところです。 `next` は、 `intercept` に似たインタフェースの `HttpHandler` であり、リクエストをレスポンスのためにObservableに変換します。インターセプタでは、 `next` はチェーン内の次のインターセプタが存在していれば次のインターセプタを表し、他のインターセプトがもう無ければ最後のバックエンドを表します。したがって、ほとんどのインターセプタは、彼らが変換したリクエストで `next` を呼ぶことで終了します。

上記の何もしないハンドラは、元のリクエストで単に `next.handle` を呼び出すだけで、それをまったく変更せずに転送します。

このパターンは、Express.jsなどのミドルウェアフレームワークのパターンに似ています。

##### インターセプタを供給する

上記の `NoopInterceptor` を宣言しても、アプリがそれを使用することはありません。次のように、モジュールでプロバイダーにインターセプタを登録する必要があります。

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

*Note `multi: true` オプション* これは必須であり、Angleに `HTTP_INTERCEPTORS` は単一の値ではなく配列であることを伝えます。


##### イベント

`intercept` と `HttpHandler.handle` によって返されたObservableが `Observable<HttpResponse<any>>` ではなく `Observable<HttpEvent<any>>` であることに気づいたかもしれません。インターセプタは `HttpClient` インタフェースよりも低いレベルで動作するからです。1回のリクエストでアップロードおよびダウンロードの進行状況イベントを含む複数のイベントを生成し得ます。 `HttpResponse` クラスは、実際には `HttpEventType.HttpResponseEvent` の `type` を持ったイベントそのものになります。

インターセプタは、たとえ解釈できなかったり変更することがわかっているイベントでも全て通過させる必要があります。処理する予定のないイベントを除外してはなりません。とはいえ、多くのインターセプタは発信リクエストのみに関心があり、 `next` からのイベントストリームを変更を行わずに単に返すだけでしょう。


##### 並べる順番

アプリケーションで複数のインターセプタを提供する場合、Angularではあなたが供給した順番でそれらを適用します。

##### イミュータビリティ（不変性）

インターセプタは、リクエストとレスポンスを検査して変更するために存在します。しかし、 `HttpRequest` クラスと `HttpResponse` クラスがほとんどイミュータブルであることを知ると驚くかもしれません。

これは、アプリがリクエストを再試行することがあり得るため、インターセプタチェーンは個別のリクエストを複数回処理する可能性があるためです。リクエストがミュータブルであった場合、再試行されたリクエストは元のリクエストと変わってしまいます。イミュータビリティは、インターセプタが各試行に対して同じリクエストを見ることを保証します。

インターセプタを書くときに型安全があなたを守ることができない場合があります。リクエストボディがそうです。インターセプタ内のリクエストボディを変更することは無効になりますが、これは型システムによってチェックされません。

リクエストボディを変更するためには、リクエストボディをコピーし、コピーを変更し、 `clone（）` を使用してリクエストをコピーし、新しいボディを設定する必要があります。

リクエストは不変なので、直接変更することはできません。それらを変更するには、 `clone（）` を使います：

```javascript
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // これは複製です。オリジナルと全く同一です。
  const dupReq = req.clone();

  // URLを変更し、 'http：//' を 'https：//' に置き換えます。
  const secureReq = req.clone({url: req.url.replace('http://', 'https://')});
}
```

ご覧のように、 `clone（）` でハッシュ引数を取ると、他のものをコピーしながらリクエストの特定のプロパティを変更できます。

#### 新しいヘッダーをセットする

インターセプタの一般的な活用場面は、デフォルトのヘッダを発信リクエストに設定することです。たとえば、認証トークンを提供する注入可能な `AuthService` があると仮定すると、これをすべての発信リクエストに追加するインターセプタを作成する方法は次のとおりです。

```javascript
import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // サービスから認証ヘッダーを取得する
    const authHeader = this.auth.getAuthorizationHeader();
    // 新しいヘッダーを加えたリクエストを複製する
    const authReq = req.clone({headers: req.headers.set('Authorization', authHeader)});
    // オリジナルのリクエストの代わりに複製したリクエストを投げる
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

#### ログを取る

インターセプタはリクエストとレスポンスを _一緒に_ で処理できるので、ログやリクエスト時間などの処理を行うことができます。 `console.log` を使って各リクエストの所要時間を示すインターセプタを考えてみましょう：

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

インターセプタを使用してキャッシングを実装することもできます。この例では、シンプルなインターフェースでHTTPキャッシュを作成することを想定します。

```javascript
abstract class HttpCache {
  /**
   * キャッシュされたレスポンスがあれば返す。存在しない場合はnullを返す
   */
  abstract get(req: HttpRequest<any>): HttpResponse<any>|null;

  /**
   * キャッシュ内のレスポンスを追加または更新する
   */
  abstract put(req: HttpRequest<any>, resp: HttpResponse<any>): void;
}
```

インターセプタは、このキャッシュを発信リクエストに適用できます。

```javascript
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: HttpCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  	// 何かをする前に、GETリクエストだけをキャッシュすることが重要である
    // リクエストメソッドがGETではないなら、インターセプタをスキップする
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // まず、キャッシュをチェックして、このリクエストが存在するかどうかを確認する
    const cachedResponse = this.cache.get(req);
    if (cachedResponse) {
      // キャッシュされたレスポンスが存在する。 
      // 次のハンドラにリクエストを転送する代わりにキャッシュを返す
      return Observable.of(cachedResponse);
    }

    // キャッシュされたレスポンスは存在しない
    // ネットワークにアクセスし、レスポンスが到着したらキャッシュする
    return next.handle(req).do(event => {
      // レスポンス以外の他のイベントがあるかもしれないことを忘れるな
      if (event instanceof HttpResponse) {
      	// キャッシュを更新する
      	this.cache.put(req, event);
      }
    });
  }
}
```

明らかに、この例では、要求の一致、キャッシュの無効化などについて説明していますが、要求を変換する以外にも、インターセプタには多くの機能が備わっています。必要に応じて、これらを使用して要求フローを完全に引き継ぐことができます。

柔軟性を例示するために、リクエストがキャッシュに存在する場合は _２つの_ レスポンスイベントを返すように上記の例を変更できます。最初にキャッシュされたレスポンスを返し、後で更新されたネットワークレスポンスが返されます。

```javascript
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // 今回もGET以外のリクエストはスキップする
  if (req.method !== 'GET') {
    return next.handle(req);
  }

  // これは、キャッシュされた値がある場合にはObservableとなり、
  // そうでなければ空のObservableになる。まず空のObservableで初期化する。
  let maybeCachedResponse: Observable<HttpEvent<any>> = Observable.empty();

  // キャッシュをチェックする
  const cachedResponse = this.cache.get(req);
  if (cachedResponse) {
    maybeCachedResponse = Observable.of(cachedResponse);
  }

  // ネットワークリクエストの作成と値のキャッシュを表すObservable（サブスクライブしない）を作成する
  const networkResponse = next.handle(req).do(event => {
    // Just like before, check for the HttpResponse event and cache it.
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

アプリケーションが大量のデータを転送する必要があり、転送に時間がかかることがあります。このような転送の進捗状況に関するフィードバックを提供することは、ユーザーエクスペリエンスの良い実践です。例えば、ファイルをアップロードすると、 `@angular/common/http` がこれをサポートします。

プログレスイベントを有効にしてリクエストを行うには、まず特別な `reportProgress` オプションをセットして `HttpRequest` のインスタンスを作成します。

```javascript
const req = new HttpRequest('POST', '/upload/file', file, {
  reportProgress: true,
});
```

このオプションを使用すると、プログレスイベントを追跡できます。プログレスイベントごとに変更検出がトリガーされるので、各イベントでUIを実際に更新する場合のみオンにすべきと覚えておいてください。

次に、 `HttpClient` の `request()` メソッドを通してリクエストを作ります。結果は、インターセプタの場合と同様に、Observableのイベントになります。

```javascript
http.request(req).subscribe(event => {
  // このAPIを使用すると、生のイベントストリームにアクセスできる
  // アップロードのプログレスイベントを見る
  if (event.type === HttpEventType.UploadProgress) {
    // これはアップロード進捗イベントである。何％終了したかを計算して表示する
    const percentDone = Math.round(100 * event.loaded / event.total);
    console.log(`File is ${percentDone}% uploaded.`);
  } else if (event instanceof HttpResponse) {
    console.log('File is completely uploaded!');
  }
});
```

## セキュリティ: XSRFプロテクション

[XSRF（Cross-Site Request Forgery）]（https://en.wikipedia.org/wiki/Cross-site_request_forgery）は、攻撃者が認証されたユーザーにそうとは知らずにあなたのWebサイト上のアクションを実行させる攻撃手法です。 `HttpClient` は、XSRF攻撃を防ぐための[common mechanism]（https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-Header_Token）をサポートしています。HTTPリクエストを実行するとき、インターセプタはデフォルトでは `XSRF-TOKEN` によってクッキーからトークンを読み込み、それをHTTPヘッダの `X-XSRF-TOKEN` として設定します。ドメイン上で動作するコードだけがCookieを読み取ることができるため、バックエンドはHTTPリクエストが攻撃者ではなくクライアントアプリケーションからのものであることを保証できます。

デフォルトでは、インターセプタはURLに関するすべての変更要求（POSTなど）に対してこのCookieを送信します。GET/HEADリクエストや絶体的なURLに基づくものではありません。

これを利用するには、サーバーがページ読み込みまたは最初のGET要求のいずれかで、 `XSRF-TOKEN` というJavaScriptで読み取れるセッションクッキーにトークンを設定する必要があります。その後のリクエストでは、サーバーはCookieが `X-XSRF-TOKEN` HTTPヘッダーと一致することを検証することができ、したがって、ドメイン上で実行されているコードだけがリクエストを送信できたと確認できます。トークンは、各ユーザーごとに一意でなければならず、サーバーによって検証可能でなければなりません。これにより、クライアントは独自のトークンを作成することができなくなります。セキュリティを強化するために、トークンをサイトの認証クッキーのdigestに設定します。

<div class="alert is-important">
*Note `HttpClient` のサポートはクライアント側だけであり、XSRFプロテクションのスキーマの半分である* あなたのバックエンドサービスは、ページのCookieを設定し、該当するすべてのリクエストにヘッダが存在することを検証するように構成する必要があります。そうでない場合、Angularのデフォルトの保護は効果がありません。
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

外部依存関係と同様に、HTTPバックエンドは良いテストプラクティスの一環としてモックされる必要があります。 `@angular/common/http` は、このようなっモックを簡単に設定するテストライブラリ `@angular/common/http/testing` を提供します。

### モックのフィロソフィー

AngularのHTTPテストライブラリは、アプリケーションがコードを実行してリクエストを最初に実行するテストパターン用に設計されています。その後、テストでは、特定のリクエストがあるかどうか、それらのリクエストに対してアサーションを実行し、最後に期待されるリクエストを「flashing」することによってレスポンスを提供します。これにより、より多くの新しいリクエストがトリガーされる可能性があります。最後に、アプリが予期せぬリクエストを行なっていないことを確認します。

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

### リクエストのexpectとanswer

モックをモジュール経由でインストールすると、モックレスポンスを提供するGETリクエストを期待したテストを作成できます。次の例では、テストに `HttpClient` と `HttpTestingController` というクラスを注入しています。

```javascript
it('expects a GET request', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
  // HTTP GETリクエストを作成し、{name: 'Test Data'}という形式のオブジェクトが返ることを期待する
  http
    .get('/data')
    .subscribe(data => expect(data['name']).toEqual('Test Data'));

  // この時点で、リクエストは保留中であり、レスポンスは送信されていない
  // 次のステップは、リクエストが発生したと予想することである
  const req = httpMock.expectOne('/data');

  // そのURLのリクエストがなかった場合、または複数のリクエストが一致した場合、expectOne()はスローする
  // ただし、このテストではこのURLに対して1回のリクエストしか行われないため、モックリクエストと一致して返される
  // モックリクエストは、レスポンスを送信するか、リクエストに対してアサーションを行うために使用できる
  // 今回は、テストでリクエストがGETであることをアサートする
  expect(req.request.method).toEqual('GET');

  // 次に、レスポンスを送信してリクエストを実行する
  req.flush({name: 'Test Data'});

  // 最後に、未処理のリクエストがないことを確認する
  httpMock.verify();
}));
```

最後のステップは、リクエストがまだ未解決であることを確認することです。これは、 `afterEach()` ステップに移動するのに十分です。

```javascript
afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
  httpMock.verify();
}));
```

#### リクエストのカスタムエクスペクト

URLによる照合では不十分な場合は、独自の照合機能を実装することができます。たとえば、Authorizationヘッダーを持つ発信リクエストを検索できます。

```javascript
const req = httpMock.expectOne((req) => req.headers.has('Authorization'));
```

上記のテストではURLによる `expectOne()` と同様に、0または2以上のリクエストがこの期待値に一致すると、スローされます。

#### 1つ以上のリクエストの処理

テストで重複したリクエストに応答する必要がある場合は、 `expect()` の代わりに `match()` APIを使用します。これは同じ引数を取りますが、一致するリクエストの配列を返します。 ここで返却されたリクエストは、今後の照合から削除され、きちんとテストで検証してフラッシュしなければいけません。

```javascript
// 5回のpingが行われることを期待して、フラッシュする
const reqs = httpMock.match('/ping');
expect(reqs.length).toBe(5);
reqs.forEach(req => req.flush());
```
