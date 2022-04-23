# アニメーションの遷移とトリガー

あなたは[イントロダクション](guide/animations)ページでAngularアニメーションの基本について学びました。

このガイドでは、`*`(ワイルドカード)や`void`などの特別な遷移状態についてより深く述べ、これらの特別な状態がビューに入る、またはビューから出る要素にどのように使用されるかを示します。
この章では、複数のアニメーショントリガー、アニメーションコールバック、およびキーフレームを使用するシーケンスベースのアニメーションについても説明します。

## 定義済み状態とワイルドカードマッチング

Angularでは、遷移の状態は<code>[state](api/animations/state)()</code> 関数を介して明示的に定義するか、定義済み状態である`*`(ワイルドカード)と`void`を使用することができます。

### ワイルドカード状態

アスタリスク`*`、*ワイルドカード*は任意のアニメーション状態にマッチします。これはHTMLの開始、終了状態に関係なく適用される状態を定義するのに便利です。

たとえば、`open => *`の遷移は要素の状態がopenから何か別の状態に変わるときに適用されます。

<div class="lightbox">
  <img src="generated/images/guide/animations/wildcard-state-500.png" alt="wildcard state expressions">
</div>

以前の`open`と`closed`状態を使用する例を、ワイルドカード状態を一緒に使用するようにしたコードサンプルは次のようになります。
各状態間の遷移のペアを定義するかわりに、`closed`への遷移に1秒、`open`への遷移に0.5秒かかることを定義しています。

これにより、各状態に別々の遷移を含めずに新しい状態を追加することができます。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="trigger-wildcard1" language="typescript"></code-example>

両方向の状態遷移を指定するには、二重矢印構文を使用します。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="trigger-wildcard2" language="typescript"></code-example>

### 複数の遷移状態でワイルドカード状態を使用する

2状態のボタンの例では、ワイルドカードは役に立ちません。なぜなら、`open`と`close`の2つの状態しかないからです。
ワイルドカード状態は、ある特定の状態の要素が複数の潜在的な状態に変化するときに役立ちます。
`open`状態から`close`や`inProgress`のような状態に変わる場合、ワイルドカードを使用することで必要なコーディング量を減らすことができます。

<div class="lightbox">
  <img src="generated/images/guide/animations/wildcard-3-states.png" alt="wildcard state with 3 states">
</div>


<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" region="trigger-transition" language="typescript"></code-example>


`* => *`の遷移は任意の2状態間の変更時に適用されます。

遷移は、定義されている順にマッチします。したがって、`* => *`(任意の状態間)の遷移よりも先に定義されている他の遷移を適用することができます。たとえば、`open => closed`や`closed => open`だけに適用されるスタイルの変更やアニメーションを定義し、呼びだされなかった状態のペアのためのフォールバックとして`* => *`を使用します。

このため、`* => *`の*前*により具体的な遷移を追加してください。

### スタイルにワイルドカードを使用する

現在のスタイルの値がどんなものでも使用して、それとともにアニメーション化するように指示するためには、スタイルにワイルドカードを使用します。ワイルドカードはアニメーション中の状態がトリガー内で宣言されていない場合に使用されるフォールバック値です。

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" region="transition4" language="typescript"></code-example>

### void状態

`void`状態を使用することで、ページに出入りする要素の遷移を設定することができます。[ビューの出入りのアニメーション化](#enter-leave-view)を参照してください。


### ワイルドカード、void状態を組み合わせる

遷移でワイルドカードとvoid状態を組み合わせることで、ページに出入りするアニメーションをトリガーすることができます:

* `* => void`の遷移は、その要素がビューを離れる前の状態に関係なく、その要素が離れるときに適用されます。

* `void => *`の遷移は、その要素がビューへの挿入時に仮定される状態に関係なく、要素が挿入されるときに適用されます。

* ワイルドカード状態`*`は`void`を含む*任意の*状態にマッチします。

## ビューへの出入りのアニメーション化

このセクションでは、ページに出入りする要素をアニメーション化する方法を説明します。

<div class="alert is-helpful">

</div>

さて、新しい振る舞いを追加しましょう:

* ヒーローをリストに追加すると、左側からページに飛んでいるように振る舞います。
* ヒーローをリストから削除すると、右側に飛んでいくように振る舞います。

<code-example path="animations/src/app/hero-list-enter-leave.component.ts" header="src/app/hero-list-enter-leave.component.ts" region="animationdef" language="typescript"></code-example>

上記のコードでは、HTML要素がビューにアタッチされていないときに`void`状態が適用されます。


{@a enter-leave-view}

## :enter と :leave エイリアス

`:enter`と`:leave`は`void => *`と`* => void`の遷移のエイリアスです。これらのエイリアスは、いくつかのアニメーション関数によって使用されます。

<code-example hideCopy language="typescript">
transition ( ':enter', [ ... ] );  // alias for void => *
transition ( ':leave', [ ... ] );  // alias for * => void
</code-example>

ビューに入ろうとする要素はDOM内にまだ存在しないため、ターゲットにすることは難しくなります。
したがって、ビューに挿入、削除されるHTML要素をターゲットにするには、エイリアス`:enter`と`:leave`を使用します。

### \*ngIf と \*ngFor で :enter と :leave を使用する

`*ngIf`または`*ngFor`のビューがページに置かれたときに`:enter`の遷移が実行され、それらのビューがページから削除されたときに`:leave`が実行されます。

**NOTE**: <br />
Entering/leaving behaviors can sometime be confusing.
As a rule of thumb consider that any element being added to the DOM by Angular passes via the `:enter` transition, but only elements being directly removed from the DOM by Angular pass via the `:leave` transition \(For example, an element's view is removed from the DOM because its parent is being removed from the DOM or the app's route has changed, then the element will not pass via the `:leave` transition\).

</div>

This example has a special trigger for the enter and leave animation called `myInsertRemoveTrigger`.
The HTML template contains the following code.

<code-example header="src/app/insert-remove.component.html" path="animations/src/app/insert-remove.component.html" region="insert-remove"></code-example>

コンポーネントファイルでは、`:enter`の遷移は要素がビューに挿入されたとき、初期値として不透明度を0に設定し、不透明度が1になるまでアニメーションします。

<code-example path="animations/src/app/insert-remove.component.ts" header="src/app/insert-remove.component.ts" region="enter-leave-trigger" language="typescript">
</code-example>

この例では<code>[state](api/animations/state)()</code>を使用する必要がないことに注意してください。

## :increment と :decrement での遷移

`transition()`関数は`:increment`と`:decrement`という追加のセレクター値を受け取ります。これらの値を使用して、値として使用している数値が増減したときに遷移を開始します。

<div class="alert is-helpful">

**Note:** The following example uses `query()` and `stagger()` methods. For more information on these methods, see the [complex sequences](guide/complex-animation-sequences#complex-sequence) page.

</div>

<code-example path="animations/src/app/hero-list-page.component.ts" header="src/app/hero-list-page.component.ts" region="increment" language="typescript"></code-example>

## 真偽値での遷移

トリガーに真偽値がバインディング値として含まれている場合、この値は`true`と`false`、あるいは`1`と`0`を比較する `transition()`式を使ってマッチさせることができます。

<code-example path="animations/src/app/open-close.component.2.html" header="src/app/open-close.component.html" region="trigger-boolean">
</code-example>

上記のコードスニペットでは、HTMLテンプレートは`<div>`要素を、`isOpen`のステータス式と、予想される値`true`と`false`をもつ`openClose`という名前のトリガーにバインドします。このパターンは、`open`と`close`のような2つの名前付き状態を作成する方法の代わりになります。

コンポーネントのコード内、`animations:`プロパティの下の`@Component`メタデータにおいて、状態が`true`(ここでは "open"を意味する)と評価されるとき、関連するHTML要素の高さはワイルドカードのスタイルまたはデフォルトのものなります。この場合、アニメーションを開始する前に要素がすでに持っていた高さを使用します。要素が"closed"のときは、要素は高さ0までアニメーションして非表示になります。

<code-example path="animations/src/app/open-close.component.2.ts" header="src/app/open-close.component.ts" region="trigger-boolean" language="typescript">
</code-example>

## 複数のアニメーショントリガー

1つのコンポーネントに対して複数のアニメーショントリガーを定義できます。アニメーショントリガーはさまざまな要素にアタッチすることができ、要素間の親子関係はアニメーションの実行方法とタイミングに影響します。

### 親子のアニメーション

アニメーションがAngularでトリガーされるたびに、親アニメーションが常に優先され、子アニメーションがブロックされます。子アニメーションを実行するには、親アニメーションは子アニメーションを含む各要素をクエリし、[`animateChild()`](api/animations/animateChild)関数を使用してアニメーションを実行する必要があります。

#### HTML要素のアニメーションの無効化

`@.disabled`という特別なアニメーションコントロールバインディングをHTML要素に置くことで、その要素とネストされた要素のアニメーションを無効にすることができます。trueの場合、`@.disabled`バインディングはすべてのアニメーションのレンダリングを防ぎます。

次のコードサンプルでは、この機能の使用方法を説明しています。

<code-tabs>

<code-pane path="animations/src/app/open-close.component.4.html" header="src/app/open-close.component.html" region="toggle-animation">
</code-pane>

<code-pane path="animations/src/app/open-close.component.4.ts" header="src/app/open-close.component.ts" region="toggle-animation" language="typescript">
</code-pane>

</code-tabs>

`@.disabled`バインディングがtrueの場合、`@childAnimation`トリガーは実行されません。

HTMLテンプレート内の要素が`@.disabled`ホストバインディングを使ってアニメーションを無効にすると、すべての内部の要素でもアニメーションは無効になります。
1つの要素上の複数のアニメーションを選択的に無効にすることはできません。

ただし、次のいずれかの方法で、選択した子アニメーションを無効な親に対して実行することはできます:

* 親アニメーションは、[`query()`](api/animations/query)関数を使用して、HTMLテンプレートの無効な領域にある内部要素を集収することができます。
これらの要素はまだアニメーションできます。

* 子アニメーションは親によってクエリーされ、その後で`animateChild()`関数でアニメーション化できます。

#### すべてのアニメーションを無効化する

Angularアプリケーションのすべてのアニメーションを無効にするには、最上位のAngularコンポーネントに`@.disabled`ホストバインディングを置きます。

<code-example path="animations/src/app/app.component.ts" header="src/app/app.component.ts" region="toggle-app-animations" language="typescript"></code-example>

<div class="alert is-helpful">

**Note:** アニメーションをアプリケーション全体で無効にすることは、エンドツーエンド(E2E)のテストで役立ちます。
</div>

## アニメーションコールバック

`trigger()`関数は、アニメーションの開始時と終了時に*コールバック*を発行します。次の例は、`openClose`トリガーを含むコンポーネントです。

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" region="events1" language="typescript"></code-example>

HTMLテンプレートでは、`@triggerName.start`と`@triggerName.done`から`$event`を介してアニメーションイベントが渡されます。ここで`triggerName`は使用されているトリガーの名前です。
この例では、トリガーの`openClose`は次のように登場します。

<code-example path="animations/src/app/open-close.component.3.html" header="src/app/open-close.component.html" region="callbacks">
</code-example>

アニメーションコールバックの潜在的用途は、データベースルックアップなどの低速API呼び出しをカバーすることです。
たとえば、**InProgress**ボタンを設定して、バックエンドシステムの操作が終了するまで脈動、または他の視覚的な動きをする独自のループアニメーションを作成することができます。

そして、現在動作しているアニメーションが終了すると別のアニメーションを呼び出すことができます。
たとえば、API呼び出しが完了すると、ボタンは `inProgress`状態から`closed`状態になります。

アニメーションは、それがないのと比べると操作がより速いとエンドユーザーに*知覚させる*ことができます。
結果的に、サーバーコールのスピードを向上させたり、信頼性の低いネットワーク接続などの制御できない状況を補うよりもむしろ、シンプルなアニメーションはユーザーを幸せに保つための費用対効果の高い方法になります。

コールバックはデバッグツールとして役立ちます。たとえば、`console.warn()`と組み合わせて、ブラウザの開発者JavaScriptコンソールでアプリケーションの進行状況を表示することができます。
次のコードスニペットは、元の例(`open`と`closed`の2つの状態をもつボタン)のコンソールログ出力を作成します。

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" region="events" language="typescript"></code-example>

{@a keyframes}

## キーフレーム

さきほどのセクションでは、シンプルな2状態の遷移を解説しました。こんどは、*キーフレーム*を使用して複数のステップを順番に実行するアニメーションを作成します。

Angularの`keyframe()`関数は、CSSのキーフレームに似ています。キーフレームは1つのタイミングセグメント内でいくつかのスタイルの変更ができるようにします。
たとえば、ボタンはフェードするかわりに、1回の2秒間のタイムスパンで色を数回変えることができます。

<div class="lightbox">
  <img src="generated/images/guide/animations/keyframes-500.png" alt="keyframes">
</div>

この色の変化をコードにすると次のようになります。

<code-example path="animations/src/app/status-slider.component.ts" header="src/app/status-slider.component.ts" region="keyframes" language="typescript"></code-example>

### オフセット

キーフレームには、各スタイルの変更が発生するアニメーション内の位置を定義する`offset`が含まれています。
オフセットは、0から1までの相対的な尺度であり、それぞれアニメーションの開始と終了を示します。and should be applied to each of the keyframe's steps if used at least once.

キーフレームのオフセットの定義はオプショナルです。
これらを省略すると、均等に間隔を置いたオフセットが自動的に割り当てられます。
たとえば、あらかじめ定義されたオフセットを持たない3つのキーフレームは、0、0.5、および1のオフセットを受け取ります。
中間の遷移に対して0.8のオフセットを指定すると、上の例は次のようになるでしょう。

<div class="lightbox">
  <img src="generated/images/guide/animations/keyframes-offset-500.png" alt="keyframes with offset">
</div>

オフセットを指定したコードは次のようになります。

<code-example path="animations/src/app/status-slider.component.ts" header="src/app/status-slider.component.ts" region="keyframesWithOffsets" language="typescript">
</code-example>

1つのアニメーション内でキーフレームを`duration`、`delay`、`easing`と組み合わせることができます。

### キーフレームでのパルスエフェクト

アニメーション全体に特定のオフセットでスタイルを定義することによって、アニメーションにパルスエフェクトを作成するには、キーフレームを使用します。

次に、キーフレームを使用してパルスエフェクトを作成する例を示します:

* オリジナルの`open`状態と`closed`状態は、高さ、色、不透明度の元の変化が1秒の時間枠にわたって発生します。

* 中間に挿入されたキーフレームシーケンスで、同じ1秒の時間枠にわたってボタンが不規則に脈動するように見せます。

<div class="lightbox">
  <img src="generated/images/guide/animations/keyframes-pulsation.png" alt="keyframes with irregular pulsation">
</div>

このアニメーションのコードスニペットは次のようになります。

<code-example path="animations/src/app/open-close.component.1.ts" header="src/app/open-close.component.ts" region="trigger" language="typescript"></code-example>

### アニメーション可能なプロパティと単位

Angularのアニメーションサポートは、Webアニメーション上に構築されているため、ブラウザがアニメーション化可能なすべてのプロパティをアニメートできます。
これには、位置、サイズ、変形、色、ボーダーなどが含まれます。W3Cは、[CSS Transitions](https://www.w3.org/TR/css-transitions-1/)ページにアニメーション可能なプロパティのリストを保持しています。

数値による位置プロパティの場合は、値を引用符で囲んだ文字列として適切な接尾辞で指定して単位を定義します:

* 50ピクセル: `'50px'`
* 相対的なフォントサイズ: `'3em'`
* パーセント: `'100%'`

You can also provide the value as a number (thus not providing a unit), in such cases Angular assumes a default unit of pixels, or `px`.
Expressing 50 pixels as `50` is the same as saying `'50px'` (note that the string `"50"` would instead be considered invalid).

### ワイルドカードを使用した自動的なプロパティの計算

実行時まで大きさのスタイルプロパティ値がわからないことがあります。
たとえば、要素の内容や画面サイズによって幅と高さが異なることがあります。
これらのプロパティは、CSSを使用してアニメーション化するのは難しいことがあります。

このような場合、`style()`の下に特別なワイルドカード`*`のプロパティ値を使うことができるので、その特定のスタイルプロパティの値は実行時に計算され、その後アニメーションに繋げられます。

この例では、`shrinkOut`というトリガーがあります。このトリガーは、HTML要素がページを離れるときに使用されます。
アニメーションは、要素が離れる前の任意の高さを取り、その高さからゼロまでアニメーションします。

<code-example path="animations/src/app/hero-list-auto.component.ts" header="src/app/hero-list-auto.component.ts" region="auto-calc" language="typescript"></code-example>

### キーフレームのまとめ

Angulerの`keyframes()`関数では、単一のトランジション内に複数の中間のスタイルを指定することができます。オプションの`offset`は、スタイルの変更が発生するアニメーション内の位置を定義します。

## Angularアニメーションの詳細

あなたは次に興味があるかもしれません:

* [Angularアニメーション・イントロダクション](guide/animations)
* [複雑なアニメーションシーケンス](guide/complex-animation-sequences)
* [再利用可能なアニメーション](guide/reusable-animations)
* [ルーティング遷移のアニメーション](guide/route-animations)
