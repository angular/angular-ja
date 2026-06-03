# アニメーションのトランジションとトリガー

IMPORTANT: `@angular/animations`パッケージは現在非推奨です。Angularチームは、新しく書くコードのアニメーションには`animate.enter`と`animate.leave`を使ったネイティブCSSの利用を推奨します。詳しくは、新しいenterとleaveの[アニメーションガイド](guide/animations)を参照してください。また、アプリケーションで純粋なCSSアニメーションへの移行を始める方法については、[AngularのAnimationsパッケージからの移行](guide/animations/migration)も参照してください。

このガイドでは、`*` ワイルドカードや `void` などの特殊なトランジション状態を詳しく説明します。また、これらの状態が、ビューに入る要素やビューから離れる要素でどのように使われるかも示します。
このセクションでは、複数のアニメーショントリガー、アニメーションコールバック、キーフレームを使ったシーケンスベースのアニメーションも扱います。

## 事前定義された状態とワイルドカードマッチング {#predefined-states-and-wildcard-matching}

Angularでは、トランジション状態を[`state()`](api/animations/state)関数で明示的に定義するか、あらかじめ定義された `*` ワイルドカードと `void` 状態を使って定義できます。

### ワイルドカード状態 {#wildcard-state}

アスタリスク `*`、つまり _ワイルドカード_ は、任意のアニメーション状態に一致します。
これは、HTML要素の開始状態や終了状態に関係なく適用されるトランジションを定義するときに便利です。

たとえば、`open => *` のトランジションは、要素の状態がopenから何らかの別の状態に変わるときに適用されます。

<img alt="wildcard state expressions" src="assets/images/guide/animations/wildcard-state-500.png">

次のコードサンプルは、前の `open` と `closed` の状態の例にワイルドカード状態を組み合わせたものです。
状態間の各トランジションの組み合わせを個別に定義する代わりに、`closed` へのトランジションはすべて1秒、`open` へのトランジションはすべて0.5秒になります。

これにより、新しい状態を追加しても、それぞれに個別のトランジションを用意する必要がなくなります。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-wildcard1"/>

状態間のトランジションを双方向で指定するには、ダブルアロー構文を使います。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-wildcard2"/>

### 複数のトランジション状態でワイルドカード状態を使う {#use-wildcard-state-with-multiple-transition-states}

2状態のボタン例では、`open` と `closed` の2つしか状態がないため、ワイルドカードはそれほど役に立ちません。
一般的には、要素が変化できる複数の候補状態を持つときにワイルドカード状態を使います。
ボタンが `open` から `closed` または `inProgress` のような別の状態に変わる場合、ワイルドカード状態を使うと必要なコード量を減らせます。

<img alt="wildcard state with 3 states" src="assets/images/guide/animations/wildcard-3-states.png">

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-transition"/>

`* => *` トランジションは、2つの状態の間で何らかの変化が起きたときに適用されます。

トランジションは、定義された順序でマッチします。
そのため、`* => *` トランジションの上に別のトランジションを適用できます。
たとえば、`open => closed` にだけ適用されるスタイル変更やアニメーションを定義し、`* => *` はそれ以外の状態の組み合わせに対するフォールバックとして使えます。

これを行うには、より具体的なトランジションを `* => *` より _前_ に並べます。

### スタイルでワイルドカードを使う {#use-wildcards-with-styles}

スタイルでワイルドカード `*` を使うと、現在のスタイル値をそのまま使ってアニメーションするよう指示できます。
ワイルドカードは、アニメーション対象の状態がトリガー内で宣言されていない場合に使われるフォールバック値です。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition4"/>

### void 状態 {#void-state}

ページに入る要素やページから離れる要素のトランジションを設定するには、`void` 状態を使います。
詳しくは、[ビューへの出入りをアニメーション化する](guide/legacy-animations/transition-and-triggers#aliases-enter-and-leave)を参照してください。

### ワイルドカード状態と void 状態を組み合わせる {#combine-wildcard-and-void-states}

ページへの出入りをアニメーション化するには、トランジションでワイルドカード状態とvoid状態を組み合わせます:

- `* => void` のトランジションは、要素がビューから離れるときに、その前の状態に関係なく適用されます
- `void => *` のトランジションは、要素がビューに入るときに、そのときにどの状態を取るかに関係なく適用されます
- ワイルドカード状態 `*` は、`void` を含む _すべて_ の状態に一致します

## ビューへの出入りをアニメーション化する {#animate-entering-and-leaving-a-view}

このセクションでは、ページに入る要素やページから離れる要素をアニメーション化する方法を示します。

次の振る舞いを追加します:

- ヒーローをヒーロー一覧に追加すると、左からページに飛び込んでくるように見えます
- ヒーローを一覧から削除すると、右へ飛び出していくように見えます

<docs-code header="hero-list-enter-leave.ts" path="adev/src/content/examples/animations/src/app/hero-list-enter-leave.ts" region="animationdef"/>

前のコードでは、HTML要素がビューにアタッチされていないときに `void` 状態を適用しています。

## :enter と :leave のエイリアス {#aliases-enter-and-leave}

`:enter` と `:leave` は、`void => *` と `* => void` のトランジションのエイリアスです。
これらのエイリアスは、いくつかのアニメーション関数で使われます。

```ts {hideCopy}

transition ( ':enter', [ … ] ); // alias for void => _
transition ( ':leave', [ … ] ); // alias for _ => void

```

ビューに入る要素はまだDOMに存在しないため、対象にするのは少し難しくなります。
挿入されたりビューから削除されたりするHTML要素を対象にするには、`:enter` と `:leave` のエイリアスを使います。

### :enter と :leave を `*ngIf` と `*ngFor` で使う {#use-ngif-and-ngfor-with-enter-and-leave}

`:enter` トランジションは、`*ngIf` や `*ngFor` のビューがページに配置されるときに実行され、`:leave` はそれらのビューがページから削除されるときに実行されます。

IMPORTANT: enterとleaveの動作は、時に紛らわしいことがあります。
目安として、AngularによってDOMに追加される要素はすべて `:enter` トランジションを通ると考えてください。AngularによってDOMから直接削除される要素だけが `:leave` トランジションを通ります。たとえば、親がDOMから削除されるために、その要素のビューがDOMから削除される場合があります。

この例には、enterとleaveのアニメーション用の特別なトリガー `myInsertRemoveTrigger` があります。
HTMLテンプレートには次のコードが含まれています。

<docs-code header="insert-remove.html" path="adev/src/content/examples/animations/src/app/insert-remove.html" region="insert-remove"/>

コンポーネントファイルでは、`:enter` トランジションが初期の不透明度0を設定し、要素がビューに挿入されるにつれてその不透明度を1に変化させるようにアニメーションします。

<docs-code header="insert-remove.ts" path="adev/src/content/examples/animations/src/app/insert-remove.ts" region="enter-leave-trigger"/>

この例では [`state()`](api/animations/state) を使う必要がないことに注意してください。

## :increment と :decrement のトランジション {#transition-increment-and-decrement}

`transition()` 関数は、他のセレクター値である `:increment` と `:decrement` も受け取ります。
数値が増加または減少したときにトランジションを開始するために使います。

HELPFUL: 次の例では `query()` と `stagger()` メソッドを使用しています。
これらのメソッドの詳細は、[複雑なシーケンス](guide/legacy-animations/complex-sequences) ページを参照してください。

<docs-code header="hero-list-page.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.ts" region="increment"/>

## トランジションにおける真偽値 {#boolean-values-in-transitions}

トリガーにバインド値として真偽値が含まれている場合、この値は `true` と `false`、または `1` と `0` を比較する `transition()` 式でマッチできます。

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.2.html" region="trigger-boolean"/>

上のコードスニペットでは、HTMLテンプレートが `<div>` 要素を `openClose` というトリガーにバインドし、状態式として `isOpen` を使っています。取りうる値は `true` と `false` です。
このパターンは、`open` と `close` のように名前付き状態を2つ作る方法の代わりになります。

`@Component` メタデータの `animations:` プロパティ内では、状態が `true` と評価されたとき、対応するHTML要素の高さはワイルドカードのスタイル、つまり既定値になります。
この場合、アニメーションは要素がアニメーション開始前にもっていた高さをそのまま使います。
要素が `closed` のときは、高さが0にアニメーションされ、見えなくなります。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.2.ts" region="trigger-boolean"/>

## 複数のアニメーショントリガー {#multiple-animation-triggers}

コンポーネントには、2つ以上のアニメーショントリガーを定義できます。
異なる要素にアニメーショントリガーを付けると、要素間の親子関係がアニメーションの実行方法とタイミングに影響します。

### 親子アニメーション {#parent-child-animations}

Angularでアニメーションがトリガーされるたびに、親のアニメーションが常に優先され、子アニメーションはブロックされます。
子アニメーションを実行するには、親アニメーションが子アニメーションを含む各要素をqueryで検索し、その後 [`animateChild()`](api/animations/animateChild) 関数を使ってアニメーションを実行させます。

#### HTML要素でアニメーションを無効にする {#disable-an-animation-on-an-html-element}

`@.disabled` という特別なアニメーション制御バインディングをHTML要素に配置すると、その要素とネストされた要素のアニメーションを無効にできます。
trueのとき、`@.disabled` バインディングはすべてのアニメーションの描画を防ぎます。

次のコードサンプルは、この機能の使い方を示します。

<docs-code-multifile>
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.4.html" region="toggle-animation"/>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.4.ts" region="toggle-animation" language="typescript"/>
</docs-code-multifile>

`@.disabled` バインディングがtrueのとき、`@childAnimation` トリガーは起動しません。

HTMLテンプレート内の要素で `@.disabled` ホストバインディングを使ってアニメーションをオフにすると、内側のすべての要素でもアニメーションはオフになります。
1つの要素で複数のアニメーションを個別に無効化できません。<!-- vale off -->

無効化された親の下でも、次のいずれかの方法で個別の子アニメーションを実行できます:

- 親アニメーションは、`query()` 関数を使ってHTMLテンプレートの無効化された領域にある内側の要素を収集できます。
  それらの要素は引き続きアニメーションできます。
<!-- vale on -->

- 子アニメーションは、親がそれをqueryで見つけたあと、`animateChild()` 関数で後からアニメーションできます

#### すべてのアニメーションを無効にする {#disable-all-animations}

Angularアプリケーションのすべてのアニメーションを無効にするには、最上位のAngularコンポーネントに `@.disabled` ホストバインディングを配置します。

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="toggle-app-animations"/>

HELPFUL: アプリケーション全体でアニメーションを無効にするのは、エンドツーエンド（E2E）テストで便利です。

## アニメーションのコールバック {#animation-callbacks}

アニメーションの `trigger()` 関数は、開始時と終了時に _コールバック_ を発行します。
次の例では、`openClose` トリガーを含むコンポーネントを示します。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="events1"/>

HTMLテンプレートでは、アニメーションイベントは `$event` を通じて `@triggerName.start` と `@triggerName.done` として返されます。ここで `triggerName` は使用中のトリガー名です。
この例では、`openClose` トリガーは次のようになります。

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.3.html" region="callbacks"/>

アニメーションコールバックの用途としては、データベース検索のような遅いAPI呼び出しを補うことが考えられます。
たとえば、バックエンドの処理が終わるまで、**InProgress** ボタンに独自のループアニメーションを設定できます。

別のアニメーションを、現在のアニメーションが終了したときに呼び出せます。
たとえば、API呼び出しが完了すると、ボタンは `inProgress` 状態から `closed` 状態に移ります。

アニメーションによって、実際にはそうでなくても、操作がより速いとエンドユーザーに _感じさせる_ ことができます。

コールバックはデバッグツールとしても使えます。たとえば `console.warn()` と組み合わせて、ブラウザの開発者向けJavaScriptコンソールでアプリケーションの進行状況を確認できます。
次のコードスニペットは、元の例である `open` と `closed` の2つの状態を持つボタンのコンソール出力を作成します。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="events"/>

## キーフレーム {#keyframes}

複数のステップを順番に実行するアニメーションを作成するには、_キーフレーム_ を使います。

Angularの `keyframe()` 関数を使うと、1つのタイミング区間内に複数のスタイル変更を指定できます。
たとえば、ボタンはフェードする代わりに、2秒間のうちに何度か色を変えられます。

<img alt="keyframes" src="assets/images/guide/animations/keyframes-500.png">

この色変更のコードは、次のようになるかもしれません。

<docs-code header="status-slider.ts" path="adev/src/content/examples/animations/src/app/status-slider.ts" region="keyframes"/>

### オフセット {#offset}

キーフレームには、各スタイル変更がアニメーションのどの地点で発生するかを定義する `offset` が含まれます。
オフセットは0から1までの相対値で、アニメーションの開始と終了を示します。
オフセットを1回でも使う場合は、各キーフレームのステップに適用する必要があります。

キーフレームのオフセット定義は省略できます。
省略すると、等間隔のオフセットが自動的に割り当てられます。
たとえば、オフセットを定義していない3つのキーフレームには、0、0.5、1のオフセットが割り当てられます。
前の例の中央のトランジションに0.8のオフセットを指定すると、次のようになります。

<img alt="keyframes with offset" src="assets/images/guide/animations/keyframes-offset-500.png">

オフセットを指定したコードは次のようになります。
<docs-code header="status-slider.ts" path="adev/src/content/examples/animations/src/app/status-slider.ts" region="keyframesWithOffsets"/>

単一のアニメーション内で、キーフレームに `duration`、`delay`、`easing` を組み合わせることができます。

### パルス効果のあるキーフレーム {#keyframes-with-a-pulsation}

アニメーション全体の特定のオフセットでスタイルを定義することで、キーフレームを使ってアニメーションにパルス効果を作成できます。

キーフレームでパルス効果を作る例を示します:

- 元の `open` と `closed` の状態で、高さ、色、不透明度の変化が1秒間にわたって発生します
- 同じ1秒間の途中にキーフレームシーケンスを挿入し、ボタンがその間に不規則に脈動しているように見せます

<img alt="keyframes with irregular pulsation" src="assets/images/guide/animations/keyframes-pulsation.png">

このアニメーションのコードスニペットは次のようになります。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.1.ts" region="trigger"/>

### アニメーション可能なプロパティと単位 {#animatable-properties-and-units}

AngularのアニメーションはWeb Animationsを土台にしているため、ブラウザがアニメーション可能と見なすすべてのプロパティをアニメーションできます。
これには、位置、サイズ、transform、色、境界線などが含まれます。
W3Cは、アニメーション可能なプロパティの一覧を [CSS Transitions](https://www.w3.org/TR/css-transitions-1) ページで管理しています。

数値を持つプロパティでは、適切なサフィックスを付けた文字列として値を引用符付きで指定して、単位を定義します:

- 50ピクセル:
  `'50px'`

- 相対フォントサイズ:
  `'3em'`

- パーセンテージ:
  `'100%'`

値は数値でも指定できます。その場合、Angularはデフォルト単位としてピクセル、つまり `px` を仮定します。
50ピクセルを `50` と書くのは `'50px'` と書くのと同じです。

HELPFUL: 文字列 `"50"` は有効とは見なされません。

### ワイルドカードを使った自動プロパティ計算 {#automatic-property-calculation-with-wildcards}

このような場合は、寸法を持つスタイルプロパティの値が実行時まで分からないことがあります。
たとえば、要素の幅や高さは、その内容や画面サイズに依存することがよくあります。
これらのプロパティは、CSSではアニメーション化が難しいことがよくあります。

このような場合は、`style()` の中で特別なワイルドカード `*` のプロパティ値を使えます。その特定のスタイルプロパティの値は実行時に計算され、アニメーションに差し込まれます。

次の例には、HTML要素がページから離れるときに使われる `shrinkOut` というトリガーがあります。
アニメーションは、要素がページを離れる前の高さをそのまま使い、その高さから0へアニメーションします。

<docs-code header="hero-list-auto.ts" path="adev/src/content/examples/animations/src/app/hero-list-auto.ts" region="auto-calc"/>

### キーフレームのまとめ {#keyframes-summary}

Angularの `keyframes()` 関数を使うと、1つのトランジション内で複数の中間スタイルを指定できます。任意の `offset` を使うと、各スタイル変更がアニメーションのどの地点で発生するかを定義できます。

## Angularアニメーションについてさらに詳しく {#more-on-angular-animations}

以下の項目にも興味があるかもしれません:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Angularアニメーションの概要"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="複雑なアニメーションシーケンス"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="再利用可能なアニメーション"/>
  <docs-pill href="guide/routing/route-transition-animations" title="ルート遷移アニメーション"/>
  <docs-pill href="guide/animations/migration" title="ネイティブCSSアニメーションへの移行"/>
</docs-pill-row>
