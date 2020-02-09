# サービスの作成

Tour of Heroes の中で扱っている `HeroesComponent` は、今のところ仮のデータを取得して表示している状態です。

このチュートリアルのリファクタリング後には、`HeroesComponent` は小さくなりビューをサポートすることに専念します。
これはモックサービスを使用して、ユニットテストをより簡潔にすることにもつながります。

## なぜサービスが必要なのか？

コンポーネント内では直接データの取得や保存を行うべきではありません。もちろん、故意に仮のデータを渡してもいけません。
コンポーネントはデータの受け渡しに集中し、その他の処理はサービスクラスへ委譲するべきです。

このチュートリアルでは、アプリケーション全体でヒーローを取得できる `HeroService` を作成します。
そのサービスは [`new` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) で生成するのではなく、
Angular による [*依存性の注入*](guide/dependency-injection) で、 
`HeroesComponent` コンストラクターに注入します。

サービスは、_お互いを知らない_ クラスの間で情報を共有する最適な方法です。
このチュートリアル後半でも `MessageService` を作成し、次の2クラスに注入します。

1. メッセージを送信する`HeroService`への注入
2. そのメッセージとユーザーがヒーローをクリックしたときにIDを表示する`MessagesComponent`への注入


## `HeroService` の作成

Angular CLI を使用して `HeroService` を作成しましょう。

<code-example language="sh" class="code-shell">
  ng generate service hero
</code-example>

このコマンドは `HeroService` のスケルトンファイルを `src/app/hero.service.ts` に次のように生成します。

<code-example path="toh-pt4/src/app/hero.service.1.ts" region="new"
 header="src/app/hero.service.ts (new service)"></code-example>


### `@Injectable()` サービス

生成されたファイル内で Angular の Injectable シンボルがインポートされ、`@Injectable()` デコレーターとしてクラスを注釈していることに注目してください。
これは、クラスを _依存関係注入システム_ に参加するものとしてマークします。 `HeroService`クラスは、注入可能なサービスを提供する予定であり、それ自身が依存関係をもつこともできます。
まだ依存関係はありませんが、[間もなくそうなります](#inject-message-service)。

`@Injectable()`デコレーターは、`@Component()`デコレーターがコンポーネントクラスに対して行ったのと同じ方法で、サービスのメタデータオブジェクトを受け入れます。

### ヒーローデータの取得

`HeroService` はさまざまな場所からヒーローデータを取得する可能性があります。&mdash; 外部Webサービス、ローカルストレージ、またはモックデータかもしれません。

コンポーネントからデータ取得ロジックを切り離すということは、そういったサービス側の事情にとらわれず、いつでも実装方針の変更ができることを意味しています。
コンポーネント側は、サービスがどのように動いていようと関係ありません。

この章の実装では、引き続き _モックヒーロー_ を使用します。

`Hero` および `HEROES` をインポートします。

<code-example path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts" region="import-heroes">
</code-example>

`getHeroes` メソッドを追加し、_モックヒーロー_ を返します。

<code-example path="toh-pt4/src/app/hero.service.1.ts" header="src/app/hero.service.ts" region="getHeroes">
</code-example>

{@a provide}
## `HeroService` の提供

Angularが `HeroesComponent` へ注入する（[次に](#inject)行います）よりも前に、
_プロバイダ_ を登録することで`HeroService`が依存性の注入システムで利用できるようにする必要があります。プロバイダーとは、サービスを作成または提供できるものです。この場合、`HeroService`クラスをインスタンス化してサービスを提供します。

`HeroService`がこのサービスのプロバイダーとして登録されていることを確認するために、
あなたは _インジェクター_ にこれを登録しています。
インジェクターは、必要な場所でプロバイダーを選択して注入するためのオブジェクトです。

デフォルトでは、Angular CLIコマンド `ng generate service`は、プロバイダーのメタデータ、つまり` providedIn: 'root'`を `@Injectable()` デコレーターに含めることで、プロバイダーをサービスの _ルートインジェクター_ に登録します。

```
@Injectable({
  providedIn: 'root',
})
```

ルートレベルでサービスを提供すると、Angularは`HeroService`の単一の共有インスタンスを作成し、それを要求する任意のクラスに注入します。
`@Injectable`メタデータでプロバイダーを登録すると、Angularはサービスが使用されなくなった場合にそれを削除することでアプリケーションを最適化することもできます。

<div class="alert is-helpful">

プロバイダーについての詳細は、[プロバイダーの章](guide/providers)を参照してください。
インジェクターについての詳細は、[依存性の注入ガイド](guide/dependency-injection)を参照してください。

</div>

これにより、 `HeroService` は `HeroesComponent` で利用できる状態になりました。

<div class="alert is-important">

これは、`HeroService`の提供と使用を可能にする暫定的なコードサンプルです。
この時点で、コードは["最終的なコードレビュー"](#final-code-review)の`HeroService`とは異なります。

</div>

<div class="alert is-helpful">

_providers_ についてより詳しく知りたい方は [Providers](guide/providers) を参照してください。

</div>


## `HeroesComponent` の更新

`HeroesComponent` クラスを開いてください。

もう必要ないので、`HEROES`のインポートを削除してください。
代わりに`HeroService`をインポートしましょう。

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts (import HeroService)" region="hero-service-import">
</code-example>

`heroes` プロパティの定義を、単純な宣言に置き換えます。

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts" region="heroes">
</code-example>

{@a inject}

### `HeroService` の注入

`HeroService` 型のプライベートプロパティである `heroService` をコンストラクターに追加しましょう。

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts" region="ctor">
</code-example>

このパラメータはプライベートな `heroService` プロパティとして定義されると同時に、 `HeroService` を注入すべき場所として認識されます。

Angular が `HeroesComponent` を生成する際、[依存性の注入](guide/dependency-injection) システムは `heroService` パラメータを `HeroService` のシングルトンインスタンスとして設定します。

### `getHeroes()` の追加

サービスからヒーローデータを取得するための関数を作成しましょう。

<code-example path="toh-pt4/src/app/heroes/heroes.component.1.ts" header="src/app/heroes/heroes.component.ts" region="getHeroes">
</code-example>

{@a oninit}

### `ngOnInit()` での呼び出し

`getHeroes()` はコンストラクターでも呼び出すことはできますが、これは最適な方法ではありません。

コンストラクターではプロパティ定義などの簡単な初期化のみを行い、それ以外は _何もするべきではありません_ 。
もちろん、_実際の_ データ取得サービスが行うであろう、サーバーへのHTTPリクエストを行う関数は呼び出すべきではありません。

`getHeroes()` はコンストラクターではなく、 [*ngOnInit ライフサイクルフック*](guide/lifecycle-hooks) 内で呼び出しましょう。
この `ngOnInit()` は、 Angular が `HeroesComponent` インスタンスを生成した後、適切なタイミングで呼び出されます。

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts" region="ng-on-init">
</code-example>

### 実行の確認

ブラウザの更新後、アプリケーションは以前と同じように実行されるはずです。
ヒーローリストが表示され、ヒーロー名をクリックすると詳細が表示されるでしょう。

## Observable データ

`HeroService.getHeroes()` は同期的なメソッドであり、これは `HeroService` が即座にヒーローデータを取得できることを示しています。

また `HeroesComponent` は、`getHeroes()` の返り値がまるで同期的に取得できるかのように扱っています。

<code-example path="toh-pt4/src/app/heroes/heroes.component.1.ts" header="src/app/heroes/heroes.component.ts" region="get-heroes">
</code-example>

しかしこれは、実際のアプリケーションでは機能しません。
現在のサービスはモックヒーローを返しているのでこれを免れていますが、
リモートサーバーからヒーローデータを取得するにあたり、この処理は _非同期_ ということに気づくでしょう。

`HeroService` はサーバーのレスポンスを待たなければならず、`getHeroes()` は即座にヒーローデータを返すことができません。
そしてそのサービスが待機している間、ブラウザはブロックされないでしょう。

`HeroService.getHeroes()` は何らかの非同期処理を実装する必要があります。

この章では、`HeroService.getHeroes()` は `Observable` を返します。
なぜなら、後にヒーローデータの取得で利用する Angular の [`HttpClient.get()`](guide/http) メソッドが `Observable` を返すからです。

### Observable `HeroService`

`Observable` は [RxJS ライブラリ](http://reactivex.io/rxjs/) で重要なクラスのひとつです。

[HTTP に関する後の章](tutorial/toh-pt6), でも Angular の `HttpClient` メソッドが `Observable` を返すことに触れるでしょう。
この章ではRxJSの `of()` 関数を使ってサーバーからのデータの取得をシミュレートします。

`HeroService` を開き、`Observable` および `of` を `RxJS` からインポートします。

<code-example path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts (Observable imports)" region="import-observable">
</code-example>

`getHeroes()` メソッドを 次のように書き直しましょう。

<code-example path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts" region="getHeroes-1"></code-example>

`of(HEROES)` は _ひとつの値_、すなわちモックヒーローの配列を出力する `Observable<Hero[]>` を返します。

<div class="l-sub-section">

[HTTP のチュートリアル](tutorial/toh-pt6) では、_ひとつの値_、すなわちHTTPレスポンスボディ由来のヒーローの配列を出力する `Observable<Hero[]>` を同じように返す `HttpClient.get<Hero[]>()` を呼び出します。

</div>

### `HeroesComponent` での Subscribe

`HeroService.getHeroes` メソッドは `Hero[]` を返していましたが、
現在の返り値は `Observable<Hero[]>` です。

そのため、これらの違いを修正する必要があるでしょう。

`getHeroes` を開き、下記コードに変更しましょう。
（比較のために以前のバージョンと横に並べられています）

<code-tabs>

  <code-pane header="heroes.component.ts (Observable)" 
    path="toh-pt4/src/app/heroes/heroes.component.ts" region="getHeroes">
  </code-pane>

  <code-pane header="heroes.component.ts (Original)" 
    path="toh-pt4/src/app/heroes/heroes.component.1.ts" region="getHeroes">
  </code-pane>

</code-tabs>

`Observable.subscribe()` はとても重要な違いです。

修正前のコードでは、`heroes` プロパティにヒーローリストを代入していました。
その代入は、まるでサーバーが即座に値を返すか、レスポンスを待機する間UIのレンダリングを中止したかのように _同期的_ です。

`HeroService` が実際にサーバーへのリクエストを行う場合、修正前のコードは動作しません。

新しいバージョンでは、`Observable` がヒーローの配列を出力するのを待っています。&mdash; 
これは現在あるいは数分後に起こる可能性があります。
そのとき、 `subscribe()`メソッド は、出力された配列をコールバックに渡し、コンポーネントの `heroes` プロパティを設定します。

この非同期的手法は、`HeroService` がサーバーからヒーローを取得する際、正常に動作します。

## メッセージの表示

このセクションでは、次について説明します。

* メッセージを表示するための `MessagesComponent` を画面下部に追加する
* 表示するメッセージを送信するために、アプリケーション全体で注入可能な `MessageService` を作成する
* `HeroService` に `MessageService` を注入する
* `HeroService` のデータ取得成功時にメッセージを表示する

### `MessagesComponent` の作成

Angular CLI を使い `MessagesComponent` を作成しましょう。

<code-example language="sh" class="code-shell">
  ng generate component messages
</code-example>

Angular CLI は `src/app/messages` 配下にコンポーネントファイル群を生成し、`AppModule` 内に `MessagesComponent` を宣言します。

作成した `MessagesComponent` を表示するために、`AppComponent` のテンプレートを修正しましょう。

<code-example
  header = "src/app/app.component.html"
  path="toh-pt4/src/app/app.component.html">
</code-example>

`MessagesComponent` のデフォルトテキストが、ページ最下部に配置されていることを確認してください。

### `MessageService` の作成

Angular CLI を使い、`src/app` 配下に `MessageService` を作成します。

<code-example language="sh" class="code-shell">
  ng generate service message
</code-example>

`MessageService` を開き、次のコードへ修正してください。

<code-example header = "src/app/message.service.ts" path="toh-pt4/src/app/message.service.ts">
</code-example>

このサービスは `messages` および `add()`、`clear()` メソッドを他のクラスから利用できるように公開しています。
また、`add()` メソッドは新たなメッセージを `messages` へ追加し、`clear()` メソッドは `messages` の値を初期化します。

{@a inject-message-service}
### `HeroService` への注入

`HeroService`で`MessageService` をインポートしましょう。

<code-example
  header = "src/app/hero.service.ts (import MessageService)"
  path="toh-pt4/src/app/hero.service.ts" region="import-message-service">
</code-example>

プライベートな `messageService` プロパティを宣言するパラメータを使用してコンストラクターを変更します。
Angular は `HeroService` を生成する際、そのプロパティへシングルトンな `MessageService` を注入します。

<code-example
  path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts" region="ctor">
</code-example>

<div class="l-sub-section">

これは典型的な "*サービス内でサービスを利用する*" 例です。
`HeroesComponent` に注入されている `HeroService` には、`MessageService` が注入されています。

</div>

### `HeroService` からメッセージを送る

ヒーローが取得されたときにメッセージを送信するように `getHeroes()` メソッドを変更します。

<code-example path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts" region="getHeroes">
</code-example>

### `HeroService` からのメッセージを表示する

`MessagesComponent` は `HeroService` がヒーローを取得した際に送信するメッセージを含め、すべてのメッセージを表示しなければなりません。

`MessagesComponent` を開き、`MessageService` をインポートしてください。

<code-example header="src/app/messages/messages.component.ts (import MessageService)" path="toh-pt4/src/app/messages/messages.component.ts" region="import-message-service">
</code-example>

コンストラクターに **パブリック** な `messageService` プロパティを宣言しましょう。
Angular は `MessagesComponent` を作成する際、シングルトンな `MessageService` インスタンスをそのプロパティへ注入します。

<code-example path="toh-pt4/src/app/messages/messages.component.ts" header="src/app/messages/messages.component.ts" region="ctor">
</code-example>

今回、`messageService` はテンプレート内でバインドして使用するつもりです。
そのため、`messageService` は **パブリックである必要があります**。

<div class="alert is-important">

Angular はコンポーネント内の _パブリック_ なプロパティのみをバインドします

</div>

### `MessageService` へバインドする

Angular CLI によって生成された `MessagesComponent` のテンプレートを下記コードへ置き換えましょう。

<code-example
  header = "src/app/messages/messages.component.html"
  path="toh-pt4/src/app/messages/messages.component.html">
</code-example>

このテンプレートは、コンポーネント内の `messageService` と直接紐付きます。

* `*ngIf` は、表示するメッセージが存在する場合のみメッセージエリアを表示します

* `*ngFor` は、`<div>` 要素をくり返してメッセージリストを表示します

* Angular の [イベントバインディング](guide/template-syntax#event-binding) は、ボタンのクリックイベントと `MessageService.clear()` を紐付けます

["最終的なコードレビュー"](#final-code-review) タブ内に記載されている `messages.component.css` をコンポーネントのスタイルに追加すると、このメッセージUIの外観はよりよいものになるでしょう。

## Add additional messages to hero service

The following example shows how to send and display a message each time the user clicks on
a hero, showing a history of the user's selections. This will be helpful when you get to the
next section on [Routing](tutorial/toh-pt5).

<code-example header="src/app/heroes/heroes.component.ts"
path="toh-pt4/src/app/heroes/heroes.component.ts">
</code-example>

The browser refreshes and the page displays the list of heroes.
Refresh the browser to see the list of heroes, and scroll to the bottom to see the
messages from the HeroService. Each time you click a hero, a new message appears to record
the selection. Use the "clear" button to clear the message history.

{@a final-code-review}

## 最終的なコードレビュー

このページで解説したコードを次に記載します。
また、アプリケーションの見た目はリンク先のようになっているはずです。 <live-example></live-example>.

<code-tabs>

  <code-pane header="src/app/hero.service.ts" 
  path="toh-pt4/src/app/hero.service.ts">
  </code-pane>

  <code-pane header="src/app/message.service.ts" 
  path="toh-pt4/src/app/message.service.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.ts"
  path="toh-pt4/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane header="src/app/messages/messages.component.ts"
  path="toh-pt4/src/app/messages/messages.component.ts">
  </code-pane>

  <code-pane header="src/app/messages/messages.component.html"
  path="toh-pt4/src/app/messages/messages.component.html">
  </code-pane>

  <code-pane header="src/app/messages/messages.component.css"
  path="toh-pt4/src/app/messages/messages.component.css">
  </code-pane>

  <code-pane header="src/app/app.module.ts"
  path="toh-pt4/src/app/app.module.ts">
  </code-pane>

  <code-pane header="src/app/app.component.html"
  path="toh-pt4/src/app/app.component.html">
  </code-pane>

</code-tabs>

## まとめ

* `HeroService` クラスのデータ利用方法を修正しました
* `HeroService`をルートレベルでサービスの _プロバイダ_ として登録し、アプリ内のどこにでも注入できるようにしました。
* [Angular の依存性の注入](guide/dependency-injection) を使用して、それをコンポーネントに注入しました
* `HeroService` の _データ取得_ メソッドを非同期化しました
* `Observable` および、それを扱うために利用する RxJS ライブラリについて学びました
* モックヒーローを Observable (`Observable<Hero[]>`) 型で返すために、RxJS の `of()` を使用しました
* コンポーネントのコンストラクター内ではなく、`ngOnInit` ライフサイクルフックで `HeroService` メソッドを呼び出しました
* クラス間で疎結合な情報伝達を行うため、 `MessageService` を作成しました
* コンポーネントに注入された `HeroService` は、もうひとつのサービスである `MessageService` とともに作成されます
