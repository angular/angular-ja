
# Observable

Observableは、アプリケーションの中でパブリッシャーとサブスクライバー間でメッセージを渡すためのサポートを提供します。Observableは、イベント処理、非同期プログラミング、および複数の値の処理のための他のテクニックよりも大きな利点を提供します。

Observableは宣言的です&mdash;つまり、値を公開するための関数を定義しますが、コンシューマーがそれを購読するまでは実行されません。購読するコンシューマーは、機能が完了するまで、または購読を中止するまで通知を受け取ります。

Observableは、文脈に応じて、任意の型&mdash;リテラル、メッセージ、またはイベントの複数の値を提供できます。受け取るためのAPIは値が同期的・非同期的に提供される場合も同じです。基本的なセットアップとティアダウンはObservableによって処理されるので、あなたのアプリケーションコードは値を消費するためにサブスクライブを行うことと、それが済んだら購読を中止することだけを心配する必要があります。ストリームがキー入力、HTTPレスポンス、インターバルタイマーのどれでも、値をリスニングしたり、リスニングを止めるためのインターフェースは同じです。

これらの利点のために、ObservableはAngular内で広く使用されており、アプリの開発にも推奨されています。

## 基本的な使用法と用語

パブリッシャーとして、*サブスクライバー* 関数を定義する `Observable` インスタンスを作成することができます。これは、コンシューマーが `subscribe（）`メソッドを呼び出したときに実行される関数です。サブスクライバー関数は、どのように値を取得または生成し、メッセージを発行するかを定義します。

作成したObservableを実行して値を受信するには、*オブザーバー* を渡す `subscribe()` メソッドを呼ぶ必要があります。これは、受け取った通知のハンドラーを定義するJavaScriptオブジェクトです。`subscribe()` は 通知を受信を止めるための `unsubscribe()` メソッドがある `Subscription` オブジェクトを返します。

ここでは、Observableを使用してジオロケーションの更新を提供する方法を示すことによって、基本的な使用モデルの例を示します。

<code-example class="no-auto-link" path="observables/src/geolocation.ts" header="Observe geolocation updates"></code-example>

## オブザーバーを定義する


Observableの通知を受け取るハンドラーは、`Observer` インターフェースを実装します。これは、Observableが送信できる3種類の通知を処理するためのコールバックメソッドを定義するオブジェクトです。

| 通知の種類 | 説明 |
|:---------|:-------------------------------------------|
| `next`  | 必須です。個々の値が提供されたときのハンドラーです。実行が開始されてから0回以上呼び出されます。|
| `error` | オプションです。エラー通知のハンドラーです。エラーはObservableインスタンスの実行を停止します。|
| `complete` | オプションです。実行完了通知のハンドラーです。遅延した値は、実行完了後もnextハンドラーに引き続き渡されます。|

オブザーバーオブジェクトは、これらのハンドラーの任意の組み合わせを定義することができます。いずれかの通知タイプのハンドラーを指定しなかった場合、オブザーバーはそのタイプの通知を無視します。

## サブスクライブ

`Observable` インスタンスは誰かが購読すると値をパブリッシュしはじめます。購読するためにはインスタンスの `subscribe()` メソッドを呼び出し、オブザーバーオブジェクトを渡して通知を受け取ります。

<div class="alert is-helpful">
   サブスクリプションがどのように動作するかを示すために、新しいObservableを作成する必要があります。
   新しいインスタンスを作成するために使用するコンストラクタがありますが、例として頻繁に使用される形式の単純なObservableを作成するRxJSライブラリのいくつかのメソッドを使用できます。

  * `of(...items)`&mdash;引数として提供された値を同期的に提供する`Observable`インスタンスを返します。
  * `from(iterable)`&mdash;引数を`Observable`インスタンスに変換します。このメソッドは、通常、配列をobservableに変換するために使用されます。

</div>

受信したメッセージをコンソールに記録するオブザーバーを使って、シンプルなObservableを作成して購読する例を次に示します。

<code-example
  path="observables/src/subscribing.ts"
  region="observer"
  header="Subscribe using observer"></code-example>

あるいは、`subscribe()`メソッドは、コールバック関数定義を`next`、`error`、`complete`ハンドラーのために、行内で受け入れることができます。たとえば、次の`subscribe()`コールは、定義済みのオブザーバーを指定するコールと同じです。

<code-example path="observables/src/subscribing.ts" region="sub_fn" header="Subscribe with positional arguments"></code-example>

いずれの場合も、`next`ハンドラーは必須です。`error`と`complete`ハンドラーはオプションです。

`next()`関数はコンテキストに応じて、たとえば、メッセージ文字列、イベントオブジェクト、数値、または構造体を受け取ることができることに注意してください。一般的な用語として、私達はObservableによって公開されたデータを*ストリーム*と呼びます。任意のタイプの値はObservableで表現でき、値はストリームとしてパブリッシュされます。

## Observableを作成する

`Observable` コンストラクターを使用して任意のタイプのObservableストリームを作成しましょう。コンストラクターは、Observableの`subscribe()`メソッドが実行されたときに実行するサブスクライバー関数を引数としてとります。サブスクライバー関数は`Observer`オブジェクトを受け取り、オブザーバーの` next()`メソッドに値を公開することができます。

たとえば、上の`Observable.of(1,2,3)`に相当するObservableを作成するには、次のようにします：

<code-example path="observables/src/creating.ts" region="subscriber" header="Create observable with constructor"></code-example>

この例を少しステップアップすると、イベントをパブリッシュするObservableを作成できます。この例では、サブスクライバー関数はインラインで定義されています。

<code-example path="observables/src/creating.ts" region="fromevent" header="Create with custom fromEvent function"></code-example>

この関数を利用して、イベント`keydown`をパブリッシュするObservableを作成できます。:

<code-example path="observables/src/creating.ts" region="fromevent_use" header="Use custom fromEvent function"></code-example>

## マルチキャスト

典型的なObservableは、サブスクライブしたオブザーバーごとに独立した新しい実行を作成します。オブザーバーが購読すると、Observableはイベントハンドラーをつなぎ、そのオブザーバーに値を渡します。2つ目のオブザーバーが加入すると、Observableは新しいイベントハンドラーをつなぎ、別の実行でその2つ目のオブザーバーに値を渡します。

場合によっては、各サブスクライバーに対して独立した実行を開始するのではなく各サブスクリプションが同じ値を取得するようにしたいことがあるでしょう&mdash;値の発行がすでに始まっていたとしても。これは、ドキュメントオブジェクトのクリックを監視するような場合に当てはまります。

*マルチキャスト* は、1回の実行で複数のサブスクライバーにブロードキャストする方法です。マルチキャストをするObservableの場合、ドキュメントに複数のリスナーを登録するのではなく、最初のリスナーを再利用して値を各サブスクライバーに送信します。

Observableを作成するときは、そのObservableをどのように使用するか、およびその値をマルチキャストするかどうかを決定する必要があります。

個々の数値が発信されてから1秒遅れて、1から3までカウントする例を見てみましょう。

<code-example path="observables/src/multicasting.ts" region="delay_sequence" header="Create a delayed sequence"></code-example>

2回購読すると、2つの別々のストリームがあり、それぞれが毎秒値を発信することに注意してください。これは次のようになります。

<code-example path="observables/src/multicasting.ts" region="subscribe_twice" header="Two subscriptions"></code-example>

 Observableをマルチキャストするように書き換えると次のようになります。

<code-example path="observables/src/multicasting.ts" region="multicast_sequence" header="Create a multicast subscriber"></code-example>

<div class="alert is-helpful">
  Observableをマルチキャストするには少しだけ多くのセットアップがかかりますが、特定のアプリケーションで役立ちます。後で、マルチキャスティングのプロセスを簡略化して、どんなObservableでもマルチキャストできるようになるツールを見ていきます。
</div>

## Error handling

Observableは値を非同期的に生成するため、try/catchは効果的にエラーを捕捉しません。代わりに、オブザーバーに`error`コールバックを指定することでエラーを処理します。 また、エラーを生成すると、Observableはサブスクリプションをクリーンアップし、値の生成を停止します。Observableは値を生成する（次のコールバックを呼び出す）か、あるいは`complete`または`error`コールバックを呼び出して完了することができます。

<code-example>
myObservable.subscribe({
  next(num) { console.log('Next num: ' + num)},
  error(err) { console.log('Received an errror: ' + err)}
});
</code-example>

エラー処理（特にエラーからの回復）については後のセクションで詳しく説明します。
