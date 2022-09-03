# テンプレート変数を理解する

テンプレート変数は、テンプレートのある部分のデータをテンプレートの別の部分で使用できるようにします。
テンプレート変数を使用すると、ユーザーの入力に応答したり、アプリケーションのフォームを細かく調整したりするなどのタスクを実行できます。

テンプレート変数は、次のものを参照することができます。

* テンプレート内の DOM 要素
* ディレクティブまたはコンポーネント
* [ng-template](api/core/ng-template)から生成された[TemplateRef](api/core/TemplateRef)
* <a href="https://developer.mozilla.org/ja/docs/Web/Web_Components" title="MDN: Web Components">ウェブコンポーネント</a>

<div class="alert is-helpful">

このガイドのコードスニペットを含む動作例については、<live-example></live-example>をご覧ください。

</div>

## 前提知識

* [Understanding templates](guide/template-overview)

## 構文

テンプレートでは、ハッシュ記号 `#` を使ってテンプレート変数を宣言します。
次のテンプレート変数 `#phone` は、`<input>` 要素を値とする `phone` 変数を宣言しています。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-var" header="src/app/app.component.html"></code-example>

コンポーネントのテンプレート内の任意の場所で、テンプレート変数を参照します。
ここでは、テンプレートのさらに下にある `<button>` が `phone` 変数を参照しています。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-phone" header="src/app/app.component.html"></code-example>

## Angularがテンプレート変数に値を割り当てる方法 {@a how-angular-assigns-values-to-template-variables}

Angularは、変数を宣言した場所に基づいて、テンプレート変数に値を割り当てます。

* コンポーネント上で変数を宣言した場合、その変数はコンポーネントのインスタンスを参照します
* 標準的なHTMLタグ上で変数を宣言すると、その変数は要素を参照します
* `<ng-template>` 要素で変数を宣言した場合、その変数はテンプレートを表す `TemplateRef` インスタンスを参照します。
  `<ng-template>` の詳細については、[構造ディレクティブ](guide/structural-directives) の [構造ディレクティブの短縮表記](guide/structural-directives#asterisk) を参照してください。

## 名前を指定する変数

* もし変数が `#var="ngModel"` のように右辺に名前を指定した場合、その変数は `exportAs` という名前にマッチした要素上のディレクティブやコンポーネントを参照します。
<!-- What does the second half of this mean?^^ Can we explain this more fully? Could I see a working example? -kw -->

### テンプレート変数と `NgForm` の併用

ほとんどの場合、Angularはテンプレート変数の値を、それが置かれた要素に設定します。
先ほどの例では、`phone`は電話番号の `<input>` を参照しています。
ボタンのクリックハンドラーは、`<input>` の値をコンポーネントの `callPhone()` メソッドに渡します。

`NgForm` ディレクティブは、`exportAs` 名を参照することで別の値への参照を取得する実例です。
次の例では、テンプレート変数である `itemForm` が HTML で区切られて3回出現しています。

<code-example path="template-reference-variables/src/app/app.component.html" region="ngForm" header="src/app/hero-form.component.html"></code-example>

`ngForm` 属性値がない場合、 `itemForm` の参照する値は
[HTMLFormElement](https://developer.mozilla.org/ja/docs/Web/API/HTMLFormElement), `<form>` になります。
要素が Angular コンポーネント の場合、属性値を指定しない参照は自動的にコンポーネントのインスタンスを参照します。それ以外の場合は、たとえその要素にひとつ以上のディレクティブが適用されていたとしても、値を持たない参照は DOM 要素を参照することになります。
<!-- What is the train of thought from talking about a form element to the difference between a component and a directive? Why is the component directive conversation relevant here?  -kw I agree -alex -->

## テンプレート変数のスコープ

JavaScriptやTypeScriptのコードの変数と同じように、テンプレート変数はそれを宣言したテンプレートにスコープされます。

同様に、 `*ngIf` や `*ngFor` などの [構造ディレクティブ](guide/built-in-directives) や `<ng-template>` 宣言は、新しい入れ子のテンプレートスコープを作成し、ちょうど `if` や `for` などの JavaScript の制御フロー文が新しいレキシカルスコープを作成するようなものです。これらの構造ディレクティブの中にあるテンプレート変数に、その境界の外からアクセスすることはできません。

<div class="alert is-helpful">

変数の定義はテンプレート内で一度だけ行い、実行時の値を予測できるようにします。

</div>

### ネストしたテンプレートでのアクセス

内側のテンプレートは、外側のテンプレートが定義しているテンプレート変数にアクセスすることができます。

次の例では、`<input>` のテキストを変更すると、`<span>` の値が変更されます。これは、Angular がテンプレート変数 `ref1` を通じて変更を即座に更新するからです。

<code-example path="template-reference-variables/src/app/app.component.html" region="template-ref-vars-scope1" header="src/app/app.component.html"></code-example>

この場合、`<span>` の `*ngIf` は新しいテンプレートスコープを作成し、その親スコープから変数 `ref1` を取り込みます。

しかし、 親テンプレート内で子スコープのテンプレート変数にアクセスすると、うまくいきません。

```html
<input *ngIf="true" #ref2 type="text" [(ngModel)]="secondExample" />
<span>Value: {{ ref2?.value }}</span> <!-- doesn't work -->
```

ここでは、`ref2`は `*ngIf` が生成する子スコープで宣言されており、親テンプレートからはアクセスできません。

{@a template-input-variable}
{@a template-input-variables}
## テンプレート入力変数

_テンプレート入力変数_は、そのテンプレートのインスタンスが作成されたときに設定される値をもつ変数です。[構造ディレクティブの書き方](https://angular.io/guide/structural-directives)を参照してください。

テンプレート入力変数は `NgFor` の長い形式の使い方の中で動作しているのを見ることができます。

```html
<ul>
  <ng-template ngFor let-hero [ngForOf]="heroes">
    <li>{{hero.name}}
  </ng-template>
</ul>
```

`NgFor` ディレクティブは `heroes` 配列の各ヒーローに対して一度だけこの `<ng-template>` をインスタンス化し、それに応じて各インスタンスの `hero` 変数をセットします。

`<ng-template>` のインスタンスを作成する際には、テンプレート入力変数に名前を付けた複数の値を渡すことができます。入力変数の `let-` 宣言の右辺で、その変数にどの値を使用するかを指定することができます。

たとえば `NgFor` は配列の各ヒーローの `index` へのアクセスも提供します。

```html
<ul>
  <ng-template ngFor let-hero let-i="index" [ngForOf]="heroes">
    <li>Hero number {{i}}: {{hero.name}}
  </ng-template>
</ul>
```

## What’s next

[Writing structural directives](https://angular.io/guide/structural-directives)

@reviewed 2022-05-12
