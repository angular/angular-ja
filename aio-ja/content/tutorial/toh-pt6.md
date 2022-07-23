# サーバーからデータの取得

このチュートリアルではAngularの`HttpClient`を使用して、次のデータ永続の機能を追加します。

* `HeroService`はHTTPリクエストを介してヒーローデータを取得します。
* ユーザーはヒーロー情報を追加、編集、削除ができ、その変更をHTTPを通して保存することができます。
* ユーザーは名前でヒーロー情報を検索できます。

<div class="alert is-helpful">

For the sample application that this page describes, see the <live-example></live-example>.

</div>

## HTTPサービスの有効化

`HttpClient` はHTTPを通してリモートサーバーと通信するための仕組みです。

2つのステップでアプリケーションのどこでも `HttpClient`を利用できるようにします。
まず、インポートしてルートの `AppModule`に追加します：

<code-example header="src/app/app.module.ts (HttpClientModule import)" path="toh-pt6/src/app/app.module.ts" region="import-http-client"></code-example>

次に、また `AppModule`で、`HttpClientModule` を `imports`配列に追加します。

<code-example header="src/app/app.module.ts (imports array excerpt)" path="toh-pt6/src/app/app.module.ts" region="import-httpclientmodule"></code-example>

## データサーバーをシミュレートする

本チュートリアルでは [In-memory Web API](https://github.com/angular/angular/tree/main/packages/misc/angular-in-memory-web-api "インメモリWebAPI")モジュールを利用してリモートデータサーバーとの通信を再現します。

このモジュールをインストールすると、アプリケーションは*インメモリWeb API*がリクエストをインターセプトして、そのリクエストをインメモリデータストアに適用します。アプリケーションは、シミュレートされたレスポンスを返すということを知らずに`HttpClient`を使ってリクエストを送信し、レスポンスを受信することができます。

インメモリWeb APIを使用すると、 `HttpClient`について学習するためにサーバーを設定する必要がなくなります。

<div class="alert is-important">

**IMPORTANT**: <br />
インメモリWeb APIモジュールはAngularのHTTPとは関係がありません。

`HttpClient`を学ぶためにこのチュートリアルを読んでいるのであれば、このステップを[読み飛ばして](#import-heroes)ください。
本チュートリアルとともにコーディングしている場合は、ここでインメモリWeb APIを追加しましょう。

</div>

次のコマンドを使用して、npmからインメモリWeb APIパッケージをインストールします。

<code-example format="shell" language="shell">

npm install angular-in-memory-web-api --save

</code-example>

`AppModule` で、`HttpClientInMemoryWebApiModule`と、次に作成する`InMemoryDataService`クラスをインポートします

<code-example header="src/app/app.module.ts (In-memory Web API imports)" path="toh-pt6/src/app/app.module.ts" region="import-in-mem-stuff"></code-example>

`HttpClientModule`の後に、`HttpClientInMemoryWebApiModule`を `AppModule`の`imports`配列に追加し、 `InMemoryDataService`を使って設定します。

<code-example header="src/app/app.module.ts (imports array excerpt)" path="toh-pt6/src/app/app.module.ts" region="in-mem-web-api-imports"></code-example>

`forRoot()` 設定メソッドは、インメモリデータベースを準備する `InMemoryDataService`クラスを取ります。

次のコマンドで `src/app/in-memory-data.service.ts` クラスを生成します:

<code-example format="shell" language="shell">

ng generate service InMemoryData

</code-example>

`in-memory-data.service.ts`のデフォルトの内容を次のものに置き換えます:

<code-example header="src/app/in-memory-data.service.ts" path="toh-pt6/src/app/in-memory-data.service.ts" region="init"></code-example>

`in-memory-data.service.ts`ファイルは` mock-heroes.ts`の機能を引き継ぎます。
ただし、このチュートリアルのいくつかのステップで必要になるため、まだ `mock-heroes.ts`を削除しないでください。

サーバーが準備されたら、インメモリWeb APIを外せば、アプリケーションのリクエストはサーバーに送信されます。

<a id="import-heroes"></a>

## ヒーローとHTTP {@a heroes-and-http}

`HeroService`で、`HttpClient`と`HttpHeaders`をインポートします。

<code-example header="src/app/hero.service.ts (import HTTP symbols)" path="toh-pt6/src/app/hero.service.ts" region="import-httpclient"></code-example>

引き続き`HeroService`で、`HttpClient`をプライベートプロパティ`http`にコンストラクターで注入します。

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="ctor" ></code-example>

`MessageService`は注入したままですが、頻繁に呼び出すため、プライベートの `log()` メソッドでラップすることに注意してください。

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="log" ></code-example>

サーバー上のヒーローリソースのアドレスで`:base/:collectionName`の形式の `heroesUrl` を定義します。
ここで `base` はリクエストが行われるリソースであり、`collectionName` は `in-memory-data-service.ts`のヒーローデータオブジェクトです。

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="heroesUrl" ></code-example>

### `HttpClient`を使ってヒーローを取得する

現在の`HeroService.getHeroes()`はRxJSの`of()`を使って、モックのヒーロー配列を`Observable<Hero[]>`として返します。

<code-example header="src/app/hero.service.ts (getHeroes with RxJs 'of()')" path="toh-pt4/src/app/hero.service.ts" region="getHeroes-1"></code-example>
</code-example>

このメソッドを`HttpClient`を使うように次のように変更します。

<code-example header="src/app/hero.service.ts" path="toh-pt6/src/app/hero.service.ts" region="getHeroes-1"></code-example>

ブラウザをリフレッシュしましょう。
ヒーローデータがモックサーバーから正しくロードされているはずです。

`of()`と`http.get()`を取り替えましたが、どちらの関数も`Observable<Hero[]>`を返すので、アプリケーションは他の変更を加えずに動作しています。

### `HttpClient`のメソッドはひとつの値を返す

すべての`HttpClient`メソッドはRxJSの`Observable`を返します。

HTTPはリクエスト/レスポンスプロトコルです。
リクエストを送信すると、ひとつのレスポンスを返却します。

一般には、Observableは時間によって複数の値を返すことが _可能_ です。
`HttpClient`が返すObservableは常にひとつの値を発行してから完了するので、再び値を発行することはありません。

特に今回の`HttpClient.get()`の呼び出しは`Observable<Hero[]>`、つまり「_ヒーローの配列のobservable_」です。
実際にやってみると、ひとつのヒーロー配列を返します。

### `HttpClient.get()`はレスポンスデータを返す

`HttpClient.get()`はデフォルトではレスポンスの本文を型のないJSONで返します。
オプションの型指定子 `<Hero[]>` を適用すると、TypeScriptの機能が追加され、コンパイル時のエラーが少なくなります。

サーバーのデータAPIがJSONデータの形状を決定します。
_Tour of Heroes_のデータAPIはヒーロー情報を配列で返します。

<div class="alert is-helpful">

他のAPIでは取得したいデータがオブジェクトの中に埋もれているかもしれません。
その場合は、RxJSの`map()`オペレーターを使って`Observable`を処理してデータを掘り出します。

ここでは取り扱いませんが、サンプルソースコード内にある`getHeroNo404()`メソッドに`map()`の例があります。

</div>

### エラーハンドリング

リモートサーバーからのデータを受け取るときに、何かうまくいかない場合があります。
`HeroService.getHeroes()`メソッドはエラーをキャッチして、適切に対応するべきです。

エラーをキャッチするには`http.get()`で得られた`observerable`な結果をRxJSの`catchError()`オペレーターに**パイプ**します。

あとで必要になるオペレーターと一緒に、`rxjs/operators`から`catchError`をインポートします。

<code-example header="src/app/hero.service.ts" path="toh-pt6/src/app/hero.service.ts" region="import-rxjs-operators"></code-example>

それではobservableの結果を`pipe()`で拡張して、それを`catchError()`オペレーターに渡しましょう。

<code-example header="src/app/hero.service.ts" path="toh-pt6/src/app/hero.service.ts" region="getHeroes-2"></code-example>

`catchError()`オペレーターは**失敗したObservable**に割り込みます。
そうするとオペレーターはエラーをエラーハンドリング関数に渡します。

次の`handleError()`メソッドはエラーを報告し、アプリケーションを動作し続けるために無害な結果を返します。

#### `handleError`

次の`handleError()`は数々の`HeroService`メソッドで共有されるので、さまざまな要件を満たすために一般化されています。

エラーを直接ハンドリングするかわりに、処理に失敗した処理の名前と、安全な返却値の両方で構成されたエラーハンドラー関数を`catchError`に返します。

<code-example header="src/app/hero.service.ts" path="toh-pt6/src/app/hero.service.ts" region="handleError"></code-example>

エラーをコンソールに出力したあと、ハンドラーはユーザーフレンドリーなメッセージを生成し、アプリケーションを動作し続けるための安全な値を返却します。

サービスの各メソッドはそれぞれ違う種類の`Observable`な結果を返すため、`handleError()`は型パラメーターを取り、アプリケーションが期待する型の値を返却できます。

### `Observable`に侵入

`HeroService`のメソッドはObservableな値の流れに入り込んで、`log()`メソッドを通してページ下部にメッセージを送信します。

これはRxJSの`tap()`オペレーターを使って行います。これはObservableな値を見て、その値に何か処理を行い、それらを渡します。
`tap()`コールバックは、値そのものには触れません。

次が、ログ処理を`tap()`した`getHeroes()`の最終版です。

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts"  region="getHeroes" ></code-example>

### IDでヒーローを取得する

ほとんどのWeb APIは、 `：baseURL/:id`の形式で_idによる取得する_リクエストをサポートしています。

ここで *base URL* は[Heroes and HTTP](tutorial/toh-pt6#heroes-and-http)セクションで定義された `heroesURL` （`api/heroes`）であり、 *id* は取得したいヒーローの番号です。
たとえば、 `api/heroes/11` のようになります。

`HeroService`の `getHero()` メソッドを次のように更新して、そのリクエストを行います:

<code-example header="src/app/hero.service.ts" path="toh-pt6/src/app/hero.service.ts" region="getHero"></code-example>

`getHero()` は `getHeroes()`とくらべて3つ重要な違いがあります。

* `getHero()`は求めたいヒーローのIDを含んだURLを生成する
* サーバーはヒーローたちの配列ではなく、一人のヒーローの情報を返す必要がある
* したがって、`getHero()`はヒーローの*配列*のObservableを返すのではなく、`Observable<Hero>` (ヒーローの*オブジェクト*のObservable)を返す

## ヒーローを更新する

ヒーロー詳細画面で、ヒーローの名前を編集します。
タイプすると、ページ上部のヒーローの名前が更新されます。
ですが、**Go back** をクリックすると、その変更は失われてしまいます。

その変更を永続化したい場合は、それをサーバーに送り返す必要があります。

ヒーロー詳細ページのテンプレートの終わりに、新しい`save()`というメソッドを呼び出す保存ボタンを追加します。

<code-example header="src/app/hero-detail/hero-detail.component.html (save)" path="toh-pt6/src/app/hero-detail/hero-detail.component.html" region="save"></code-example>

`HeroDetail` コンポーネントクラスの中で、`HeroService` の`updateHero()`を呼び出して名前の変更を永続化したのち、前のビューに戻る`save()`メソッドを追加しましょう。

<code-example header="src/app/hero-detail/hero-detail.component.ts (save)" path="toh-pt6/src/app/hero-detail/hero-detail.component.ts" region="save"></code-example>

#### `HeroService.updateHero()`の追加

`updateHero()`メソッドの全体の構造は`getHeroes()`のそれと似ていますが、こちらではサーバー上でヒーローの変更を永続化するために`http.put()`を使用しています。
`HeroService`クラスに以下を追加します。

<code-example header="src/app/hero.service.ts (update)" path="toh-pt6/src/app/hero.service.ts" region="updateHero"></code-example>

`HttpClient.put()`メソッドは3つのパラメーターを取ります。

* URL
* アップデート用のデータ (今回の場合は編集されたヒーロー)
* オプション

URLは変わりません。
ヒーローWeb APIはヒーローの`id`を見てどのヒーローを更新すべきかを知ります。

ヒーローWeb APIはHTTPの保存リクエストのとき特別なヘッダーを期待します。
そのヘッダーは`HeroService`の定数`httpOptions`で定義されています。 
`HeroService`クラスに以下を追加しましょう。

<code-example header="src/app/hero.service.ts" path="toh-pt6/src/app/hero.service.ts" region="http-options"></code-example>

ブラウザをリフレッシュして、ヒーローの名前を変更して、変更を保存しましょう。
`HeroDetailComponent`の`save()`メソッドは前のビューに移動します。
リストに変更された名前のヒーローが現れているはずです。

## 新しいヒーローを追加する

ヒーローを追加するためには、このアプリケーションではヒーローの名前だけ必要です。
追加ボタンとペアになった`<input>`要素が使えます。

下記を`HeroesComponent`のテンプレートの先頭に挿入します。

<code-example header="src/app/heroes/heroes.component.html (add)" path="toh-pt6/src/app/heroes/heroes.component.html" region="add"></code-example>

クリックイベントに反応し、コンポーネントのクリックハンドラーである `add()` が呼び出され、そのあと次の名前の入力を可能にするためにinputフィールドをクリアします。
以下を `HeroesComponent`クラスに追加します:

<code-example header="src/app/heroes/heroes.component.ts (add)" path="toh-pt6/src/app/heroes/heroes.component.ts" region="add"></code-example>

与えられた名前が空文字でない場合、ハンドラーは名前から(`id`だけが抜けた)`Hero`-ライクなオブジェクトを作成し、
サービスの`addHero()`メソッドに渡します。

`addHero()`が正常に登録すると、`subscribe()`コールバックが新しいヒーローを受け取り、表示用の`heroes`リストに追加します。

`HeroService`クラスに次のメソッド`addHero()`を追加します。

<code-example header="src/app/hero.service.ts (addHero)" path="toh-pt6/src/app/hero.service.ts" region="addHero"></code-example>

`HeroService.addHero()`は`updateHero()`と2つ違う点があります。

* `put()`の代わりに`HttpClient.post()`を呼び出します。
* サーバーで新しいヒーローのIDが生成されることを期待します。そしてそれは呼び出し元に`Observable<Hero>`として戻ります。

ブラウザをリフレッシュして、いくつかヒーローを登録しましょう。

## ヒーローを削除する

リスト内の各ヒーローは削除ボタンをもつべきです。

次のボタンを`HeroesComponent`のテンプレートに追加します。繰り返されている`<li>`エレメント内のヒーロー名の後ろです。

<code-example header="src/app/heroes/heroes.component.html" path="toh-pt6/src/app/heroes/heroes.component.html" region="delete"></code-example>

ヒーローたちのリストのHTMLは次のようになるはずです。

<code-example header="src/app/heroes/heroes.component.html (list of heroes)" path="toh-pt6/src/app/heroes/heroes.component.html" region="list"></code-example>

削除ボタンをヒーローエントリーの右端に配置するには、[最終確認コード](#heroescomponent)にあるCSSを `heroes.component.css` に追加してください。

`delete()`ハンドラーをコンポーネントクラスに追加しましょう。

<code-example header="src/app/heroes/heroes.component.ts (delete)" path="toh-pt6/src/app/heroes/heroes.component.ts" region="delete"></code-example>

削除処理は`HeroService`に任されますが、コンポーネントでもそれ自身がもつヒーローリストの更新処理は必要です。
コンポーネント側の`delete()`メソッドは`HeroService`がサーバーとの処理を成功するものと予測して、*削除されるべきヒーロー*をリストから即座に削除します。

`heroService.delete()`が返却する`Observable`に対してはコンポーネント側で何もする必要はありません。**しかし、いずれにしろsubscribeはしなければなりません**

<div class="alert is-important">

もし`subscribe()`をし忘れると、サービスはDELETEリクエストをサーバーに送信しません！
ルールとして、`Observable`はsubscribeされるまで_なにもしません_

これを確認するためには、一時的に`subscribe()`を外して、**Dashboard**をクリックし、それから**Heroes**をクリックしてください。
そうするとヒーローのフルリストが再び現れるはずです。

</div>

次に、このように`HeroService`にメソッド`deleteHero()`を追加しましょう。

<code-example header="src/app/hero.service.ts (delete)" path="toh-pt6/src/app/hero.service.ts" region="deleteHero"></code-example>

次の重要な点に注意してください。

* `deleteHero()`が`HttpClient.delete`を呼び出しています。
* URLはヒーローリソースのURLと削除するヒーローの`id`です。
* `put()`や`post()`で行っていたようなデータ送信はしません。
* `httpOptions`は送信しています。

ブラウザをリフレッシュして、新しい削除機能を試しましょう。

## 名前で検索する

この最後のエクササイズでは、`Observable`オペレーターの連結を学んで、同じようなHTTPリクエストの数を減らし、効率よくネットワーク帯域を使えるようにします。

### ダッシュボードにヒーロー検索機能を追加する

ユーザーが検索ボックスに名前をタイプすると、その名前でフィルターするHTTPリクエストを繰り返し送信します。
ゴールは必要最低限のリクエストを送信することです。

#### `HeroService.searchHeroes`

`HeroService`に`searchHeroes()`メソッドを追加するところから始めましょう。

<code-example header="src/app/hero.service.ts" path="toh-pt6/src/app/hero.service.ts" region="searchHeroes"></code-example>

検索ワードがない場合、このメソッドはただちに空の配列を返します。
それ以外の場合は`getHeroes()`ととても似ています。ただひとつの重要な違いはURLで、検索ワードがついたクエリ文字列を含んでいます。

### ダッシュボードに検索を追加

`DashboardComponent`のテンプレートを開いて、
ヒーロー検索のエレメント、`<app-hero-search>`をマークアップの下部に追加します。

<code-example header="src/app/dashboard/dashboard.component.html" path="toh-pt6/src/app/dashboard/dashboard.component.html"></code-example>

このテンプレートは`HeroesComponent`のテンプレートの`*ngFor`にとても似ています。

これが機能するための次のステップは、 `<app-hero-search>`に一致するセレクターをもつコンポーネントを追加することです。

### `HeroSearchComponent` を作成する

`ng generate` で `HeroSearchComponent`を作ります。

<code-example format="shell" language="shell">

ng generate component hero-search

</code-example>

`ng generate` は `HeroSearchComponent` ファイルを作成し、`AppModule`のdeclarationsにそのコンポーネントを追加します。

作成された`HeroSearchComponent`のテンプレートを次のようにテキストボックスと、マッチした検索結果一覧を表示するように書き換えます。

<code-example header="src/app/hero-search/hero-search.component.html" path="toh-pt6/src/app/hero-search/hero-search.component.html"></code-example>

下にある[final code review](#herosearchcomponent)にあるようにプライベートCSSスタイルを`hero-search.component.css`に追加します。

ユーザーが検索ボックス内でタイプすると、inputイベントのバインディングがコンポーネントの`search()`メソッドを呼び出して、検索ボックス内の新しい値を渡します。

<a id="asyncpipe"></a>

### `AsyncPipe`

`*ngFor`はヒーローオブジェクトを繰り返します。 
`*ngFor` は `heroes`ではなく`heroes$`というリストを反復処理することに注意してください。 
`$` は、`heroes$`が配列ではなく`Observable`であることを示す規則です。

<code-example header="src/app/hero-search/hero-search.component.html" path="toh-pt6/src/app/hero-search/hero-search.component.html" region="async"></code-example>

`*ngFor`は`Observable`では何もできないので、パイプ文字（ `|`）に続けて `async`を使用します。 
これにより、Angularの`AsyncPipe`が識別され、`Observable`が自動的にサブスクライブされるため、コンポーネントクラスでこれを行う必要はありません。

### `HeroSearchComponent`クラスを変更する

生成された`HeroSearchComponent`クラスとメタデータを次のように置き換えます。

<code-example header="src/app/hero-search/hero-search.component.ts" path="toh-pt6/src/app/hero-search/hero-search.component.ts"></code-example>

`heroes$`の宣言が`Observable`であることに注意しましょう。

<code-example header="src/app/hero-search/hero-search.component.ts" path="toh-pt6/src/app/hero-search/hero-search.component.ts" region="heroes-stream"></code-example>

これを[`ngOnInit()`](#search-pipe)内でセットします。
これをする前に、`searchTerms`の定義に注目しましょう。

### RxJS subjectの`searchTerms`

`searchTerms`プロパティはRxJSの`Subject`です。

<code-example header="src/app/hero-search/hero-search.component.ts" path="toh-pt6/src/app/hero-search/hero-search.component.ts" region="searchTerms"></code-example>

`Subject`はobservableな値の元でもあり、`Observable`そのものでもあります。
`Observable`にするように`Subject`をsubscribeすることができます。

また、`search()`メソッドで実行している様に、`next(value)`メソッドを呼ぶことで、`Observable`に値をpushすることができます。

テキストボックスの`input`イベントへのイベントバインディングは、`search()`メソッドを呼び出します。

<code-example header="src/app/hero-search/hero-search.component.html" path="toh-pt6/src/app/hero-search/hero-search.component.html" region="input"></code-example>

テキストボックス内でユーザーがタイプするたびに、テキストボックスの値、検索語と共に`search()`を呼び出します。
`searchTerms`は検索語の安定したストリームを発行する`Observable`になります。

<a id="search-pipe"></a>

### RxJSオペレーターの連結

ユーザーのすべてのキーストロークの度に`searchHeroes()`に新しい検索語を渡していては、極端に多いHTTPリクエストを送信することになり、サーバーリソースを圧迫したり、データプランをすぐに溶かしたりしてしまいます。

代わりに、`ngOnInit()`メソッドが`searchTerms` observableを`searchHeroes()`を呼ぶ回数を抑えるためのいくつかのRxJSオペレーターをつなげていて、最終的にヒーローのタイムリーな検索結果のobservable(それぞれは`Hero[]`)を返します。

コードを詳しく見てみましょう。

<code-example header="src/app/hero-search/hero-search.component.ts" path="toh-pt6/src/app/hero-search/hero-search.component.ts" region="search"></code-example>

各オペレーターは次のように機能します。

* `debounceTime(300)`は最新の文字列を渡す前に、
新しい文字列の入力を300ミリ秒待ちます。

* `distinctUntilChanged`はフィルター用の文字列が変わったときだけリクエストを送信することを保証します。

* `switchMap()`は`debounce()`と`distinctUntilChanged()`を通過した各検索語について検索サービスを呼び出します。
これはそれまでの検索のobservableをキャンセルし、最新の検索サービスのobservableだけを返します。

<div class="alert is-helpful">

[switchMap operator](https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap)によりすべての適格なキーイベントが`HttpClient.get`メソッドを呼び出すことができます。
各リクエスト間の300msの休止により、複数のHTTPリクエストを送信できますが、それらは順序どおりに戻ってこないかもしれません。

`swtichMap()`は元のリクエスト順を保持しますが、もっとも新しいHTTPメソッドコールからのobservableのみを返します。
前の呼び出しはキャンセルされ、破棄されます。

<div class="alert is-helpful">

前の`searchHeroes()`のObservableをキャンセルするというのは実際には保留中のHTTPリクエストを中止しているということに注意してください。
不本意な結果はアプリケーションのコードに到達する前に破棄されます。

</div>

</div>

コンポーネント_クラス_が`heroes$`_observable_をsubscribeしていないことを思い出してください。
それはテンプレート内の[`AsyncPipe`](#asyncpipe)の役割です。

#### 試してみよう

アプリケーションを再度起動しましょう。
*Dashboard*にて、検索ボックスで何かテキストを入力してください。
ヒーロー名にマッチするような文字を入力すると、こんなふうに見えるはずです。

<div class="lightbox">

<img alt="Hero Search field with the letters 'm' and 'a' along with four search results that match the query displayed in a list beneath the search input" src="generated/images/guide/toh/toh-hero-search.gif">

</div>

## 最終的なコードレビュー

これがこのページで説明していたコードファイルです。(すべて`src/app/`フォルダーの中にあります)

<a id="heroservice"></a>
<a id="inmemorydataservice"></a>

<a id="appmodule"></a>

#### `HeroService`, `InMemoryDataService`, `AppModule`

<code-tabs>
    <code-pane header="hero.service.ts" path="toh-pt6/src/app/hero.service.ts"></code-pane>
    <code-pane header="in-memory-data.service.ts" path="toh-pt6/src/app/in-memory-data.service.ts"></code-pane>
    <code-pane header="app.module.ts" path="toh-pt6/src/app/app.module.ts"></code-pane>
</code-tabs>

<a id="heroescomponent"></a>

#### `HeroesComponent`

<code-tabs>
    <code-pane header="heroes/heroes.component.html" path="toh-pt6/src/app/heroes/heroes.component.html"></code-pane>
    <code-pane header="heroes/heroes.component.ts" path="toh-pt6/src/app/heroes/heroes.component.ts"></code-pane>
    <code-pane header="heroes/heroes.component.css" path="toh-pt6/src/app/heroes/heroes.component.css"></code-pane>
</code-tabs>

<a id="herodetailcomponent"></a>

#### `HeroDetailComponent`

<code-tabs>
    <code-pane header="hero-detail/hero-detail.component.html" path="toh-pt6/src/app/hero-detail/hero-detail.component.html"></code-pane>
    <code-pane header="hero-detail/hero-detail.component.ts" path="toh-pt6/src/app/hero-detail/hero-detail.component.ts"></code-pane>
    <code-pane header="hero-detail/hero-detail.component.css" path="toh-pt6/src/app/hero-detail/hero-detail.component.css"></code-pane>
</code-tabs>

<a id="dashboardcomponent"></a>

#### `DashboardComponent`

<code-tabs>
    <code-pane header="dashboard/dashboard.component.html" path="toh-pt6/src/app/dashboard/dashboard.component.html"></code-pane>
    <code-pane header="dashboard/dashboard.component.ts" path="toh-pt6/src/app/dashboard/dashboard.component.ts"></code-pane>
    <code-pane header="dashboard/dashboard.component.css" path="toh-pt6/src/app/dashboard/dashboard.component.css"></code-pane>
</code-tabs>

<a id="herosearchcomponent"></a>

#### `HeroSearchComponent`

<code-tabs>
    <code-pane header="hero-search/hero-search.component.html" path="toh-pt6/src/app/hero-search/hero-search.component.html"></code-pane>
    <code-pane header="hero-search/hero-search.component.ts" path="toh-pt6/src/app/hero-search/hero-search.component.ts"></code-pane>
    <code-pane header="hero-search/hero-search.component.css" path="toh-pt6/src/app/hero-search/hero-search.component.css"></code-pane>
</code-tabs>

## まとめ

旅はここで終わりです。あなたは多くのことを成し遂げました。

* アプリケーションにHTTPで必要な依存パッケージを追加しました。
* `HeroService`をリファクタリングして、Web APIからヒーローを読み込めるようにしました。
* `HeroService`を拡張して、`post()`, `put()`, そして `delete()`メソッドを使えるようにしました。
* コンポーネントを更新して、ヒーローを追加、更新、そして削除できるようにしました。
* インメモリWeb APIを設定しました。
* Observableをどのように扱うかを学びました。

これで"Tour of Heroes"のチュートリアルは終了です。
基礎ガイドのセクションで、さらにAngularでの開発について学べるようになりました。[Architecture](guide/architecture "Architecture")ガイドから始めましょう。

@reviewed 2022-02-28
