# テンプレート参照変数 (`#var`)

**テンプレート参照変数**は、テンプレートから DOM 要素を参照するために使うことがあります。
他にも、ディレクティブ（コンポーネントも含む）、要素、[TemplateRef](api/core/TemplateRef)、<a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">web components</a> を参照することができます。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

</div>

ハッシュ記号 (#) を使うことで参照変数を宣言できます。
次の参照変数 `#phone` は、`<input>` を参照する `phone` 変数を宣言します。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-var" header="src/app/app.component.html"></code-example>

テンプレート参照変数は、コンポーネントのテンプレートのどこからでも参照することができます。
ここでは、テンプレートの下の方に出てくる `<button>` が `phone` 変数を参照しています。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-phone" header="src/app/app.component.html"></code-example>

<h3 class="no-toc">参照変数がその値を得る方法</h3> {@a how-a-reference-variable-gets-its-value}

ほとんどの場合、Angular は参照変数の値を、それが宣言された要素とします。
前の例では `phone` は電話番号の `<input>` を参照しています。
ボタンのクリックハンドラーは、`<input>` の値をコンポーネントの `callPhone()` メソッドに渡します。

`NgForm` ディレクティブはこの動作を変更することができ、値を少し違ったものに設定します。次の例では、テンプレート参照変数 `itemForm` は
HTML の中でバラバラに3回出現します。

<code-example path="template-reference-variables/src/app/app.component.html" region="ngForm" header="src/app/hero-form.component.html"></code-example>

属性の値が ngForm でなければ、`itemForm` が参照する値は
[HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement) となります。
ただし、`Component`と`Directive`には違いがあります。
`Component` は属性の値がなくても参照されるのに対して、
`Directive` は暗黙の参照（つまり要素）を変更しません。



しかしここでは `NgForm` があるので、`itemForm` は [NgForm](api/forms/NgForm "API: NgForm")
ディレクティブへの参照となり、フォーム内のすべてのコントロールの値や妥当性を追うことができます。

ネイティブの `<form>` 要素には `form` というプロパティはありませんが、`NgForm` ディレクティブにはあり、
`itemForm.form.valid` が無効なら送信ボタンを無効化したり、
親コンポーネントの `onSubmit()` メソッドにフォームコントロールツリー全体を渡したりできます。

<h3 class="no-toc">テンプレート参照変数の考慮事項</h3> {@a template-reference-variable-considerations}

テンプレート _参照_ 変数 (`#phone`) は、[`*ngFor`](guide/built-in-directives#template-input-variable) に出てくるようなテンプレート _入力_ 変数 (`let phone`) とは異なります。
詳しくは [_構造ディレクティブ_](guide/structural-directives#template-input-variable) をご覧ください。

参照変数のスコープは、テンプレート全体です。実行時の値が予測不可能となるため、同じテンプレート内で同じ名前の変数を2回以上宣言しないでください。

### 別の構文 {@a alternative-syntax}

`#` の代わりに、接頭辞 `ref-` を使うこともできます。
この例では `fax` 変数を `#fax` ではなく `ref-fax` で宣言しています。


<code-example path="template-reference-variables/src/app/app.component.html" region="ref-fax" header="src/app/app.component.html"></code-example>

