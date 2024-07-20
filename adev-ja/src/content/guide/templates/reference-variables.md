# テンプレート変数を理解する

テンプレート変数は、テンプレートの1つの部分から別の部分にデータを使用するのに役立ちます。
テンプレート変数を使用して、ユーザー入力に応答したり、アプリケーションのフォームを微調整したりなどのタスクを実行します。

テンプレート変数は、以下を参照できます。

* テンプレート内のDOM要素
* 指令またはコンポーネント
* [ng-template](api/core/ng-template)からの[TemplateRef](api/core/TemplateRef)
* <a href="https://developer.mozilla.org/docs/Web/Web_Components" title="MDN: Web Components">ウェブコンポーネント</a>

## 構文

テンプレートでは、ハッシュ記号 `#` を使用してテンプレート変数を宣言します。
次のテンプレート変数 `#phone` は、`<input>` 要素を値とする `phone` 変数を宣言します。

<docs-code path="adev/src/content/examples/template-reference-variables/src/app/app.component.html" visibleRegion="ref-var" header="src/app/app.component.html"/>

コンポーネントのテンプレートのどこでもテンプレート変数を参照します。
ここでは、テンプレートの下にある `<button>` が `phone` 変数を参照しています。

<docs-code path="adev/src/content/examples/template-reference-variables/src/app/app.component.html" visibleRegion="ref-phone" header="src/app/app.component.html"/>

## Angularがテンプレート変数に値を割り当てる方法

Angularは、テンプレート変数を宣言した場所に基づいて、テンプレート変数に値を割り当てます。

* コンポーネントで変数を宣言した場合、変数はコンポーネントインスタンスを参照します。
* 標準のHTMLタグで変数を宣言した場合、変数は要素を参照します。
* `<ng-template>` 要素で変数を宣言した場合、変数はテンプレートを表す `TemplateRef` インスタンスを参照します。
  `<ng-template>` の詳細については、[構造ディレクティブ](guide/directives/structural-directives)の[Angularがアスタリスク `*` 構文を使用する方法](guide/directives/structural-directives#asterisk)を参照してください。

## 名前を指定する変数

変数が `#var="ngModel"` のように右側に名前を指定している場合、変数は `exportAs` 名が一致する要素の指令またはコンポーネントを参照します。
<!-- この後半の意味は？^^ もっと詳しく説明できますか？ 実行可能な例を見ることができますか？ -kw -->

### テンプレート変数と `NgForm` の使用

ほとんどの場合、Angularはテンプレート変数の値を、その変数が発生した要素に設定します。
前の例では、`phone` は電話番号 `<input>` を参照します。
ボタンのクリックハンドラーは、`<input>` の値をコンポーネントの `callPhone()` メソッドに渡します。

`NgForm` 指令は、指令の `exportAs` 名を参照することで、別の値への参照を取得する方法を示しています。
次の例では、テンプレート変数 `itemForm` は、HTMLで区切られた3回表示されます。

<docs-code path="adev/src/content/examples/template-reference-variables/src/app/app.component.html" visibleRegion="ngForm" header="src/app/hero-form.component.html"/>

`ngForm` 属性値がなければ、`itemForm` の参照値は
[HTMLFormElement](https://developer.mozilla.org/ja/docs/Web/API/HTMLFormElement)、`<form>` になります。
要素がAngularコンポーネントの場合、属性値のない参照は自動的にコンポーネントインスタンスを参照します。それ以外の場合は、属性値のない参照はDOM要素を参照します。これは、要素に1つ以上の指令が適用されていても同じです。
<!-- What is the train of thought from talking about a form element to the difference between a component and a directive? Why is the component directive conversation relevant here?  -kw I agree -alex -->

## テンプレート変数のスコープ

JavaScriptまたはTypeScriptコードの変数と同様に、テンプレート変数は、その変数を宣言したテンプレートにスコープされています。

同様に、`*ngIf` や `*ngFor` などの[構造ディレクティブ](guide/directives)、または `<ng-template>` 宣言はJavaScriptの `if` や `for` などの制御フロー文が新しい字句スコープを作成するのと同じように新しいネストされたテンプレートスコープを作成します。これらの構造ディレクティブのいずれか内にあるテンプレート変数には、境界の外からアクセスできません。

HELPFUL: テンプレート内で変数を1回だけ定義してください。これにより、実行時の値が予測可能になります。

### ネストされたテンプレートへのアクセス

内部テンプレートは、外部テンプレートが定義したテンプレート変数にアクセスできます。

次の例では、`<input>` 内のテキストを変更すると、`<span>` 内の値も変更されます。これは、Angularがテンプレート変数 `ref1` を通じて変更をすぐに更新するためです。

<docs-code path="adev/src/content/examples/template-reference-variables/src/app/app.component.html" visibleRegion="template-ref-vars-scope1" header="src/app/app.component.html"/>

この場合、`<span>` の `*ngIf` は新しいテンプレートスコープを作成し、そのスコープには親スコープの `ref1` 変数が含まれます。

ただし、親テンプレートから子スコープのテンプレート変数にはアクセスできません。

```html
  <input *ngIf="true" #ref2 type="text" [(ngModel)]="secondExample" />
  <span>Value: {{ ref2?.value }}</span> <!-- 機能しません -->
```

ここでは、`ref2` は `*ngIf` によって作成された子スコープで宣言されており、親テンプレートからはアクセスできません。

## テンプレート入力変数

_テンプレート入力変数_ は、そのテンプレートのインスタンスが作成されるときに値が設定される変数です。[構造ディレクティブの記述](guide/directives/structural-directives) を参照してください。

テンプレート入力変数は、`NgFor` の長形式の使用で確認できます。

```html
<ul>
  <ng-template ngFor let-hero [ngForOf]="heroes">
    <li>{{hero.name}}
  </ng-template>
</ul>
```

`NgFor` 指令は、`heroes` 配列内の各ヒーローに対してこの `<ng-template>` を1回インスタンス化し、各インスタンスに対して `hero` 変数を適切に設定します。

`<ng-template>` がインスタンス化されると、複数の名前付き値を渡すことができ、これらは異なるテンプレート入力変数にバインドできます。入力変数の `let-` 宣言の右側は、その変数にどの値を使用するかを指定できます。

たとえば、`NgFor` は配列内の各ヒーローの `index` にもアクセスできます。

```html
<ul>
  <ng-template ngFor let-hero let-i="index" [ngForOf]="heroes">
    <li>Hero number {{i}}: {{hero.name}}
  </ng-template>
</ul>
```

## 次へ

<docs-pill-row>
  <docs-pill href="guide/directives/structural-directives" title="構造ディレクティブを作る"/>
</docs-pill-row>
