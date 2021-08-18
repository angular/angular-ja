# テキスト補間

テキスト補間を使用すると、HTML テンプレートに動的な文字列値を組み込むことができます。
補間を使用すると、ユーザー名を含むカスタムグリーティングを表示するなど、アプリケーションビューに表示されるものを動的に変更することができます。

<div class="alert is-helpful">

See the <live-example></live-example> for all of the syntax and code snippets in this guide.

</div>

## Displaying values with interpolation

補間では、マークアップされたテキストに埋め込まれた式を参照します。
デフォルトでは、補間は二重中括弧 `{{` と `}}` を区切り文字として使います。

To illustrate how interpolation works, consider an Angular component that contains a `currentCustomer` variable:

<code-example path="interpolation/src/app/app.component.ts" region="customer" header="src/app/app.component.ts"></code-example>

Use interpolation to display the value of this variable in the corresponding component template:

<code-example path="interpolation/src/app/app.component.html" region="interpolation-example1" header="src/app/app.component.html"></code-example>

Angular replaces `currentCustomer` with the string value of the corresponding component property.
In this case, the value is `Maria`.

In the following example, Angular evaluates the `title` and `itemImageUrl` properties to display some title text and an image.

<code-example path="interpolation/src/app/app.component.html" region="component-property" header="src/app/app.component.html"></code-example>

## Template expressions

A template **expression** produces a value and appears within double curly braces, `{{ }}`.
Angular resolves the expression and assigns it to a property of a binding target.
The target could be an HTML element, a component, or a directive.

### Resolving expressions with interpolation

More generally, the text between the braces is a template expression that Angular first evaluates and then converts to a string.
次の補間の例では、2つの数を加算していることがポイントです:

<code-example path="interpolation/src/app/app.component.html" region="convert-string" header="src/app/app.component.html"></code-example>

式では次の例のように `getVal()`などのホストコンポーネントのメソッドを呼び出すことができます:

<code-example path="interpolation/src/app/app.component.html" region="invoke-method" header="src/app/app.component.html"></code-example>

With interpolation, Angular performs the following tasks:

1. Evaluates all expressions in double curly braces.
1. Converts the expression results to strings.
1. Links the results to any adjacent literal strings.
1. Assigns the composite to an element or directive property.

<div class="alert is-helpful">

Configure the interpolation delimiter with the [interpolation](api/core/Component#interpolation) option in the `@Component()` metadata.

</div>

### Syntax

Template expressions are similar to JavaScript.
Many JavaScript expressions are legal template expressions, with the following exceptions.

You can't use JavaScript expressions that have or promote side effects, including:

* 代入（`=`、`+=`、`-=`、`...`）
* `new`、`typeof`、`instanceof` などの演算子
* <code>;</code> や <code>,</code> で式をつなげる
* `++` や `--` などのインクリメントおよびデクリメント演算子
* いくつかの ES2015+ 演算子

その他の JavaScript 構文との注目すべき違いは次のとおりです。

* `|` や `&` などのビット演算子はサポートされていません
* `|`、`?.` や `!` などの新しい[テンプレート式演算子](guide/template-expression-operators)を持ちます

## 式のコンテキスト

Interpolated expressions have a context&mdash;a particular part of the application to which the expression belongs.
Typically, this context is the component instance.

次のスニペットでは、二重中括弧内の `recommended` と、引用符内の `itemImageUrl2`は `AppComponent` のプロパティを参照しています。

<code-example path="interpolation/src/app/app.component.html" region="component-context" header="src/app/app.component.html"></code-example>

An expression can also refer to properties of the _template's_ context such as a [template input variable](guide/structural-directives#shorthand) or a [template reference variable](guide/template-reference-variables).

The following example uses a template input variable of `customer`.

<code-example path="interpolation/src/app/app.component.html" region="template-input-variable" header="src/app/app.component.html (template input variable)"></code-example>

This next example features a template reference variable, `#customerInput`.

<code-example path="interpolation/src/app/app.component.html" region="template-reference-variable" header="src/app/app.component.html (template reference variable)"></code-example>

<div class="alert is-helpful">

Template expressions cannot refer to anything in the global namespace, except `undefined`.
They can't refer to `window` or `document`.
Additionally, they can't call `console.log()` or `Math.max()` and they are restricted to referencing members of the expression context.

</div>

### Preventing name collisions

The context against which an expression evaluates is the union of the template variables, the directive's context object&mdash;if it has one&mdash;and the component's members.
If you reference a name that belongs to more than one of these namespaces, Angular  applies the following logic to determine the context:

1. The template variable name.
1. A name in the directive's context.
1. The component's member names.

To avoid variables shadowing variables in another context, keep variable names unique.
In the following example, the `AppComponent` template greets the `customer`, Padma.

An `ngFor` then lists each `customer` in the `customers` array.

<code-example path="interpolation/src/app/app.component.1.ts" region="var-collision" header="src/app/app.component.ts"></code-example>

The `customer` within the `ngFor` is in the context of an `<ng-template>` and so refers to the `customer` in the `customers` array, in this case Ebony and Chiho.
This list does not feature Padma because `customer` outside of the `ngFor` is in a different context.
Conversely, `customer` in the `<h1>` doesn't include Ebony or Chiho because the context for this `customer` is the class and the class value for `customer` is Padma.

## Expression best practices

When using template expressions, follow these best practices:

* **Use short expressions**

  Use property names or method calls whenever possible.
  Keep application and business logic in the component, where it is accessible to develop and test.

* **Quick execution**

  Angular はすべての変更検知サイクルの後にテンプレート式を実行します。
  変更検知サイクルは、Promise の解決、HTTP の結果、タイマーイベント、キープレス、マウスの移動などの多くの非同期アクティビティによって引き起こされます。

  Expressions should finish quickly to keep the user experience as efficient as possible, especially on slower devices.
  Consider caching values when their computation requires greater resources.

* **No visible side effects**

  According to Angular's [unidirectional data flow model](guide/glossary#unidirectional-data-flow), a template expression should not change any application state other than the value of the target property.
  Reading a component value should not change some other displayed value.
  ビューは1回のレンダリングパスを通して安定しているべきです。

<div class="callout is-important">
  <header>Idempotent expressions reduce side effects</header>

  [冪等](https://en.wikipedia.org/wiki/Idempotence)な式は、副作用がなく、Angular の変更検知の性能を向上させるので理想的です。
  Angular の項の中で冪等な式は、その依存する値の1つが変わるまで、*常にまったく同じもの* を返します。

  依存する値は、イベントループが1回転する間に変化すべきではありません。
  冪等な式が文字列または数値を返す場合、2回続けて呼び出されると同じ文字列または数値を返します。
  式が `array` を含むオブジェクトを返す場合、2回続けて呼び出されると同じオブジェクト *参照* を返します。

</div>

<div class="alert is-important">

  `*ngFor` に適用される振る舞いについて1つ例外があります。
  `*ngFor` には、繰り返しをまたいだときに、参照の違うオブジェクトを処理できる `trackBy` 機能があります。
  詳しくは、このガイドの [`trackBy` を使用した *ngFor](guide/built-in-directives#ngfor-with-trackby) セクションを参照してください。

</div>
