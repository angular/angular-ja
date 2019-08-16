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

## JSONデータを取得する

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

### なぜサービスを書くのか？

この例はとてもシンプルで、`Http.get()`をコンポーネント自身に書いてサービスは作りません。

しかし、データアクセスはめったにこのようなシンプルな形にはなりません。
典型的には、データの後処理、エラー処理の追加、断続的な接続に対処するためのリトライロジックなどがあります。

このコンポーネントは、データアクセスの細分化ですぐに乱雑になります。
コンポーネントの理解が難しくなり、テストが難しくなり、データアクセスロジックを再利用したり標準化することができなくなります。

そのため、このサービスのような単純なケースでも、データアクセスを別のサービスにカプセル化し、コンポーネント内のそのサービスに委任することによって、データの表示とデータアクセスを分離することがベストプラクティスです。

### レスポンスを型判定する

上記のサブスクライブのコールバックは、データ値を抽出するためにブラケット記法が必要です。

<code-example 
  path="http/src/app/config/config.component.ts"
  region="v1_callback">
</code-example>

`data.heroesUrl`と書くことはできません。TypeScriptは、サービスの`data`オブジェクトに`heroesUrl`プロパティがないと正しく警告するからです。

`HttpClient.get()`メソッドは、JSONのサーバーレスポンスを匿名の`Object`型に解析しました。そのオブジェクトの形が何であるかはわかりません。

`HttpClient`にレスポンスの型を伝えれば、アウトプットをより簡単かつ明瞭に使えます。

はじめに、正しい型でインターフェースを定義します。

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

更新されたコンポーネントメソッドのコールバックは、より簡単で安全な型指定されたデータオブジェクトを受け取ります。

<code-example 
  path="http/src/app/config/config.component.ts"
  region="v2"
  header="app/config/config.component.ts (showConfig v.2)">
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

### `retry()`

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

## JSON以外のデータをリクエストする

すべてのAPIがJSONデータを返すわけではありません。
この次の例では、`DownloaderService`メソッドはサーバーからテキストファイルを読み込み、`Observable<string>`としてファイルの内容を呼び出し元に返す前に、その内容を記録します。

<code-example 
  path="http/src/app/downloader/downloader.service.ts"
  region="getTextFile" 
  header="app/downloader/downloader.service.ts (getTextFile)">
</code-example>

`HttpClient.get()`は`responseType`オプションのためにデフォルトのJSONではなく文字列を返します。

RxJSの（「盗聴」のような）`tap`オペレーターは、Obervableを通して値の流れを妨害することなく正常値とエラー値をコードが検査できるようにします。

`DownloaderComponent`の`download()`メソッドは、サービスのメソッドを購読することによってリクエストを開始します。

<code-example 
  path="http/src/app/downloader/downloader.component.ts"
  region="download" 
  header="app/downloader/downloader.component.ts (download)">
</code-example>

## サーバーにデータを送る

`HttpClient`は、サーバーからデータを取得するだけでなく、PUT、POST、DELETEなどの他のHTTPメソッドを使用してサーバーにデータを送信するという、変更リクエストをサポートします。

このガイドのサンプルアプリケーションには、ヒーローを取得してユーザーが追加、削除、および更新できるようにする、ツアー・オブ・ヒーローの簡略版が含まれています。

次のセクションでは、サンプルのHeroesServiceメソッドの抜粋を示します。

{@a adding-headers}
### ヘッダーを追加する

多くのサーバーでは、保存操作に追加のヘッダーが必要です。
たとえば、リクエストボディのMIMEタイプを明示的に宣言するために、「Content-Type」ヘッダーが必要な場合があります。
あるいは、サーバーに認証トークンが必要なのかもしれません。

`HeroesService`は、`HttpClient`の保存操作ごとに渡される`httpOptions`オブジェクトでそのようなヘッダーを定義しています。

<code-example 
  path="http/src/app/heroes/heroes.service.ts"
  region="http-options" 
  header="app/heroes/heroes.service.ts (httpOptions)">
</code-example>

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

### リクエストの設定

外部へのリクエストの他の設定は、`HttpClient`メソッドの最後の引数として渡されたオプションオブジェクトを介して行えます。

`HeroesService`がオプションオブジェクト（`httpOptions`）をその保存メソッドに渡すことでデフォルトヘッダーを設定していることを[前に](#adding-headers)見てきました。
もっと他のこともできます。

#### ヘッダーを更新する

`HttpHeaders`クラスのインスタンスはイミュータブルなので、以前のオプションオブジェクト内の既存のヘッダを直接変更することはできません。

代わりに`set()`メソッドを使用してください。
新しい変更が適用された現在のインスタンスのクローンを返します。

（以前のトークンが期限切れになった後に）次のリクエストを行う前に、承認ヘッダーを更新する方法は次のとおりです。

<code-example 
  path="http/src/app/heroes/heroes.service.ts"
  region="update-headers">
</code-example>

#### URLパラメータ

URL検索パラメータを追加する方法も同様です。
名前に検索語が含まれるヒーローを照会する`searchHeroes`メソッドがあります。

<code-example 
  path="http/src/app/heroes/heroes.service.ts"
  region="searchHeroes">
</code-example>

検索語であるtermがある場合、コードは、HTML URLエンコードされた検索パラメータを使用してオプションオブジェクトを作成します。
termが「foo」の場合、GETリクエストURLは`api/heroes/?name=foo`になります。

`HttpParams`はイミュータブルなので、`set()`メソッドを使ってオプションを更新する必要があります。

### リクエストのデバウンス

このサンプルには_npmパッケージのsearch_機能が含まれています。

ユーザーが検索ボックスに名前を入力すると、「PackageSearchComponent」は、その名前をもつパッケージの検索リクエストをNPMのwebAPIに送信します。

ここにテンプレートからの関連する抜粋があります。

<code-example 
  path="http/src/app/package-search/package-search.component.html"
  region="search" 
  header="app/package-search/package-search.component.html (search)">
</code-example>

`(keyup)`イベントバインディングはすべてのキーストロークをコンポーネントの`search()`メソッドに送ります。

すべてのキーストロークに対してリクエストを送信することは高いコストになる可能性があります。
ユーザーが入力をやめるのを待ってからリクエストを送信する方がよいでしょう。
この抜粋に示すように、RxJSオペレーターで実装すれば簡単です。

<code-example 
  path="http/src/app/package-search/package-search.component.ts"
  region="debounce" 
  header="app/package-search/package-search.component.ts (excerpt)">
</code-example>

`searchText$`は、ユーザーからの検索ボックス値のシーケンスです。
RxJSの`Subject`として定義されています。これは、`search()`メソッドのように、`next(value)`を呼び出すことによって値を生成するマルチキャスト`Observable`を意味します。

注入された`PackageSearchService`にすべての`searchText`値を直接転送するのではなく、`ngOnInit()`のコードは3つのオペレーターを使って検索値を_パイプ_します。

1. `debounceTime(500)` - ユーザーが入力を停止するのを待ちます（この場合は1/2秒）。
1. `distinctUntilChanged()` - 検索テキストが変わるまで待ちます。
1. `switchMap()` - 検索リクエストをサービスに送ります。

コードでは、この再構成された検索結果の`Observable`に`packages$`をセットします。
テンプレートは[AsyncPipe](api/common/AsyncPipe)を使用して`packages$`を購読し、値が来たら検索結果を表示します。

検索値が新しい値であり、ユーザーが入力を停止した場合にのみ、値がサービスに到達します。

<div class="alert is-helpful">

`withRefresh`オプションについては[後述](#cache-refresh)します。

</div>

#### _switchMap()_

`switchMap()`オペレーターには3つの重要な特徴があります。

1. `Observable`を返す関数の引数をとります。
`PackageSearchService.search`は他のデータサービスメソッドと同様に`Observable`を返します。

2. 以前の検索リクエストがまだ_実行中である場合_（接続が悪い場合など）、そのリクエストをキャンセルして新しいリクエストを送信します。

3. サーバーがそれらを順不同で戻しても、サービスのレスポンスは元のリクエストの順序で戻されます。


<div class="alert is-helpful">

このデバウンスロジックを再利用しようと考えるなら、ユーティリティ関数または`PackageSearchService`自体に移すことを検討してください。

</div>

{@a intercepting-requests-and-responses}

### リクエストとレスポンスのインターセプト

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
`HttpResponse`クラス自体は実際にはイベントで、その型は`HttpEventType.HttpResponseEvent`です。

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

[XSRF(Cross-Site Request Forgery)](https://en.wikipedia.org/wiki/Cross-site_request_forgery)は、攻撃者が認証されたユーザーにそうとは知らずにあなたのWebサイト上のアクションを実行させる攻撃手法です。`HttpClient`は、XSRF攻撃を防ぐための[共通メカニズム](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-Header_Token)をサポートしています。
HTTPリクエストを実行するとき、インターセプターはデフォルトでは`XSRF-TOKEN`によってクッキーからトークンを読み込み、それをHTTPヘッダの`X-XSRF-TOKEN`として設定します。
ドメイン上で動作するコードだけがCookieを読み取ることができるため、バックエンドはHTTPリクエストが攻撃者ではなくクライアントアプリケーションからのものであることを保証できます。

デフォルトでは、インターセプターは相対URLへのすべての変更リクエスト（POSTなど）に対してこのヘッダーを送信しますが、GET/HEADリクエストや絶対URLには送りません。

これを利用するには、サーバーがページ読み込みまたは最初のGET要求のいずれかで、`XSRF-TOKEN`というJavaScriptで読み取れるセッションクッキーにトークンを設定する必要があります。
その後のリクエストでは、サーバーはCookieが`X-XSRF-TOKEN`HTTPヘッダーと一致することを検証することができ、したがって、ドメイン上で実行されているコードだけがリクエストを送信できたと確認できます。
トークンは、各ユーザーごとに一意でなければならず、サーバーによって検証可能でなければなりません。これにより、クライアントは独自のトークンを作成することができなくなります。
セキュリティを強化するために、トークンをサイトの認証クッキーのダイジェストに設定します。

複数のAngularアプリケーションが同じドメインまたはサブドメインを共有する環境での衝突を防ぐために、各アプリケーションに固有のCookie名を付けましょう。

<div class="alert is-important">

*`HttpClient`のサポートはクライアント側だけであり、XSRFプロテクションのスキーマの半分だけであることに注意しましょう。*
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

{@a testing-http-requests}
## HTTPリクエストをテストする

外部依存関係と同様に、HTTPバックエンドをモックして、テストでリモートサーバーとのやりとりをシミュレートできるようにする必要があります。
`@angular/common/http/testing`ライブラリでは、そのようなモッキングを簡単に設定できます。

### モックの思想

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
