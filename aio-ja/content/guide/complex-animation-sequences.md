# 複雑なアニメーションシーケンス

#### 前提

次の概念への基本的な理解:

* [Angularアニメーション・イントロダクション](guide/animations)
* [アニメーションの遷移とトリガー](guide/transition-and-triggers)

これまでは、単一のHTML要素の単純なアニメーションを学んできました。 
Angularを使用すると、グリッド全体や要素リストなどの、シーケンスをもつ要素がページに出入りするときにアニメーションできます。 
複数のアニメーションを並列に実行するか、個別にアニメーションを順次実行するかを選択できます。

複雑なアニメーションシーケンスを制御する関数は次のとおりです。

| Functions                         | Details |
|:---                               |:---     |
| `query()`                         | Finds one or more inner HTML elements. |
| `stagger()`                       | Applies a cascading delay to animations for multiple elements. |
| [`group()`](api/animations/group) | Runs multiple animation steps in parallel. |
| `sequence()`                      | Runs animation steps one after another. |

<a id="complex-sequence"></a>

## The query() function

Most complex animations rely on the `query()` function to find child elements and apply animations to them, basic examples of such are:

| Examples                               | Details |
|:---                                    |:---     |
| `query()` followed by `animate()`      | Used to query simple HTML elements and directly apply animations to them.                                                                                                                            |
| `query()` followed by `animateChild()` | Used to query child elements, which themselves have animations metadata applied to them and trigger such animation \(which would be otherwise be blocked by the current/parent element's animation\). |

The first argument of `query()` is a [css selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) string which can also contain the following Angular-specific tokens:

| Tokens                     | Details |
|:---                        |:---     |
| `:enter` <br /> `:leave`   | For entering/leaving elements.               |
| `:animating`               | For elements currently animating.            |
| `@*` <br /> `@triggerName` | For elements with any—or a specific—trigger. |
| `:self`                    | The animating element itself.                |

<div class="callout is-helpful">

<header>Entering and Leaving Elements</header>

Not all child elements are actually considered as entering/leaving; this can, at times, be counterintuitive and confusing. Please see the [query api docs](api/animations/query#entering-and-leaving-elements) for more information.

You can also see an illustration of this in the animations live example \(introduced in the animations [introduction section](guide/animations#about-this-guide)\) under the Querying tab.

</div>

## Animate multiple elements using query() and stagger() functions

After having queried child elements via `query()`, the `stagger()` function lets you define a timing gap between each queried item that is animated and thus animates elements with a delay between them.

The following example demonstrates how to use the `query()` and `stagger()` functions to animate a list \(of heroes\) adding each in sequence, with a slight delay, from top to bottom.

*   Use `query()` to look for an element entering the page that meets certain criteria
*   For each of these elements, use `style()` to set the same initial style for the element.
    Make it transparent and use `transform` to move it out of position so that it can slide into place.

*   Use `stagger()` to delay each animation by 30 milliseconds
*   Animate each element on screen for 0.5 seconds using a custom-defined easing curve, simultaneously fading it in and un-transforming it

<code-example header="src/app/hero-list-page.component.ts" path="animations/src/app/hero-list-page.component.ts" region="page-animations"></code-example>

## group()関数を使用した並列アニメーション

連続する各アニメーションの間に遅延を追加する方法を書きました。 しかし他にも、並列に起こるアニメーションについても設定することもできます。 たとえば、同じ要素の2つのCSSプロパティをアニメーションし、それぞれに異なる`easing`関数を使用することができます。 このアニメーションは、<code>[group](api/animations/group)()</code>関数を使用することで実現できます。

<div class="alert is-helpful">

**注意:** <code>[group](api/animations/group)()</code>関数はアニメーション要素ではなく、アニメーションの*ステップ*をグループ化するために使用されます。
</div>

The following example, uses <code>[group](api/animations/group)()</code>s on both `:enter` and `:leave` for two different timing configurations, thus applying two independent animations to the same element in parallel.

<code-example path="animations/src/app/hero-list-groups.component.ts" region="animationdef" header="src/app/hero-list-groups.component.ts (excerpt)" language="typescript"></code-example>

## シーケンシャル vs. 並列アニメーション

複雑なアニメーションでは、一度に多くのことが起こる可能性があります。 それでも、複数のアニメーションが連続したアニメーションを作成したい場合はどうすればよいでしょうか？ 以前は<code>[group](api/animations/group)()</code>を使うことで、同時に複数アニメーションを並列に実行していました。

`sequence()`と呼ばれる第2の関数は、前述のように、同じアニメーションを次々に実行することを可能とします。 `sequence()`の中において、アニメーションのステップは`style()`または `animate()`のいずれかの関数呼び出しで構成されます。

* `style()`を使用すると、指定されたスタイルデータを直ちに適用できます。
* `animate()`を使用すると、一定の時間間隔でスタイリングデータを適用します。

## フィルターアニメーション例

ライブサンプルページの別のアニメーションを見てみましょう。 「Filter/Stagger」ページを開き、**Search Heroes**テキストボックスに`Magnet`や`tornado`などのテキストを入力します。

入力時にフィルターがリアルタイムで機能します。 新しい文字を入力すると要素がページから離れ、フィルターが徐々に狭められていきます。 フィルターボックスの各文字を削除すると、ヒーローのリストが徐々にページに再挿入されます。

HTMLテンプレートには、`filterAnimation`というトリガーが含まれています。

<code-example path="animations/src/app/hero-list-page.component.html" header="src/app/hero-list-page.component.html" region="filter-animations"></code-example>

The `filterAnimation` in the component's decorator contains three transitions.

<code-example path="animations/src/app/hero-list-page.component.ts" header="src/app/hero-list-page.component.ts" region="filter-animations" language="typescript"></code-example>

The code in this example performs the following tasks:

* Skips animations when the user first opens or navigates to this page (the filter animation narrows what is already there, so it only works on elements that already exist in the DOM).

* Filters heroes based on the search input's value.

For each change:

* Hides an element leaving the DOM by setting its opacity and width to 0.

* Animates an element entering the DOM over 300 milliseconds. During the animation, the element assumes its default width and opacity.

* If there are multiple elements entering or leaving the DOM, staggers each animation starting at the top of the page, with a 50-millisecond delay between each element.

## Animating the items of a reordering list

Although Angular animates correctly `*ngFor` list items out of the box, it will not be able to do so if their ordering changes.
This is because it will lose track of which element is which, resulting in broken animations.
The only way to help Angular keep track of such elements is by assigning a `TrackByFunction` to the `NgForOf` directive.
This makes sure that Angular always knows which element is which, thus allowing it to apply the correct animations to the correct elements all the time.

<div class="alert is-important">

**IMPORTANT**: <br />
If you need to animate the items of an `*ngFor` list and there is a possibility that the order of such items will change during runtime, always use a `TrackByFunction`.

</div>

## Animations and Component View Encapsulation

Angular animations are based on the components DOM structure and do not directly take [View Encapsulation](/guide/view-encapsulation) into account, this means that components using `ViewEncapsulation.Emulated` behave exactly as if they where using `ViewEncapsulation.None` (`ViewEncapsulation.ShadowDom` behaves differently as we'll discuss shortly).

For example if the `query()` function (which you'll see more of in the rest of the Animations guide) were to be applied at the top of a tree of components using the emulated view encapsulation, such query would be able to identify (and thus animate) DOM elements on any depth of the tree.

On the other hand the `ViewEncapsulation.ShadowDom` changes the component's DOM structure by "hiding" DOM elements inside [`ShadowRoot`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) elements. Such DOM manipulations do prevent some of the animations implementation to work properly since it relies on simple DOM structures and doesn't take `ShadowRoot` elements into account. Therefore it is advised to avoid applying animations to views incorporating components using the ShadowDom view encapsulation.

## アニメーションシーケンスのまとめ

複数要素をアニメーションするためのAngular関数は、内部要素を見つけるために`query()`で始まります。 たとえば、`<div>`内のすべての画像を収集します。 残りの関数`stagger()`、<code>[group](api/animations/group)()</code>、`sequence()`はカスケードを適用したり、複数のアニメーションステップを適用する方法を制御することができます。

## Angularアニメーションの詳細

あなたは次に興味があるかもしれません:

* [Angularアニメーション・イントロダクション](guide/animations)
* [アニメーションの遷移とトリガー](guide/transition-and-triggers)
* [再利用可能なアニメーション](guide/reusable-animations)
* [ルーティング遷移のアニメーション](guide/route-animations)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
