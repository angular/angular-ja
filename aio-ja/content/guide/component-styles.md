# Component Styles
# コンポーネントスタイル

Angular applications are styled with standard CSS. That means you can apply
everything you know about CSS stylesheets, selectors, rules, and media queries
directly to Angular applications.
Angularアプリケーションは、標準CSSでデザインされます。これは、貴方が知っているCSSスタイルシート、
セレクター、ルール、そしてメディアクエリーついての全てを
適用できる事を意味します。

Additionally, Angular can bundle *component styles*
with components, enabling a more modular design than regular stylesheets.
加えて、Angularは、 コンポーネントに、標準スタイルシートでは無く
*コンポーネントスタイル* をバンドルできます。

This page describes how to load and apply these component styles.
このページでは、これらのコンポーネントスタイルをどのように読み込み適用するのか説明します。

You can run the <live-example></live-example> in Stackblitz and download the code from there.
Stackblitz で <live-example></live-example> を実行でき、ここからコードをダウンロードできます。

## Using component styles
## コンポーネントスタイルを使いましょう

For every Angular component you write, you may define not only an HTML template,
but also the CSS styles that go with that template,
specifying any selectors, rules, and media queries that you need.
あなたが書く全ての Angular コンポーネントのために、HTMLテンプレートだけでは無く、
CSSスタイル、必要な、あらゆるセレクターの指定、ルール、メディアクエリー、
などを定義して良いです、

One way to do this is to set the `styles` property in the component metadata.
一つの方法は、コンポーネントメタデータに `styles` プロパティをセットすることです。
The `styles` property takes an array of strings that contain CSS code.
この `styles` プロパティは、CSSコードを含む、文字列の配列を持ちます。
Usually you give it one string, as in the following example:
一般的に、一つの文字を与えます、次のような例です：

<code-example path="component-styles/src/app/hero-app.component.ts" title="src/app/hero-app.component.ts" linenums="false">
</code-example>

## Style scope
## スタイルの有効範囲

<div class="alert is-critical">

The styles specified in `@Component` metadata _apply only within the template of that component_.
スタイルは、 `@Component` _そのテンプレートのコンポーネントにだけ適用される_ メタデータで定義します。

</div>

They are _not inherited_ by any components nested within the template nor by any content projected into the component.
テンプレートの中のコンポーネントの入れ子や、コンポーネントに投げられたコンテントでも、_引き継がない_。

In this example, the `h1` style applies only to the `HeroAppComponent`,
not to the nested `HeroMainComponent` nor to `<h1>` tags anywhere else in the application.
この例では、 `h1` スタイルは、ただ `HeroAppComponent` だけに現れ、
ネストされた `HeroMainComponent` には無く、 `<h1>` タグは、アプリケーションの何処にも現れない。

This scoping restriction is a ***styling modularity feature***.
この有効範囲の制限は、 ***モジュール式スタイリング特徴*** です。

* You can use the CSS class names and selectors that make the most sense in the context of each component.
* それぞれのコンポーネントのコンテキストの大部分の表現を作るCSSクラス名、セレクターを利用できます。


* Class names and selectors are local to the component and don't collide with
  classes and selectors used elsewhere in the application.
* クラス名とセレクターは、コンポーネント内で局所的で、アプリケーションの他の場所で使われている
  クラスやセレクターと衝突しません。


* Changes to styles elsewhere in the application don't affect the component's styles.
* スタイルの変更は、他の場所のアプリケーションのコンポーネントスタイルに影響しません。


* You can co-locate the CSS code of each component with the TypeScript and HTML code of the component,
  which leads to a neat and tidy project structure.
* きちんとした、そして整然としたプロジェクト構造に導く、
  コンポーネントの TypeScript と HTMLコードと共に、各々のコンポーネントの CSSコードを配置できます。


* You can change or remove component CSS code without searching through the
  whole application to find where else the code is used.
* アプリケーションの他の場所で使われているか探す検索を行わずに、コンポーネント CSS コードの変更或いは除去が可能です。

{@a special-selectors}

## Special selectors
## 特別なセレクター

Component styles have a few special *selectors* from the world of shadow DOM style scoping
(described in the [CSS Scoping Module Level 1](https://www.w3.org/TR/css-scoping-1) page on the
[W3C](https://www.w3.org) site).
コンポーネントスタイルは、いくつかの DOMスタイルのスコーピングの影の世界からの特別な *セレクター* があります
([W3C](https://www.w3.org) サイトの
[CSS スコーピング モデル レベル 1](https://www.w3.org/TR/css-scoping-1) ページに記述されている)。
The following sections describe these selectors.
次のセクションで、これらのセレクターを説明します。


### :host
### :host

Use the `:host` pseudo-class selector to target styles in the element that *hosts* the component (as opposed to
コンポーネントを *提供する* 要素のスタイルを対象にする `:host` 偽クラスセレクターを使います(
targeting elements *inside* the component's template).
対して、コンポーネントの雛形の *内部の* エレメントを対象とする)。

<code-example path="component-styles/src/app/hero-details.component.css" region="host" title="src/app/hero-details.component.css" linenums="false">
</code-example>

The `:host` selector is the only way to target the host element. You can't reach
`:host` セレクターは、ホストのエレメントを対象とする唯一の方法です。別のセレクターを用いて
the host element from inside the component with other selectors because it's not part of the
コンポーネントの内側からホスト要素には到達できない、なぜならば、それは、コンポーネント自身の
component's own template. The host element is in a parent component's template.
雛形の一部ではないから。ホストの要素は、親のコンポーネントの雛形の中にあるから。

Use the *function form* to apply host styles conditionally by
`:host` の後のカッコの中の別なセレクターを含むことにより、
including another selector inside parentheses after `:host`.
条件付きのホストのスタイルを適用するために *function form* を使います。
The next example targets the host element again, but only when it also has the `active` CSS class.
つぎの例は、再びホストの要素を目標にします、が、`active` CSS クラスがある時だけです。

<code-example path="component-styles/src/app/hero-details.component.css" region="hostfunction" title="src/app/hero-details.component.css" linenums="false">
</code-example>

### :host-context
### :host-context

Sometimes it's useful to apply styles based on some condition *outside* of a component's view.
時々、コンポーネントのビューの *外側* のいくつかの状態の基づいたスタイルを表すのに役立ちます。
For example, a CSS theme class could be applied to the document `<body>` element, and
例えば、CSS テーマクラスは、ドキュメントの `<body>` 要素に適用させることが可能です、そして
you want to change how your component looks based on that.
あなたは、どの様にコンポーネントが見えるのかを変えたいと、望んでいます。

Use the `:host-context()` pseudo-class selector, which works just like the function
`:host-context()` 仮クラスセレクターを使いましょう、`:host()` からの関数の様に働きます。
form of `:host()`. The `:host-context()` selector looks for a CSS class in any ancestor of the component host element,
`:host-context()` セレクターは、コンポーネントのホスト要素の任意の先祖のうち、
up to the document root. The `:host-context()` selector is useful when combined with another selector.
ドキュメントルートまでのCSSクラスを探します。`:host-context()` セレクターは、他のセレクターと結びつけた時に便利です。

The following example applies a `background-color` style to all `<h2>` elements *inside* the component, only
つぎの例は、いくつかの先祖のエレメントが、`theme-light` CSSクラスを備えている時の場合にのみ、
if some ancestor element has the CSS class `theme-light`.
コンポーネントの *内部* の全ての `<h2>` エレメントのスタイルに `background-color` を適用します。

<code-example path="component-styles/src/app/hero-details.component.css" region="hostcontext" title="src/app/hero-details.component.css" linenums="false">
</code-example>

### (deprecated) `/deep/`, `>>>`, and `::ng-deep`
### (非推奨) `/deep/` 、 `>>>` と `::ng-deep`

Component styles normally apply only to the HTML in the component's own template.
コンポーネントスタイルは、普通は、HTML 内のコンポーネント自身のテンプレートにだけ適用されます。

Use the `/deep/` shadow-piercing descendant combinator to force a style down through the child
component tree into all the child component views.
`/deep/` シャドウピアスの子孫コンビネーターを利用して、子のコンポーネント ツリーを介して
全ての子のコンポーネントの見え方にスタイルを強制的におろしますます。
The `/deep/` combinator works to any depth of nested components, and it applies to both the view
children and content children of the component.
`/deep/` コンビネーターは、あらゆる深さのネストされたコンポーネントとして作動し、子のビューとしても
コンポーネントの子のコンテンツとしてもあてはまります。

The following example targets all `<h3>` elements, from the host element down
through this component to all of its child elements in the DOM.
つぎの例は、全ての `<h3>` エレメント、つまり、ホストの要素から、このコンポーネントを下がり降り、DOM の全てのそれの子の要素まで、を対象とします。

<code-example path="component-styles/src/app/hero-details.component.css" region="deep" title="src/app/hero-details.component.css" linenums="false">

</code-example>

The `/deep/` combinator also has the aliases `>>>`, and `::ng-deep`.
`/deep/` コンビネーターは、別名 `>>>`　と `::ng-deep` があります。

<div class="alert is-important">

Use `/deep/`, `>>>` and `::ng-deep` only with *emulated* view encapsulation.
`/deep/`、 `>>>` と `::ng-deep` は、 *エミュレート化* ビューがカプセルされている時だけ使います。
Emulated is the default and most commonly used view encapsulation. For more information, see the
エミュレート化は、デフォルトで、そして、大抵、ビューのカプセル化に使われます。追加の情報は、
[Controlling view encapsulation](guide/component-styles#view-encapsulation) section.
[ビューのカプセル化制御法](guide/component-styles#view-encapsulation) セクションを参照してください。

</div>

<div class="alert is-important">

The shadow-piercing descendant combinator is deprecated and [support is being removed from major browsers](https://www.chromestatus.com/features/6750456638341120) and tools.
シャドウピアスの子孫コンビネーターは、非推奨で、ツールと[主要ブラウザからサポートが除去され始めています](https://www.chromestatus.com/features/6750456638341120) 。
As such we plan to drop support in Angular (for all 3 of `/deep/`, `>>>` and `::ng-deep`).
同じように、Angular (`/deep/`、 `>>>` と `::ng-deep` の三つとも) のサポートも停止する計画です。
Until then `::ng-deep` should be preferred for a broader compatibility with the tools.
それまでは、ツールの幅広い互換性のために、`::ng-deep` を選択すべきです。

</div>

{@a loading-styles}

## Loading component styles
#＃ 読み込みコンポーネント スタイル

There are several ways to add styles to a component:
コンポーネントにスタイルを追加する方法は、いくつかあります。

* By setting `styles` or `styleUrls` metadata.
* `styles` または `styleUrls` メタデータの設定
* Inline in the template HTML.
* HTML テンプレート内のインライン
* With CSS imports.
* CSS のインポート

The scoping rules outlined earlier apply to each of these loading patterns.
前に概説した範囲指定のルールは、これらの読み込みパターンのそれぞれに適用されます。 

### Styles in component metadata
### コンポーネント メタデータ内のスタイル

You can add a `styles` array property to the `@Component` decorator.
`styles` 配列プロパティを `@Component` デコレーター に追加できます。

Each string in the array defines some CSS for this component.
配列のそれぞれの文字は、コンポーネントに対していくつかの CSS を定義します。

<code-example path="component-styles/src/app/hero-app.component.ts" title="src/app/hero-app.component.ts (CSS inline)">
</code-example>

<div class="alert is-critical">

Reminder: these styles apply _only to this component_.
注意： これらのスタイルは、 _このコンポーネントにのみ_ 適用されます。
They are _not inherited_ by any components nested within the template nor by any content projected into the component.
これらのスタイルは、テンプレートでネストされたどんなコンポーネントでも、あるいはコンポーネントに突出されたどんなコンテントでも、受継がれません。

</div>

The CLI defines an empty `styles` array when you create the component with the `--inline-styles` flag.
CLI は、 `--inline-styles` フラグを使ってコンポーネントを生成すれば、空の `styles` 配列を定義します。

<code-example language="sh" class="code-shell">
ng generate component hero-app --inline-style
</code-example>

### Style files in component metadata
### コンポーネント メタデータ内のスタイル ファイル

You can load styles from external CSS files by adding a `styleUrls` property
to a component's `@Component` decorator:
`styleUrls` プロパティを `@Component` デコレータのコンポーネントに追加すると、スタイルを外部の CSS ファイルから読み込めます。

<code-tabs>
  <code-pane title="src/app/hero-app.component.ts (CSS in file)" path="component-styles/src/app/hero-app.component.1.ts"></code-pane>
  <code-pane title="src/app/hero-app.component.css" path="component-styles/src/app/hero-app.component.css"></code-pane>
</code-tabs>

<div class="alert is-critical">

Reminder: the styles in the style file apply _only to this component_.
注意： スタイルファイルのスタイルは、 _このコンポーネントにのみ_ 適用されます。
They are _not inherited_ by any components nested within the template nor by any content projected into the component.
これらのスタイルは、テンプレートでネストされたどんなコンポーネントでも、あるいはコンポーネントに突出されたどんなコンテントでも、受継がれません。

</div>

<div class="l-sub-section">

  You can specify more than one styles file or even a combination of `style` and `styleUrls`.
  ひとつ以上のスタイルファイル、あるいは `style` と `styleUrls` の組み合わせて、定義が可能です。

</div>

The CLI creates an empty styles file for you by default and references that file in the component's generated `styleUrls`.
CLI は、デフォルトで空のスタイルファイルを生成し、コンポーネントの生成された `styleUrls` で参照します。

<code-example language="sh" class="code-shell">
ng generate component hero-app
</code-example>

### Template inline styles
### インライン スタイル テンプレート

You can embed CSS styles directly into the HTML template by putting them
inside `<style>` tags.
`<style>` タグで囲めば、HTMLテンプレート内に直に CSS　スタイルを埋め込むことも可能です。

<code-example path="component-styles/src/app/hero-controls.component.ts" region="inlinestyles" title="src/app/hero-controls.component.ts">
</code-example>

### Template link tags
### リンク タグ テンプレート

You can also write `<link>` tags into the component's HTML template.
コンポーネントの HTML テンプレート内に `<link>` タグを記述することも可能です。

<code-example path="component-styles/src/app/hero-team.component.ts" region="stylelink" title="src/app/hero-team.component.ts">
</code-example>

<div class="alert is-critical">

The link tag's `href` URL must be relative to the
_**application root**_, not relative to the component file.
リンクタグの `href` URL は、 _**アプリケーションルート**_ からの相対指定でなければならず、コンポーネントファイルからの相対指定では無いです。

When building with the CLI, be sure to include the linked style file among the assets to be copied to the server as described in the [CLI documentation](https://github.com/angular/angular-cli/wiki/stories-asset-configuration).
CLI で生成するときに、[CLI 説明書](https://github.com/angular/angular-cli/wiki/stories-asset-configuration) に記述されているように、サーバーにコピーされた資産(アセット)の中に、必ずリンクされたスタイルファイルを含めてください。

</div>

### CSS @imports
### CSS @imports

You can also import CSS files into the CSS files using the standard CSS `@import` rule.
標準 CSS `@import` ルールを利用して CSSファイルを CSSファイルの中にインポートすることも可能です。
For details, see [`@import`](https://developer.mozilla.org/en/docs/Web/CSS/@import)
on the [MDN](https://developer.mozilla.org) site.
詳しくは、[MDN](https://developer.mozilla.org) サイトの
[`@import`](https://developer.mozilla.org/en/docs/Web/CSS/@import) を参照してください。

In this case, the URL is relative to the CSS file into which you're importing.
この場合、インポートするファイルの URL は、CSSファイルに対して相対指定です。

<code-example path="component-styles/src/app/hero-details.component.css" region="import" title="src/app/hero-details.component.css (excerpt)">
</code-example>

### External and global style files
### 外部とグローバルなスタイルファイル

When building with the CLI, you must configure the `angular.json` to include _all external assets_, including external style files.
CLI で生成する場合、あなたは、 `angular.json` に _全ての外部アセット_ を含め、外部スタイルファイルを含め、定義しなければならない。

Register **global** style files in the `styles` section which, by default, is pre-configured with the global `styles.css` file.
`styles` セクションで **グローバル** スタイルファイルの登録は、デフォルでは、グローバル `styles.css` と、事前定義してあります。

See the [CLI documentation](https://github.com/angular/angular-cli/wiki/stories-global-styles) to learn more.
もっと学びたい場合は、 [CLI ドキュメント](https://github.com/angular/angular-cli/wiki/stories-global-styles) を参照してください。

### Non-CSS style files
### CSSスタイルでは無いファイル

If you're building with the CLI,
CLI を使って生成しているならば、
you can write style files in [sass](http://sass-lang.com/), [less](http://lesscss.org/), or [stylus](http://stylus-lang.com/) and specify those files in the `@Component.styleUrls` metadata with the appropriate extensions (`.scss`, `.less`, `.styl`) as in the following example:
スタイルファイルを、つぎの例のように、 [sass](http://sass-lang.com/)、 [less](http://lesscss.org/)、  あるいは、[stylus](http://stylus-lang.com/) で書け、 `@Component.styleUrls` メタデータで適切な拡張子 (`.scss`, `.less`, `.styl`) を定義します：

<code-example>
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
...
</code-example>

The CLI build process runs the pertinent CSS preprocessor.
CLI 構築プロセスは、適切な CSS プリプロセッサを実行します。

When generating a component file with `ng generate component`, the CLI emits an empty CSS styles file (`.css`) by default.
`ng generate component` を使ってコンポーネントを生成すれば、CLI は、デフォルトで空の CSS　スタイルファイル(`.css`)を作ります。
You can configure the CLI to default to your preferred CSS preprocessor
[CLI ドキュメント](https://github.com/angular/angular-cli/wiki/stories-css-preprocessors
"CSS プリプロセッサ統合") 
に記述してあるように、あなたのお気に入りの CSS プリプロセッサに環境設定できます。
as explained in the [CLI documentation](https://github.com/angular/angular-cli/wiki/stories-css-preprocessors
"CSS Preprocessor integration").

<div class="alert is-important">

Style strings added to the `@Component.styles` array _must be written in CSS_ because the CLI cannot apply a preprocessor to inline styles.
`@Component.styles` 配列に追加されたスタイル文字列は、_CSS に記述されなければならない_ 、何故ならば、CLI は、インラインスタイルのプリプロセッサに適用できないから。

</div>

{@a view-encapsulation}

## View encapsulation
#＃ ビューのカプセル化

As discussed earlier, component CSS styles are encapsulated into the component's view and don't
affect the rest of the application.
コンポーネント CSS スタイルは、コンポーネントのビューの中に含まれ、アプリケーションの残りに影響しない、と前に論じました。

To control how this encapsulation happens on a *per
component* basis, you can set the *view encapsulation mode* in the component metadata.
*プリコンポーネント* 基礎の上で、どの様にカプセル化が起きるのかを制御し、コンポーネント メタデータで、*ビューカプセル化モード* を設定できます。
Choose from the following modes:
つぎのモードから選択してください：

* `Native` view encapsulation uses the browser's native shadow DOM implementation (see
  [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
  on the [MDN](https://developer.mozilla.org) site)
* `Native` ビューカプセル化は、コンポーネントのホストエレメントのシャドウDOMを接続するために
ブラウザーのネイティブ・シャドウDOM実装
  ([MDN](https://developer.mozilla.org) サイト上の [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
  参照) を利用し、そして、シャドウDOMの中のコンポーネントビューに入れます。
  to attach a shadow DOM to the component's host element, and then puts the component
  
  view inside that shadow DOM. The component's styles are included within the shadow DOM.

* `Emulated` view encapsulation (the default) emulates the behavior of shadow DOM by preprocessing
  (and renaming) the CSS code to effectively scope the CSS to the component's view.
  For details, see [Appendix 1](guide/component-styles#inspect-generated-css).

* `None` means that Angular does no view encapsulation.
  Angular adds the CSS to the global styles.
  The scoping rules, isolations, and protections discussed earlier don't apply.
  This is essentially the same as pasting the component's styles into the HTML.

To set the components encapsulation mode, use the `encapsulation` property in the component metadata:

<code-example path="component-styles/src/app/quest-summary.component.ts" region="encapsulation.native" title="src/app/quest-summary.component.ts" linenums="false">
</code-example>

`Native` view encapsulation only works on browsers that have native support
for shadow DOM (see [Shadow DOM v0](http://caniuse.com/#feat=shadowdom) on the
[Can I use](http://caniuse.com) site). The support is still limited,
which is why `Emulated` view encapsulation is the default mode and recommended
in most cases.

{@a inspect-generated-css}

## Inspecting generated CSS

When using emulated view encapsulation, Angular preprocesses
all component styles so that they approximate the standard shadow CSS scoping rules.

In the DOM of a running Angular application with emulated view
encapsulation enabled, each DOM element has some extra attributes
attached to it:

<code-example format="">
  &lt;hero-details _nghost-pmm-5>
    &lt;h2 _ngcontent-pmm-5>Mister Fantastic&lt;/h2>
    &lt;hero-team _ngcontent-pmm-5 _nghost-pmm-6>
      &lt;h3 _ngcontent-pmm-6>Team&lt;/h3>
    &lt;/hero-team>
  &lt;/hero-detail>

</code-example>

There are two kinds of generated attributes:

* An element that would be a shadow DOM host in native encapsulation has a
  generated `_nghost` attribute. This is typically the case for component host elements.
* An element within a component's view has a `_ngcontent` attribute
that identifies to which host's emulated shadow DOM this element belongs.

The exact values of these attributes aren't important. They are automatically
generated and you never refer to them in application code. But they are targeted
by the generated component styles, which are in the `<head>` section of the DOM:

<code-example format="">
  [_nghost-pmm-5] {
    display: block;
    border: 1px solid black;
  }

  h3[_ngcontent-pmm-6] {
    background-color: white;
    border: 1px solid #777;
  }
</code-example>

These styles are post-processed so that each selector is augmented
with `_nghost` or `_ngcontent` attribute selectors.
These extra selectors enable the scoping rules described in this page.
