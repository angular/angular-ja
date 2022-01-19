# コンポーネントスタイル

Angularアプリケーションは、標準CSSでスタイルされます。これは、あなたが知っているCSSスタイルシート、
セレクター、ルール、そしてメディアクエリーついてのすべてを Angularアプリケーションに直接
適用できることを意味します。

加えて、Angularは、コンポーネントに標準スタイルシートでは無く、よりモジュールデザインを可能にする
コンポーネントと共に *コンポーネントスタイル* をバンドルできます。

このページでは、これらのコンポーネントスタイルをどのように読み込み適用するのか説明します。

Stackblitz で <live-example></live-example> を実行でき、ここからコードをダウンロードできます。

## コンポーネントスタイルを使いましょう

あなたが書くすべての Angular コンポーネントについて、HTMLテンプレートだけではなく、
そのテンプレートに付随するCSSスタイルを定義し、必要な、あらゆるセレクター、ルール、
そしてメディアクエリーを細く指定することなどを定義できます。

これを行うひとつの方法は、コンポーネントのメタデータに `styles` プロパティをセットすることです。
`styles` プロパティは、CSSコードを含む文字列の配列を使います。
通常は、次の例のようにひとつの文字列を与えます：

<code-example path="component-styles/src/app/hero-app.component.ts" header="src/app/hero-app.component.ts"></code-example>

## Component styling best practices

<div class="alert is-helpful">

   See [View Encapsulation](guide/view-encapsulation) for information on how Angular scopes styles to specific components.

</div>

You should consider the styles of a component to be private implementation details for that component. When consuming a common component, you should not override the component's styles any more than you should access the private members of a TypeScript class. While Angular's default style encapsulation prevents component styles from affecting other components, global styles affect all components on the page. This includes `::ng-deep`, which promotes a component style to a global style.

### Authoring a component to support customization

As component author, you can explicitly design a component to accept customization in one of four different ways.

#### 1. Use CSS Custom Properties (recommended)

You can define a supported customization API for your component by defining its styles with CSS Custom Properties, alternatively known as CSS Variables. Anyone using your component can consume this API by defining values for these properties, customizing the final appearance of the component on the rendered page.

While this requires defining a custom property for each customization point, it creates a clear API contract that works in all style encapsulation modes.

#### 2. Declare global CSS with @mixin

While Angular's emulated style encapsulation prevents styles from escaping a component, it does not prevent global CSS from affecting the entire page. While component consumers should avoid directly overwriting the CSS internals of a component, you can offer a supported customization API via a CSS preprocessor like Sass.

For example, a component may offer one or more supported mixins to customize various aspects of the component's appearance. While this approach uses global styles in it’s implementation, it allows the component author to keep the mixins up to date with changes to the component's private DOM structure and CSS classes.

#### 3. Customize with CSS ::part

If your component uses [Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM), you can apply the `part` attribute to specify elements in your component's template. This allows consumers of the component to author arbitrary styles targeting those specific elements with [the `::part` pseudo-element](https://developer.mozilla.org/docs/Web/CSS/::part).

While this lets you limit the elements within your template that consumers can customize, it does not limit which CSS properties are customizable. 

#### 4. Provide a TypeScript API

You can define a TypeScript API for customizing styles, using template bindings to update CSS classes and styles. This is not recommended because the additional JavaScript cost of this style API incurs far more performance cost than CSS.

## 特別なセレクター {@a special-selectors}

コンポーネントスタイルには、Shadow DOMスタイルスコーピング([W3C](https://www.w3.org) サイトの
[CSS スコーピング モデル レベル 1](https://www.w3.org/TR/css-scoping-1) ページに記述されています)
の世界からの特別な *セレクター* がいくつかあります。
次のセクションでは、これらのセレクターについて説明します。


### :host
Every component is associated within an element that matches the component's selector. This element, into which the template is rendered, 
is called the _host element_.
The `:host` pseudo-class selector may be used to create styles that target the host element itself, as opposed to targeting elements inside the host.

<code-example path="component-styles/src/app/host-selector-example.component.ts" header="src/app/host-selector-example.component.ts">
</code-example>

Creating the following style will target the component's host element. Any rule applied to this selector will affect the host element and all its descendants (in this case, italicizing all contained text).

<code-example path="component-styles/src/app/hero-details.component.css" region="host" header="src/app/hero-details.component.css"></code-example>

The `:host` selector only targets the host element of a component. Any styles within the `:host` block of a child component will *not* affect parent components.

*関数形式* を使用して、`:host` の後のカッコ内に別なセレクターを含むことで、
ホストスタイルを条件付きで適用します。

In this example the host's content also becomes bold when the `active` CSS class is applied to the host element.

<code-example path="component-styles/src/app/hero-details.component.css" region="hostfunction" header="src/app/hero-details.component.css"></code-example>

`:host` セレクターは他のセレクターと組み合わせることもできます。
子要素を選択するには、 `:host` の後ろにセレクターを追加します。たとえば、`:host h2` を使って、コンポーネントのビュー内にあるすべての `<h2>` 要素をターゲットにすることができます。

<div class="alert is-helpful">

コンポーネントのビューの外側のコンテキストに基づいてコンポーネントのスタイルを決めるために、`:host` セレクターの前に (`:host-context` 以外の) セレクターを追加してはいけません。このようなセレクターはコンポーネントのビューにスコープされておらず、外側のコンテキストを選択してしまいますが、これはビルトインの動作ではありません。そのような場合には、`:host-context` セレクターを使用してください。

</div>

### :host-context

Sometimes it's useful to apply styles to elements within a component's template 
based on some condition in an element that is an ancestor of the host element.
たとえば、CSSのテーマクラスをドキュメントの `<body>` 要素に適用すると、
それに基づいてコンポーネントの外観を変更することができます。

`:host()` の関数形式と同じように動作する `:host-context()` 疑似クラスセレクターを使用します。
`:host-context()` セレクターは、コンポーネントのホスト要素の先祖のうち、ドキュメントルートまでのCSSクラスを探します。
`:host-context()` セレクターは、別のセレクターと組み合わせたときに便利です。

The following example italicizes all text inside a component, but only
if some _ancestor_ element of the host element has the CSS class `active`.

<code-example path="component-styles/src/app/hero-details.component.css" region="hostcontext" header="src/app/hero-details.component.css"></code-example>

Note that only the host element and its descendants will be affected, not the ancestor with the assigned `active` class.

### (非推奨) `/deep/` 、 `>>>` と `::ng-deep` {@a deprecated-deep--and-ng-deep}

コンポーネントスタイルは通常、コンポーネント自身のテンプレートのHTMLにのみ適用されます。

擬似クラス `::ng-deep` を任意の CSS ルールに適用すると、そのルールに対するビューのカプセル化が
完全に無効になります。また、`::ng-deep` が適用されたすべてのスタイルは、グローバルなスタイルになります。指定されたスタイルを
現在のコンポーネントとそのすべての子孫に適用するには、必ず `::ng-deep` の前に `:host` セレクターを含めるように
してください。擬似セレクター `:host` を使用せずに `::ng-deep` コンビネーターを使用すると、スタイルが
他のコンポーネントに波及する可能性があります。

次の例では、ホスト要素からこのコンポーネントを経由してDOM内のすべての子要素に至るまで、
すべての `<h3>` 要素を対象としています。

<code-example path="component-styles/src/app/hero-details.component.css" region="deep" header="src/app/hero-details.component.css"></code-example>

`/deep/` コンビネーターには、別名 `>>>`　と `::ng-deep` があります。

<div class="alert is-important">

`/deep/`、 `>>>` および `::ng-deep` は、 *エミュレートされた* ビューカプセル化でのみ使用してください。
Emulatedは、デフォルトでもっともよく使用されるビューカプセル化です。
詳細については、[ビューのカプセル化](guide/view-encapsulation) セクションを参照してください。

</div>

<div class="alert is-important">

shadow-piercing子孫コンビネータは廃止され、主要なツールや[ブラウザからサポートが削除されています](https://www.chromestatus.com/feature/6750456638341120) 。
そのため、Angular (`/deep/`、 `>>>` および `::ng-deep` の3つすべて) のサポートを落とす予定です。
それまでは、ツールの幅広い互換性のために、`::ng-deep` を選択すべきです。

</div>

{@a loading-styles}

## コンポーネントスタイルの読み込み

コンポーネントにスタイルを追加する方法は、いくつかあります。

* `styles` または `styleUrls` メタデータの設定
* HTML テンプレート内のインライン
* CSS のインポート

前に概説した範囲指定のルールは、これらの読み込みパターンのそれぞれに適用されます。 

### コンポーネントメタデータ内のスタイル

`styles` 配列プロパティを `@Component` デコレーター に追加できます。

配列の各文字列は、このコンポーネントのCSSを定義します。

<code-example path="component-styles/src/app/hero-app.component.ts" header="src/app/hero-app.component.ts (CSS inline)">
</code-example>

<div class="alert is-critical">

注意： これらのスタイルは、 _このコンポーネントにのみ_ 適用されます。
テンプレート内にネストされたコンポーネントやコンポーネントに投影されたコンテンツによって _継承されることはありません_ 。

</div>

Angular CLIコマンド [`ng generate component`](cli/generate) は、 `--inline-style` フラグを使用してコンポーネントを作成するときに空の `styles` 配列を定義します。

<code-example language="sh">
ng generate component hero-app --inline-style
</code-example>

### コンポーネントメタデータ内のスタイルファイル

コンポーネントの `@Component` デコレーターに `styleUrls` プロパティを追加すると、
外部CSSファイルからスタイルをロードできます。

<code-tabs>
  <code-pane header="src/app/hero-app.component.ts (CSS in file)" path="component-styles/src/app/hero-app.component.1.ts"></code-pane>
  <code-pane header="src/app/hero-app.component.css" path="component-styles/src/app/hero-app.component.css"></code-pane>
</code-tabs>

<div class="alert is-critical">

注意： スタイルファイルのスタイルは、 _このコンポーネントにのみ_ 適用されます。
テンプレート内にネストされたコンポーネントやコンポーネントに投影されたコンテンツによって _継承されることはありません_ 。

</div>

<div class="alert is-helpful">

  複数のスタイルファイル、または `styles` と `styleUrls` の組み合わせを指定することもできます。

</div>

Angular CLIコマンド [`ng generate component`](cli/generate) を `--inline-style` フラグなしで使用すると、空のスタイルファイルを生成し、コンポーネントの生成された `styleUrls` で参照します。

<code-example language="sh">
ng generate component hero-app
</code-example>

### インラインスタイルテンプレート

`<style>` タグの中に入れることで、
CSSスタイルをHTMLテンプレートに直接埋め込むことができます。

<code-example path="component-styles/src/app/hero-controls.component.ts" region="inlinestyles" header="src/app/hero-controls.component.ts">
</code-example>

### リンクタグテンプレート

コンポーネントのHTMLテンプレートに `<link>` タグを記述することもできます。

<code-example path="component-styles/src/app/hero-team.component.ts" region="stylelink" header="src/app/hero-team.component.ts">
</code-example>

<div class="alert is-critical">

CLIを使用して構築する場合は、[Assets configuration guide](guide/workspace-config#assets-configuration) の説明にしたがって、リンクされたスタイルファイルをアセットに含めてサーバーにコピーしてください。

リンクタグのhref URLがアプリケーションルートまたはコンポーネントファイルのどちらへの相対パスであっても、CLIはスタイルシートを取り込みます。

</div>

### CSS @imports

標準のCSS `@import` ルールを使用して CSSファイルを CSSファイルにインポートすることもできます。
詳細は、[MDN](https://developer.mozilla.org/ja) サイトの
[`@import`](https://developer.mozilla.org/ja/docs/Web/CSS/@import) を参照してください。

この場合、インポートするファイルの URL は、CSSファイルに対して相対指定です。

<code-example path="component-styles/src/app/hero-details.component.css" region="import" header="src/app/hero-details.component.css (excerpt)">
</code-example>

### 外部およびグローバルスタイルファイル

CLIを使用して構築する場合、外部スタイルファイルを含む _すべての外部アセット_ を含めるように `angular.json` を設定する必要があります。

デフォルトでグローバルな `styles.css` ファイルを事前設定している `styles` セクションに、 **グローバル** スタイルファイルを登録します。

もっと学びたい場合は、 [Styles configuration guide](guide/workspace-config#styles-and-scripts-configuration) を参照してください。


### CSS以外のスタイルファイル

CLIを使用して構築する場合、
スタイルファイルを、次の例のように、 [sass](https://sass-lang.com/)、または [less](https://lesscss.org/) に書き込んで、`@Component.styleUrls` メタデータに適切な拡張子 (`.scss`, `.less`, `.styl`) をもつファイルを次のように指定できます：

<code-example>
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
...
</code-example>

CLIビルドプロセスは、適切なCSSプリプロセッサを実行します。

`ng generate component` を使用してコンポーネントファイルを生成する場合、CLI は、デフォルトで空の CSS　スタイルファイル(`.css`)を生成します。
[Workspace configuration guide](guide/workspace-config#generation-schematics) 
で説明されているように、CLIのデフォルトのプリプロセッサを設定することができます。

<div class="alert is-important">

CLIはインラインスタイルにプリプロセッサを適用できないため、`@Component.styles` 配列に追加されたスタイル文字列は _CSSで記述する必要があります_ 。

</div>

@reviewed 2021-09-17
