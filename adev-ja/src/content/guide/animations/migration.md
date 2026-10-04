# AngularのAnimationsパッケージから移行する

v20.2以降、`@angular/animations`パッケージは非推奨になり、同時にアプリケーションへアニメーションを追加するための新しい`animate.enter`および`animate.leave`機能が導入されました。これらの新機能を使うと、`@angular/animations`ベースのアニメーションをすべて、プレーンなCSSまたはJSアニメーションライブラリで置き換えられます。アプリケーションから`@angular/animations`を削除すると、JavaScriptバンドルのサイズを大幅に削減できます。ネイティブCSSアニメーションは、ハードウェアアクセラレーションの恩恵を受けられるため、一般により優れたパフォーマンスを発揮します。このガイドでは、`@angular/animations`からネイティブCSSアニメーションへコードをリファクタリングする手順を説明します。

## ネイティブCSSでアニメーションを書く方法 {#how-to-write-animations-in-native-css}

ネイティブCSSでアニメーションを書いたことがない場合は、入門に役立つ優れたガイドがいくつもあります。以下にいくつか紹介します。  
[MDNのCSSアニメーションガイド](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)  
[W3SchoolsのCSS3アニメーションガイド](https://www.w3schools.com/css/css3_animations.asp)  
[CSSアニメーションの完全チュートリアル](https://www.lambdatest.com/blog/css-animations-tutorial/)  
[初心者向けCSSアニメーション](https://thoughtbot.com/blog/css-animation-for-beginners)

また、次の動画も参考にしてください。  
[9分でCSSアニメーションを学ぶ](https://www.youtube.com/watch?v=z2LQYsZhsFw)  
[Net NinjaのCSSアニメーションチュートリアル再生リスト](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

まずは、これらのガイドやチュートリアルに目を通し、その後にこのガイドへ戻ってきてください。

## 再利用可能なアニメーションを作成する {#creating-reusable-animations}

アニメーションパッケージと同様に、アプリケーション全体で共有できる再利用可能なアニメーションを作成できます。アニメーションパッケージでは共有のTypeScriptファイルで`animation()`関数を使っていましたが、ネイティブCSSでも考え方は似ており、共有のCSSファイルに定義します。

#### Animationsパッケージの場合

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="animation-example"/>

#### ネイティブCSSの場合

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-shared"/>

要素に`animated-class`クラスを追加すると、その要素でアニメーションがトリガーされます。

## トランジションをアニメーション化する {#animating-a-transition}

### 状態とスタイルをアニメーション化する {#animating-state-and-styles}

アニメーションパッケージでは、コンポーネント内で[`state()`](api/animations/state)関数を使ってさまざまな状態を定義できました。たとえば、定義の中にそれぞれの状態に対応するスタイルを含む`open`や`closed`といった状態です。例を示します。

#### Animationsパッケージの場合 {#animating-state-and-styles-with-animations-package}

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state1"/>

この動作は、キーフレームアニメーションまたはトランジションスタイルとCSSクラスを使うことで、ネイティブにも実現できます。

#### ネイティブCSSの場合 {#animating-state-and-styles-with-native-css}

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-states"/>

`open`または`closed`状態のトリガーは、コンポーネント内で要素のクラスを切り替えて行います。例は、[テンプレートガイド](guide/templates/binding#css-class-and-style-property-bindings)で確認できます。

同様の例として、テンプレートガイドの[スタイルを直接アニメーション化する](guide/templates/binding#css-style-properties)も参照してください。

### トランジション、タイミング、イージング {#transitions-timing-and-easing}

アニメーションパッケージの`animate()`関数では、継続時間や遅延、イージングといったタイミングを指定できました。これはネイティブでも、複数のCSSプロパティまたはショートハンドプロパティを使って実現できます。

キーフレームアニメーションでは、`animation-duration`、`animation-delay`、`animation-timing-function`を指定するか、代わりに`animation`ショートハンドプロパティを使用します。

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-timing"/>

同様に、`@keyframes`を使用しないアニメーションでは、`transition-duration`、`transition-delay`、`transition-timing-function`、および`transition`ショートハンドを使用できます。

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="transition-timing"/>

### アニメーションをトリガーする {#triggering-an-animation}

アニメーションパッケージでは、`trigger()`関数を使ってトリガーを指定し、その中にすべての状態をネストする必要がありました。ネイティブCSSでは、これは不要です。CSSのスタイルやクラスを切り替えるだけでアニメーションをトリガーできます。要素にクラスが存在するとアニメーションが実行され、クラスを削除すると、その要素に定義されているCSSへ戻ります。これにより、同じアニメーションをはるかに少ないコードで実現できます。例を示します。

#### Animationsパッケージの場合 {#triggering-an-animation-with-animations-package}

<docs-code-multifile>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/animations-package/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/animations-package/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/animations-package/open-close.css"/>
</docs-code-multifile>

#### ネイティブCSSの場合 {#triggering-an-animation-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.ts">
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.css"/>
</docs-code-multifile>

## トランジションとトリガー {#transition-and-triggers}

### 事前定義された状態とワイルドカードマッチング {#predefined-state-and-wildcard-matching}

アニメーションパッケージでは、文字列を使って定義済みの状態をトランジションに対応付けられます。たとえば、openからclosedへのアニメーションは`open => closed`となります。ワイルドカードを使うと任意の状態から対象状態へのマッチングができ、`* => closed`のように書けます。また、`void`キーワードはenterおよびexitの状態に使えます。たとえば、要素がビューを離れるときは`* => void`、要素がビューに入るときは`void => *`です。

CSSで直接アニメーション化する場合、こうした状態マッチングパターンはまったく不要です。要素に設定するクラスやスタイルに応じて、どのトランジションや`@keyframes`アニメーションを適用するかを管理できます。DOMに入った直後の要素の見た目を制御するために`@starting-style`を追加できます。

### ワイルドカードによる自動プロパティ計算 {#automatic-property-calculation-with-wildcards}

アニメーションパッケージでは、固定した高さから`height: auto`へのアニメーションのように、従来は難しかったアニメーションを実現できました。これは現在では純粋なCSSでも可能です。

#### Animationsパッケージの場合 {#automatic-property-calculation-with-animations-package}

<docs-code-multifile>
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.css" />
</docs-code-multifile>

CSS Gridを使うと、height: autoへのアニメーションを実現できます。

#### ネイティブCSSの場合 {#automatic-property-calculation-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts">
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.css"  />
</docs-code-multifile>

すべてのブラウザをサポートする必要がない場合は、height: autoをアニメーション化するための本命の解決策である`calc-size()`も確認してください。詳しくは、[MDNのドキュメント](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size)と[このチュートリアル](https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/)を参照してください。

### ビューへの出入りをアニメーション化する {#animate-entering-and-leaving-a-view}

アニメーションパッケージでは、前述のenterとleaveのパターンマッチングに加えて、`:enter`と`:leave`というショートハンドエイリアスも提供していました。

#### Animationsパッケージの場合 {#enter-and-leave-with-animations-package}

<docs-code-multifile>
    <docs-code header="insert-remove.ts" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.ts" />
    <docs-code header="insert-remove.html" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.html" />
    <docs-code header="insert-remove.css" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.css" />
</docs-code-multifile>

#### ネイティブCSSの場合 {#enter-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.ts">
    <docs-code header="insert.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.ts" />
    <docs-code header="insert.html" path="adev/src/content/examples/animations/src/app/native-css/insert.html" />
    <docs-code header="insert.css" path="adev/src/content/examples/animations/src/app/native-css/insert.css"  />
</docs-code-multifile>

#### ネイティブCSSの場合 {#leave-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.ts">
    <docs-code header="remove.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.ts" />
    <docs-code header="remove.html" path="adev/src/content/examples/animations/src/app/native-css/remove.html" />
    <docs-code header="remove.css" path="adev/src/content/examples/animations/src/app/native-css/remove.css"  />
</docs-code-multifile>

`animate.enter`と`animate.leave`について詳しくは、[EnterとLeaveのアニメーションガイド](guide/animations)を参照してください。

### インクリメントとデクリメントをアニメーション化する {#animating-increment-and-decrement}

前述の`:enter`と`:leave`に加えて、`:increment`と`:decrement`もあります。これらもクラスを追加・削除することでアニメーションできます。アニメーションパッケージの組み込みエイリアスとは異なり、値が増減したときにクラスが自動で適用されるわけではありません。適切なクラスをプログラムから付与できます。例を示します。

#### Animationsパッケージの場合 {#increment-and-decrement-with-animations-package}

<docs-code-multifile>
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.css" />
</docs-code-multifile>

#### ネイティブCSSの場合 {#increment-and-decrement-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts">
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.css" />
</docs-code-multifile>

### 親子アニメーション {#parent-child-animations}

アニメーションパッケージとは異なり、あるコンポーネント内に複数のアニメーションを指定しても、どのアニメーションも他より優先されず、どのアニメーションの発火もブロックされません。アニメーションの順序付けは、animationやtransitionの遅延を使ったCSSアニメーション定義、あるいは次にアニメーションさせるCSSを追加するための`animationend`または`transitionend`によって処理する必要があります。

Child animations fire only within the same component template. In the `@angular/animations` package, parent animations could query and trigger animations in nested child components using `query()` and `animateChild()`. With `animate.leave` and native CSS animations, animations defined inside nested child component templates will not fire when a parent component removes an element or view. Only nested animations within the same Angular component template will execute. See the [Enter and Leave Animations guide](guide/animations#element-removal-order) for more information on this.

### アニメーションまたはすべてのアニメーションを無効にする {#disabling-an-animation-or-all-animations}

ネイティブCSSアニメーションでは、指定したアニメーションを無効にしたい場合、複数の選択肢があります。

1. animationとtransitionを`none`に強制するカスタムクラスを作成します。

```css
.no-animation {
  animation: none !important;
  transition: none !important;
}
```

このクラスを要素に適用すると、その要素ではどのアニメーションも発火しなくなります。代わりにDOM全体またはDOMの一部にスコープして、この挙動を強制できます。ただし、この方法ではアニメーションイベントが発火しなくなります。要素削除のためにアニメーションイベントを待っている場合、この方法は機能しません。回避策としては、継続時間を1ミリ秒に設定します。

2. [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)メディアクエリを使用して、アニメーションを控えたいユーザーにはアニメーションを再生しないようにします。

3. プログラムからアニメーションクラスを追加しないようにします。

### アニメーションのコールバック {#animation-callbacks}

アニメーションパッケージは、アニメーション終了時に何かをしたい場合に使用できるコールバックを公開していました。ネイティブCSSアニメーションにも同様のコールバックがあります。

[`OnAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)  
[`OnAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)  
[`OnAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event)  
[`OnAnimationCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)

[`OnTransitionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)  
[`OnTransitionRun`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)  
[`OnTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)  
[`OnTransitionCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)

Web Animations APIには、他にも多くの機能があります。利用できるすべてのアニメーションAPIについては、[ドキュメント](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)を参照してください。

NOTE: これらのコールバックではバブリングの問題に注意してください。子要素と親要素の両方をアニメーション化している場合、イベントは子要素から親要素へバブルアップします。子ノードからバブルしてきたイベントではなく、意図したイベントターゲットに応答しているかを判断するために、伝播を停止するか、イベントの詳細を確認してください。適切なノードを対象にしているかは、`animationname`プロパティやトランジション対象のプロパティを調べることで確認できます。

## 複雑なシーケンス {#complex-sequences}

アニメーションパッケージには、複雑なシーケンスを作成するための組み込み機能がありました。これらのシーケンスはどれも、アニメーションパッケージなしで十分に実現できます。

### 特定の要素を対象にする {#targeting-specific-elements}

アニメーションパッケージでは、[`document.querySelector()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector)に似た`query()`関数を使って、CSSクラス名で特定の要素を見つけて対象にできました。ネイティブCSSアニメーションでは、これは不要です。代わりにCSSセレクターを使ってサブクラスを対象にし、必要な`transform`や`animation`を適用できます。

テンプレート内の子ノードのクラスを切り替えるには、クラスバインディングとスタイルバインディングを使って、適切なタイミングでアニメーションを追加できます。

### stagger() {#stagger}

`stagger()`関数では、指定した時間だけリスト内の各項目のアニメーションを遅らせて、カスケード効果を作成できました。この挙動は、ネイティブCSSでも`animation-delay`または`transition-delay`を利用して再現できます。以下はそのCSSの例です。

#### Animationsパッケージの場合 {#stagger-with-animations-package}

<docs-code-multifile>
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/animations-package/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/animations-package/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/animations-package/stagger.css" />
</docs-code-multifile>

#### ネイティブCSSの場合 {#stagger-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.ts">
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.css" />
</docs-code-multifile>

### 並行アニメーション {#parallel-animations}

アニメーションパッケージには、複数のアニメーションを同時に再生する`group()`関数がありました。CSSでは、アニメーションのタイミングを完全に制御できます。複数のアニメーションを定義している場合は、それらを一度にすべて適用できます。

```css
.target-element {
  animation:
    rotate 3s,
    fade-in 2s;
}
```

この例では、`rotate`と`fade-in`のアニメーションが同時に発火します。

### 並び替えられるリストの項目をアニメーション化する {#animating-the-items-of-a-reordering-list}

リスト項目の並び替えは、前述の手法を使うだけでそのまま機能します。特別な追加作業は必要ありません。`@for`ループ内の項目は適切に削除されて再追加されるため、enterアニメーションとして`@starting-styles`を使用したアニメーションが発火します。代わりに、同じ挙動を`animate.enter`で実現できます。上の例のように、要素が削除されるときは`animate.leave`を使ってアニメーションします。

#### Animationsパッケージの場合 {#reordering-list-with-animations-package}

<docs-code-multifile>
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/animations-package/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/animations-package/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/animations-package/reorder.css" />
</docs-code-multifile>

#### ネイティブCSSの場合 {#reordering-list-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.ts">
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.css" />
</docs-code-multifile>

## AnimationPlayerの使用箇所を移行する {#migrating-usages-of-animationplayer}

`AnimationPlayer`クラスを使うと、コードからアニメーションを一時停止、再生、再開、完了するなど、より高度な操作をするためにアニメーションへアクセスできます。これらはすべてネイティブでも処理できます。

[`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations)を使うと、要素に関連付けられたアニメーションを直接取得できます。これは、その要素上のすべての[`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation)を配列として返します。`Animation` APIを使えば、アニメーションパッケージの`AnimationPlayer`が提供していたものよりも多くのことを行えます。ここから`cancel()`、`play()`、`pause()`、`reverse()`などを呼び出せます。このネイティブAPIだけで、アニメーションを制御するために必要な機能が揃うはずです。

## ルートトランジション {#route-transitions}

ルート間をアニメーションさせるには、ビュー遷移を使用できます。始めるには、[ルートトランジションアニメーションガイド](guide/routing/route-transition-animations)を参照してください。
