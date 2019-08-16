# 再利用可能なアニメーション

#### 前提

次の概念への基本的な理解:

* [Angularアニメーション・イントロダクション](guide/animations)
* [アニメーションの遷移とトリガー](guide/transition-and-triggers)

<hr>

Angularアニメーションの[AnimationOptions](https://angular.io/api/animations/AnimationOptions)インターフェースを使用すると、異なるコンポーネント間で再利用できるアニメーションを作成できます。

## 再利用可能なアニメーションの作成

再利用可能なアニメーションを作成するには、[`animation()`](https://angular.io/api/animations/animation)メソッドを使用してアニメーションを別の`.ts`ファイルに定義し、このアニメーション定義を`const`のexport変数として宣言します。 このアニメーションは、[`useAnimation()`](https://angular.io/api/animations/useAnimation)APIを使用して任意のコンポーネントでimportすると再利用できます。

<code-example path="animations/src/app/animations.ts" header="src/app/animations.ts" region="reusable" language="typescript"></code-example>

上記のコードスニペットでは、`transAnimation`がexport変数として宣言されているので再利用可能です。

<div class="alert is-helpful">

**Note:** `height`、`opacity`、`backgroundColor`、および`time`の値は、実行時に置き換えられます。
</div>

`transAnimation`変数をコンポーネントクラスにインポートすると、次に示された`useAnimation()`を用いる方法で再利用することができます。

<code-example path="animations/src/app/open-close.component.3.ts" header="src/app/open-close.component.ts" region="reusable" language="typescript"></code-example>

## Angularアニメーションの詳細

あなたは次に興味があるかもしれません:

* [Angularアニメーション・イントロダクション](guide/animations)
* [アニメーションの遷移とトリガー](guide/transition-and-triggers)
* [複雑なアニメーションシーケンス](guide/complex-animation-sequences)
* [ルーティング遷移のアニメーション](guide/route-animations)
