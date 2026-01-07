## HTTP リクエストを行う

`HttpClient` には、データの読み込みとサーバーへの変更の適用に使用されるさまざまなHTTP動詞に対応するメソッドがあります。各メソッドは[RxJS `Observable`](https://rxjs.dev/guide/observable) を返し、これはサブスクライブされるとリクエストを送信し、サーバーが応答すると結果を発行します。

NOTE: `HttpClient` によって作成された `Observable` は、何度でもサブスクライブでき、各サブスクライブごとに新しいバックエンドリクエストが行われます。

リクエストメソッドに渡されるオプションオブジェクトを通じて、リクエストのさまざまなプロパティと返されるレスポンスタイプを調整できます。

## JSON データの取得 {#fetching-json-data}

バックエンドからデータを取得するには、多くの場合、[`HttpClient.get()`](api/common/http/HttpClient#get) メソッドを使用してGETリクエストを行う必要があります。このメソッドは、2つの引数を取ります。1つ目は、フェッチする文字列のエンドポイントURL、2つ目はリクエストを構成するための*オプションオブジェクト*です（省略可能）。

たとえば、`HttpClient.get()` メソッドを使用して、仮説上のAPIから構成データを取得するには、次のようになります。

```ts
http.get<Config>('/api/config').subscribe((config) => {
  // 構成を処理します。
});
```

サーバーによって返されるデータが `Config` 型であることを指定するジェネリック型引数に注意してください。この引数は省略可能であり、省略すると、返されるデータは `Object` 型になります。

TIP: 不確実な構造のデータや `undefined` または `null` の値を扱う場合、レスポンスタイプとして `Object` の代わりに `unknown` 型を使用することを検討してください。

CRITICAL: リクエストメソッドのジェネリック型は、サーバーによって返されるデータに関する**アサーション**です。`HttpClient` は、実際の戻り値データがこの型と一致することを検証しません。

## 他のタイプのデータの取得 {#fetching-other-types-of-data}

デフォルトでは、`HttpClient` はサーバーがJSONデータを返すことを想定しています。JSON以外のAPIと対話する場合、`HttpClient` にリクエストを行うときに期待されるレスポンス型と返す型を伝えることができます。これは、`responseType` オプションを使用して行います。

| **`responseType` 値** | **返されるレスポンス型**                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `'json'` (デフォルト)       | 指定されたジェネリック型の JSON データ                                                                                                  |
| `'text'`                 | 文字列データ                                                                                                                     |
| `'arraybuffer'`          | 応答バイトの生のデータを格納した [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) |
| `'blob'`                 | [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) インスタンス                                                           |

たとえば、`HttpClient` に `.jpeg` イメージの生のバイトを `ArrayBuffer` にダウンロードするように依頼できます。

```ts
http.get('/images/dog.jpg', {responseType: 'arraybuffer'}).subscribe((buffer) => {
  console.log('画像は ' + buffer.byteLength + ' バイトです');
});
```

<docs-callout important title="`responseType` のリテラル値">
`responseType` の値は、`HttpClient` によって返される型に影響を与えるため、`string` 型ではなく、リテラル型である必要があります。

これは、リクエストメソッドに渡されるオプションオブジェクトがリテラルオブジェクトの場合に自動的に発生しますが、リクエストオプションを変数やヘルパーメソッドに抽出している場合は、`responseType: 'text' as const` のように明示的にリテラルとして指定する必要があるかもしれません。
</docs-callout>

## サーバーの状態を変更する {#mutating-server-state}

変更を伴うサーバーAPIは多くの場合、新しい状態または行うべき変更を指定したリクエストボディを使用してPOSTリクエストを行う必要があります。

[`HttpClient.post()`](api/common/http/HttpClient#post) メソッドは `get()` と同様に動作し、オプションの前に `body` 引数を追加で受け取ります。

```ts
http.post<Config>('/api/config', newConfig).subscribe((config) => {
  console.log('更新された構成:', config);
});
```

さまざまなタイプの値をリクエストの `body` として提供でき、`HttpClient` はそれに応じてシリアル化します。

| **`body` 型**                                                                                                               | **シリアル化されるもの**                                 |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 文字列                                                                                                                        | プレーンテキスト                                         |
| 数値、ブール値、配列、またはプレーンオブジェクト                                                                                       | JSON                                                 |
| [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)                       | バッファーからの生データ                                   |
| [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)                                                                     | `Blob` のコンテンツタイプを使用した生データ                   |
| [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData)                                                             | `multipart/form-data` エンコードされたデータ               |
| [`HttpParams`](api/common/http/HttpParams) または [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | `application/x-www-form-urlencoded` 形式の文字列 |

IMPORTANT: 変更リクエスト `Observable` を `.subscribe()` することを忘れないでください。そうしないと、リクエストは実際に発行されません。

## URL パラメータの設定 {#setting-url-parameters}

リクエストURLに含めるべきリクエストパラメータは、`params` オプションを使用して指定します。

オブジェクトリテラルを渡すことは、URLパラメータを構成するための最も簡単な方法です。

```ts
http
  .get('/api/config', {
    params: {filter: 'all'},
  })
  .subscribe((config) => {
    // ...
  });
```

あるいは、パラメータの構築やシリアル化をより細かく制御する必要がある場合は、`HttpParams` のインスタンスを渡します。

IMPORTANT: `HttpParams` のインスタンスは*変更不可能*であり、直接変更できません。代わりに、`append()` などの変更メソッドは、変更が適用された新しい `HttpParams` のインスタンスを返します。

```ts
const baseParams = new HttpParams().set('filter', 'all');

http
  .get('/api/config', {
    params: baseParams.set('details', 'enabled'),
  })
  .subscribe((config) => {
    // ...
  });
```

`HttpParams` を、`HttpClient` がパラメータをURLにエンコードする方法を決定するカスタム `HttpParameterCodec` でインスタンス化できます。

### カスタムパラメータエンコーディング {#custom-parameter-encoding}

デフォルトでは、`HttpParams` は組み込みの [`HttpUrlEncodingCodec`](api/common/http/HttpUrlEncodingCodec) を使用してパラメータのキーと値をエンコードおよびデコードします。

[`HttpParameterCodec`](api/common/http/HttpParameterCodec) の独自の実装を提供することで、エンコードとデコードの適用方法をカスタマイズできます。

```ts
import {HttpClient, HttpParams, HttpParameterCodec} from '@angular/common/http';
import {inject} from '@angular/core';

export class CustomHttpParamEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

export class ApiService {
  private http = inject(HttpClient);

  search() {
    const params = new HttpParams({
      encoder: new CustomHttpParamEncoder(),
    })
      .set('email', 'dev+alerts@example.com')
      .set('q', 'a & b? c/d = e');

    return this.http.get('/api/items', {params});
  }
}
```

## リクエストヘッダーの設定 {#setting-request-headers}

リクエストに含めるべきリクエストヘッダーは、`headers` オプションを使用して指定します。

オブジェクトリテラルを渡すことは、リクエストヘッダーを構成するための最も簡単な方法です。

```ts
http
  .get('/api/config', {
    headers: {
      'X-Debug-Level': 'verbose',
    },
  })
  .subscribe((config) => {
    // ...
  });
```

あるいは、ヘッダーの構築をより細かく制御する必要がある場合は、`HttpHeaders` のインスタンスを渡します。

IMPORTANT: `HttpHeaders` のインスタンスは*変更不可能*であり、直接変更できません。代わりに、`append()` などの変更メソッドは、変更が適用された新しい `HttpHeaders` のインスタンスを返します。

```ts
const baseHeaders = new HttpHeaders().set('X-Debug-Level', 'minimal');

http
  .get<Config>('/api/config', {
    headers: baseHeaders.set('X-Debug-Level', 'verbose'),
  })
  .subscribe((config) => {
    // ...
  });
```

## サーバーレスポンスイベントとの対話 {#interacting-with-the-server-response-events}

便宜上、`HttpClient` はデフォルトでサーバーによって返されるデータ（レスポンスボディ）の `Observable` を返します。場合によっては、特定のレスポンスヘッダーを取得するなど、実際のレスポンスを調べる必要がある場合もあります。

レスポンス全体にアクセスするには、`observe` オプションを `'response'` に設定します。

```ts
http.get<Config>('/api/config', {observe: 'response'}).subscribe((res) => {
  console.log('レスポンスステータス:', res.status);
  console.log('ボディ:', res.body);
});
```

<docs-callout important title="`observe` のリテラル値">
`observe` の値は、`HttpClient` によって返される型に影響を与えるため、`string` 型ではなく、リテラル型である必要があります。

これは、リクエストメソッドに渡されるオプションオブジェクトがリテラルオブジェクトの場合に自動的に発生しますが、リクエストオプションを変数やヘルパーメソッドに抽出している場合は、`observe: 'response' as const` のように明示的にリテラルとして指定する必要があるかもしれません。
</docs-callout>

## 生の進捗イベントを受信する {#receiving-raw-progress-events}

`HttpClient` は、レスポンスボディとレスポンスオブジェクトに加えて、リクエストライフサイクルの特定の時点に対応する生の*イベント*のストリームを返せます。これらのイベントには、リクエストが送信されたとき、レスポンスヘッダーが返されたとき、ボディが完了したときなどが含まれます。これらのイベントには、大きなリクエストボディとレスポンスボディのアップロードとダウンロードの状態を報告する*進捗イベント*も含まれる場合があります。

進捗イベントは、デフォルトでは無効になっています（パフォーマンス上のコストがかかるため）が、`reportProgress` オプションを使用して有効にできます。

NOTE: `HttpClient` のオプションの `fetch` 実装は、*アップロード*の進捗イベントを報告しません。

イベントストリームを観察するには、`observe` オプションを `'events'` に設定します。

```ts
http
  .post('/api/upload', myData, {
    reportProgress: true,
    observe: 'events',
  })
  .subscribe((event) => {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
        break;
      case HttpEventType.Response:
        console.log('Finished uploading!');
        break;
    }
  });
```

<docs-callout important title="`observe` のリテラル値">
`observe` の値は、`HttpClient` によって返される型に影響を与えるため、`string` 型ではなく、リテラル型である必要があります。

これは、リクエストメソッドに渡されるオプションオブジェクトがリテラルオブジェクトの場合に自動的に発生しますが、リクエストオプションを変数やヘルパーメソッドに抽出している場合は、`observe: 'events' as const` のように明示的にリテラルとして指定する必要があるかもしれません。
</docs-callout>

イベントストリームで報告される各 `HttpEvent` には、イベントを表す `type` があります。

| **`type` 値**                 | **イベントの意味**                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `HttpEventType.Sent`             | リクエストがサーバーに送信されました                                                     |
| `HttpEventType.UploadProgress`   | リクエストボディのアップロードの進捗状況を報告する `HttpUploadProgressEvent`            |
| `HttpEventType.ResponseHeader`   | レスポンスのヘッダーが受信されました。ステータスとヘッダーが含まれています                  |
| `HttpEventType.DownloadProgress` | レスポンスボディのダウンロードの進捗状況を報告する `HttpDownloadProgressEvent` |
| `HttpEventType.Response`         | レスポンス全体が受信されました。レスポンスボディが含まれています                         |
| `HttpEventType.User`             | Http インターセプターからのカスタムイベント                                           |

## リクエスト失敗の処理 {#handling-request-failure}

HTTPリクエストは、次の3つの方法で失敗する可能性があります。

- ネットワークエラーまたは接続エラーにより、リクエストがバックエンドサーバーに到達できない場合があります。
- timeoutオプションが設定されている場合に、リクエストが時間内に応答しませんでした。
- バックエンドがリクエストを受け取りますが、処理に失敗し、エラーレスポンスを返す場合があります。

`HttpClient` は、上記のすべての種類のエラーを `HttpErrorResponse` に捕捉し、`Observable` のエラーチャネルを通じて返します。ネットワークエラーとタイムアウトエラーの `status` コードは `0` で、`error` は [`ProgressEvent`](https://developer.mozilla.org/docs/Web/API/ProgressEvent) のインスタンスです。バックエンドエラーの `status` コードは、バックエンドによって返された失敗したコードであり、`error` はエラーレスポンスです。レスポンスを調べて、エラーの原因とエラーを処理するための適切なアクションを特定します。

[RxJS ライブラリ](https://rxjs.dev/) は、エラー処理に役立つ演算子をいくつか提供しています。

`catchError` 演算子を使用して、エラーレスポンスをUI用の値に変換できます。この値は、UIにエラーページまたは値を表示し、必要に応じてエラーの原因を捕捉します。

ネットワークの中断など、一時的なエラーにより、予期せずリクエストが失敗することがあります。リクエストを再試行するだけで成功する場合があります。RxJSは、特定の条件下で失敗した `Observable` に自動的に再購読する、複数の*再試行*演算子を提供しています。たとえば、`retry()` 演算子は、指定された回数だけ自動的に再サブスクライブを試みます。

### タイムアウト {#timeouts}

リクエストにタイムアウトを設定するには、他のリクエストオプションと一緒に `timeout` オプションをミリ秒数に設定できます。バックエンドリクエストが指定された時間内に完了しない場合、リクエストは中止され、エラーが発行されます。

NOTE: タイムアウトは、バックエンドHTTPリクエスト自体にのみ適用されます。リクエスト処理チェーン全体のタイムアウトではありません。したがって、このオプションは、インターセプターによって導入される遅延の影響を受けません。

```ts
http
  .get('/api/config', {
    timeout: 3000,
  })
  .subscribe({
    next: (config) => {
      console.log('設定の取得に成功:', config);
    },
    error: (err) => {
      // リクエストがタイムアウトした場合、エラーが発行されます。
    },
  });
```

## 高度な fetch オプション {#advanced-fetch-options}

`withFetch()` プロバイダーを使用する場合、Angularの `HttpClient` は、パフォーマンスとユーザー体験を改善できる高度なfetch APIオプションへのアクセスを提供します。これらのオプションは、fetchバックエンドを使用する場合にのみ利用できます。

### Fetch オプション {#fetch-options}

以下のオプションは、fetchバックエンドを使用する際のリクエスト動作を細かく制御します。

#### Keep-alive 接続 {#keep-alive-connections}

`keepalive` オプションにより、リクエストはそれを開始したページよりも長く存続できます。これは、ユーザーがページから移動した場合でも完了する必要がある分析やログリクエストに特に有用です。

```ts
http
  .post('/api/analytics', analyticsData, {
    keepalive: true,
  })
  .subscribe();
```

#### HTTP キャッシュ制御 {#http-caching-control}

`cache` オプションは、リクエストがブラウザのHTTPキャッシュとどのように相互作用するかを制御し、繰り返しリクエストのパフォーマンスを大幅に改善できます。

```ts
//  新鮮度に関係なくキャッシュされたレスポンスを使用
http
  .get('/api/config', {
    cache: 'force-cache',
  })
  .subscribe((config) => {
    // ...
  });

// 常にネットワークから取得、キャッシュをバイパス
http
  .get('/api/live-data', {
    cache: 'no-cache',
  })
  .subscribe((data) => {
    // ...
  });

// キャッシュされたレスポンスのみを使用、キャッシュにない場合は失敗
http
  .get('/api/static-data', {
    cache: 'only-if-cached',
  })
  .subscribe((data) => {
    // ...
  });
```

#### Core Web Vitals のためのリクエスト優先度 {#request-priority-for-core-web-vitals}

`priority` オプションを使用すると、リクエストの相対的な重要度を示すことができ、ブラウザがより良いCore Web Vitalsスコアのためにリソースの読み込みを最適化するのに役立ちます。

```ts
// 重要なリソースの高優先度
http
  .get('/api/user-profile', {
    priority: 'high',
  })
  .subscribe((profile) => {
    // ...
  });

// 重要でないリソースの低優先度
http
  .get('/api/recommendations', {
    priority: 'low',
  })
  .subscribe((recommendations) => {
    // ...
  });

// 自動優先度 (デフォルト) はブラウザーが決定
http
  .get('/api/settings', {
    priority: 'auto',
  })
  .subscribe((settings) => {
    // ...
  });
```

利用可能な `priority` 値：

- `'high'`: 高優先度、早期に読み込まれる（例：重要なユーザーデータ、above-the-foldコンテンツ）
- `'low'`: 低優先度、リソースが利用可能なときに読み込まれる（例：分析、プリフェッチデータ）
- `'auto'`: ブラウザがリクエストコンテキストに基づいて優先度を決定（デフォルト）

TIP: Largest Contentful Paint (LCP) に影響するリクエストには `priority: 'high'` を使用し、初期ユーザー体験に影響しないリクエストには `priority: 'low'` を使用してください。

#### リクエストモード {#request-mode}

`mode` オプションは、リクエストがクロスオリジンリクエストを処理する方法を制御し、レスポンスタイプを決定します。

```ts
// 同一オリジンリクエストのみ
http
  .get('/api/local-data', {
    mode: 'same-origin',
  })
  .subscribe((data) => {
    // ...
  });

// CORS が有効なクロスオリジンリクエスト
http
  .get('https://api.external.com/data', {
    mode: 'cors',
  })
  .subscribe((data) => {
    // ...
  });

// シンプルなクロスオリジンリクエストの No-CORS モード
http
  .get('https://external-api.com/public-data', {
    mode: 'no-cors',
  })
  .subscribe((data) => {
    // ...
  });
```

利用可能な `mode` 値：

- `'same-origin'`: 同一オリジンリクエストのみを許可、クロスオリジンリクエストは失敗
- `'cors'`: CORSでクロスオリジンリクエストを許可（デフォルト）
- `'no-cors'`: CORSなしでシンプルなクロスオリジンリクエストを許可、レスポンスは不透明

TIP: クロスオリジンに行くべきでない機密リクエストには `mode: 'same-origin'` を使用してください。

#### リダイレクト処理 {#redirect-handling}

`redirect` オプションは、サーバーからのリダイレクトレスポンスを処理する方法を指定します。

```ts
// リダイレクトを自動的に追跡（デフォルトの動作）
http
  .get('/api/resource', {
    redirect: 'follow',
  })
  .subscribe((data) => {
    // ...
  });

// 自動リダイレクトを防ぐ
http
  .get('/api/resource', {
    redirect: 'manual',
  })
  .subscribe((response) => {
    // リダイレクトを手動で処理
  });

// リダイレクトをエラーとして扱う
http
  .get('/api/resource', {
    redirect: 'error',
  })
  .subscribe({
    next: (data) => {
      // 成功レスポンス
    },
    error: (err) => {
      // リダイレクトレスポンスはこのエラーハンドラーをトリガーします
    },
  });
```

利用可能な `redirect` 値：

- `'follow'`: リダイレクトを自動的に追跡（デフォルト）
- `'error'`: リダイレクトをエラーとして扱う
- `'manual'`: リダイレクトを自動的に追跡せず、リダイレクトレスポンスを返す

TIP: カスタムロジックでリダイレクトを処理する必要がある場合は `redirect: 'manual'` を使用してください。

#### 認証情報の処理 {#credentials-handling}

`credentials` オプションは、Cookie、認証ヘッダー、その他の認証情報がクロスオリジンリクエストと一緒に送信されるかどうかを制御します。これは認証シナリオで特に重要です。

```ts
// クロスオリジンリクエストに認証情報を含める
http
  .get('https://api.example.com/protected-data', {
    credentials: 'include',
  })
  .subscribe((data) => {
    // ...
  });

// 認証情報を送信しない（クロスオリジンのデフォルト）
http
  .get('https://api.example.com/public-data', {
    credentials: 'omit',
  })
  .subscribe((data) => {
    // ...
  });

// 同一オリジンリクエストのみに認証情報を送信
http
  .get('/api/user-data', {
    credentials: 'same-origin',
  })
  .subscribe((data) => {
    // ...
  });

// withCredentials は credentials 設定を上書きします
http
  .get('https://api.example.com/data', {
    credentials: 'omit', // これは無視されます
    withCredentials: true, // これにより credentials: 'include' が強制されます
  })
  .subscribe((data) => {
    // credentials: 'omit' にもかかわらず、リクエストは認証情報を含みます
  });

// レガシーアプローチ（まだサポートされています）
http
  .get('https://api.example.com/data', {
    withCredentials: true,
  })
  .subscribe((data) => {
    // credentials: 'include' と同等
  });
```

IMPORTANT: `withCredentials` オプションは `credentials` オプションより優先されます。両方が指定されている場合、明示的な `credentials` 値に関係なく、`withCredentials: true` は常に `credentials: 'include'` になります。

利用可能な `credentials` 値：

- `'omit'`: 認証情報を送信しない
- `'same-origin'`: 同一オリジンリクエストのみに認証情報を送信（デフォルト）
- `'include'`: クロスオリジンリクエストでも常に認証情報を送信

TIP: CORSをサポートする異なるドメインに認証Cookieやヘッダーを送信する必要がある場合は `credentials: 'include'` を使用してください。混乱を避けるため、`credentials` と `withCredentials` オプションを混在させることは避けてください。

#### Referrer {#referrer}

`referrer` オプションを使用すると、リクエストと一緒に送信されるリファラー情報を制御できます。これは、プライバシーとセキュリティを考慮する上で重要です。

```ts
// 特定のリファラーURLを送信
http
  .get('/api/data', {
    referrer: 'https://example.com/page',
  })
  .subscribe((data) => {
    // ...
  });

// 現在のページをリファラーとして使用（デフォルトの動作）
http
  .get('/api/analytics', {
    referrer: 'about:client',
  })
  .subscribe((data) => {
    // ...
  });
```

`referrer` オプションは以下を受け入れます。

- 有効なURL文字列: 送信する特定のリファラーURLを設定
- 空文字列 `''`: リファラー情報を送信しない
- `'about:client'`: デフォルトのリファラー（現在のページのURL）を使用

TIP: 参照元ページのURLを漏らしたくない機密リクエストには `referrer: ''` を使用してください。

#### Referrerポリシー {#referrer-policy}

`referrerPolicy` オプションは、HTTPリクエストと一緒に送信されるリファラー情報（リクエストを行うページのURL）の量を制御します。この設定はプライバシーと分析の両方に影響し、データの可視性とセキュリティの考慮事項とのバランスを取ることができます。

```ts
// 現在のページに関係なくリファラー情報を送信しない
http
  .get('/api/data', {
    referrerPolicy: 'no-referrer',
  })
  .subscribe();

// オリジンのみを送信（例: https://example.com）
http
  .get('/api/analytics', {
    referrerPolicy: 'origin',
  })
  .subscribe();
```

`referrerPolicy` オプションは以下を受け入れます。

- `'no-referrer'` `Referer` ヘッダーを送信しません。
- `'no-referrer-when-downgrade'` 同一オリジンおよび安全な（HTTPS→HTTPS）リクエストにはリファラーを送信しますが、安全なオリジンから安全性の低いオリジンへ移動する場合（HTTPS→HTTP）は省略します。
- `'origin'` リファラーのオリジン（スキーム、ホスト、ポート）のみを送信し、パスとクエリ情報は省略します。
- `'origin-when-cross-origin'` 同一オリジンリクエストには完全なURLを送信しますが、クロスオリジンリクエストにはオリジンのみを送信します。
- `'same-origin'` 同一オリジンリクエストには完全なURLを送信し、クロスオリジンリクエストにはリファラーを送信しません。
- `'strict-origin'` オリジンのみを送信し、プロトコルのセキュリティレベルがダウングレードされない場合のみ（例: HTTPS→HTTPS）。ダウングレード時はリファラーを省略します。
- `'strict-origin-when-cross-origin'` デフォルトのブラウザ動作。同一オリジンリクエストには完全なURLを、ダウングレードされていないクロスオリジンリクエストにはオリジンを送信し、ダウングレード時はリファラーを省略します。
- `'unsafe-url'` 常に完全なURL（パスとクエリを含む）を送信します。これは機密データを公開する可能性があるため、注意して使用する必要があります。

TIP: プライバシーに配慮したリクエストには、`'no-referrer'`、`'origin'`、または `'strict-origin-when-cross-origin'` などの保守的な値を優先してください。

#### Integrity {#integrity}

`integrity` オプションを使用すると、期待されるコンテンツの暗号化ハッシュを提供することで、レスポンスが改ざんされていないことを検証できます。これは、CDNからスクリプトやその他のリソースを読み込む際に特に有用です。

```ts
// SHA-256ハッシュでレスポンスの整合性を検証
http
  .get('/api/script.js', {
    integrity: 'sha256-ABC123...',
    responseType: 'text',
  })
  .subscribe((script) => {
    // スクリプトのコンテンツがハッシュに対して検証されます
  });
```

IMPORTANT: `integrity` オプションには、レスポンスコンテンツと提供されたハッシュとの厳密な一致が必要です。コンテンツが一致しない場合、リクエストはネットワークエラーで失敗します。

TIP: 外部ソースから重要なリソースを読み込む際は、それらが変更されていないことを確実にするため、サブリソースの整合性を使用してください。`openssl` などのツールを使用してハッシュを生成してください。

## Http `Observable` {#http-observables}

`HttpClient` の各リクエストメソッドは、要求されたレスポンス型の `Observable` を構築して返します。これらの `Observable` の仕組みを理解することは、`HttpClient` を使用する場合に重要です。

`HttpClient` は、RxJSが「コールド」と呼ぶ `Observable` を生成します。つまり、`Observable` がサブスクライブされるまでは、実際のリクエストは行われません。リクエストが実際にサーバーに送信されるのは、そのときだけです。同じ `Observable` を複数回購読すると、複数のバックエンドリクエストがトリガーされます。各サブスクライブは独立しています。

Tip: `HttpClient` の `Observable` は、実際のリクエストの*ブループリント*と考えることができます。

いったんサブスクライブされると、アン購読すると、進行中のリクエストが中止されます。これは、`Observable` が `async` パイプを使用してサブスクライブされている場合に非常に便利です。ユーザーが現在のページから移動すると、リクエストが自動的にキャンセルされます。さらに、`Observable` を `switchMap` などのRxJSコンビネータと使用する場合、このキャンセルによって、古いリクエストがすべてクリーンアップされます。

レスポンスが返されると、`HttpClient` からの `Observable` は通常完了します（ただし、インターセプターがこれに影響を与える可能性があります）。

自動完了のため、`HttpClient` のサブスクライブがクリーンアップされなくても、通常はメモリリークのリスクはありません。ただし、他の非同期操作と同様に、サブスクライブを使用しているコンポーネントが破棄されたときにサブスクライブをクリーンアップすることを強くお勧めします。そうしないと、サブスクライブコールバックが実行され、破棄されたコンポーネントと対話するときにエラーが発生する可能性があります。

TIP: `async` パイプまたは `toSignal` 演算子を使用して `Observable` に購読すると、サブスクライブが適切に破棄されます。

## ベストプラクティス {#best-practices}

`HttpClient` はコンポーネントから直接注入して使用できますが、一般的にはデータアクセスロジックを分離してカプセル化する、再利用できる注入可能なサービスを作成することをお勧めします。たとえば、この `UserService` は、IDでユーザーのデータをリクエストするロジックをカプセル化しています。

```ts
@Injectable({providedIn: 'root'})
export class UserService {
  private http = inject(HttpClient);

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }
}
```

コンポーネント内で、`@if` を `async` パイプと組み合わせて、データの読み込みが完了した後にのみ、データのUIをレンダリングできます。

```angular-ts
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe],
  template: `
    @if (user$ | async; as user) {
      <p>名前: {{ user.name }}</p>
      <p>経歴: {{ user.biography }}</p>
    }
  `,
})
export class UserProfileComponent {
  userId = input.required<string>();
  user$!: Observable<User>;

  private userService = inject(UserService);

  constructor(): void {
    effect(() => {
      this.user$ = this.userService.getUser(this.userId());
    });
  }
}
```
