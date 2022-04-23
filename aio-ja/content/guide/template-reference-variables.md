# テンプレート変数 {@a template-variables}

テンプレート変数は、テンプレートのある部分のデータをテンプレートの別の部分で使うのに役立ちます。
テンプレート変数を使って、ユーザー入力への応答やアプリケーションのフォームの微調整などのタスクを実行できます。

テンプレート変数は以下を参照できます:

* テンプレート内のDOM要素
* ディレクティブ
* 要素
* [TemplateRef](api/core/TemplateRef)
* <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">web component</a>

<div class="alert is-helpful">

このガイドのコードを含む動作例については、<live-example></live-example>を参照してください。

</div>

## 構文 {@a syntax}

テンプレートでは、ハッシュ記号`#`を使ってテンプレート変数を宣言します。
次のテンプレート変数`#phone`は、`<input>`要素で`phone`変数を宣言しています。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-var" header="src/app/app.component.html"></code-example>

テンプレート変数はコンポーネントのテンプレートのどこからでも参照できます。
ここでは、テンプレート下方にある`<button>`は`phone`変数を参照しています。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-phone" header="src/app/app.component.html"></code-example>

## Angularがテンプレート変数に値を割り当てる方法 {@a how-angular-assigns-values-to-template-variables}

Angularは、変数を宣言する場所に基づいてテンプレート変数に値を割り当てます:

* コンポーネントで変数を宣言すると、変数はそのコンポーネントのインスタンスを参照します。
* 標準のHTMLタグで変数を宣言すると、変数はその要素を参照します。
* `<ng-template>`要素で変数を宣言すると、変数はそのテンプレートを表す`TemplateRef`のインスタンスを参照します。
  `<ng-template>`の詳細については、[構造ディレクティブ](guide/structural-directives)の[How Angular uses the asterisk, `*`, syntax](guide/structural-directives#asterisk)を参照してください。
* 変数が`#var="ngModel"`のように右側に名前を指定すると、変数は要素において一致する`exportAs`名をもつディレクティブやコンポーネントを参照します。
<!-- What does the second half of this mean?^^ Can we explain this more fully? Could I see a working example? -kw -->

### テンプレート変数を用いて`NgForm`を使う {@a using-ngform-with-template-variables}

ほとんどの場合、Angularはテンプレート変数の値をそれが発生する要素に設定します。
前の例では、`phone`は`<input>`の電話番号を参照しています。
そのボタンのクリックハンドラーは、`<input>`の値をコンポーネントの`callPhone()`メソッドに渡しています。

The `NgForm` directive is applied by Angular on `<form>` elements. This example demonstrates getting a reference to a different value by referencing a directive's `exportAs` name.

<code-example path="template-reference-variables/src/app/app.component.html" region="ngForm" header="src/app/hero-form.component.html"></code-example>

この`ngForm`属性値がないと、`itemForm`の参照値は、
[HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)の`<form>`になります。

`NgForm`があると、`itemForm`はフォーム内のすべてのコントロールの値と妥当性を追跡する機能をもつ、[NgForm](api/forms/NgForm "API: NgForm")ディレクティブへの参照です。

ネイティブの`<form>`要素とは異なり、`NgForm`ディレクティブには`form`プロパティがあります。
`NgForm`の`form`プロパティを使用して、`itemForm.form.valid`が妥当でないときに送信ボタンを無効にできます。

## Default reference type without assigned value

When declaring a template reference variable on an element without defining a value for it, its returned type will reflect the type of element it's applied to:

- **Native element**: specific subclass of [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)
- **Component**: instance of the specific Component class
- **NgTemplate**: TemplateRef

Referencing an element by its directive needs the directive `exportAs` property set as reference value.
In case of an unspecified variable value, the reference will return an `HTMLElement`, even if the element has one or more directive applied to itself.

## テンプレート変数のスコープ {@a template-variable-scope}

テンプレート変数はそれを囲むテンプレート内のどこからでも参照できます。
`*ngIf`や`*ngFor`、`<ng-template>`などの[構造ディレクティブ](guide/built-in-directives)は、テンプレートの境界として機能します。
これらの境界の外にあるテンプレート変数にはアクセスできません。

<div class="alert is-helpful">

実行時の値を予測可能にしておくために、1つの変数は1回だけテンプレートで定義します。

</div>

### ネストしたテンプレートでのアクセス {@a accessing-in-a-nested-template}

内側のテンプレートは、外側のテンプレートが定義するテンプレート変数にアクセスできます。

次の例では、`<input>`におけるテキスト変更によって`<span>`における値が変化します。Angularがテンプレート変数の`ref1`を介して変化をすぐに更新するからです。

<code-example path="template-reference-variables/src/app/app.component.html" region="template-ref-vars-scope1" header="src/app/app.component.html"></code-example>

このケースでは、`<span>`の周りに暗黙の`<ng-template>`があり、変数の定義はその外部です。
親テンプレート由来のテンプレート変数へのアクセスはうまくいきます。子テンプレートは親テンプレートからコンテキストを継承するからです。

上記のコードを、`<ng-template>`を明示的に表した詳細な形式で書き直します。

<code-example format="html" language="html">

&lt;input #ref1 type="text" [(ngModel)]="firstExample" /&gt;

&lt;!-- New template --&gt;
&lt;ng-template [ngIf]="true"&gt;
  &lt;!-- Because the context is inherited, the value is available to the new template --&gt;
  &lt;span&gt;Value: {{ ref1.value }}&lt;/span&gt;
&lt;/ng-template&gt;

</code-example>

しかしながら、親テンプレートの外部由来のテンプレート変数へのアクセスは、うまくいきません。

<code-example format="html" language="html">

&lt;input *ngIf="true" #ref2 type="text" [(ngModel)]="secondExample" /&gt;
&lt;span&gt;Value: {{ ref2?.value }}&lt;/span&gt; &lt;!-- doesn't work --&gt;

</code-example>

詳細な形式で示すと、`ref2`は親テンプレートの外部にあります。

<code-example format="html" language="html">

&lt;ng-template [ngIf]="true"&gt;
  &lt;!-- The reference is defined within a template --&gt;
  &lt;input #ref2 type="text" [(ngModel)]="secondExample" /&gt;
&lt;/ng-template&gt;
&lt;!-- ref2 accessed from outside that template doesn't work --&gt;
&lt;span&gt;Value: {{ ref2?.value }}&lt;/span&gt;

</code-example>

`*ngFor`を使う次の例を考えてみましょう。

<code-example format="html" language="html">

&lt;ng-container *ngFor="let i of [1,2]"&gt;
  &lt;input #ref type="text" [value]="i" /&gt;
&lt;/ng-container&gt;
{{ ref.value }}

</code-example>

ここでの、`ref.value`はうまくいきません。
Verbose syntax of the same loop shows why:

<code-example format="html" language="html">
  
&lt;ng-template ngFor let-i [ngForOf]="[1,2]"&gt;
  &lt;input #ref type="text" [value]="i" /&gt;
&lt;/ng-template&gt;
{{ ref.value }}

</code-example>

The interpolation trying to access property `ref.value` occurs outside of the referenced element's parent template, making it unreachable.

Moving the interpolation inside the template makes the variable available. Now it references the correct distinct value for each element the loop renders.

<code-example format="html" language="html">
  
&lt;ng-template ngFor let-i [ngForOf]="[1,2]"&gt;
  &lt;input #ref type="text" [value]="i" /&gt;
  {{ ref.value }}
&lt;/ng-template&gt;

</code-example>

This snippet shows 2 `<input>` elements, with their respective value printed.

### `<ng-template>`内のテンプレート変数へのアクセス {@a accessing-a-template-variable-within-ng-template}

`<ng-template>`で変数を宣言すると、変数はテンプレートを表す`TemplateRef`のインスタンスを参照します。

<code-example path="template-reference-variables/src/app/app.component.html" region="template-ref" header="src/app/app.component.html"></code-example>

この例では、ボタンをクリックすると`log()`関数が呼び出され、`#ref3`の値がコンソールに出力します。
`#ref3`変数は`<ng-template>`にあるため、値は`TemplateRef`です。

以下は、`TemplateRef`という名前をもつ`TemplateRef()`関数の、拡張したブラウザコンソール出力です。

<code-example format="shell" language="shell">

&blacktriangledown; ƒ TemplateRef()
name: "TemplateRef"
&lowbar;&lowbar;proto&lowbar;&lowbar;: Function

</code-example>

<a id="template-input-variable"></a>
<a id="template-input-variables"></a>

## Template input variable

A _template input variable_ is a variable to reference within a single instance of the template.
You declare a template input variable using the `let` keyword as in `let hero`.

If its value is omitted, it gets the `$implicit` template context's property value.

There are several such variables in this example: `hero`, `i`, and `odd`.  
The first one takes the value of the iterated item, because `NgForOf` assigns that to `$implicit`

<code-example format="html" language="html">
  
&lt;ng-template ngFor #hero let-hero [ngForOf]="heroes" let-i="index" let-odd="odd"&gt;
  &lt;div [class]="{'odd-row': odd}"&gt;{{i}}:{{hero.name}}&lt;/div&gt;
&lt;/ng-template&gt;

</code-example>

The variable's scope is limited to a single instance of the repeated template.
Use the same variable name again in the definition of other structural directives.

When in the same template a _template reference variable_ and a _template input variable_ with the same name get declared, the latter takes precedence.
