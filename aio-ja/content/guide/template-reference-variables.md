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

`NgForm`ディレクティブが、ディレクティブの`exportAs`名の参照によって、別の値への参照の取得を実演しています。
次の例では、テンプレート変数の`itemForm`がHTMLで隔てられて3回現れています。

<code-example path="template-reference-variables/src/app/app.component.html" region="ngForm" header="src/app/hero-form.component.html"></code-example>

この`ngForm`属性値がないと、`itemForm`の参照値は、
[HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)の`<form>`になります。
ただし`Component`と`Directive`には違いがあり、Angularは属性値の指定なしに`Component`を参照し、`Directive`は暗黙の参照(要素)を変更しません。
<!-- What is the train of thought from talking about a form element to the difference between a component and a directive? Why is the component directive conversation relevant here?  -kw -->

`NgForm`があると、`itemForm`はフォーム内のすべてのコントロールの値と妥当性を追跡する機能をもつ、[NgForm](api/forms/NgForm "API: NgForm")ディレクティブへの参照です。

ネイティブの`<form>`要素とは異なり、`NgForm`ディレクティブには`form`プロパティがあります。
`NgForm`の`form`プロパティを使用して、`itemForm.form.valid`が妥当でないときに送信ボタンを無効にできます。


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

```html

<input #ref1 type="text" [(ngModel)]="firstExample" />

<!-- 新しいテンプレート -->
<ng-template [ngIf]="true">
  <!-- コンテキストが継承されるため、値は新しいテンプレートで有効です -->
  <span>Value: {{ ref1.value }}</span>
</ng-template>

```

しかしながら、親テンプレートの外部由来のテンプレート変数へのアクセスは、うまくいきません。

```html
  <input *ngIf="true" #ref2 type="text" [(ngModel)]="secondExample" />
  <span>Value: {{ ref2?.value }}</span> <!-- うまくいきません -->
```

詳細な形式で示すと、`ref2`は親テンプレートの外部にあります。

```
<ng-template [ngIf]="true">
  <!-- この参照はテンプレート内で定義されています -->
  <input #ref2 type="text" [(ngModel)]="secondExample" />
</ng-template>
<!-- そのテンプレートの外部からアクセスされるref2は、うまくいきません -->
<span>Value: {{ ref2?.value }}</span>
```

`*ngFor`を使う次の例を考えてみましょう。

```
<ng-container *ngFor="let i of [1,2]">
  <input #ref type="text" [value]="i" />
</ng-container>
{{ ref.value }}
```

ここでの、`ref.value`はうまくいきません。
構造ディレクティブの`*ngFor`はテンプレートを2回インスタンス化します。`*ngFor`が配列内の2つのアイテムを反復処理するからです。
この`ref.value`の参照が何を意味するかを明示することは不可能です。

`*ngFor`や`*ngIf`などの構造ディレクティブでは、テンプレートがインスタンス化されたかどうかをAngularが知る方法はありません。

その結果、Angularはその値にアクセスできずエラーを返します。

### `<ng-template>`内のテンプレート変数へのアクセス {@a accessing-a-template-variable-within-ng-template}

`<ng-template>`で変数を宣言すると、変数はテンプレートを表す`TemplateRef`のインスタンスを参照します。

<code-example path="template-reference-variables/src/app/app.component.html" region="template-ref" header="src/app/app.component.html"></code-example>

この例では、ボタンをクリックすると`log()`関数が呼び出され、`#ref3`の値がコンソールに出力します。
`#ref3`変数は`<ng-template>`にあるため、値は`TemplateRef`です。

以下は、`TemplateRef`という名前をもつ`TemplateRef()`関数の、拡張したブラウザコンソール出力です。

<code-example language="sh">

&#9660; ƒ TemplateRef()
name: "TemplateRef"
__proto__: Function

</code-example>

{@a template-input-variable}
{@a template-input-variables}
## Template input variable

A _template input variable_ is a variable you can reference within a single instance of the template.
You declare a template input variable using the `let` keyword as in `let hero`.

There are several such variables in this example: `hero`, `i`, and `odd`.

The variable's scope is limited to a single instance of the repeated template.
You can use the same variable name again in the definition of other structural directives.

In contrast, you declare a template variable by prefixing the variable name with `#`, as in `#var`.
A template variable refers to its attached element, component, or directive.

Template input variables and template variables names have their own namespaces.
The template input variable `hero` in `let hero` is distinct from the template variable `hero` in `#hero`.
