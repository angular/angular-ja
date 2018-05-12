# アニメーション

モーションは、モダンなWebアプリケーションの設計において重要な側面を担っています。  
適切なユーザーインターフェースは、必要な箇所で注意を促す魅力的なアニメーションの状態をスムーズにトランジションさせます。
うまく設計されたアニメーションは、UIをより楽しくするだけでなく使いやすくすることができます。

## 概要

Angularのアニメーションシステムでは、純粋なCSSアニメーションと同じ類いのネイティブパフォーマンスで動作するアニメーションを作成することができます。  
アニメーションロジックを他のアプリケーションコードと緊密に統合して、制御を容易にすることもできます。

<div class="alert is-helpful">

Angularのアニメーションは、標準の[Web Animations API](https://w3c.github.io/web-animations/)の上に構築され、それを[サポートするブラウザ](http://caniuse.com/#feat=web-animation)でネイティブに実行されます。

Angular 6の時点で、Web Animations APIがブラウザによってネイティブにサポートされていない場合、代わりにAngularは自動的にCSSキーフレームをフォールバックとして使用します。
つまり、[AnimationBuilder](/api/animations/AnimationBuilder)を使用するコードがない限り、ポリフィルは不要になります。
コードでAnimationBuilderを使用している場合は、
Angular CLIで生成された`polyfills.ts`ファイルから`web-animations-js` polyfillのコメントを外してください。
</div>

<div class="l-sub-section">

このページの例は、<live-example></live-example> として利用できます。

</div>

## 設定

アプリケーションにアニメーションを追加する前に、
いくつかのアニメーション固有のモジュールと関数をルートアプリケーションモジュールにインポートします。

<code-example path="animations/src/app/app.module.ts" region="animations-module" title="app.module.ts (animation module import excerpt)" linenums="false"></code-example>

#### 基本例

このガイドのアニメーションの例では、ヒーローのリストをアニメーションさせています。

`Hero` クラスには、 `name` プロパティ、ヒーローがアクティブかどうかを示す `state` プロパティ、および状態を切り替える `toggleState（）` メソッドがあります。

<code-example path="animations/src/app/hero.service.ts" region="hero" title="hero.service.ts (Hero class)" linenums="false"></code-example>

画面上部 (`app.hero-team-builder.component.ts`) には、(`HeroService` を介して) ヒーローを追加または削除する一連のボタンがあります。
そのボタンは、すべてのサンプルコンポーネントが同時に参照するリストに変更をトリガーをします。

{@a example-transitioning-between-states}

## 2つの状態間の推移

<img src="generated/images/guide/animations/animation_basic_click.gif" alt="A simple transition animation" class="right">

モデル属性を利用することによって、2つの状態の間で要素を推移させるシンプルなアニメーションを構築できます。


アニメーションは `@Component` のメタデータ内で定義できます。

<code-example path="animations/src/app/hero-list-basic.component.ts" region="imports" title="hero-list-basic.component.ts" linenums="false"></code-example>

これらを使用して、コンポーネントメタデータに `heroState` という *アニメーショントリガー* を定義できます。
アニメーションを使用して、`active` 状態と `inactive` 状態の2つの状態の間で推移します。
ヒーローがアクティブになると、要素はやや大きなサイズと明るい色で表示されます。

<code-example path="animations/src/app/hero-list-basic.component.ts" region="animationdef" title="hero-list-basic.component.ts (@Component excerpt)" linenums="false"></code-example>

<div class="alert is-helpful">

この例では、アニメーションメタデータでアニメーションスタイル（colorとtransform）をインラインで定義しています。

</div>

次に、`[@triggerName]` 構文を利用して、定義したアニメーションをコンポーネントのテンプレートに含まれている1つ以上の要素にアタッチします。

<code-example path="animations/src/app/hero-list-basic.component.ts" region="template" title="hero-list-basic.component.ts (excerpt)" linenums="false"></code-example>

ここで、アニメーショントリガーは、 `ngFor` で繰り返されるすべての要素に適用されます。
繰り返し要素のそれぞれは、独立してアニメーション化されます。
属性の値は、式 `hero.state` にバインドされ、常に `active` または `inactive` のいずれかになります。

この設定では、ヒーローオブジェクトが状態を変えるたびにアニメーションのトランジションが表示されます。
完全なコンポーネントの実装は次のとおりになります:

<code-example path="animations/src/app/hero-list-basic.component.ts" title="hero-list-basic.component.ts"></code-example>

## 状態とトランジション

Angular のアニメーションは、論理 **状態** および状態間の **推移** として定義されます。

アニメーションの状態は、アプリケーションコードで定義された文字列です。
上記の例では、 `'active'` と `'inactive'` の状態は、ヒーローオブジェクトの論理状態に基づいています。
その状態のソースは、この場合と同様に単純なオブジェクト属性でも、メソッド内で計算された値でもかまいません。
重要なことは、それをコンポーネントのテンプレートに読み込むことができるということです。

各アニメーション状態の *スタイル* を定義することができます:

<code-example path="animations/src/app/hero-list-basic.component.ts" region="states" title="src/app/hero-list-basic.component.ts" linenums="false"></code-example>

これらの `状態` の定義は、各状態の *終了スタイル* を指定します。
それらは、その状態に移行した後に要素に適用され、*その状態のままである限り*、その要素に適用されます。
実際には、要素が異なる状態にあるスタイルを定義しています。

状態を定義した後、状態間の*トランジション*を定義することができます。
各トランジションは、1組のスタイルと次のスタイルの切り替えタイミングを制御します:

<code-example path="animations/src/app/hero-list-basic.component.ts" region="transitions" title="src/app/hero-list-basic.component.ts" linenums="false"></code-example>

<figure>
  <img src="generated/images/guide/animations/ng_animate_transitions_inactive_active.png" alt="In Angular animations you define states and transitions between states" width="400">
</figure>

複数のトランジションが同じタイミング構成をもつ場合、それらを同じ `transition` の定義に組み合わせることができます:

<code-example path="animations/src/app/hero-list-combined-transitions.component.ts" region="transitions" title="src/app/hero-list-combined-transitions.component.ts" linenums="false"></code-example>

トランジションの両方向が同じタイミングをもつ場合、前の例のように、簡略構文 `<=>` を利用できます。

<code-example path="animations/src/app/hero-list-twoway.component.ts" region="transitions" title="src/app/hero-list-twoway.component.ts" linenums="false"></code-example>

また、アニメーションの途中でスタイルを適用することもできますが、アニメーションが終了した後にスタイルを維持することはできません。
このようなスタイルは、`transition` でインラインで定義することができます。
この例では、その要素はすぐに1組のスタイルを受け取り、次のスタイルにアニメーションされます。
トランジションが終了すると、これらのスタイルは `state` で定義されていないため保持されません。

<code-example path="animations/src/app/hero-list-inline-styles.component.ts" region="transitions" title="src/app/hero-list-inline-styles.component.ts" linenums="false"></code-example>

### ワイルドカードステート `*`

`*` ("ワイルドカード") ステートは *どの* アニメーション状態にもマッチします。
これは、アニメーションがどの状態にあるかにかかわらず適用されるスタイルとトランジションを定義するのに便利です。  
例：

* `active => *` トランジションは、要素の状態が `active` から他の何かに変化したときに適用されます。
* `* => *` トランジションは、2つの状態の間の *変化が起こる* ときに適用されます。

<figure>
  <img src="generated/images/guide/animations/ng_animate_transitions_inactive_active_wildcards.png" alt="The wildcard state can be used to match many different transitions at once" width="400">
</figure>

### `void` ステート

`void` と呼ばれる特別な状態は、どのアニメーションにも適用できます。
これは、要素がビューにアタッチされて *いない* 場合に適用されます。
これは、要素がまだ追加されていないか、または除去されたためです。
`void` ステートは、アニメーションの入場と退場を定義するのに便利です。

たとえば、`* => void`トランジションは、要素に残していた状態にかかわらず、要素がビューから離れるときに適用されます。

<figure>
  <img src="generated/images/guide/animations/ng_animate_transitions_void_in.png" alt="The void state can be used for enter and leave transitions" width="400">
</figure>

ワイルドカードステート`*`は`void`にも適用されます。

## 例：entering と leaving

<img src="generated/images/guide/animations/animation_enter_leave.gif" alt="Enter and leave animations" class="right" width="250">

`void` と `*` ステートを利用することで、要素の出入りのアニメーションをさせるトランジション定義することができます。

* enter: `void => *`
* leave: `* => void`

たとえば、次のアニメーション配列には、`void => *`および`* => void`構文を使用してビューの内外に要素をアニメーションさせる2つのトランジションがあります。

<code-example path="animations/src/app/hero-list-enter-leave.component.ts" region="animationdef" title="hero-list-enter-leave.component.ts (excerpt)" linenums="false"></code-example>

この場合、スタイルはトランジション定義では直接 void ステートに適用され、別の`ステート（void）`定義には適用されないことに注意してください。
したがって、変換は出入で異なります。要素は左から入り、右から出ていきます。

<div class="l-sub-section">

これらの2つの一般的なアニメーションには、独自のエイリアスがあります。

<code-example language="typescript">
  transition(':enter', [ ... ]); // void => *
  transition(':leave', [ ... ]); // * => void
</code-example>

</div>

## 例：異なる状態からの入場と退場

<img src="generated/images/guide/animations/animation_enter_leave_states.gif" alt="Enter and leave animations combined with state animations" class="right" width="200">

ヒーローの状態をアニメーションの状態として利用することで、このアニメーションと以前のステートトランジションのアニメーションを組み合わせることもできます。
ヒーローの状態に基づいて、出入りのさまざまなトランジションを設定できます。

* 非アクティブなヒーローが入る: `void => inactive`
* アクティブなヒーローが入る: `void => active`
* 非アクティブなヒーローが出る: `inactive => void`
* アクティブなヒーローが出る: `active => void`

これにより、各トランジションの細かな制御が可能になります。

<figure>
  <img src="generated/images/guide/animations/ng_animate_transitions_inactive_active_void.png" alt="This example transitions between active, inactive, and void states" width="400">
</figure>

<code-example path="animations/src/app/hero-list-enter-leave-states.component.ts" region="animationdef" title="hero-list-enter-leave.component.ts (excerpt)" linenums="false"></code-example>

## アニメーション可能なプロパティと単位

Angular のアニメーションサポートは Web アニメーションの上に構築されているため、ブラウザが*サポートしている*すべてのプロパティをアニメーションさせることができます。
これには、位置、サイズ、変形、色、枠線、その他多くのものが含まれます。
W3Cの、[CSS Transitions ページ](https://www.w3.org/TR/css3-transitions)に[アニメーション可能なプロパティのリスト](https://www.w3.org/TR/css3-transitions/#animatable-properties)が記載されています。

数値をもつ定位置プロパティの場合、適切な接尾辞をつ文字列として値を指定して単位を定義できます。

* `'50px'`
* `'3em'`
* `'100%'`

プロパティの値の指定をするときに単位を設定しないと、Angular での初期値は `px` になります。

* `50` は `'50px'` と同じ意味になります。

## 自動的なプロパティの計算

<img src="generated/images/guide/animations/animation_auto.gif" alt="Animation with automated height calculation" class="right" width="220">

次元的なスタイルプロパティは、実行時まで値がわからないことがあります。
たとえば、要素の内容や画面サイズによって幅と高さが異なることがよくあります。
これらのプロパティは、CSSでアニメーション化するのが難しい場合がよくあります。

これらの場合、特殊な `*` プロパティ値を使用することでプロパティの値が実行時に計算され、その後アニメーションにプラグインされるようにすることができます。

この例では、退場アニメーションは、要素が離れる前の任意の高さをとり、その高さから0までアニメーションします。

<code-example path="animations/src/app/hero-list-auto.component.ts" region="animationdef" title="src/app/hero-list-auto.component.ts" linenums="false"></code-example>

## アニメーションのタイミング

アニメーション化されたトランジションには、デュレーション、ディレイ、およびイージング関数の3つのタイミングプロパティがあります。
それらはすべて1つの遷移の *タイミング文字列* として結合されています。

### デュレーション

デュレーションは、アニメーションの開始から終了までの時間を制御します。次の3つの方法で期間を定義できます:

* 純粋な値（ミリ秒単位）: `100`
* 文字列（ミリ秒単位）: `'100ms'`
* 文字列（秒単位）: `'0.1s'`

### ディレイ

ディレイは、アニメーショントリガーとトランジションの開始の間の時間の長さを制御します。
デュレーションの後に同じ文字列に追加することで定義することができます。
また、期間と同じ書式オプションがあります:

* 100ms待機してから200msかけて実行する: `'0.2s 100ms'`

### イージング

[イージング関数](http://easings.net/)は、実行時にアニメーションがどのように加速および減速するかを制御します。
たとえば、`ease-in` 関数を使用すると、アニメーションは比較的ゆっくりと開始されますが、進行するにつれて速度が上がります。
デュレーションとディレイの後の文字列の`3番目`の値（またはディレイがない場合の`2番目`の値）を追加することでイージングを制御することができます:

* 100ms待機してから、  イージングとともに200msかけて実行する: `'0.2s 100ms ease-out'`
* イージングとともに200msかけて実行する: `'0.2s ease-in-out'`

<img src="generated/images/guide/animations/animation_timings.gif" alt="Animations with specific timings" class="right" width="220">

### 例

ここでは実際のタイミングをいくつか紹介します。
どちらも200ミリ秒、すなわち`0.2秒`で最後に出入りするが、イージングが異なります。
`'0.2s 0.1s ease-out'` で指定されているように、100ミリ秒のわずかな遅延の後にアニメーションが開始されます:

<code-example path="animations/src/app/hero-list-timings.component.ts" region="animationdef" title="hero-list-timings.component.ts (excerpt)" linenums="false"></code-example>

## キーフレーム付きの複数のステップアニメーション

<img src="generated/images/guide/animations/animation_multistep.gif" alt="Animations with some bounce implemented with keyframes" class="right" width="220">

アニメーションの*キーフレーム*は、2つのスタイルセット間を遷移するときに1つ以上の中間スタイルを経由し、単純な遷移を超えてより複雑なアニメーションになります。

各キーフレームに対して、アニメーション内でキーフレームが適用されるポイントを定義する*オフセット*を指定します。
オフセットは、アニメーションの開始を示す0から終了を示す1の間の数値です。

次の例では、入力に "bounce" を追加し、アニメーションにキーフレームを適用します:

<code-example path="animations/src/app/hero-list-multistep.component.ts" region="animationdef" title="hero-list-multistep.component.ts (excerpt)" linenums="false"></code-example>

オフセットは絶対時間で定義されて*いない*ことに注意してください。
それらはゼロから1への相対的な尺度です。
アニメーションの最終的なタイムラインは、キーフレームのオフセット、デュレーション、ディレイ、およびイージングの組み合わせに基づいています。

キーフレームのオフセットの定義はオプションです。
それらを省略すると、均等間隔のオフセットが自動的に割り当てられます。
たとえば、あらかじめ定義されたオフセットのない3つのキーフレームは、オフセット`0`、`0.5`、および`1`を受け取ります。

## 並列アニメーショングループ

<img src="generated/images/guide/animations/animation_groups.gif" alt="Parallel animations with different timings, implemented with groups" class="right" width="220px">

同時に複数のスタイルプロパティをアニメーション化する方法を見てきました。
すべてのスタイルプロパティを同じ`style（）`定義に入れるだけです。

しかし、並行して発生するアニメーションのさまざまな*タイミング*を設定することもできます。
たとえば、2つのCSSプロパティをアニメーションさせるときに、それぞれに異なるイージング関数を使用することができます。

このために、アニメーション*グループ*を使用できます。
次の例では、enterとleaveの両方でグループを使用することで、2つの異なるタイミング構成が可能にしています。
両方とも同じ要素に並列に適用されますが、互いに独立して実行されます:

<code-example path="animations/src/app/hero-list-groups.component.ts" region="animationdef" title="hero-list-groups.component.ts (excerpt)" linenums="false"></code-example>

1つのグループは要素の変換と幅をアニメートします。
もう一方のグループは不透明度をアニメートします。

## アニメーションのコールバック

コールバックは、アニメーションが開始されたときおよび終了したときに発火します。

キーフレームの例では、`@flyInOut`という`トリガー`があります。このようなコールバックをフックすることができます:

<code-example path="animations/src/app/hero-list-multistep.component.ts" region="template" title="hero-list-multistep.component.ts (excerpt)" linenums="false"></code-example>

そのコールバックは、`fromState`、`toState`、`totalTime`などの有用なプロパティを含む`AnimationEvent`を受け取ります。

これらのコールバックは、アニメーションが取得されたかどうかにかかわらず発火します。
