# 再利用可能なアニメーション

This topic provides some examples of how to create reusable animations.

## Prerequisites

Before continuing with this topic, you should be familiar with the following:

* [Angularアニメーション・イントロダクション](guide/animations)
* [アニメーションの遷移とトリガー](guide/transition-and-triggers)

## 再利用可能なアニメーションの作成

再利用可能なアニメーションを作成するには、<code>[animation](api/animations/animation)()</code>関数を使用してアニメーションを別の`.ts`ファイルに定義し、このアニメーション定義を`const`のexport変数として宣言します。 このアニメーションは、<code>[useAnimation](api/animations/useAnimation)()</code>関数を使用して任意のコンポーネントでimportすると再利用できます。

<code-example path="animations/src/app/animations.1.ts" header="src/app/animations.ts" region="animation-const" language="typescript"></code-example>

上記のコードスニペットでは、`transitionAnimation`がexport変数として宣言されているので再利用可能です。

<div class="alert is-helpful">

**Note:** `height`、`opacity`、`backgroundColor`、および`time`の値は、実行時に置き換えられます。
</div>

You can also export a part of an animation. For example, the following snippet exports the animation `trigger`.

<code-example path="animations/src/app/animations.1.ts" header="src/app/animations.1.ts" region="trigger-const" language="typescript"></code-example>

From this point, you can import reusable animation variables in your component class. For example, the following code snippet imports the `transitionAnimation` variable and uses it via the `useAnimation()` function.

<code-example path="animations/src/app/open-close.component.3.ts" header="src/app/open-close.component.ts" region="reusable" language="typescript"></code-example>

## Angularアニメーションの詳細

あなたは次に興味があるかもしれません:

* [Angularアニメーション・イントロダクション](guide/animations)
* [アニメーションの遷移とトリガー](guide/transition-and-triggers)
* [複雑なアニメーションシーケンス](guide/complex-animation-sequences)
* [ルーティング遷移のアニメーション](guide/route-animations)
