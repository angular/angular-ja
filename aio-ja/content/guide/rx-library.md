# RxJS ライブラリ

リアクティブプログラミングは、データストリームと変更の伝播 ([Wikipedia](https://en.wikipedia.org/wiki/Reactive_programming)) に関する非同期プログラミングのパラダイムです。RxJS (Reactive Extensions for JavaScript) は、非同期またはコールバックベースのコード ([RxJS Docs](https://rxjs.dev/guide/overview)) の作成を容易にする observables を使用したリアクティブプログラミング用のライブラリです。

RxJS は `Observable` 型の実装を提供します。Observable 型は、型が言語の一部となるまで、そしてブラウザがそれをサポートするまで必要です。ライブラリはまたobservablesを作成して作業するためのユーティリティ関数を提供します。これらのユーティリティ関数は、次の用途に使用できます。

* 非同期処理の既存のコードを observables に変換する
* ストリーム内の値を反復処理する
* 異なる型への値のマッピング
* ストリームのフィルタリング
* 複数のストリームの作成

## Observable 作成関数

RxJS には新しい observables を作成するために使用できるいくつかの関数が用意されています。これらの関数はイベント、タイマー、promise などから observables を作成するプロセスを簡素化できます。たとえば：

<code-example path="rx-library/src/simple-creation.1.ts" region="promise" header="promise から observable を作成する"></code-example>

<code-example path="rx-library/src/simple-creation.2.ts" region="interval" header="カウンターから observable を作成する"></code-example>

<code-example path="rx-library/src/simple-creation.3.ts" region="event" header="イベントから observable を作成する"></code-example>

<code-example path="rx-library/src/simple-creation.ts" region="ajax" header="AJAX リクエストから observable を作成する"></code-example>

## オペレーター {@a operators}

オペレーターは、コレクションの高度な操作を可能にするために、observables 基盤上に構築される関数です。たとえば RxJS は `map()`、`filter()`、`concat()`、`flatMap()` のようなオペレーターを定義します。

オペレーターは設定オプションをとり、ソースとなる observable を受け取る関数を返します。この返された関数を実行するとき、オペレーターは observable が出力する値を観測、変換し、変換された値の新しい observable を返します。ここに簡単な例があります：

<code-example path="rx-library/src/operators.ts" header="Map operator"></code-example>

_パイプ_を使用するとオペレーターをリンクすることができます。パイプを使用すると、複数の機能を1つの機能にまとめることができます。`pipe()` 関数は、結合する関数を引数としてとり、実行時に順次関数を実行する新しい関数を返します。

observable に適用されるオペレーターのセットは、レシピ、つまり関心のある値を生成するための一連の命令です。それだけではレシピは何もしません。レシピを通して結果を出すには  `subscribe()` を呼び出す必要があります。

これはその例です:

<code-example path="rx-library/src/operators.1.ts" header="Standalone pipe function"></code-example>

`pipe()` 関数は　RxJS `Observable` のメソッドでもあるので、この短い形式を使って同じ操作を定義します：

<code-example path="rx-library/src/operators.2.ts" header="Observable.pipe function"></code-example>

### 共通のオペレーター

RxJS には多くのオペレーターが用意されていますが、頻繁に使用されるのは一握りです。オペレーターと使用例のリストについては、[RxJS API Documentation](https://rxjs.dev/api) を参照してください。

<div class="alert is-helpful">
  Angular アプリでは、チェーンを使用するのではなく、パイプとオペレーターを組み合わせることをお勧めします。チェーンは多くの RxJS の例で使用されています。
</div>

| エリア | オペレーター |
| :------------| :----------|
| Creation |  `from`, `fromEvent`, `of` |
| Combination | `combineLatest`, `concat`, `merge`, `startWith` , `withLatestFrom`, `zip` |
| Filtering | `debounceTime`, `distinctUntilChanged`, `filter`, `take`, `takeUntil` |
| Transformation | `bufferTime`, `concatMap`, `map`, `mergeMap`, `scan`, `switchMap` |
| Utility | `tap` |
| Multicasting | `share` |

## エラーハンドリング

RxJS は、サブスクリプションで提供する `error()` ハンドラーに加えて、observable レシピの既知のエラーを処理するための `catchError` オペレーターも提供しています。

たとえば、APIリクエストを作成しサーバーからの応答にマップする observable があるとします。サーバーがエラーを戻すか、値が存在しない場合、エラーが生成されます。このエラーを受け取り、デフォルト値を指定した場合、ストリームはエラーを処理するのではなく値を処理し続けます。

以下は `catchError` オペレーターを使ってこれを行う例です：

<code-example path="rx-library/src/error-handling.ts" header="catchError オペレーター"></code-example>

### 失敗した observable の再実行

`catchError` オペレーターがシンプルなリカバリーパスを提供する場合、`retry` オペレーターは失敗したリクエストを再試行させます。

`catchError` オペレーターの前に `retry` オペレーターを使用します。これは元のソース observable に再びサブスクライブし、エラーの原因となった一連のアクションを再実行できます。これに HTTP リクエストが含まれる場合、その HTTP リクエストを再試行します。

次の例はエラーをキャッチする前にリクエストを再試行するために、前の例を変換します。

<code-example path="rx-library/src/retry-on-error.ts" header="retry operator"></code-example>

<div class="alert is-helpful">

   **認証**リクエストはユーザーの操作によってのみ開始されるため、再試行しないでください。ユーザーが開始していない繰り返しのログインリクエストでユーザーアカウントをロックアウトする必要はありません。

</div>

## observables の命名規則

Angular アプリケーションは主に TypeScript で記述されるため、変数がいつ observable であるかを知ることができます。Angular フレームワークは observables の命名規則を強制しませんが、末尾に "$" 記号が付いた名前の observables をよく見かけるでしょう。

これはコードをスキャンして observable の値を探す場合に便利です。また、プロパティに observable からの最新の値を格納する場合は、"$" の有無にかかわらず同じ名前を使用すると便利です。

たとえば:

<code-example path="rx-library/src/naming-convention.ts" header="Naming observables"></code-example>
