# Observable と 他の技術の比較

Promise の代わりに Observable を使用して、値を非同期に配信することができます。 同様に、Observable はイベントハンドラーと置き換えることができます。最後に、Observable は複数の値を提供するため、配列でビルドして操作する可能性のある場所で使用することができます。

Observable は、これらの状況の個々の代替技術とは多少異なる動作をしますが、いくつか重要な利点があります。違いの詳細な比較を次に示します。

## Observable と Promise の比較

Observable はしばしば Promise と比較されます。主な違いは次のとおりです。

* Observable は宣言型です。購読するまで処理が開始されません。Promise は作成時に直ちに実行されます。これにより、結果が必要なときにいつでも実行できるレシピを定義するために、Observable が役立ちます。

* Observable は多くの値を提供します。Promise は1つです。これは、時間の経過とともに複数の値を取得するのには Observable が有効だということです。

* Observable は、連鎖とサブスクリプションを区別します。Promise は `.then()` 句しかありません。これにより、作業を実行させることなく、システムの他の部分で使用される複雑な変換レシピを作成するのに便利です。

* Observable の `subscribe()` はエラーを処理します。Promise は子の Promise にエラーをプッシュします。これにより、Observable は集中管理され、予測可能なエラー処理に役立ちます。


### 作成とサブスクリプション

* Observable は、消費者が購読するまで実行されません。`subscribe()` は定義された振る舞いを一度実行し、再び呼び出すことができます。各サブスクリプションには独自の計算機能があります。再購読によって値の再計算が行われます。

  <code-example 
    path="comparing-observables/src/observables.ts" 
    header="src/observables.ts (observable)" 
    region="observable">
  </code-example>

* Promise はすぐに、一度だけ実行されます。結果の計算は Promise が作成されたときに開始されます。作業を再開する方法はありません。 すべての `then` 句 (サブスクリプション) は同じ計算を共有します。

  <code-example 
    path="comparing-observables/src/promises.ts" 
    header="src/promises.ts (promise)"
    region="promise">
  </code-example>

### チェーンにする

* Observable は map やサブスクリプションなどの変換機能を区別します。サブスクリプションだけがサブスクライバー機能をアクティブにして値の計算を開始します。

  <code-example 
    path="comparing-observables/src/observables.ts" 
    header="src/observables.ts (chain)" 
    region="chain">
  </code-example>

* Promise は最後の `.then` 節 (サブスクリプションに相当) と中間の `.then` 節 (mapに相当) を区別しません。

  <code-example
    path="comparing-observables/src/promises.ts"
    header="src/promises.ts (chain)"
    region="chain">
  </code-example>

### キャンセル処理

* Observable のサブスクリプションはキャンセル可能です。サブスクライブ解除は、リスナーがそれ以上の値を受け取らないようにし、サブスクライバー関数に作業を取り消すよう通知します。

  <code-example 
    path="comparing-observables/src/observables.ts" 
    header="src/observables.ts (unsubsribe)" 
    region="unsubscribe">
  </code-example>

* Promise はキャンセルできません。

### エラーハンドリング

* Observable の実行エラーはサブスクライバーのエラーハンドラーに渡され、サブスクライバーは Observable から自動的にサブスクライブを解除します。

  <code-example 
    path="comparing-observables/src/observables.ts" 
    header="src/observables.ts (error)"
    region="error">
  </code-example>

* Promise は子の Promise にエラーをプッシュします。

  <code-example 
    path="comparing-observables/src/promises.ts" 
    header="src/promises.ts (error)"
    region="error">
  </code-example>

### チートシート

次のコードスニペットは、Observable と Promise を使用して同じ種類の操作を定義する方法を示しています。

<table>
  <thead>
    <tr>
      <th>処理</th>
      <th>Observable</th>
      <th>Promise</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>作成</td>
      <td>
        <pre>
new Observable((observer) => {
  observer.next(123);
  });</pre>
      </td>
      <td>
        <pre>
new Promise((resolve, reject) => {
  resolve(123);
});</pre>
      </td>
    </tr>
    <tr>
      <td>変換</td>
      <td><pre>obs.pipe(map((value) => value * 2));</pre></td>
      <td><pre>promise.then((value) => value * 2);</pre></td>
    </tr>
    <tr>
      <td>サブスクライブ</td>
      <td>
        <pre>
sub = obs.subscribe((value) => {
  console.log(value)
});</pre>
      </td>
      <td>
        <pre>
promise.then((value) => {
  console.log(value);
});</pre>
      </td>
    </tr>
    <tr>
      <td>サブスクライブ解除</td>
      <td><pre>sub.unsubscribe();</pre></td>
      <td>暗黙的に Promise が決定します。</td>
    </tr>
  </tbody>
</table>

## events API と Observable の比較

Observable は events API を使用するイベントハンドラーと非常によく似ています。どちらの手法も通知ハンドラーを定義し、それらを使用して複数の値を処理します。Observable を登録することは、イベントリスナーを追加することと同じです。重要な違いの1つは、イベントをハンドラーに渡す前に、イベントを変換する Observable を構成できることです。

Observable を使用してイベントや非同期操作を処理すると、HTTP リクエストなどのコンテキストの一貫性が向上するという利点があります。

Observable と events API を使用して同じ種類の操作を定義する方法を示すコードサンプルをいくつか示します。

<table>
  <tr>
    <th></th>
    <th>Observable</th>
    <th>Events API</th>
  </tr>
  <tr>
    <td>作成 & キャンセル</td>
    <td>
<pre>// Setup
const clicks$ = fromEvent(buttonEl, ‘click’);
// Begin listening
const subscription = clicks$
  .subscribe(e => console.log(‘Clicked’, e))
// Stop listening
subscription.unsubscribe();</pre>
   </td>
   <td>
<pre>function handler(e) {
  console.log(‘Clicked’, e);
}
// Setup & begin listening
button.addEventListener(‘click’, handler);
// Stop listening
button.removeEventListener(‘click’, handler);
</pre>
    </td>
  </tr>
  <tr>
    <td>サブスクリプション</td>
    <td>
<pre>observable.subscribe(() => {
  // notification handlers here
});</pre>
    </td>
    <td>
<pre>element.addEventListener(eventName, (event) => {
  // notification handler here
});</pre>
    </td>
  </tr>
  <tr>
    <td>設定</td>
    <td>Listen for keystrokes, but provide a stream representing the value in the input.
<pre>fromEvent(inputEl, 'keydown').pipe(
  map(e => e.target.value)
);</pre>
    </td>
    <td>Does not support configuration.
<pre>element.addEventListener(eventName, (event) => {
  // Cannot change the passed Event into another
  // value before it gets to the handler
});</pre>
    </td>
  </tr>
</table>


## Observable と 配列の比較

Observable は時間とともに値を生成します。配列は静的な値のセットとして作成されます。ある意味では、配列が同期であるところで Observable は非同期です。次の例では、➞ は非同期の値の配信を意味します。

<table>
  <tr>
    <th></th>
    <th>Observable</th>
    <th>Array</th>
  </tr>
  <tr>
    <td>Given</td>
    <td>
      <pre>obs: ➞1➞2➞3➞5➞7</pre>
      <pre>obsB: ➞'a'➞'b'➞'c'</pre>
    </td>
    <td>
      <pre>arr: [1, 2, 3, 5, 7]</pre>
      <pre>arrB: ['a', 'b', 'c']</pre>
    </td>
  </tr>
  <tr>
    <td><pre>concat()</pre></td>
    <td>
      <pre>concat(obs, obsB)</pre>
      <pre>➞1➞2➞3➞5➞7➞'a'➞'b'➞'c'</pre>
    </td>
    <td>
      <pre>arr.concat(arrB)</pre>
      <pre>[1,2,3,5,7,'a','b','c']</pre>
    </td>
  </tr>
  <tr>
    <td><pre>filter()</pre></td>
    <td>
      <pre>obs.pipe(filter((v) => v>3))</pre>
      <pre>➞5➞7</pre>
    </td>
    <td>
      <pre>arr.filter((v) => v>3)</pre>
      <pre>[5, 7]</pre>
    </td>
  </tr>
  <tr>
    <td><pre>find()</pre></td>
    <td>
      <pre>obs.pipe(find((v) => v>3))</pre>
      <pre>➞5</pre>
    </td>
    <td>
      <pre>arr.find((v) => v>3)</pre>
      <pre>5</pre>
    </td>
  </tr>
  <tr>
    <td><pre>findIndex()</pre></td>
    <td>
      <pre>obs.pipe(findIndex((v) => v>3))</pre>
      <pre>➞3</pre>
    </td>
    <td>
      <pre>arr.findIndex((v) => v>3)</pre>
      <pre>3</pre>
    </td>
  </tr>
  <tr>
    <td><pre>forEach()</pre></td>
    <td>
      <pre>obs.pipe(tap((v) => {
  console.log(v);
}))
1
2
3
5
7</pre>
    </td>
    <td>
      <pre>arr.forEach((v) => {
  console.log(v);
})
1
2
3
5
7</pre>
    </td>
  </tr>
  <tr>
    <td><pre>map()</pre></td>
    <td>
      <pre>obs.pipe(map((v) => -v))</pre>
      <pre>➞-1➞-2➞-3➞-5➞-7</pre>
    </td>
    <td>
      <pre>arr.map((v) => -v)</pre>
      <pre>[-1, -2, -3, -5, -7]</pre>
    </td>
  </tr>
  <tr>
    <td><pre>reduce()</pre></td>
    <td>
      <pre>obs.pipe(reduce((s,v)=> s+v, 0))</pre>
      <pre>➞18</pre>
    </td>
    <td>
      <pre>arr.reduce((s,v) => s+v, 0)</pre>
      <pre>18</pre>
    </td>
  </tr>
</table>
