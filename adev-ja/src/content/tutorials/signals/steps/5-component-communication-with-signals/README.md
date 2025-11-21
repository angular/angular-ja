# コンポーネントに入力シグナルでデータを渡す

[シグナルで非同期データを管理する](/tutorials/signals/4-managing-async-data-with-signals)方法を学んだところで、親から子コンポーネントへデータを渡すためのAngularのシグナルベースの`input()` APIを探求し、コンポーネントのデータフローをよりリアクティブで効率的にしましょう。他のフレームワークのコンポーネントプロパティに慣れているなら、入力も同じ考え方です。

このアクティビティでは、プロダクトカードコンポーネントにシグナル入力を追加し、親データがどのようにリアクティブに流れていくかを確認します。

<hr />

<docs-workflow>

<docs-step title="ProductCardにシグナル入力を追加">
`product-card`コンポーネントでデータを受け取るために、シグナル`input()`関数を追加します。

```ts
// Add imports for signal inputs
import {Component, input, ChangeDetectionStrategy} from '@angular/core';

// Add these signal inputs
name = input.required<string>();
price = input.required<number>();
available = input<boolean>(true);
```

`input.required()`が必須の入力を作成するのに対し、デフォルト値を持つ`input()`はオプションであることに注目してください。
</docs-step>

<docs-step title="入力をテンプレートに接続">
`product-card`のテンプレートを更新して、シグナル入力値を表示します。

```angular-html
<div class="product-card">
  <h3>{{ name() }}</h3>
  <p class="price">\${{ price() }}</p>
  <p class="status">Status:
    @if (available()) {
      Available
    } @else {
      Out of Stock
    }
  </p>
</div>
```

入力シグナルは、テンプレート内で通常のシグナルと同じように機能します。関数として呼び出して値にアクセスします。
</docs-step>

<docs-step title="親シグナルを子入力に接続">
`app.ts`内の`product-card`の使用箇所を更新し、静的な値の代わりに動的なシグナル値を渡すようにします。

```html
<!-- Change from static values: -->
<product-card
  name="Static Product"
  price="99"
  available="true"
/>

<!-- To dynamic signals: -->
<product-card
  [name]="productName()"
  [price]="productPrice()"
  [available]="productAvailable()"
/>
```

角括弧`[]`は、現在のシグナル値を子に渡すプロパティバインディングを作成します。
</docs-step>

<docs-step title="リアクティブな更新をテスト">
`app.ts`にメソッドを追加して親シグナルを更新し、子コンポーネントがどのように自動的に反応するかを確認します。

```ts
updateProduct() {
  this.productName.set('Updated Product');
  this.productPrice.set(149);
}

toggleAvailability() {
  this.productAvailable.set(!this.productAvailable());
}
```

```html
<!-- Add controls to test reactivity -->
<div class="controls">
  <button (click)="updateProduct()">Update Product Info</button>
  <button (click)="toggleAvailability()">Toggle Availability</button>
</div>
```

親シグナルが変更されると、子コンポーネントは自動的に新しい値を受け取り、表示します！
</docs-step>

</docs-workflow>

すばらしい！シグナル入力の仕組みを学びました。

- **シグナル入力** - 親コンポーネントからデータを受け取るために`input()`と`input.required()`を使用します
- **リアクティブな更新** - 親シグナル値が変更されると、子コンポーネントは自動的に更新されます
- **型安全性** - シグナル入力は完全なTypeScriptの型チェックを提供します
- **デフォルト値** - オプションの入力はデフォルト値を持つことができ、必須の入力は提供されなければなりません

シグナル入力はコンポーネント間の通信をよりリアクティブにし、多くの場合で`OnChanges`ライフサイクルフックの必要性を排除します。

次のレッスンでは、[モデルシグナルによる双方向バインディング](/tutorials/signals/6-two-way-binding-with-model-signals)について学びます！
