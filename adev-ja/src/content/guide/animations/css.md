# CSSでアプリケーションをアニメーション化する

CSSには、アプリケーション内で美しく魅力的なアニメーションを作成するための強力なツールが揃っています。

## ネイティブCSSでアニメーションを書く方法 {#how-to-write-animations-in-native-css}

ネイティブCSSでアニメーションを書いたことがない場合は、入門に役立つ優れたガイドがいくつもあります。以下にいくつか紹介します。

- [MDNのCSSアニメーションガイド](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
- [W3SchoolsのCSS3アニメーションガイド](https://www.w3schools.com/css/css3_animations.asp)
- [CSSアニメーションの完全チュートリアル](https://www.lambdatest.com/blog/css-animations-tutorial/)
- [初心者向けCSSアニメーション](https://thoughtbot.com/blog/css-animation-for-beginners)

また、次の動画も参考にしてください。

- [9分でCSSアニメーションを学ぶ](https://www.youtube.com/watch?v=z2LQYsZhsFw)
- [Net NinjaのCSSアニメーションチュートリアル再生リスト](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

まずはこれらのガイドやチュートリアルに目を通し、その後に本ガイドに戻ってきてください。

## 再利用可能なアニメーションを作成する {#creating-reusable-animations}

`@keyframes`を使用すると、アプリケーション全体で共有できる再利用可能なアニメーションを作成できます。共通のCSSファイルにキーフレームアニメーションを定義しておけば、アプリケーション内の任意の場所で再利用できます。

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-shared"/>

要素に`animated-class`クラスを追加すると、その要素でアニメーションが開始されます。

## トランジションをアニメーション化する {#animating-a-transition}

### 状態とスタイルをアニメーション化する {#animating-state-and-styles}

要素を開いたり閉じたりするときなど、2つの異なる状態の間をアニメーションで遷移させたいことがあります。CSSクラスを切り替えることで、キーフレームアニメーションやトランジションを使って実現できます。

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-states"/>

`open`または`closed`状態のトリガーは、コンポーネント内で要素のクラスを切り替えて行います。例は、[テンプレートガイド](guide/templates/binding#css-class-and-style-property-bindings)で確認できます。

同様の例として、テンプレートガイドの[スタイルを直接アニメーション化する](guide/templates/binding#css-style-properties)も参照してください。

### トランジション、タイミング、イージング {#transitions-timing-and-easing}

アニメーションでは、継続時間や遅延、イージングの挙動を調整することがよくあります。これは複数のCSSプロパティ（またはショートハンド）で指定できます。

キーフレームアニメーションでは、`animation-duration`、`animation-delay`、`animation-timing-function`を指定するか、`animation`ショートハンドプロパティを使用します。

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-timing"/>

同様に、`@keyframes`を使用しないアニメーションでは、`transition-duration`、`transition-delay`、`transition-timing-function`、および`transition`ショートハンドプロパティを使用できます。

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="transition-timing"/>

### アニメーションをトリガーする {#triggering-an-animation}

アニメーションは、CSSのスタイルやクラスを切り替えることでトリガーできます。クラスが要素に追加されるとアニメーションが実行され、クラスを削除すると、その要素に定義されているCSSに戻ります。例を示します。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.component.ts">
    <docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.ts" />
    <docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.html" />
    <docs-code header="open-close.component.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.css"/>
</docs-code-multifile>

## トランジションとトリガー {#transition-and-triggers}

### `height: auto` をアニメーション化する {#animating-auto-height}

CSS Gridを使用すると、`height: auto`へのアニメーションを実現できます。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.ts">
    <docs-code header="auto-height.component.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.ts" />
    <docs-code header="auto-height.component.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.html" />
    <docs-code header="auto-height.component.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.css"  />
</docs-code-multifile>

すべてのブラウザをサポートする必要がない場合は、`height: auto`をアニメーション化するためのより本質的な解決策である`calc-size()`も確認してください。詳しくは、[MDNのドキュメント](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size)と[このチュートリアル](https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/)を参照してください。

### ビューへの出入りをアニメーション化する {#animate-entering-and-leaving-a-view}

要素がビューに入るとき、またはビューから出るときのアニメーションを作成できます。まずは、ビューに入るときのアニメーションを見ていきましょう。`animate.enter`を使うと、要素がビューに入るときにアニメーション用のクラスが適用されます。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts">
    <docs-code header="insert.component.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts" />
    <docs-code header="insert.component.html" path="adev/src/content/examples/animations/src/app/native-css/insert.component.html" />
    <docs-code header="insert.component.css" path="adev/src/content/examples/animations/src/app/native-css/insert.component.css"  />
</docs-code-multifile>

ビューから出るときのアニメーションも、ビューに入るときと同様です。`animate.leave`で、要素がビューから出るときに適用するCSSクラスを指定します。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts">
    <docs-code header="remove.component.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts" />
    <docs-code header="remove.component.html" path="adev/src/content/examples/animations/src/app/native-css/remove.component.html" />
    <docs-code header="remove.component.css" path="adev/src/content/examples/animations/src/app/native-css/remove.component.css"  />
</docs-code-multifile>

`animate.enter`と`animate.leave`について詳しくは、[EnterとLeaveのアニメーションガイド](guide/animations)を参照してください。

### インクリメントとデクリメントをアニメーション化する {#animating-increment-and-decrement}

インクリメントとデクリメントに合わせてアニメーションするのは、アプリケーションでよくあるパターンです。以下はその例です。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.ts">
    <docs-code header="increment-decrement.component.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.ts" />
    <docs-code header="increment-decrement.component.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.html" />
    <docs-code header="increment-decrement.component.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.css" />
</docs-code-multifile>

### アニメーション（またはすべてのアニメーション）を無効にする {#disabling-an-animation-or-all-animations}

指定したアニメーションを無効にする方法はいくつかあります。

1. `animation`と`transition`を`none`に強制するカスタムクラスを作成します。

```css
.no-animation {
  animation: none !important;
  transition: none !important;
}
```

このクラスを要素に適用すると、その要素ではアニメーションが一切実行されません。また、DOM全体またはDOMの一部にスコープすることで、この挙動を強制することもできます。ただし、この方法ではアニメーションイベントも発生しなくなります。要素の削除のためにアニメーションイベントを待っている場合、この方法は機能しません。回避策としては、継続時間を1ミリ秒に設定します。

2. [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)メディアクエリを使用して、アニメーションを控えたいユーザーにはアニメーションを再生しないようにします。

3. プログラムからアニメーションクラスを追加しないようにします。

### アニメーションのコールバック {#animation-callbacks}

アニメーション中の特定のタイミングで処理を実行したい場合、リッスンできるイベントがいくつかあります。次はその一例です。

[`OnAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)  
[`OnAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)  
[`OnAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event)  
[`OnAnimationCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)

[`OnTransitionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)  
[`OnTransitionRun`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)  
[`OnTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)  
[`OnTransitionCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)

Web Animations APIには、他にも多くの機能があります。利用できるアニメーション関連APIについては、[ドキュメント](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)を参照してください。

NOTE: これらのコールバックはバブリング（イベント伝播）します。子要素と親要素の両方をアニメーション化している場合、イベントは子要素から親要素へ伝播します。意図したイベントターゲットに応答しているかを判断するために、伝播を停止するか、イベントの詳細を確認してください。適切なノードを対象にしていることは、`animationname`プロパティやトランジション対象のプロパティを確認すると検証できます。

## 複雑なシーケンス {#complex-sequences}

アニメーションは、単純なフェードインやフェードアウトだけではありません。複数のアニメーションを組み合わせた複雑なシーケンスを実行したいこともあるでしょう。ここでは、そうしたシナリオをいくつか見ていきましょう。

### リスト内のアニメーションに段階的な遅延を付ける {#staggering-animations-in-a-list}

よくある効果の1つに、リスト内の各要素のアニメーションを段階的に遅らせてカスケード効果を作るものがあります。これは`animation-delay`または`transition-delay`を利用して実現できます。次はそのCSSの例です。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.component.ts">
    <docs-code header="stagger.component.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.ts" />
    <docs-code header="stagger.component.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.html" />
    <docs-code header="stagger.component.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.css" />
</docs-code-multifile>

### 並行アニメーション {#parallel-animations}

`animation`ショートハンドプロパティを使用すると、1つの要素に複数のアニメーションを同時に適用できます。それぞれに継続時間や遅延を個別に設定できるため、アニメーションを合成して複雑な効果を作成できます。

```css
.target-element {
  animation:
    rotate 3s,
    fade-in 2s;
}
```

この例では、`rotate`と`fade-in`のアニメーションは同時に実行されますが、継続時間が異なります。

### 並び替え可能なリストの要素をアニメーション化する {#animating-the-items-of-a-reordering-list}

`@for`ループ内の要素は削除されて再追加されるため、enterアニメーションとして`@starting-styles`を使用したアニメーションが実行されます。同じ挙動は`animate.enter`でも実現できます。要素が削除されるときにアニメーションするには、以下の例のように`animate.leave`を使用します。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.component.ts">
    <docs-code header="reorder.component.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.ts" />
    <docs-code header="reorder.component.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.html" />
    <docs-code header="reorder.component.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.css" />
</docs-code-multifile>

## アニメーションをプログラムで制御する {#programmatic-control-of-animations}

[`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations)を使用すると、要素に関連付けられたアニメーションを直接取得できます。これは、その要素上のすべての[`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation)を配列として返します。`Animation` APIを使えば、`@angular/animations`パッケージの`AnimationPlayer`よりも多くの操作が可能です。`cancel()`、`play()`、`pause()`、`reverse()`などを呼び出せます。このネイティブAPIだけで、アニメーションの制御に必要な機能が揃います。

## Angularアニメーションについてさらに詳しく {#more-on-angular-animations}

以下の項目にも興味があるかもしれません：

<docs-pill-row>
  <docs-pill href="guide/animations" title="EnterとLeaveのアニメーション"/>
  <docs-pill href="guide/routing/route-transition-animations" title="ルート遷移アニメーション"/>
</docs-pill-row>
