# 再利用可能なアニメーション

This topic provides some examples of how to create reusable animations.

## Prerequisites

Before continuing with this topic, you should be familiar with the following:

*   [Angularアニメーション・イントロダクション](guide/animations)
*   [アニメーションの遷移とトリガー](guide/transition-and-triggers)

## 再利用可能なアニメーションの作成

再利用可能なアニメーションを作成するには、[`animation()`](api/animations/animation)関数を使用してアニメーションを別の`.ts`ファイルに定義し、このアニメーション定義を`const`のexport変数として宣言します。 
このアニメーションは、[`useAnimation()`](api/animations/useAnimation)関数を使用して任意のコンポーネントでimportすると再利用できます。

<code-example header="src/app/animations.ts" path="animations/src/app/animations.1.ts" region="animation-const"></code-example>

上記のコードスニペットでは、`transitionAnimation`がexport変数として宣言されているので再利用可能です。

<div class="alert is-helpful">

**NOTE**: <br />
`height`、`opacity`、`backgroundColor`、および`time`の値は、実行時に置き換えられます。
</div>

You can also export a part of an animation.
For example, the following snippet exports the animation `trigger`.

<code-example header="src/app/animations.1.ts" path="animations/src/app/animations.1.ts" region="trigger-const"></code-example>

From this point, you can import reusable animation variables in your component class.
For example, the following code snippet imports the `transitionAnimation` variable and uses it via the `useAnimation()` function.

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.3.ts" region="reusable"></code-example>

## Angularアニメーションの詳細

あなたは次に興味があるかもしれません:

*   [Angularアニメーション・イントロダクション](guide/animations)
*   [アニメーションの遷移とトリガー](guide/transition-and-triggers)
*   [複雑なアニメーションシーケンス](guide/complex-animation-sequences)
*   [ルーティング遷移のアニメーション](guide/route-animations)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
