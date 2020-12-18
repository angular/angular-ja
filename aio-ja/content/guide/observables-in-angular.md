# Angular での Observable

Angular はさまざまな一般的な非同期操作を処理するためのインターフェースとして Observable を使用します。たとえば：

* You can define [custom events](guide/event-binding#custom-events-with-eventemitter) that send observable output data from a child to a parent component.
* HTTP モジュールは Observable を使用して AJAX リクエストとレスポンスを処理します。
* Router と Form モジュールは、ユーザー入力イベントを待ち受けてレスポンスするために Observable を使用します。

## Transmitting data between components

Angularは コンポーネントから値を [`@Output()` デコレーター](guide/inputs-outputs#output)を通してパブリッシュするときに使用される `EventEmitter` クラスを提供します。
`EventEmitter` は [RxJSの `Subject`](https://rxjs.dev/api/index/class/Subject) を拡張し、任意の値を送ることができるように `emit()` メソッドを追加します。
`emit()` を呼び出すと、サブスクライブされたオブザーバーの `next()` メソッドに送出された値が渡されます。

[EventEmitter](api/core/EventEmitter) のドキュメントに、使い方の良い例があります。オープンイベントとクローズイベントを待ち受けるサンプルコンポーネントを次に示します。

`<app-zippy (open)="onOpen($event)" (close)="onClose($event)"></app-zippy>`

コンポーネントの定義は次のとおりです。

<code-example path="observables-in-angular/src/main.ts" header="EventEmitter" region="eventemitter"></code-example>

## HTTP
Angularの `HttpClient` は、HTTPメソッド呼び出しからの Observable を返します。たとえば、`http.get(‘/api’)` は Observable オブジェクトを返します。これは、Promise ベースの HTTP API に勝るいくつかの利点を提供します。

* Observables はサーバーのレスポンスを変更しません(Promise で `.then()` の呼び出しによって発生する可能性があります)。代わりに、必要に応じて一連のオペレーターを使用して値を変換することができます。
* HTTP リクエストは `unsubscribe()` メソッドで取り消すことができます。
* イベントの更新の進行状況を取得するようにリクエストを構成できます。
* 失敗したリクエストは簡単に再試行できます。

## 非同期パイプ

[AsyncPipe](api/common/AsyncPipe) は Observable または Promise をサブスクライブし、送出した最新の値を返します。新しい値が発行されると、パイプはコンポーネントの変更をチェックします。

次の例では `time` observable をコンポーネントのビューにバインドします。observable は現在時刻でビューを継続的に更新します。

<code-example path="observables-in-angular/src/main.ts" header="非同期パイプの使用" region="pipe"></code-example>

{@a router}

## ルーター

[`Router.events`](api/router/Router#events) は Observable としてイベントを提供します。RxJS の `filter()` オペレーターを使用して目的のイベントを検索し、それらのイベントをサブスクライブして、ナビゲーションプロセスの一連のイベントに基づいて決定することができます。ここに例があります：

<code-example path="observables-in-angular/src/main.ts" header="ルーターイベント" region="router"></code-example>

[ActivatedRoute](api/router/ActivatedRoute) は Observable を利用してルートパスとパラメータに関する情報を取得する、注入されたルーターサービスです。たとえば、 `ActivatedRoute.url` にはルートパスを報告する Observable が含まれています。ここに例があります：

<code-example path="observables-in-angular/src/main.ts" header="ActivatedRoute" region="activated_route"></code-example>

## リアクティブフォーム

リアクティブフォームには Observable を使用してフォームコントロール値を監視するプロパティがあります。[`FormControl`](api/forms/FormControl) プロパティの `valueChanges` および `statusChanges` には、変更イベントを発生させる Observable が含まれます。 Observable のフォームコントロールプロパティを購読することは、コンポーネントクラス内でアプリケーションロジックをトリガーする方法です。たとえば：

<code-example path="observables-in-angular/src/main.ts" header="リアクティブフォーム" region="forms"></code-example>
